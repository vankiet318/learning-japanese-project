from pydantic_settings import BaseSettings
from pydantic import ValidationError, field_validator
from typing import Optional, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Japanese Kana Learning"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./dev.db"
    
    # Security
    SECRET_KEY: str = "supersecretkey123"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Union[str, None]) -> str:
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v or "sqlite:///./dev.db"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
