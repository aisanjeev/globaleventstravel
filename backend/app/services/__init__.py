"""
Application services package.
"""
from app.services.storage import get_storage, StorageBackend, LocalStorage, AzureStorage

__all__ = [
    "get_storage",
    "StorageBackend",
    "LocalStorage",
    "AzureStorage",
]
