"""
CRUD operations for Trek model.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload
from app.crud.base import CRUDBase
from app.db.models.trek import Trek, TrekImage, ItineraryDay
from app.models.trek import TrekCreate, TrekUpdate, ItineraryDayCreate, TrekImageCreate


class CRUDTrek(CRUDBase[Trek, TrekCreate, TrekUpdate]):
    """CRUD operations for Trek model."""
    
    def get_with_details(self, db: Session, id: int) -> Optional[Trek]:
        """Get trek with all related data."""
        return db.query(Trek).options(
            joinedload(Trek.itinerary),
            joinedload(Trek.images),
            joinedload(Trek.guide)
        ).filter(Trek.id == id).first()
    
    def get_by_slug_with_details(self, db: Session, slug: str) -> Optional[Trek]:
        """Get trek by slug with all related data."""
        return db.query(Trek).options(
            joinedload(Trek.itinerary),
            joinedload(Trek.images),
            joinedload(Trek.guide)
        ).filter(Trek.slug == slug).first()
    
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
        season: Optional[str] = None
    ) -> List[Trek]:
        """Get treks with various filters."""
        query = db.query(Trek)
        
        if difficulty:
            query = query.filter(Trek.difficulty == difficulty)
        if max_price is not None:
            query = query.filter(Trek.price <= max_price)
        if min_price is not None:
            query = query.filter(Trek.price >= min_price)
        if featured is not None:
            query = query.filter(Trek.featured == featured)
        if season:
            # JSON contains check - works for both SQLite and MySQL
            query = query.filter(Trek.season.contains(season))
        
        return query.offset(skip).limit(limit).all()
    
    def get_count_with_filters(
        self,
        db: Session,
        *,
        difficulty: Optional[str] = None,
        max_price: Optional[float] = None,
        min_price: Optional[float] = None,
        featured: Optional[bool] = None,
        season: Optional[str] = None
    ) -> int:
        """Get count of treks with filters."""
        from sqlalchemy import func
        query = db.query(func.count(Trek.id))
        
        if difficulty:
            query = query.filter(Trek.difficulty == difficulty)
        if max_price is not None:
            query = query.filter(Trek.price <= max_price)
        if min_price is not None:
            query = query.filter(Trek.price >= min_price)
        if featured is not None:
            query = query.filter(Trek.featured == featured)
        if season:
            query = query.filter(Trek.season.contains(season))
        
        return query.scalar() or 0
    
    def create_with_relations(
        self,
        db: Session,
        *,
        obj_in: TrekCreate
    ) -> Trek:
        """Create trek with itinerary and images."""
        # Extract nested data
        itinerary_data = obj_in.itinerary or []
        images_data = obj_in.images or []
        
        # Create trek without nested data
        trek_data = obj_in.model_dump(exclude={"itinerary", "images"})
        db_trek = Trek(**trek_data)
        db.add(db_trek)
        db.flush()  # Get the ID
        
        # Create itinerary days
        for day_data in itinerary_data:
            db_day = ItineraryDay(**day_data.model_dump(), trek_id=db_trek.id)
            db.add(db_day)
        
        # Create images
        for img_data in images_data:
            db_img = TrekImage(**img_data.model_dump(), trek_id=db_trek.id)
            db.add(db_img)
        
        db.commit()
        db.refresh(db_trek)
        return db_trek
    
    def add_itinerary_day(
        self,
        db: Session,
        *,
        trek_id: int,
        day_in: ItineraryDayCreate
    ) -> ItineraryDay:
        """Add an itinerary day to a trek."""
        db_day = ItineraryDay(**day_in.model_dump(), trek_id=trek_id)
        db.add(db_day)
        db.commit()
        db.refresh(db_day)
        return db_day
    
    def add_image(
        self,
        db: Session,
        *,
        trek_id: int,
        image_in: TrekImageCreate
    ) -> TrekImage:
        """Add an image to a trek."""
        db_img = TrekImage(**image_in.model_dump(), trek_id=trek_id)
        db.add(db_img)
        db.commit()
        db.refresh(db_img)
        return db_img


trek_crud = CRUDTrek(Trek)

