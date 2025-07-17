"""
User Models
Pydantic models for user management
"""

from pydantic import BaseModel as PydanticBaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from models.shared import BaseResponse

# Pydantic Models for API
class UserBase(PydanticBaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(PydanticBaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None
    role: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_verified: bool
    email_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserListResponse(BaseResponse):
    data: List[UserResponse]
    total: int

class UserDetailResponse(BaseResponse):
    data: UserResponse

# SQLAlchemy User model is now in models/database.py 