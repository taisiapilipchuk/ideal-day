import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    "postgresql+psycopg2://",
    creator=lambda: psycopg2.connect(
        dbname="ideal_day",
        user="postgres",
        password="213546879ilia",
        host="localhost",
        port="5432",
    ),
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()