from datetime import date, datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from schemas import (
    UserCreate,
    UserResponse,
    UserLogin,
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    UserSettingsUpdate,
    UserSettingsResponse,
    NotificationResponse,
)
import crud
from auth import create_access_token, get_current_user
from models import User, Task, Notification
from biorhythm import calculate_biorhythm
from recommendations import generate_recommendations
from scheduler import create_schedule
from models import Base
from database import engine


class DeleteTaskResponse(BaseModel):
    message: str


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ideal Day API",
    description="""
    API приложения Ideal Day.

    Основные возможности:
    - Регистрация и авторизация пользователей.
    - Получение информации о биоритмах.
    - Формирование рекомендаций.
    - Управление задачами.
    - Автоматическое составление расписания.
    - Управление настройками пользователя.
    - Получение уведомлений и напоминаний.
    
    Для защищённых запросов необходимо использовать Bearer Token.
    """,
    version="1.0.0",
    openapi_tags=[
        {"name": "Общее", "description": "Проверка состояния API."},
        {
            "name": "Пользователи",
            "description": "Регистрация, авторизация и информация о пользователях.",
        },
        {"name": "Биоритмы", "description": "Расчёт биоритмов пользователя."},
        {
            "name": "Рекомендации",
            "description": "Получение рекомендаций на основе биоритмов.",
        },
        {
            "name": "Задачи",
            "description": "Создание, просмотр, изменение и удаление задач.",
        },
        {
            "name": "Планировщик",
            "description": "Автоматическое составление расписания задач.",
        },
        {
            "name": "Настройки",
            "description": "Получение и изменение настроек пользователя.",
        },
        {
            "name": "Уведомления",
            "description": "Получение уведомлений и управление ими.",
        },
    ],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Общее ----------


@app.get("/", tags=["Общее"], summary="Главная страница")
def home():
    return {"message": "Ideal Day backend is working!"}


@app.get("/api/health", tags=["Общее"], summary="Проверка состояния API")
def health_check():
    return {"status": "ok"}


# ---------- Пользователи ----------


@app.get(
    "/api/users/me",
    response_model=UserResponse,
    tags=["Пользователи"],
    summary="Получение информации о текущем пользователе",
)
def get_current_user_info(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user


@app.get("/api/search", tags=["Пользователи"], summary="Поиск пользователей")
def search_users(name: str):
    return {"search_name": name}


@app.post(
    "/api/register",
    response_model=UserResponse,
    status_code=201,
    tags=["Пользователи"],
    summary="Регистрация пользователя",
)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email уже занят")

    if crud.get_user_by_username(db, user_data.username):
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")

    return crud.create_user(db, user_data)


@app.post("/api/login", tags=["Пользователи"], summary="Авторизация пользователя")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_data.email)

    if not user or not crud.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


# ---------- Биоритмы ----------


