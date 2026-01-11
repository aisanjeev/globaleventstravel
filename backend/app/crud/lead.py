"""
CRUD operations for Lead model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.lead import Lead
from app.models.lead import LeadCreate, LeadUpdate


class CRUDLead(CRUDBase[Lead, LeadCreate, LeadUpdate]):
    """CRUD operations for Lead model."""
    
    def get_by_email(self, db: Session, email: str) -> List[Lead]:
        """Get all leads for an email."""
        return db.query(Lead).filter(Lead.email == email).all()
    
    def get_by_trek_slug(self, db: Session, trek_slug: str) -> List[Lead]:
        """Get all leads for a trek."""
        return db.query(Lead).filter(Lead.trek_slug == trek_slug).all()
    
    def get_by_status(
        self, 
        db: Session, 
        status: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Lead]:
        """Get leads by status."""
        return db.query(Lead).filter(
            Lead.status == status
        ).offset(skip).limit(limit).all()
    
    def get_new_leads(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[Lead]:
        """Get new/uncontacted leads."""
        return db.query(Lead).filter(
            Lead.status == "new"
        ).order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()
    
    def mark_itinerary_sent(
        self,
        db: Session,
        *,
        lead_id: int
    ) -> Optional[Lead]:
        """Mark lead as having received itinerary."""
        lead = self.get(db, lead_id)
        if lead:
            lead.itinerary_sent = True
            db.commit()
            db.refresh(lead)
        return lead


lead_crud = CRUDLead(Lead)

