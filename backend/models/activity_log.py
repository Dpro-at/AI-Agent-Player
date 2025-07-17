"""
Activity Log Models
SQLAlchemy and Pydantic models for activity logging
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from models import Base

class ActivityLog(Base):
    """SQLAlchemy Activity Log Model"""
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(String(500))
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    extra_data = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="activity_logs")

# Pydantic Models for API
class ActivityLogBase(PydanticBaseModel):
    action: str = Field(..., min_length=1, max_length=100)
    details: Optional[str] = Field(None, max_length=500)
    ip_address: Optional[str] = Field(None, max_length=50)
    user_agent: Optional[str] = Field(None, max_length=500)
    extra_data: Optional[Dict[str, Any]] = None

class ActivityLogCreate(ActivityLogBase):
    user_id: int

class ActivityLogResponse(ActivityLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True 