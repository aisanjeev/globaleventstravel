"""
Guide Pydantic schemas for request/response validation.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class GuideBase(BaseModel):
    """Base schema for guide."""
    name: str = Field(..., min_length=2, max_length=255)
    bio: str
    experience_years: int = Field(..., gt=0)
    profile_image_url: str
    specializations: List[str]
    rating: float = Field(default=0.0, ge=0, le=5)


class GuideCreate(GuideBase):
    """Schema for creating a guide."""
    pass


class GuideUpdate(BaseModel):
    """Schema for updating a guide."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    bio: Optional[str] = None
    experience_years: Optional[int] = Field(None, gt=0)
    profile_image_url: Optional[str] = None
    specializations: Optional[List[str]] = None
    rating: Optional[float] = Field(None, ge=0, le=5)


class GuideResponse(GuideBase):
    """Schema for guide response."""
    id: int

    class Config:
        from_attributes = True

