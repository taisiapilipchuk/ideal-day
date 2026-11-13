from datetime import date
from sqlalchemy.orm import Session
from models import User, Task, BiorhythmLog
from pwdlib import PasswordHash
from schemas import UserCreate, TaskCreate, TaskUpdate

password_hash = PasswordHash.recommended()


# ---------- Пользователи ----------


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user_data: UserCreate):
    hashed_password = password_hash.hash(user_data.password)

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        birth_date=user_data.birth_date,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_password(plain_password: str, hashed_password: str):
    return password_hash.verify(plain_password, hashed_password)


# ---------- Задачи ----------


def get_tasks_by_date(db: Session, user_id: int, target_date: date):
    return (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.due_date == target_date)
        .all()
    )


def get_all_tasks(db: Session, user_id: int):
    return db.query(Task).filter(Task.user_id == user_id).all()


def get_task(db: Session, user_id: int, task_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def create_task(db: Session, user_id: int, task_data: TaskCreate):
    task = Task(user_id=user_id, **task_data.model_dump())

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, task_data: TaskUpdate):
    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()


# ---------- Биоритмы ----------


def get_biorhythm_cache(db: Session, user_id: int, target_date: date):
    return (
        db.query(BiorhythmLog)
        .filter(BiorhythmLog.user_id == user_id, BiorhythmLog.date == target_date)
        .first()
    )


def save_biorhythm_cache(
    db: Session,
    user_id: int,
    target_date: date,
    physical: float,
    emotional: float,
    intellectual: float,
):
    log = BiorhythmLog(
        user_id=user_id,
        date=target_date,
        physical=physical,
        emotional=emotional,
        intellectual=intellectual,
    )

    db.add(log)
    db.commit()
    db.refresh(log)
    return log
