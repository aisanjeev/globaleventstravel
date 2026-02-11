"""
CRUD operations for SiteSettings model (single-row).
"""
from sqlalchemy.orm import Session
from app.db.models.site_settings import SiteSettings
from app.models.site_settings import SiteSettingsUpdate


SITE_SETTINGS_ID = 1


def get(db: Session) -> SiteSettings | None:
    """Get the single site settings row."""
    return db.query(SiteSettings).filter(SiteSettings.id == SITE_SETTINGS_ID).first()


def get_defaults() -> "SiteSettingsResponse":
    """Return default values when no row exists (for API response)."""
    from app.models.site_settings import SiteSettingsResponse

    return SiteSettingsResponse(
        id=SITE_SETTINGS_ID,
        company_name="Global Events Travels",
        tagline="Adventure Awaits in the Himalayas",
        description="Discover amazing treks and expeditions in the Himalayas.",
        url="https://globaleventstravels.com",
        email="info@globaleventstravels.com",
        phone="+91 63833 13359",
        address="Manali, Himachal Pradesh, India",
        facebook_url="https://www.facebook.com/TheTrekkingCommunity",
        instagram_url="https://www.instagram.com/global_events_travels",
        twitter_url="#",
        youtube_url="https://www.youtube.com/@globaleventstravels6010",
    )


def update(db: Session, *, obj_in: SiteSettingsUpdate) -> SiteSettings:
    """Update or create the single site settings row (upsert)."""
    row = db.query(SiteSettings).filter(SiteSettings.id == SITE_SETTINGS_ID).first()
    data = obj_in.model_dump(exclude_unset=True)
    if not row:
        # Create initial row - use payload with defaults for required fields
        row = SiteSettings(
            id=SITE_SETTINGS_ID,
            company_name=data.get("company_name") or "Company",
            email=data.get("email") or "info@example.com",
            phone=data.get("phone") or "+",
            tagline=data.get("tagline"),
            description=data.get("description"),
            url=data.get("url"),
            address=data.get("address"),
            facebook_url=data.get("facebook_url"),
            instagram_url=data.get("instagram_url"),
            twitter_url=data.get("twitter_url"),
            youtube_url=data.get("youtube_url"),
        )
        db.add(row)
    else:
        for field, value in data.items():
            if hasattr(row, field):
                setattr(row, field, value)
        db.add(row)
    db.commit()
    db.refresh(row)
    return row
