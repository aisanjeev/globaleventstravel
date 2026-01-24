"""
Page content API endpoints for CMS-like sections.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.crud.page_content import page_section_crud
from app.models.page_content import (
    PageSectionCreate,
    PageSectionUpdate,
    PageSectionResponse,
    PageSectionListResponse,
)


router = APIRouter()


@router.get(
    "/{page}",
    response_model=List[PageSectionListResponse],
)
def list_page_sections(
    page: str,
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    """Get all sections for a given page."""
    sections = page_section_crud.list_by_page(
        db,
        page=page,
        active_only=active_only,
    )
    return [PageSectionListResponse.model_validate(s) for s in sections]


@router.get(
    "/{page}/{key}",
    response_model=PageSectionResponse,
)
def get_page_section(
    page: str,
    key: str,
    db: Session = Depends(get_db),
):
    """Get a single section by page and key."""
    section = page_section_crud.get_by_page_and_key(db, page=page, key=key)
    if not section:
        raise HTTPException(status_code=404, detail="Page section not found")
    return PageSectionResponse.model_validate(section)


@router.post(
    "",
    response_model=PageSectionResponse,
    status_code=201,
)
def create_page_section(
    section_in: PageSectionCreate,
    db: Session = Depends(get_db),
):
    """Create a new page section."""
    # Optional: prevent duplicates for same page+key
    existing = page_section_crud.get_by_page_and_key(
        db, page=section_in.page, key=section_in.key
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Section with this page and key already exists",
        )

    section = page_section_crud.create(db, obj_in=section_in)
    return PageSectionResponse.model_validate(section)


@router.put(
    "/{section_id}",
    response_model=PageSectionResponse,
)
def update_page_section(
    section_id: int,
    section_in: PageSectionUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing page section."""
    section = page_section_crud.get(db, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Page section not found")

    section = page_section_crud.update(db, db_obj=section, obj_in=section_in)
    return PageSectionResponse.model_validate(section)


@router.delete("/{section_id}")
def delete_page_section(
    section_id: int,
    db: Session = Depends(get_db),
):
    """Delete a page section."""
    section = page_section_crud.get(db, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Page section not found")

    page_section_crud.remove(db, id=section_id)
    return {"message": "Page section deleted successfully"}

