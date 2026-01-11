"""
Contact message Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class ContactMessageBase(BaseModel):
    """Base schema for contact message."""
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., max_length=100)
    trek_interest: Optional[str] = None
    message: str = Field(..., min_length=10)
    newsletter_subscribe: bool = False


class ContactMessageCreate(ContactMessageBase):
    """Schema for creating a contact message."""
    pass


class ContactMessageUpdate(BaseModel):
    """Schema for updating a contact message."""
    status: Optional[str] = Field(None, pattern="^(unread|read|replied|archived)$")
    admin_notes: Optional[str] = None


class ContactMessageResponse(ContactMessageBase):
    """Schema for contact message response."""
    id: int
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContactMessageListResponse(BaseModel):
    """Schema for contact message list."""
    id: int
    name: str
    email: str
    subject: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

