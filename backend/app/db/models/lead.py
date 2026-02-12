"""
Lead model for capturing potential customer information.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Text, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Lead(Base):
    """Lead model for capturing leads from website forms."""
    
    __tablename__ = "leads"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    whatsapp: Mapped[str] = mapped_column(String(20), nullable=False)
    trek_slug: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    trek_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # trek | expedition - for PDF lookup
    interest_type: Mapped[str] = mapped_column(String(20), default="trek", nullable=False)

    # Source tracking
    source: Mapped[str] = mapped_column(
        String(50), default="website", nullable=False
    )  # website, mobile, hero_form, trek_page, etc.
    
    # Status tracking
    status: Mapped[str] = mapped_column(
        String(20), default="new", nullable=False
    )  # new, contacted, converted, lost
    
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # WhatsApp sent flag
    itinerary_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

