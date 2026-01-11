"""
FastAPI application entry point.
Global Events Travels API
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Creates database tables on startup.
    """
    # Ensure data directory exists for SQLite
    if settings.is_sqlite:
        os.makedirs("data", exist_ok=True)
    
    # Import all models to register them
    from app.db.models import (
        Trek, Expedition, Guide, Booking, Lead, 
        ContactMessage, Testimonial, Office, BlogPost
    )
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    yield
    
    # Cleanup (if needed)
    pass


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## Global Events Travels API
    
    Backend API for the Global Events Travels website.
    
    ### Features
    - **Treks**: Browse and manage trekking packages
    - **Expeditions**: Mountaineering expeditions
    - **Guides**: Trek/expedition leaders
    - **Bookings**: Trek reservations
    - **Leads**: Lead capture from forms
    - **Contact**: Contact form submissions
    - **Testimonials**: Customer reviews
    - **Blog**: Travel blog posts
    - **Offices**: Company locations
    
    ### Authentication
    Currently public API. Authentication can be added later.
    """,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# Root endpoint
@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "api": settings.API_V1_PREFIX,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )

