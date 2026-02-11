"""
Email log model for tracking Brevo transactional email events.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class EmailLog(Base):
    """Email log for tracking sent emails and Brevo webhook events."""

    __tablename__ = "email_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    email_type: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )  # lead_notification | itinerary
    lead_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("leads.id", ondelete="SET NULL"), nullable=True
    )
    contact_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("contact_messages.id", ondelete="SET NULL"), nullable=True
    )
    brevo_message_id: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, index=True)
    tags: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)  # List of tags
    sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    opened_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(
        String(30), default="sent", nullable=False
    )  # sent | delivered | opened | bounced | error
