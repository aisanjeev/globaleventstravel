"""
Trek model and related tables.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, Text, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Trek(Base):
    """Trek model representing a trekking package."""
    
    __tablename__ = "treks"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)  # easy, moderate, hard, expert
    duration: Mapped[int] = mapped_column(Integer, nullable=False)  # days
    price: Mapped[float] = mapped_column(Float, nullable=False)
    season: Mapped[str] = mapped_column(JSON, nullable=False)  # List of months as JSON
    elevation: Mapped[int] = mapped_column(Integer, nullable=False)  # meters
    distance: Mapped[float] = mapped_column(Float, nullable=False)  # kilometers
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image: Mapped[str] = mapped_column(String(500), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Foreign key to guide (optional)
    guide_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("guides.id", ondelete="SET NULL"), nullable=True
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Relationships
    guide: Mapped[Optional["Guide"]] = relationship("Guide", back_populates="treks")
    images: Mapped[List["TrekImage"]] = relationship(
        "TrekImage", back_populates="trek", cascade="all, delete-orphan"
    )
    itinerary: Mapped[List["ItineraryDay"]] = relationship(
        "ItineraryDay", back_populates="trek", cascade="all, delete-orphan",
        order_by="ItineraryDay.day"
    )
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="trek")


class TrekImage(Base):
    """Additional images for a trek."""
    
    __tablename__ = "trek_images"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trek_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("treks.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    
    # Relationship
    trek: Mapped["Trek"] = relationship("Trek", back_populates="images")


class ItineraryDay(Base):
    """Day-by-day itinerary for a trek."""
    
    __tablename__ = "itinerary_days"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trek_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("treks.id", ondelete="CASCADE"), nullable=False
    )
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    elevation_gain: Mapped[int] = mapped_column(Integer, default=0)
    distance: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Relationship
    trek: Mapped["Trek"] = relationship("Trek", back_populates="itinerary")


# Import for type hints (avoid circular imports)
from app.db.models.guide import Guide
from app.db.models.booking import Booking

