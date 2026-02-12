"""
Google reviews API endpoints.
"""
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.auth import oauth2_scheme
from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.models.user import User
from app.crud import google_review as crud_google_review
from app.models.google_review import GoogleReviewsResponse
from app.services.google_reviews_sync import sync_google_reviews

router = APIRouter()


async def _verify_sync_auth(
    x_sync_key: str | None = Header(None, alias="X-Sync-Key"),
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> None:
    """Allow admin auth OR valid X-Sync-Key for sync endpoint."""
    settings = get_settings()
    if settings.GOOGLE_REVIEWS_SYNC_KEY and x_sync_key == settings.GOOGLE_REVIEWS_SYNC_KEY:
        return
    if token:
        payload = decode_access_token(token)
        if payload:
            user_id = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == int(user_id)).first()
                if user and user.is_active and user.role in ("admin", "superadmin"):
                    return
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Admin authentication or valid X-Sync-Key required",
    )


@router.get("", response_model=GoogleReviewsResponse)
def get_google_reviews(db: Session = Depends(get_db)):
    """Get cached Google reviews (public). Returns empty list when not yet synced."""
    settings = get_settings()
    result = crud_google_review.get_reviews_with_meta(db, settings.GOOGLE_REVIEWS_PLACE_ID)
    if result is None:
        return GoogleReviewsResponse(reviews=[], place_name="", rating=None, user_ratings_total=None, last_synced_at=None)
    return result


@router.post("/sync")
def sync_google_reviews_endpoint(
    db: Session = Depends(get_db),
    _: None = Depends(_verify_sync_auth),
):
    """Trigger Google reviews sync (admin or X-Sync-Key)."""
    count, err = sync_google_reviews(db)
    if err:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=err)
    return {"synced": count, "message": f"Synced {count} reviews"}
