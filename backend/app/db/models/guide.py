"""
Guide model for trek/expedition leaders.
"""
from typing import List, Optional
from sqlalchemy import String, Integer, Float, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Guide(Base):
    """Guide model representing trek/expedition leaders."""
    
    __tablename__ = "guides"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    experience_years: Mapped[int] = mapped_column(Integer, nullable=False)
    profile_image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    specializations: Mapped[str] = mapped_column(JSON, nullable=False)  # List of specializations
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Relationships
    treks: Mapped[List["Trek"]] = relationship("Trek", back_populates="guide")


# Import for type hints
from app.db.models.trek import Trek

