"""
CRUD operations for Booking model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.booking import Booking
from app.models.booking import BookingCreate, BookingUpdate


class CRUDBooking(CRUDBase[Booking, BookingCreate, BookingUpdate]):
    """CRUD operations for Booking model."""
    
    def get_by_email(self, db: Session, email: str) -> List[Booking]:
        """Get all bookings for an email."""
        return db.query(Booking).filter(Booking.email == email).all()
    
    def get_by_trek(self, db: Session, trek_id: int) -> List[Booking]:
        """Get all bookings for a trek."""
        return db.query(Booking).filter(Booking.trek_id == trek_id).all()
    
    def get_by_status(
        self, 
        db: Session, 
        status: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Booking]:
        """Get bookings by status."""
        return db.query(Booking).filter(
            Booking.status == status
        ).offset(skip).limit(limit).all()
    
    def update_status(
        self,
        db: Session,
        *,
        booking_id: int,
        status: str
    ) -> Optional[Booking]:
        """Update booking status."""
        booking = self.get(db, booking_id)
        if booking:
            booking.status = status
            db.commit()
            db.refresh(booking)
        return booking


booking_crud = CRUDBooking(Booking)

