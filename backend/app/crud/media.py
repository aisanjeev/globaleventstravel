"""
CRUD operations for Media model.
"""
from typing import List, Optional
from sqlalchemy import or_, func
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.media import Media
from app.models.media import MediaCreate, MediaUpdate


class CRUDMedia(CRUDBase[Media, MediaCreate, MediaUpdate]):
    """CRUD operations for Media."""
    
    def get_by_hash(self, db: Session, *, hash: str) -> Optional[Media]:
        """Get media by content hash."""
        return db.query(Media).filter(Media.hash == hash).first()
    
    def get_by_folder(
        self, 
        db: Session, 
        *, 
        folder: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[Media]:
        """Get media files by folder."""
        return (
            db.query(Media)
            .filter(Media.folder == folder)
            .order_by(Media.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_tags(
        self,
        db: Session,
        *,
        tags: List[str],
        skip: int = 0,
        limit: int = 50
    ) -> List[Media]:
        """Get media files that have any of the specified tags."""
        # For SQLite, we need to use JSON functions
        # This query finds media where tags array contains any of the specified tags
        conditions = []
        for tag in tags:
            # Use JSON_EACH for SQLite or JSON_CONTAINS for MySQL
            conditions.append(
                Media.tags.contains([tag])
            )
        
        return (
            db.query(Media)
            .filter(or_(*conditions))
            .order_by(Media.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search(
        self,
        db: Session,
        *,
        query: Optional[str] = None,
        folder: Optional[str] = None,
        tags: Optional[List[str]] = None,
        mime_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Media], int]:
        """
        Search media with filters.
        
        Returns:
            Tuple of (media list, total count)
        """
        q = db.query(Media)
        
        # Apply filters
        if query:
            search_term = f"%{query}%"
            q = q.filter(
                or_(
                    Media.original_filename.ilike(search_term),
                    Media.alt_text.ilike(search_term),
                    Media.caption.ilike(search_term),
                )
            )
        
        if folder:
            q = q.filter(Media.folder == folder)
        
        if tags:
            tag_conditions = []
            for tag in tags:
                tag_conditions.append(Media.tags.contains([tag]))
            q = q.filter(or_(*tag_conditions))
        
        if mime_type:
            if mime_type.endswith("/*"):
                # Match mime type category (e.g., "image/*")
                prefix = mime_type[:-1]
                q = q.filter(Media.mime_type.like(f"{prefix}%"))
            else:
                q = q.filter(Media.mime_type == mime_type)
        
        # Get total count before pagination
        total = q.count()
        
        # Apply ordering and pagination
        media_list = (
            q.order_by(Media.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return media_list, total
    
    def update_tags(
        self,
        db: Session,
        *,
        media_id: int,
        tags: List[str]
    ) -> Optional[Media]:
        """Update tags for a media item."""
        media = self.get(db, id=media_id)
        if media:
            media.tags = tags
            db.add(media)
            db.commit()
            db.refresh(media)
        return media
    
    def add_tags(
        self,
        db: Session,
        *,
        media_id: int,
        tags: List[str]
    ) -> Optional[Media]:
        """Add tags to a media item (without removing existing ones)."""
        media = self.get(db, id=media_id)
        if media:
            existing_tags = media.tags or []
            # Add new tags that don't already exist
            new_tags = list(set(existing_tags + tags))
            media.tags = new_tags
            db.add(media)
            db.commit()
            db.refresh(media)
        return media
    
    def remove_tag(
        self,
        db: Session,
        *,
        media_id: int,
        tag: str
    ) -> Optional[Media]:
        """Remove a specific tag from a media item."""
        media = self.get(db, id=media_id)
        if media and media.tags:
            if tag in media.tags:
                media.tags = [t for t in media.tags if t != tag]
                db.add(media)
                db.commit()
                db.refresh(media)
        return media
    
    def get_all_tags(self, db: Session) -> List[dict]:
        """Get all unique tags with their usage counts."""
        # This is a simple approach - for large datasets, 
        # consider a separate tags table
        all_media = db.query(Media).filter(Media.tags.isnot(None)).all()
        
        tag_counts = {}
        for media in all_media:
            if media.tags:
                for tag in media.tags:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        return [
            {"tag": tag, "count": count}
            for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1])
        ]
    
    def get_folders(self, db: Session) -> List[dict]:
        """Get all folders with their file counts."""
        results = (
            db.query(Media.folder, func.count(Media.id).label("count"))
            .group_by(Media.folder)
            .order_by(func.count(Media.id).desc())
            .all()
        )
        return [{"folder": r[0], "count": r[1]} for r in results]


# Singleton instance
media = CRUDMedia(Media)
