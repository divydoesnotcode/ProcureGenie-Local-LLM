from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Vendor Generation System"
    DATABASE_URL: str
    OLLAMA_URL: str = "http://localhost:11434/api/generate"
    MODEL_NAME: str = "ministral-3:3B"  # use ollama list to verify exact tag

    class Config:
        env_file = ".env"

settings = Settings()
