"""
Shared Models
Common Pydantic models used across the application
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

# Base Response Models
class BaseResponse(BaseModel):
    """Base response model for all API responses"""
    success: bool = True
    message: Optional[str] = None
    errors: Optional[List[str]] = None
    timestamp: Optional[str] = None

class SuccessResponse(BaseResponse):
    """Standard success response"""
    data: Optional[Any] = None

class ErrorResponse(BaseResponse):
    """Standard error response"""
    success: bool = False
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class PaginatedResponse(BaseResponse):
    """Paginated response model"""
    data: List[Any]
    total: int
    page: int = 1
    pages: int = 1
    has_next: bool = False
    has_prev: bool = False

# Authentication Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginResponse(BaseResponse):
    data: Dict[str, Any]  # Contains tokens and user info

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6)

class TokenRefreshRequest(BaseModel):
    refresh_token: str

# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: str = "user"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    # Basic user info
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    
    # Individual profile fields
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    current_position: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = Field(None, max_length=1000)
    
    # Company profile fields
    user_type: Optional[str] = Field(None, pattern="^(individual|company|freelancer|organization)$")
    company_name: Optional[str] = Field(None, max_length=200)
    company_registration_number: Optional[str] = Field(None, max_length=100)
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[str] = Field(None, max_length=50)
    founded_year: Optional[int] = Field(None, ge=1800, le=2030)
    
    # Contact information
    phone: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    
    # Company address
    address_street: Optional[str] = Field(None, max_length=200)
    address_city: Optional[str] = Field(None, max_length=100)
    address_state: Optional[str] = Field(None, max_length=100)
    address_zip: Optional[str] = Field(None, max_length=20)
    address_country: Optional[str] = Field(None, max_length=10)
    
    # Subscription info
    subscription_type: Optional[str] = Field(None, max_length=50)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Health Check Model
class HealthCheck(BaseModel):
    status: str = "healthy"
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    database: str = "connected"
    services: Dict[str, str] = {}

# System Status Model
class SystemStatus(BaseModel):
    application: str
    version: str
    status: str
    uptime: str
    database: Dict[str, Any]
    memory_usage: Dict[str, Any]
    active_sessions: int

# User Profile Models
class UserProfileUpdate(BaseModel):
    """User profile update model"""
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)

class UserSettingsUpdate(BaseModel):
    """User settings update model"""
    theme: Optional[str] = Field(None, pattern="^(light|dark)$")
    notifications_enabled: Optional[bool] = None
    language: Optional[str] = Field(None, pattern="^(en|ar|fr|es|de)$")
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None

class UserPreferencesUpdate(BaseModel):
    """User preferences update model"""
    sidebar_collapsed: Optional[bool] = None
    show_tips: Optional[bool] = None
    dashboard_layout: Optional[str] = None
    timezone: Optional[str] = None
    date_format: Optional[str] = None
    number_format: Optional[str] = None

class UserProfileResponse(BaseModel):
    """User profile response model"""
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    preferences: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

class UserActivityResponse(BaseModel):
    """User activity response model"""
    id: int
    action: str
    details: Optional[str] = None
    created_at: datetime

class UserStatisticsResponse(BaseModel):
    """User statistics response model"""
    total_logins: int = 0
    last_login: Optional[datetime] = None 