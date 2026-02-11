"""
Pydantic schemas for site settings.
"""
from typing import Optional
from pydantic import BaseModel, Field


class SiteSettingsBase(BaseModel):
    """Base schema for site settings."""

    company_name: str = Field(..., min_length=1, max_length=255)
    tagline: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    url: Optional[str] = Field(None, max_length=500)
    email: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1, max_length=50)
    address: Optional[str] = Field(None, max_length=500)
    facebook_url: Optional[str] = Field(None, max_length=500)
    instagram_url: Optional[str] = Field(None, max_length=500)
    twitter_url: Optional[str] = Field(None, max_length=500)
    youtube_url: Optional[str] = Field(None, max_length=500)


class SiteSettingsUpdate(BaseModel):
    """Schema for updating site settings."""

    company_name: Optional[str] = Field(None, min_length=1, max_length=255)
    tagline: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    url: Optional[str] = Field(None, max_length=500)
    email: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = Field(None, min_length=1, max_length=50)
    address: Optional[str] = Field(None, max_length=500)
    facebook_url: Optional[str] = Field(None, max_length=500)
    instagram_url: Optional[str] = Field(None, max_length=500)
    twitter_url: Optional[str] = Field(None, max_length=500)
    youtube_url: Optional[str] = Field(None, max_length=500)


class SiteSettingsResponse(BaseModel):
    """Schema for site settings response."""

    id: int
    company_name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    email: str
    phone: str
    address: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    twitter_url: Optional[str] = None
    youtube_url: Optional[str] = None

    class Config:
        from_attributes = True
