"""
Pydantic schemas for EmailLog.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class EmailLogResponse(BaseModel):
    """Schema for email log response."""

    id: int
    recipient_email: str
    subject: str
    email_type: str
    lead_id: Optional[int] = None
    contact_id: Optional[int] = None
    brevo_message_id: Optional[str] = None
    tags: Optional[List[str]] = None
    sent_at: datetime
    delivered_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True
