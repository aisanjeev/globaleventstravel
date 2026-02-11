"""
Sync Google Reviews from Places API to database.
Run weekly via cron or admin endpoint.
"""
import json
from datetime import datetime
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models.google_review import GoogleReview
from app.db.models.google_reviews_meta import GoogleReviewsMeta
from app.db.session import SessionLocal


def fetch_place_details(place_id: str, api_key: str) -> dict[str, Any] | None:
    """Fetch place details from Google Places API (Place Details)."""
    base = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "key": api_key,
        "fields": "name,rating,reviews,user_ratings_total",
    }
    url = f"{base}?{urlencode(params)}"
    try:
        req = Request(url, headers={"User-Agent": "GlobalEventsTravels/1.0"})
        with urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data.get("status") == "OK":
                return data.get("result")
    except (URLError, HTTPError, json.JSONDecodeError):
        pass
    return None


def sync_google_reviews(db: Session) -> tuple[int, str | None]:
    """
    Sync Google reviews from Places API to DB.
    Returns (reviews_count, error_message).
    """
    api_key = settings.GOOGLE_MAPS_API_KEY.strip()
    place_id = settings.GOOGLE_REVIEWS_PLACE_ID.strip()
    if not api_key or not place_id:
        return 0, "GOOGLE_MAPS_API_KEY and GOOGLE_REVIEWS_PLACE_ID must be set"

    result = fetch_place_details(place_id, api_key)
    if not result:
        return 0, "Failed to fetch place details from Google Places API"

    place_name = result.get("name", "")
    rating = result.get("rating")
    user_ratings_total = result.get("user_ratings_total")
    reviews_data = result.get("reviews") or []

    now = datetime.utcnow()

    # Upsert meta
    meta = db.query(GoogleReviewsMeta).filter(GoogleReviewsMeta.place_id == place_id).first()
    if meta:
        meta.place_name = place_name
        meta.rating = float(rating) if rating is not None else None
        meta.user_ratings_total = user_ratings_total
        meta.last_synced_at = now
    else:
        meta = GoogleReviewsMeta(
            place_id=place_id,
            place_name=place_name,
            rating=float(rating) if rating is not None else None,
            user_ratings_total=user_ratings_total,
            last_synced_at=now,
        )
        db.add(meta)
    db.flush()

    # Delete existing reviews for this place, then insert new
    db.query(GoogleReview).filter(GoogleReview.place_id == place_id).delete()

    for r in reviews_data:
        rev = GoogleReview(
            place_id=place_id,
            author_name=r.get("author_name", ""),
            rating=int(r.get("rating", 0)) if r.get("rating") is not None else 0,
            text=r.get("text", ""),
            review_time=r.get("time"),
            relative_time_description=r.get("relative_time_description"),
            profile_photo_url=r.get("profile_photo_url"),
        )
        db.add(rev)

    db.commit()
    return len(reviews_data), None


def run_sync() -> tuple[int, str | None]:
    """Run sync with a new DB session. For CLI/endpoint use."""
    db = SessionLocal()
    try:
        return sync_google_reviews(db)
    finally:
        db.close()


def run_sync_cli() -> None:
    """CLI entry point for poetry run sync-google-reviews."""
    count, err = run_sync()
    if err:
        print(f"Error: {err}")
        raise SystemExit(1)
    print(f"Synced {count} Google reviews successfully.")
