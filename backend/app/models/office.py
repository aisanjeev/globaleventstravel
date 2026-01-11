"""
Office Pydantic schemas for request/response validation.
"""
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class Coordinates(BaseModel):
    """Coordinates model."""
    lat: float
    lng: float


class OfficeBase(BaseModel):
    """Base schema for office."""
    name: str = Field(..., min_length=2, max_length=255)
    address: str
    city: str
    state: str
    pincode: str
    landmarks: Optional[str] = None
    phone: str
    email: EmailStr
    lat: float
    lng: float
    map_url: str = Field(..., alias="mapUrl")
    image: Optional[str] = None

    class Config:
        populate_by_name = True


class OfficeCreate(OfficeBase):
    """Schema for creating an office."""
    pass


class OfficeUpdate(BaseModel):
    """Schema for updating an office."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmarks: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    map_url: Optional[str] = Field(None, alias="mapUrl")
    image: Optional[str] = None

    class Config:
        populate_by_name = True


class OfficeResponse(BaseModel):
    """Schema for office response."""
    id: int
    name: str
    address: str
    city: str
    state: str
    pincode: str
    landmarks: Optional[str] = None
    phone: str
    email: str
    coordinates: Coordinates
    mapUrl: str
    image: Optional[str] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_model(cls, obj):
        """Convert ORM model to response schema."""
        return cls(
            id=obj.id,
            name=obj.name,
            address=obj.address,
            city=obj.city,
            state=obj.state,
            pincode=obj.pincode,
            landmarks=obj.landmarks,
            phone=obj.phone,
            email=obj.email,
            coordinates=Coordinates(lat=obj.lat, lng=obj.lng),
            mapUrl=obj.map_url,
            image=obj.image,
        )

