"""
CRUD operations for Google reviews (read-only from API perspective).
"""
from sqlalchemy.orm import Session
from app.db.models.google_review import GoogleReview
from app.db.models.google_reviews_meta import GoogleReviewsMeta
from app.models.google_review import GoogleReviewResponse, GoogleReviewsResponse


def get_reviews_with_meta(db: Session, place_id: str) -> GoogleReviewsResponse | None:
    """Get all reviews and meta for a place. Returns None if no data."""
    meta = db.query(GoogleReviewsMeta).filter(GoogleReviewsMeta.place_id == place_id).first()
    reviews = (
        db.query(GoogleReview)
        .filter(GoogleReview.place_id == place_id)
        .order_by(GoogleReview.review_time.desc())
        .all()
    )

    if not meta and not reviews:
        return None

    return GoogleReviewsResponse(
        reviews=[GoogleReviewResponse.model_validate(r) for r in reviews],
        place_name=meta.place_name if meta else "",
        rating=meta.rating if meta else None,
        user_ratings_total=meta.user_ratings_total if meta else None,
        last_synced_at=meta.last_synced_at if meta else None,
    )
