"""
Site settings API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.auth import get_current_admin_user
from app.db.models.user import User
from app.crud import site_settings as crud_site_settings
from app.models.site_settings import SiteSettingsUpdate, SiteSettingsResponse

router = APIRouter()


@router.get("", response_model=SiteSettingsResponse)
def get_site_settings(db: Session = Depends(get_db)):
    """Get current site settings (public). Returns defaults when no row exists."""
    row = crud_site_settings.get(db)
    if not row:
        return crud_site_settings.get_defaults()
    return row


@router.put("", response_model=SiteSettingsResponse)
def update_site_settings(
    data: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Update or create site settings (admin only). Creates row on first save if missing."""
    row = crud_site_settings.update(db, obj_in=data)
    return row
