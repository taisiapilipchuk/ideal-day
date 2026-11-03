from database import Base, engine
import models

print("Создаем таблицы в PostgreSQL...")
Base.metadata.create_all(bind=engine)
print("Готово.")