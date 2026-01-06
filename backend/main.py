from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta

from .database import create_db_and_tables, get_session
from .models import User, UserCreate, UserRead, Token
from .auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(title="Japanese Learning API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/auth/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    # Check if username or email already exists
    existing_user = session.exec(
        select(User).where((User.username == user.username) | (User.email == user.email))
    ).first()
    
    if existing_user:
        if existing_user.username == user.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        else:
            raise HTTPException(status_code=400, detail="Email already registered")

    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/")
async def root():
    return {"message": "Welcome to the Japanese Learning API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

