from datetime import date
from sqlalchemy.orm import Session

from models import (
    User,
    Task,
    BiorhythmLog,
    UserSettings,
    Notification,
)
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
        chronotype=user_data.chronotype,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception:
        db.rollback()
        raise


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

    try:
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
    except Exception:
        db.rollback()
        raise


def update_task(db: Session, task: Task, task_data: TaskUpdate):
    try:
        for key, value in task_data.model_dump(exclude_unset=True).items():
            setattr(task, key, value)

        db.commit()
        db.refresh(task)
        return task
    except Exception:
        db.rollback()
        raise


def delete_task(db: Session, task: Task):
    try:
        db.delete(task)
        db.commit()
    except Exception:
        db.rollback()
        raise


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

    try:
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
    except Exception:
        db.rollback()
        raise


# ---------- Настройки пользователя ----------


def get_or_create_user_settings(db: Session, user_id: int):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    if settings:
        return settings

    settings = UserSettings(user_id=user_id)

    try:
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings
    except Exception:
        db.rollback()
        raise


def update_user_settings(db: Session, user_id: int, settings_data):
    settings = get_or_create_user_settings(db, user_id)

    try:
        changes = settings_data.model_dump(exclude_unset=True)

        for key, value in changes.items():
            if value is not None:
                setattr(settings, key, value)

        db.commit()
        db.refresh(settings)
        return settings
    except Exception:
        db.rollback()
        raise


# ---------- Уведомления ----------


def get_user_notifications(db: Session, user_id: int):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_notification(db: Session, user_id: int, notification_id: int):
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .first()
    )


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "general",
    task_id: int | None = None,
):
    notification = Notification(
        user_id=user_id,
        task_id=task_id,
        title=title,
        message=message,
        notification_type=notification_type,
    )

    try:
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    except Exception:
        db.rollback()
        raise


def mark_notification_read(db: Session, notification: Notification):
    try:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification
    except Exception:
        db.rollback()
        raise


def mark_all_notifications_read(db: Session, user_id: int):
    try:
        (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .update({"is_read": True}, synchronize_session=False)
        )

        db.commit()
    except Exception:
        db.rollback()
        raise
