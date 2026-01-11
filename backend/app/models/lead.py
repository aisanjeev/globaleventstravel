"""
Lead Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class LeadBase(BaseModel):
    """Base schema for lead."""
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    whatsapp: str = Field(..., min_length=10, max_length=15)
    trek_slug: str


class LeadCreate(LeadBase):
    """Schema for creating a lead."""
    trek_name: Optional[str] = None
    source: str = "website"


class LeadUpdate(BaseModel):
    """Schema for updating a lead."""
    status: Optional[str] = Field(None, pattern="^(new|contacted|converted|lost)$")
    notes: Optional[str] = None
    itinerary_sent: Optional[bool] = None


class LeadResponse(LeadBase):
    """Schema for lead response."""
    id: int
    trek_name: Optional[str] = None
    source: str
    status: str
    itinerary_sent: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    """Schema for lead list."""
    id: int
    name: str
    email: str
    whatsapp: str
    trek_slug: str
    trek_name: Optional[str] = None
    source: str
    status: str
    itinerary_sent: bool
    created_at: datetime

    class Config:
        from_attributes = True

