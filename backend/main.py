from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth
from app.db.base import Base
from app.db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Japanese Learning Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://jplearning.vercel.app",
        "https://jplearning.vercel.app/",
    ],
    # Use a more liberal regex to ensure all Vercel subdomains and common patterns match
    allow_origin_regex=r"https://.*\.vercel\.app$|https://jplearning\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
