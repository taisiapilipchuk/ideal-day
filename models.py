from database import Base
from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  email = Column(String, unique=True, index=True, nullable=False)
  password_hash = Column(String, nullable=False)
  birth_date = Column(Date, nullable=True)  # Нужно для расчета биоритмов
  chronotype_score = Column(
      Integer, nullable=True
  )  # Результат теста на хронотип


class Task(Base):
  __tablename__ = "tasks"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  title = Column(String, nullable=False)  # Название задачи
  cognitive_weight = Column(Integer, default=1)  # Сложность от 1 до 5
  duration_minutes = Column(Integer, default=30)  # Длительность в минутах
  scheduled_time = Column(String, nullable=True)  # Время, куда воткнул слот
  status = Column(String, default="pending")  # Статус: pending / completed


class BiorhythmLog(Base):
  __tablename__ = "biorhythm_logs"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  date = Column(Date, nullable=False)  # Дата расчета
  physical = Column(Float, default=0.0)  # Физический цикл (%)
  emotional = Column(Float, default=0.0)  # Эмоциональный цикл (%)
  intellectual = Column(Float, default=0.0)  # Интеллектуальный цикл (%)