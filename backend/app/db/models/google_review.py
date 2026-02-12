"""
Google Review model - cached reviews from Google Places API.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Text, DateTime, BigInteger
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class GoogleReview(Base):
    """Cached Google Place review."""

    __tablename__ = "google_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    place_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    review_time: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    relative_time_description: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    profile_photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
