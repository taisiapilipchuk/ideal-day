from pydantic import BaseModel
from datetime import date, time

# ---------- Пользователи ----------


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


# ---------- Задачи ----------


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    task_type: str = "routine"
    duration: int = 30
    due_date: date
    start_time: time | None = None
    end_time: time | None = None
    priority: int = 1


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    task_type: str | None = None
    duration: int | None = None
    due_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    is_completed: bool | None = None
    priority: int | None = None


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    task_type: str
    duration: int
    due_date: date
    start_time: time | None
    end_time: time | None
    is_completed: bool
    priority: int

    model_config = {"from_attributes": True}
