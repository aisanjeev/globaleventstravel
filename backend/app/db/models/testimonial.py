"""
Testimonial model for customer reviews.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Testimonial(Base):
    """Testimonial model for customer reviews and feedback."""
    
    __tablename__ = "testimonials"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    testimonial: Mapped[str] = mapped_column(Text, nullable=False)
    trek_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    tags: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)  # List of tags
    helpful_count: Mapped[int] = mapped_column(Integer, default=0)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

