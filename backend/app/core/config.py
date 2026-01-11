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

