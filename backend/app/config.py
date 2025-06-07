import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://spotify:spotify@localhost:5432/mini_spotify"
    )
    
    class Config:
        env_file = ".env"

settings = Settings() 