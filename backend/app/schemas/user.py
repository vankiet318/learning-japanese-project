from pydantic import BaseModel, EmailStr
from typing import Optional, Union

class UserCreate(BaseModel):
    name: Union[str, None] = None
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: Union[str, None] = None
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
