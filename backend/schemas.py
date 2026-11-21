from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import date, time
from typing import Literal

# ---------- Пользователи ----------

Chronotype = Literal[
    "lark",
    "leaning_lark",
    "pigeon",
    "leaning_owl",
    "owl",
]

TaskType = Literal[
    "intellectual",
    "physical",
    "creative",
    "communication",
    "routine",
    "rest",
]


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8)
    birth_date: date
    chronotype: Chronotype = "pigeon"


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    birth_date: date
    chronotype: Chronotype

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------- Задачи ----------


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    task_type: TaskType = "routine"
    duration: int = Field(default=30, gt=0)
    due_date: date
    deadline_time: time | None = None
    start_time: time | None = None
    end_time: time | None = None
    priority: int = Field(default=1, ge=1, le=5)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    task_type: TaskType | None = None
    duration: int | None = Field(default=None, gt=0)
    due_date: date | None = None
    deadline_time: time | None = None
    start_time: time | None = None
    end_time: time | None = None
    is_completed: bool | None = None
    priority: int | None = Field(default=None, ge=1, le=5)

    @model_validator(mode="before")
    @classmethod
    def reject_null_required_fields(cls, data):
        required_fields = {
            "title",
            "task_type",
            "duration",
            "due_date",
            "is_completed",
            "priority",
        }

        if isinstance(data, dict):
            for field in required_fields:
                if field in data and data[field] is None:
                    raise ValueError(f"Поле '{field}' не может быть null")

        return data


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    task_type: str
    duration: int
    due_date: date
    deadline_time: time | None
    start_time: time | None
    end_time: time | None
    is_completed: bool
    priority: int

    model_config = {"from_attributes": True}
