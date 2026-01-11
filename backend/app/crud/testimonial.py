"""
CRUD operations for Testimonial model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.testimonial import Testimonial
from app.models.testimonial import TestimonialCreate, TestimonialUpdate


class CRUDTestimonial(CRUDBase[Testimonial, TestimonialCreate, TestimonialUpdate]):
    """CRUD operations for Testimonial model."""
    
    def get_by_trek(self, db: Session, trek_name: str) -> List[Testimonial]:
        """Get testimonials for a specific trek."""
        return db.query(Testimonial).filter(
            Testimonial.trek_name == trek_name
        ).all()
    
    def get_verified(
        self, 
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[Testimonial]:
        """Get verified testimonials."""
        return db.query(Testimonial).filter(
            Testimonial.verified == True
        ).offset(skip).limit(limit).all()
    
    def increment_helpful(
        self,
        db: Session,
        *,
        testimonial_id: int
    ) -> Optional[Testimonial]:
        """Increment helpful count for a testimonial."""
        testimonial = self.get(db, testimonial_id)
        if testimonial:
            testimonial.helpful_count += 1
            db.commit()
            db.refresh(testimonial)
        return testimonial


testimonial_crud = CRUDTestimonial(Testimonial)

