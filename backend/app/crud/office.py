"""
CRUD operations for Office model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.office import Office
from app.models.office import OfficeCreate, OfficeUpdate


class CRUDOffice(CRUDBase[Office, OfficeCreate, OfficeUpdate]):
    """CRUD operations for Office model."""
    
    def get_by_city(self, db: Session, city: str) -> Optional[Office]:
        """Get office by city (case-insensitive)."""
        return db.query(Office).filter(
            Office.city.ilike(f"%{city}%")
        ).first()
    
    def get_by_state(self, db: Session, state: str) -> List[Office]:
        """Get offices by state."""
        return db.query(Office).filter(
            Office.state.ilike(f"%{state}%")
        ).all()


office_crud = CRUDOffice(Office)

