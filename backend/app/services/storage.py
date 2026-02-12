"""
Storage abstraction layer for file uploads.
Supports both local filesystem and Azure Blob Storage.
"""
import os
import hashlib
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from typing import Optional, Tuple
from app.core.config import settings


class StorageBackend(ABC):
    """Abstract base class for storage backends."""
    
    @abstractmethod
    async def upload(self, content: bytes, filename: str, folder: str) -> str:
        """
        Upload file content to storage.
        
        Args:
            content: File content as bytes
            filename: Generated filename
            folder: Organizational folder
            
        Returns:
            Storage path (relative path for local, blob name for Azure)
        """
        pass
    
    @abstractmethod
    async def delete(self, storage_path: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            storage_path: Path returned from upload()
            
        Returns:
            True if deleted, False if not found
        """
        pass
    
    @abstractmethod
    def get_url(self, storage_path: str) -> str:
        """
        Get the public URL for a file.
        
        Args:
            storage_path: Path returned from upload()
            
        Returns:
            Public URL to access the file
        """
        pass
    
    @staticmethod
    def compute_hash(content: bytes) -> str:
        """Compute SHA-256 hash of content."""
        return hashlib.sha256(content).hexdigest()
    
    @staticmethod
    def generate_filename(original_filename: str, content_hash: str) -> str:
        """Generate a unique filename using hash prefix and timestamp."""
        ext = os.path.splitext(original_filename)[1].lower()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        hash_prefix = content_hash[:8]
        return f"{timestamp}_{hash_prefix}{ext}"


class LocalStorage(StorageBackend):
    """Local filesystem storage backend."""
    
    def __init__(self):
        # Get the backend directory (where app/ is located)
        self.base_dir = os.path.dirname(
            os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))
            )
        )
        self.upload_dir = os.path.join(self.base_dir, settings.LOCAL_UPLOAD_DIR)
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload(self, content: bytes, filename: str, folder: str) -> str:
        """Upload file to local filesystem."""
        folder_path = os.path.join(self.upload_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        file_path = os.path.join(folder_path, filename)
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Return relative path from upload directory
        return f"{folder}/{filename}"
    
    async def delete(self, storage_path: str) -> bool:
        """Delete file from local filesystem."""
        file_path = os.path.join(self.upload_dir, storage_path)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    
    def get_url(self, storage_path: str) -> str:
        """Get URL for local file (served via API)."""
        return f"/api/v1/uploads/{storage_path}"


class AzureStorage(StorageBackend):
    """Azure Blob Storage backend."""
    
    def __init__(self):
        self.connection_string = settings.AZURE_STORAGE_CONNECTION_STRING
        self.container_name = settings.AZURE_CONTAINER_NAME
        self._client = None
        self._container_client = None
    
    def _get_container_client(self):
        """Lazy initialization of Azure container client."""
        if self._container_client is None:
            try:
                from azure.storage.blob import BlobServiceClient, ContainerClient
                
                if not self.connection_string:
                    raise ValueError("AZURE_STORAGE_CONNECTION_STRING is not configured")
                
                self._client = BlobServiceClient.from_connection_string(self.connection_string)
                self._container_client = self._client.get_container_client(self.container_name)
                
                # Create container if it doesn't exist
                try:
                    self._container_client.create_container()
                except Exception:
                    pass  # Container already exists
                    
            except ImportError:
                raise ImportError(
                    "azure-storage-blob package is required for Azure storage. "
                    "Install it with: pip install azure-storage-blob"
                )
        
        return self._container_client
    
    async def upload(self, content: bytes, filename: str, folder: str) -> str:
        """Upload file to Azure Blob Storage."""
        container_client = self._get_container_client()
        
        blob_name = f"{folder}/{filename}"
        blob_client = container_client.get_blob_client(blob_name)
        
        # Upload the blob
        blob_client.upload_blob(content, overwrite=True)
        
        return blob_name
    
    async def delete(self, storage_path: str) -> bool:
        """Delete file from Azure Blob Storage."""
        container_client = self._get_container_client()
        
        try:
            blob_client = container_client.get_blob_client(storage_path)
            blob_client.delete_blob()
            return True
        except Exception:
            return False
    
    def get_url(self, storage_path: str) -> str:
        """Get public URL for Azure blob."""
        container_client = self._get_container_client()
        blob_client = container_client.get_blob_client(storage_path)
        
        # Try to generate SAS URL for private containers
        try:
            from azure.storage.blob import generate_blob_sas, BlobSasPermissions
            from datetime import timezone
            
            # Get account info from connection string
            account_name = None
            account_key = None
            for part in self.connection_string.split(";"):
                if part.startswith("AccountName="):
                    account_name = part.split("=", 1)[1]
                elif part.startswith("AccountKey="):
                    account_key = part.split("=", 1)[1]
            
            if account_name and account_key:
                # Generate SAS token valid for 1 year
                sas_token = generate_blob_sas(
                    account_name=account_name,
                    container_name=self.container_name,
                    blob_name=storage_path,
                    account_key=account_key,
                    permission=BlobSasPermissions(read=True),
                    expiry=datetime.now(timezone.utc) + timedelta(days=365)
                )
                return f"{blob_client.url}?{sas_token}"
        except Exception:
            pass
        
        # Fall back to blob URL (works for public containers)
        return blob_client.url


def get_storage() -> StorageBackend:
    """
    Get the configured storage backend.
    
    Returns:
        StorageBackend instance based on STORAGE_TYPE setting
    """
    if settings.is_azure_storage:
        return AzureStorage()
    return LocalStorage()
