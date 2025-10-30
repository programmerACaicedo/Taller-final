from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pathfinder.db")

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    """Crear base de datos y tablas"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Obtener sesión de base de datos"""
    with Session(engine) as session:
        yield session