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
)
import crud
from auth import create_access_token, get_current_user
from models import User
from datetime import date
from biorhythm import calculate_biorhythm
from recommendations import generate_recommendations
from scheduler import create_schedule


class DeleteTaskResponse(BaseModel):
    message: str


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
    ],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Общее ----------


@app.get(
    "/",
    tags=["Общее"],
    summary="Главная страница",
    description="Проверяет доступность главного маршрута backend-приложения.",
    response_description="Сообщение о работе backend.",
)
def home():
    return {"message": "Ideal Day backend is working!"}


@app.get(
    "/api/health",
    tags=["Общее"],
    summary="Проверка состояния API",
    description="Проверяет, запущено ли backend-приложение.",
    response_description="Текущий статус API.",
)
def health_check():
    return {"status": "ok"}


# ---------- Пользователи ----------


@app.get(
    "/api/users/me",
    response_model=UserResponse,
    tags=["Пользователи"],
    summary="Получение информации о текущем пользователе",
    description="Возвращает информацию о пользователе, определённом по токену авторизации.",
    response_description="Данные текущего пользователя.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Пользователь не найден."},
    },
)
def get_current_user_info(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user


@app.get(
    "/api/search",
    tags=["Пользователи"],
    summary="Поиск пользователей",
    description="Принимает имя для поиска и возвращает его в ответе.",
    response_description="Результат обработки поискового запроса.",
)
def search_users(name: str):
    return {"search_name": name}


@app.post(
    "/api/register",
    response_model=UserResponse,
    status_code=201,
    tags=["Пользователи"],
    summary="Регистрация пользователя",
    description="Создаёт новую учётную запись пользователя.",
    response_description="Данные зарегистрированного пользователя.",
    responses={
        400: {"description": "Email или имя пользователя уже заняты."},
        422: {"description": "Ошибка проверки входных данных."},
    },
)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email уже занят")

    if crud.get_user_by_username(db, user_data.username):
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")

    return crud.create_user(db, user_data)


@app.post(
    "/api/login",
    tags=["Пользователи"],
    summary="Авторизация пользователя",
    description="Проверяет email и пароль пользователя и выдаёт токен доступа.",
    response_description="Токен доступа и тип авторизации.",
    responses={
        401: {"description": "Неверный email или пароль."},
        422: {"description": "Ошибка проверки входных данных."},
    },
)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_data.email)

    if not user or not crud.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


# ---------- Биоритмы ----------


@app.get(
    "/api/biorhythm",
    tags=["Биоритмы"],
    summary="Получение биоритмов",
    description="Рассчитывает физический, эмоциональный и интеллектуальный биоритмы пользователя на указанную дату. Если дата не передана, используется текущая дата.",
    response_description="Значения биоритмов и критические циклы.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Пользователь не найден."},
    },
)
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
    description="Формирует рекомендации на основе биоритмов пользователя на указанную дату. Если дата не передана, используется текущая дата.",
    response_description="Дата и список рекомендаций.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Пользователь не найден."},
    },
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
    description="Возвращает все задачи текущего пользователя. При передаче target_date возвращает только задачи на указанную дату.",
    response_description="Список задач пользователя.",
    responses={
        401: {"description": "Пользователь не авторизован."},
    },
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
    description="Создаёт новую задачу для текущего пользователя.",
    response_description="Созданная задача.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        422: {"description": "Ошибка проверки входных данных."},
    },
)
def create_task(
    task_data: TaskCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.create_task(db, user_id, task_data)


# ---------- Планировщик ----------


@app.get(
    "/api/tasks/schedule",
    tags=["Планировщик"],
    summary="Получение расписания задач",
    description="Формирует расписание задач текущего пользователя на указанную дату с учётом занятых интервалов и правил планировщика.",
    response_description="Дата и сформированное расписание.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        422: {"description": "Не указана дата или передана некорректная дата."},
    },
)
def get_task_schedule(
    target_date: date,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tasks = crud.get_tasks_by_date(db, user_id, target_date)

    schedule = create_schedule(tasks)

    return {"date": target_date, "schedule": schedule}


# ---------- Получение и изменение задач ----------


@app.get(
    "/api/tasks/{task_id}",
    response_model=TaskResponse,
    tags=["Задачи"],
    summary="Получение задачи",
    description="Возвращает задачу по её ID. Пользователь может получить только собственную задачу.",
    response_description="Найденная задача.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Задача не найдена или недоступна пользователю."},
    },
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
    description="Частично обновляет задачу по её ID. Можно передать только те поля, которые необходимо изменить. Пользователь может обновлять только собственные задачи.",
    response_description="Обновлённая задача.",
    responses={
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Задача не найдена или недоступна пользователю."},
        422: {"description": "Ошибка проверки входных данных."},
    },
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
    description="Удаляет задачу по её ID. Пользователь может удалить только собственную задачу.",
    response_description="Сообщение об успешном удалении.",
    responses={
        200: {"description": "Задача успешно удалена."},
        401: {"description": "Пользователь не авторизован."},
        404: {"description": "Задача не найдена или недоступна пользователю."},
    },
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
