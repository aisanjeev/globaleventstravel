"""
Application configuration using Pydantic Settings.
Supports both SQLite (default) and MySQL databases.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Application
    APP_NAME: str = "Global Events Travels API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"
    
    # Database
    # Default: SQLite, can be changed to MySQL via environment variable
    # SQLite: sqlite:///./data/app.db
    # MySQL: mysql+pymysql://user:password@localhost:3306/dbname
    DATABASE_URL: str = "sqlite:///./data/app.db"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:4321,http://localhost:3000"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 100
    
    # Storage Configuration
    STORAGE_TYPE: str = "local"  # "local" or "azure"
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_CONTAINER_NAME: str = "global-events-travels"
    LOCAL_UPLOAD_DIR: str = "uploads"
    
    # Database Migrations
    USE_ALEMBIC_MIGRATIONS: bool = False  # Set to True to use Alembic migrations on startup

    # Brevo Email
    BREVO_API_KEY: str = ""
    ADMIN_EMAIL: str = ""
    SENDER_EMAIL: str = "noreply@example.com"
    SENDER_NAME: str = "Global Events Travels"
    FRONTEND_URL: str = "http://localhost:4321"
    API_BASE_URL: str = "http://localhost:8000"  # For building absolute PDF URLs

    # Google Places API (for reviews sync)
    GOOGLE_MAPS_API_KEY: str = ""
    GOOGLE_REVIEWS_PLACE_ID: str = "ChIJGQi8B8FdBDkROs-J97u89T0"
    GOOGLE_REVIEWS_SYNC_KEY: str = ""  # Optional: cron can pass X-Sync-Key header instead of admin auth

    @property
    def is_azure_storage(self) -> bool:
        """Check if using Azure Blob Storage."""
        return self.STORAGE_TYPE.lower() == "azure"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def is_sqlite(self) -> bool:
        """Check if using SQLite database."""
        return self.DATABASE_URL.startswith("sqlite")
    
    @property
    def is_mysql(self) -> bool:
        """Check if using MySQL database."""
        return "mysql" in self.DATABASE_URL


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance.
    Using lru_cache ensures settings are only loaded once.
    """
    return Settings()


settings = get_settings()

