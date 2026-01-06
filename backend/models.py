from typing import Optional
from sqlmodel import Field, SQLModel
from pydantic import EmailStr

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(index=True, unique=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Optional[str] = None
