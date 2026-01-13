"""
Pydantic schemas for Media API.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class MediaBase(BaseModel):
    """Base schema for media."""
    folder: str = Field(default="general", description="Organizational folder")
    tags: Optional[List[str]] = Field(default=None, description="Free-form tags")
    alt_text: Optional[str] = Field(default=None, max_length=255, description="Alt text for images")
    caption: Optional[str] = Field(default=None, description="Caption or description")


class MediaCreate(MediaBase):
    """Schema for creating media (internal use after file processing)."""
    hash: str
    filename: str
    original_filename: str
    url: str
    size: int
    mime_type: str
    storage_type: str
    storage_path: str


class MediaUpdate(BaseModel):
    """Schema for updating media metadata."""
    tags: Optional[List[str]] = None
    alt_text: Optional[str] = Field(default=None, max_length=255)
    caption: Optional[str] = None
    folder: Optional[str] = None


class MediaResponse(BaseModel):
    """Schema for media response."""
    id: int
    hash: str
    filename: str
    original_filename: str
    url: str
    size: int
    mime_type: str
    folder: str
    tags: Optional[List[str]] = None
    storage_type: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MediaListResponse(BaseModel):
    """Schema for paginated media list."""
    items: List[MediaResponse]
    total: int
    skip: int
    limit: int


class MediaUploadResponse(MediaResponse):
    """Response after uploading a file."""
    is_duplicate: bool = Field(
        default=False, 
        description="True if file already existed (same hash)"
    )


class TagInfo(BaseModel):
    """Schema for tag information."""
    tag: str
    count: int


class FolderInfo(BaseModel):
    """Schema for folder information."""
    folder: str
    count: int


class TagsUpdateRequest(BaseModel):
    """Request to update tags."""
    tags: List[str]


class TagAddRequest(BaseModel):
    """Request to add tags."""
    tags: List[str]
