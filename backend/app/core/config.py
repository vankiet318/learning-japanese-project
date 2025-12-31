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
        if not isinstance(v, str):
            return v or "sqlite:///./dev.db"
            
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql://", 1)
            
        # If it's a PostgreSQL URL, ensure user:password part is correctly encoded
        if v.startswith("postgresql://"):
            import urllib.parse
            try:
                # Format: postgresql://user:password@host:port/dbname
                # Find the last '@' which separates credentials from host
                proto, rest = v.split("://", 1)
                if "@" in rest:
                    creds, host = rest.rsplit("@", 1)
                    if ":" in creds:
                        user, password = creds.split(":", 1)
                        # Only encode if not already looks like encoded (contains % handles some cases but let's be safe)
                        # We use quote_plus to handle '@', '#', etc.
                        safe_user = urllib.parse.quote_plus(urllib.parse.unquote(user))
                        safe_password = urllib.parse.quote_plus(urllib.parse.unquote(password))
                        return f"{proto}://{safe_user}:{safe_password}@{host}"
            except Exception:
                # Fallback to original if parsing fails
                pass
                
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
