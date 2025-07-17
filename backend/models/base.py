"""
Base model for SQLAlchemy models
"""

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, DateTime
from datetime import datetime
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    """Base class for all models"""
    pass 