"""
Office API endpoints.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.crud.office import office_crud
from app.models.office import OfficeCreate, OfficeUpdate, OfficeResponse

router = APIRouter()


@router.get("", response_model=List[OfficeResponse])
def list_offices(
    db: Session = Depends(get_db),
):
    """Get list of all offices."""
    offices = office_crud.get_multi(db, limit=100)
    return [OfficeResponse.from_orm_model(o) for o in offices]


@router.get("/city/{city}", response_model=OfficeResponse)
def get_office_by_city(
    city: str,
    db: Session = Depends(get_db),
):
    """Get an office by city name."""
    office = office_crud.get_by_city(db, city)
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    return OfficeResponse.from_orm_model(office)


@router.get("/{office_id}", response_model=OfficeResponse)
def get_office(
    office_id: int,
    db: Session = Depends(get_db),
):
    """Get an office by ID."""
    office = office_crud.get(db, office_id)
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    return OfficeResponse.from_orm_model(office)


@router.post("", response_model=OfficeResponse, status_code=201)
def create_office(
    office_in: OfficeCreate,
    db: Session = Depends(get_db),
):
    """Create a new office."""
    # Convert aliased fields
    office_data = office_in.model_dump(by_alias=False)
    if "mapUrl" in office_data:
        office_data["map_url"] = office_data.pop("mapUrl")
    
    from app.db.models.office import Office
    db_office = Office(**office_data)
    db.add(db_office)
    db.commit()
    db.refresh(db_office)
    return OfficeResponse.from_orm_model(db_office)


@router.put("/{office_id}", response_model=OfficeResponse)
def update_office(
    office_id: int,
    office_in: OfficeUpdate,
    db: Session = Depends(get_db),
):
    """Update an office."""
    office = office_crud.get(db, office_id)
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    
    # Handle field alias
    update_data = office_in.model_dump(exclude_unset=True, by_alias=False)
    if "mapUrl" in update_data:
        update_data["map_url"] = update_data.pop("mapUrl")
    
    for field, value in update_data.items():
        if hasattr(office, field):
            setattr(office, field, value)
    
    db.commit()
    db.refresh(office)
    return OfficeResponse.from_orm_model(office)


@router.delete("/{office_id}")
def delete_office(
    office_id: int,
    db: Session = Depends(get_db),
):
    """Delete an office."""
    office = office_crud.get(db, office_id)
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    
    office_crud.remove(db, id=office_id)
    return {"message": "Office deleted successfully"}

