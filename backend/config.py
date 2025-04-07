# backend/config.py
import os
from pydantic import BaseSettings, validator
from typing import Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("config")

class Settings(BaseSettings):
    """Application settings loaded from environment variables with validation."""
    
    # App settings
    APP_NAME: str = "Elevate"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # DeepSeek API settings
    DEEPSEEK_API_KEY: str 
    DEEPSEEK_API_BASE_URL: str = "https://api.deepseek.com/v1"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    DEEPSEEK_REQUEST_TIMEOUT: int = 30
    DEEPSEEK_MAX_RETRIES: int = 3
    
    # API request configuration
    AI_REQUEST_LOGGING: bool = True
    AI_RESPONSE_CACHE_ENABLED: bool = True
    AI_RESPONSE_CACHE_TTL: int = 3600  # 1 hour in seconds
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./elevate.db"
    
    # JWT settings
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @validator("DEEPSEEK_API_KEY")
    def validate_api_key(cls, v):
        """Validate the DeepSeek API key format."""
        if not v or not isinstance(v, str):
            raise ValueError("DeepSeek API key must be provided")
        
        if not v.startswith("sk-"):
            logger.warning("DeepSeek API key doesn't follow expected format (should start with 'sk-')")
        
        return v
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        """Validate the log level."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            logger.warning(f"Invalid log level: {v}. Defaulting to INFO.")
            return "INFO"
        return v.upper()
    
    class Config:
        """Configuration for the Settings class."""
        env_file = ".env"
        case_sensitive = True

def get_settings() -> Settings:
    """Get application settings.
    
    Returns:
        Settings object with application configuration.
    
    Raises:
        Exception: If required environment variables are missing.
    """
    try:
        settings = Settings()
        
        # Configure logging level based on settings
        logging.getLogger().setLevel(getattr(logging, settings.LOG_LEVEL))
        
        return settings
    except Exception as e:
        logger.error(f"Failed to load settings: {str(e)}")
        # Re-raise the exception to be handled by the caller
        raise

# Create a global settings instance
try:
    settings = get_settings()
    logger.info(f"Loaded configuration for environment: {settings.APP_ENV}")
except Exception as e:
    logger.critical(f"Failed to initialize application settings: {str(e)}")
    # Set default settings for critical failures
    settings = None



