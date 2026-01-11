"""
Health check endpoint.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.deps import get_db
from app.core.config import settings

router = APIRouter()


@router.get("")
def health_check():
    """Basic health check."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@router.get("/db")
def health_check_db(db: Session = Depends(get_db)):
    """Health check with database connectivity test."""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": db_status,
        "database_type": "sqlite" if settings.is_sqlite else "mysql",
    }