@app.get("/api/biorhythm", tags=["Биоритмы"], summary="Получение биоритмов")
def get_biorhythm(
    target_date: date | None = None,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if target_date is None:
        target_date = date.today()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not user.birth_date:
        raise HTTPException(
            status_code=400,
            detail="Для расчёта биоритмов необходимо указать дату рождения",
        )

    values = calculate_biorhythm(user.birth_date, target_date)

    result = crud.get_biorhythm_cache(db, user_id, target_date)

    if result is None:
        result = crud.save_biorhythm_cache(
            db,
            user_id,
            target_date,
            values["physical"],
            values["emotional"],
            values["intellectual"],
        )

    return {
        "date": result.date,
        "physical": result.physical,
        "emotional": result.emotional,
        "intellectual": result.intellectual,
        "critical_cycles": values["critical_cycles"],
    }


# ---------- Рекомендации ----------


@app.get(
    "/api/recommendations",
    tags=["Рекомендации"],
    summary="Получение рекомендаций",
)
def get_recommendations(
    target_date: date | None = None,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if target_date is None:
        target_date = date.today()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not user.birth_date:
        raise HTTPException(
            status_code=400,
            detail="Для получения рекомендаций необходимо указать дату рождения",
        )

    values = calculate_biorhythm(user.birth_date, target_date)

    biorhythm = crud.get_biorhythm_cache(db, user_id, target_date)

    if biorhythm is None:
        biorhythm = crud.save_biorhythm_cache(
            db,
            user_id,
            target_date,
            values["physical"],
            values["emotional"],
            values["intellectual"],
        )

    recommendations = generate_recommendations(
        {
            "physical": biorhythm.physical,
            "emotional": biorhythm.emotional,
            "intellectual": biorhythm.intellectual,
            "critical_cycles": values["critical_cycles"],
        }
    )

    return {
        "date": target_date,
        "recommendations": recommendations,
    }


# ---------- Задачи ----------


@app.get(
    "/api/tasks",
    response_model=list[TaskResponse],
    tags=["Задачи"],
    summary="Получение списка задач",
)
def get_tasks(
    target_date: date | None = None,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if target_date:
        return crud.get_tasks_by_date(db, user_id, target_date)

    return crud.get_all_tasks(db, user_id)


@app.post(
    "/api/tasks",
    response_model=TaskResponse,
    status_code=201,
    tags=["Задачи"],
    summary="Создание задачи",
)
def create_task(
    task_data: TaskCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.create_task(db, user_id, task_data)


@app.get(
    "/api/tasks/schedule",
    tags=["Планировщик"],
    summary="Получение расписания задач",
)
def get_task_schedule(
    target_date: date,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tasks = crud.get_tasks_by_date(db, user_id, target_date)
    schedule = create_schedule(tasks)

    return {"date": target_date, "schedule": schedule}


@app.get(
    "/api/tasks/{task_id}",
    response_model=TaskResponse,
    tags=["Задачи"],
    summary="Получение задачи",
)
def get_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db, user_id, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    return task


@app.patch(
    "/api/tasks/{task_id}",
    response_model=TaskResponse,
    tags=["Задачи"],
    summary="Обновление задачи",
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db, user_id, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    return crud.update_task(db, task, task_data)


@app.delete(
    "/api/tasks/{task_id}",
    response_model=DeleteTaskResponse,
    tags=["Задачи"],
    summary="Удаление задачи",
)
def delete_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db, user_id, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    crud.delete_task(db, task)

    return {"message": "Задача успешно удалена"}


# ---------- Настройки пользователя ----------


@app.get(
    "/api/settings",
    response_model=UserSettingsResponse,
    tags=["Настройки"],
    summary="Получение настроек пользователя",
)
def get_settings(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.get_or_create_user_settings(db, user_id)


@app.patch(
    "/api/settings",
    response_model=UserSettingsResponse,
    tags=["Настройки"],
    summary="Изменение настроек пользователя",
)
def update_settings(
    settings_data: UserSettingsUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.update_user_settings(db, user_id, settings_data)


# ---------- Уведомления ----------


@app.get(
    "/api/notifications",
    response_model=list[NotificationResponse],
    tags=["Уведомления"],
    summary="Получение уведомлений пользователя",
)
def get_notifications(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.get_user_notifications(db, user_id)


@app.patch(
    "/api/notifications/{notification_id}/read",
    response_model=NotificationResponse,
    tags=["Уведомления"],
    summary="Отметить уведомление прочитанным",
)
def read_notification(
    notification_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = crud.get_notification(db, user_id, notification_id)

    if not notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")

    return crud.mark_notification_read(db, notification)


@app.patch(
    "/api/notifications/read-all",
    tags=["Уведомления"],
    summary="Отметить все уведомления прочитанными",
)
def read_all_notifications(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crud.mark_all_notifications_read(db, user_id)

    return {"message": "Все уведомления отмечены прочитанными"}


# ---------- Проверка напоминаний ----------


@app.post(
    "/api/notifications/check-reminders",
    tags=["Уведомления"],
    summary="Проверка задач для напоминаний",
)
def check_task_reminders(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    settings = crud.get_or_create_user_settings(db, user_id)

    if not settings.notifications_enabled or not settings.task_reminders_enabled:
        return {
            "message": "Уведомления о задачах отключены",
            "created": 0,
        }

    now = datetime.now()
    reminder_limit = now + timedelta(minutes=settings.reminder_minutes_before)

    tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.due_date == now.date(),
            Task.is_completed == False,
            Task.start_time.isnot(None),
        )
        .all()
    )

    created_count = 0

    for task in tasks:
        task_start = datetime.combine(now.date(), task.start_time)

        if now <= task_start <= reminder_limit:
            existing_notification = (
                db.query(Notification)
                .filter(
                    Notification.user_id == user_id,
                    Notification.task_id == task.id,
                    Notification.notification_type == "task_reminder",
                )
                .first()
            )

            if existing_notification:
                continue

            crud.create_notification(
                db=db,
                user_id=user_id,
                task_id=task.id,
                title="Напоминание о задаче",
                message=f"Скоро начнётся задача: {task.title}",
                notification_type="task_reminder",
            )

            created_count += 1

    return {
        "message": "Проверка напоминаний завершена",
        "created": created_count,
    }
