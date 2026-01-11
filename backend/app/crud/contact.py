"""
CRUD operations for ContactMessage model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.contact import ContactMessage
from app.models.contact import ContactMessageCreate, ContactMessageUpdate


class CRUDContactMessage(CRUDBase[ContactMessage, ContactMessageCreate, ContactMessageUpdate]):
    """CRUD operations for ContactMessage model."""
    
    def get_unread(
        self, 
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[ContactMessage]:
        """Get unread messages."""
        return db.query(ContactMessage).filter(
            ContactMessage.status == "unread"
        ).order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_by_status(
        self, 
        db: Session, 
        status: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[ContactMessage]:
        """Get messages by status."""
        return db.query(ContactMessage).filter(
            ContactMessage.status == status
        ).offset(skip).limit(limit).all()
    
    def mark_as_read(
        self,
        db: Session,
        *,
        message_id: int
    ) -> Optional[ContactMessage]:
        """Mark message as read."""
        message = self.get(db, message_id)
        if message and message.status == "unread":
            message.status = "read"
            db.commit()
            db.refresh(message)
        return message


contact_crud = CRUDContactMessage(ContactMessage)

