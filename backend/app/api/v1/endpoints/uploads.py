"""
File upload API endpoints.
"""
import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

# Configure upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class UploadResponse(BaseModel):
    """Response schema for file upload."""
    id: str
    filename: str
    original_filename: str
    url: str
    size: int
    mime_type: str
    folder: str
    created_at: str


class MediaFile(BaseModel):
    """Schema for media file listing."""
    id: str
    filename: str
    original_filename: str
    url: str
    size: int
    mime_type: str
    folder: str
    created_at: str


def ensure_upload_dir():
    """Ensure upload directory exists."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_file_extension(filename: str) -> str:
    """Get file extension from filename."""
    return os.path.splitext(filename)[1].lower()


def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename while preserving extension."""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{timestamp}_{unique_id}{ext}"


def get_mime_type(extension: str) -> str:
    """Get MIME type from file extension."""
    mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
    }
    return mime_types.get(extension, "application/octet-stream")


@router.post("", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("general"),
):
    """
    Upload a file.
    
    - **file**: The file to upload
    - **folder**: Folder to organize uploads (e.g., 'blog', 'treks', 'general')
    """
    ensure_upload_dir()
    
    # Validate file extension
    ext = get_file_extension(file.filename or "unknown")
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content to check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    # Create folder-specific directory
    folder_path = os.path.join(UPLOAD_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # Generate unique filename
    original_filename = file.filename or "unknown"
    unique_filename = generate_unique_filename(original_filename)
    file_path = os.path.join(folder_path, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Generate file ID
    file_id = str(uuid.uuid4())
    
    # Get file info
    file_size = len(content)
    mime_type = get_mime_type(ext)
    
    # Build URL (relative to API)
    file_url = f"/api/v1/uploads/{folder}/{unique_filename}"
    
    return UploadResponse(
        id=file_id,
        filename=unique_filename,
        original_filename=original_filename,
        url=file_url,
        size=file_size,
        mime_type=mime_type,
        folder=folder,
        created_at=datetime.now().isoformat(),
    )


@router.get("/{folder}/{filename}")
async def get_file(folder: str, filename: str):
    """Serve an uploaded file."""
    file_path = os.path.join(UPLOAD_DIR, folder, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Security check: ensure path doesn't escape upload directory
    real_path = os.path.realpath(file_path)
    if not real_path.startswith(os.path.realpath(UPLOAD_DIR)):
        raise HTTPException(status_code=403, detail="Access denied")
    
    return FileResponse(file_path)


@router.get("", response_model=List[MediaFile])
async def list_files(
    folder: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """
    List uploaded files.
    
    - **folder**: Filter by folder (optional)
    - **skip**: Number of files to skip
    - **limit**: Maximum number of files to return
    """
    ensure_upload_dir()
    
    files = []
    
    def scan_folder(folder_name: str, folder_path: str):
        """Scan a folder for files."""
        if not os.path.exists(folder_path):
            return
        
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                ext = get_file_extension(filename)
                if ext in ALLOWED_EXTENSIONS:
                    stat = os.stat(file_path)
                    files.append({
                        "id": str(uuid.uuid5(uuid.NAMESPACE_URL, file_path)),
                        "filename": filename,
                        "original_filename": filename,
                        "url": f"/api/v1/uploads/{folder_name}/{filename}",
                        "size": stat.st_size,
                        "mime_type": get_mime_type(ext),
                        "folder": folder_name,
                        "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    })
    
    if folder:
        folder_path = os.path.join(UPLOAD_DIR, folder)
        scan_folder(folder, folder_path)
    else:
        # Scan all folders
        if os.path.exists(UPLOAD_DIR):
            for folder_name in os.listdir(UPLOAD_DIR):
                folder_path = os.path.join(UPLOAD_DIR, folder_name)
                if os.path.isdir(folder_path):
                    scan_folder(folder_name, folder_path)
    
    # Sort by creation time (newest first)
    files.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Apply pagination
    paginated = files[skip:skip + limit]
    
    return [MediaFile(**f) for f in paginated]


@router.delete("/{folder}/{filename}")
async def delete_file(folder: str, filename: str):
    """Delete an uploaded file."""
    file_path = os.path.join(UPLOAD_DIR, folder, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Security check
    real_path = os.path.realpath(file_path)
    if not real_path.startswith(os.path.realpath(UPLOAD_DIR)):
        raise HTTPException(status_code=403, detail="Access denied")
    
    os.remove(file_path)
    
    return {"message": "File deleted successfully"}


