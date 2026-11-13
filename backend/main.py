from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import UserCreate, UserResponse, UserLogin
import crud
from auth import create_access_token, get_current_user
from models import User
from datetime import date
from biorhythm import calculate_biorhythm

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Ideal Day backend is working!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/users/me", response_model=UserResponse)
def get_current_user_info(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user


@app.get("/api/search")
def search_users(name: str):
    return {"search_name": name}


@app.post("/api/register", response_model=UserResponse, status_code=201)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):

    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email уже занят")

    if crud.get_user_by_username(db, user_data.username):
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")

    return crud.create_user(db, user_data)


@app.post("/api/login")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_data.email)

    if not user or not crud.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/biorhythm")
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

    result = crud.get_biorhythm_cache(db, user_id, target_date)

    if result is None:
        values = calculate_biorhythm(user.birth_date, target_date)

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
    }
