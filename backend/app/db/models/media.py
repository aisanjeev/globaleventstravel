"""
Media model for tracking uploaded files with hash deduplication and tags.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Text, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Media(Base):
    """Media model representing an uploaded file with hash-based deduplication."""
    
    __tablename__ = "media"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Content hash for deduplication (SHA-256 = 64 hex characters)
    hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    
    # File information
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False)  # bytes
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Organization
    folder: Mapped[str] = mapped_column(String(100), nullable=False, default="general")
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True, default=list)
    
    # Storage backend info
    storage_type: Mapped[str] = mapped_column(String(20), nullable=False, default="local")
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)  # Full path in storage
    
    # Metadata
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    caption: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Indexes for common queries
    __table_args__ = (
        Index('ix_media_folder', 'folder'),
        Index('ix_media_created_at', 'created_at'),
    )
    
    def __repr__(self) -> str:
        return f"<Media(id={self.id}, filename='{self.filename}', hash='{self.hash[:8]}...')>"
