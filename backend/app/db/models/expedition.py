"""
Expedition model for high-altitude climbing expeditions.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, Text, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Expedition(Base):
    """Expedition model for mountaineering expeditions."""
    
    __tablename__ = "expeditions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)  # advanced, expert, extreme
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    summit_altitude: Mapped[int] = mapped_column(Integer, nullable=False)
    base_altitude: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    region: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    highlights: Mapped[str] = mapped_column(JSON, nullable=False)  # List of highlights
    
    # Requirements stored as JSON
    requirements: Mapped[str] = mapped_column(JSON, nullable=False)
    # {experience: str, fitnessLevel: str, technicalSkills: [str]}
    
    # Equipment stored as JSON
    equipment: Mapped[str] = mapped_column(JSON, nullable=False)
    # {provided: [str], personal: [str]}
    
    price: Mapped[float] = mapped_column(Float, nullable=False)
    group_size_min: Mapped[int] = mapped_column(Integer, nullable=False)
    group_size_max: Mapped[int] = mapped_column(Integer, nullable=False)
    season: Mapped[str] = mapped_column(JSON, nullable=False)  # List of months
    success_rate: Mapped[int] = mapped_column(Integer, default=0)  # percentage
    image: Mapped[str] = mapped_column(String(500), nullable=False)
    gallery: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)  # List of image URLs
    safety_info: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Relationships
    itinerary: Mapped[List["ExpeditionDay"]] = relationship(
        "ExpeditionDay", back_populates="expedition", cascade="all, delete-orphan",
        order_by="ExpeditionDay.day"
    )


class ExpeditionDay(Base):
    """Day-by-day itinerary for an expedition."""
    
    __tablename__ = "expedition_days"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    expedition_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("expeditions.id", ondelete="CASCADE"), 
        nullable=False
    )
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    altitude: Mapped[int] = mapped_column(Integer, nullable=False)
    activities: Mapped[str] = mapped_column(JSON, nullable=False)  # List of activities
    
    # Relationship
    expedition: Mapped["Expedition"] = relationship("Expedition", back_populates="itinerary")

