from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, Index, Float, Time
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    chronotype = Column(String, nullable=False, default="pigeon")

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    biorhythm_logs = relationship("BiorhythmLog", back_populates="user", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    task_type = Column(String, nullable=False, default="routine")
    duration = Column(Integer, nullable=False, default=30)
    due_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    priority = Column(Integer, default=1, nullable=False)

    user = relationship("User", back_populates="tasks")

    __table_args__ = (
        Index("idx_tasks_user_date", "user_id", "due_date"),
        Index("idx_tasks_status", "user_id", "is_completed"),
    )


class BiorhythmLog(Base):
    __tablename__ = "biorhythm_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    physical = Column(Float, nullable=False)
    emotional = Column(Float, nullable=False)
    intellectual = Column(Float, nullable=False)

    user = relationship("User", back_populates="biorhythm_logs")

    __table_args__ = (
        Index("idx_biorhythm_user_date", "user_id", "date", unique=True),
    )