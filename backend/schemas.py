from pydantic import BaseModel
from datetime import date


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    birth_date: date


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    birth_date: date
    chronotype: str

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    email: str
    password: str