"""
CRUD operations for Expedition model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.crud.base import CRUDBase
from app.db.models.expedition import Expedition, ExpeditionDay
from app.models.expedition import ExpeditionCreate, ExpeditionUpdate, ExpeditionDayCreate


class CRUDExpedition(CRUDBase[Expedition, ExpeditionCreate, ExpeditionUpdate]):
    """CRUD operations for Expedition model."""
    
    def get_with_details(self, db: Session, id: int) -> Optional[Expedition]:
        """Get expedition with all related data."""
        return db.query(Expedition).options(
            joinedload(Expedition.itinerary)
        ).filter(Expedition.id == id).first()
    
    def get_by_slug_with_details(self, db: Session, slug: str) -> Optional[Expedition]:
        """Get expedition by slug with all related data."""
        return db.query(Expedition).options(
            joinedload(Expedition.itinerary)
        ).filter(Expedition.slug == slug).first()
    
    def get_multi_with_filters(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        difficulty: Optional[str] = None,
        max_price: Optional[float] = None,
        min_price: Optional[float] = None,
        featured: Optional[bool] = None,
        region: Optional[str] = None
    ) -> List[Expedition]:
        """Get expeditions with various filters."""
        query = db.query(Expedition)
        
        if difficulty:
            query = query.filter(Expedition.difficulty == difficulty)
        if max_price is not None:
            query = query.filter(Expedition.price <= max_price)
        if min_price is not None:
            query = query.filter(Expedition.price >= min_price)
        if featured is not None:
            query = query.filter(Expedition.featured == featured)
        if region:
            query = query.filter(Expedition.region.ilike(f"%{region}%"))
        
        return query.offset(skip).limit(limit).all()
    
    def get_count_with_filters(
        self,
        db: Session,
        *,
        difficulty: Optional[str] = None,
        max_price: Optional[float] = None,
        min_price: Optional[float] = None,
        featured: Optional[bool] = None,
        region: Optional[str] = None
    ) -> int:
        """Get count of expeditions with filters."""
        from sqlalchemy import func
        query = db.query(func.count(Expedition.id))
        
        if difficulty:
            query = query.filter(Expedition.difficulty == difficulty)
        if max_price is not None:
            query = query.filter(Expedition.price <= max_price)
        if min_price is not None:
            query = query.filter(Expedition.price >= min_price)
        if featured is not None:
            query = query.filter(Expedition.featured == featured)
        if region:
            query = query.filter(Expedition.region.ilike(f"%{region}%"))
        
        return query.scalar() or 0
    
    def create_with_relations(
        self,
        db: Session,
        *,
        obj_in: ExpeditionCreate
    ) -> Expedition:
        """Create expedition with itinerary."""
        # Extract nested data
        itinerary_data = obj_in.itinerary or []
        
        # Create expedition data dict
        exp_data = obj_in.model_dump(exclude={"itinerary"}, by_alias=False)
        
        # Map aliased fields to DB fields
        if "summitAltitude" in exp_data:
            exp_data["summit_altitude"] = exp_data.pop("summitAltitude")
        if "baseAltitude" in exp_data:
            exp_data["base_altitude"] = exp_data.pop("baseAltitude")
        if "shortDescription" in exp_data:
            exp_data["short_description"] = exp_data.pop("shortDescription")
        if "successRate" in exp_data:
            exp_data["success_rate"] = exp_data.pop("successRate")
        if "safetyInfo" in exp_data:
            exp_data["safety_info"] = exp_data.pop("safetyInfo")
        if "reviewCount" in exp_data:
            exp_data["review_count"] = exp_data.pop("reviewCount")
        
        # Convert nested models to dict
        if "requirements" in exp_data and hasattr(exp_data["requirements"], "model_dump"):
            exp_data["requirements"] = exp_data["requirements"].model_dump()
        if "equipment" in exp_data and hasattr(exp_data["equipment"], "model_dump"):
            exp_data["equipment"] = exp_data["equipment"].model_dump()
        
        db_exp = Expedition(**exp_data)
        db.add(db_exp)
        db.flush()
        
        # Create itinerary days
        for day_data in itinerary_data:
            day_dict = day_data.model_dump() if hasattr(day_data, "model_dump") else day_data
            db_day = ExpeditionDay(**day_dict, expedition_id=db_exp.id)
            db.add(db_day)
        
        db.commit()
        db.refresh(db_exp)
        return db_exp


expedition_crud = CRUDExpedition(Expedition)

