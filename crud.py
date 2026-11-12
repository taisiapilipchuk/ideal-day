from datetime import date
from sqlalchemy.orm import Session
from models import Task, BiorhythmLog

def get_tasks_by_date(db: Session, user_id: int, target_date: date):
    return db.query(Task).filter(Task.user_id == user_id, Task.due_date == target_date).all()

def create_task(db: Session, user_id: int, title: str, due_date: date, description: str = None, priority: int = 1):
    task = Task(user_id=user_id, title=title, description=description, due_date=due_date, priority=priority)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_biorhythm_cache(db: Session, user_id: int, target_date: date):
    return db.query(BiorhythmLog).filter(BiorhythmLog.user_id == user_id, BiorhythmLog.date == target_date).first()

def save_biorhythm_cache(db: Session, user_id: int, target_date: date, physical: float, emotional: float, intellectual: float):
    log = BiorhythmLog(user_id=user_id, date=target_date, physical=physical, emotional=emotional, intellectual=intellectual)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log