from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Japanese Kana Learning"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./dev.db"
    SECRET_KEY: str = "change-me"

settings = Settings()
