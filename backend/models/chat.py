"""
💬 Chat Models
Pydantic models for chat and conversation management
"""

from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from models.shared import BaseResponse

# Pydantic Models for API
class ConversationBase(PydanticBaseModel):
    title: Optional[str] = Field(None, max_length=300)  # Made optional with default
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    extra_data: Optional[Dict[str, Any]] = None

class ConversationCreate(PydanticBaseModel):
    title: Optional[str] = Field("New Conversation", max_length=300)  # Default title
    agent_id: Optional[int] = None  # Optional - can be set later
    context_data: Optional[Dict[str, Any]] = None
    extra_data: Optional[Dict[str, Any]] = None
    # user_id removed - taken from authenticated user

class ConversationUpdate(PydanticBaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    extra_data: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class ConversationResponse(ConversationBase):
    id: str
    user_id: int
    is_active: bool
    total_messages: int
    total_tokens: Optional[int] = None
    total_cost: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MessageBase(PydanticBaseModel):
    content: str = Field(..., min_length=1)
    sender_type: str = Field("user", pattern="^(user|agent|system)$")  # Default to user
    agent_id: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None

class MessageCreate(PydanticBaseModel):
    content: str = Field(..., min_length=1, description="Message content")
    sender_type: str = Field("user", pattern="^(user|agent|system)$")  # Default to user
    agent_id: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None
    # conversation_id removed - taken from URL path

class MessageResponse(MessageBase):
    id: str
    conversation_id: str
    user_id: int
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# List Response Models
class ConversationListResponse(BaseResponse):
    data: Dict[str, Any]

class ConversationDetailResponse(BaseResponse):
    data: ConversationResponse

class MessageListResponse(BaseResponse):
    data: Dict[str, Any]

# Analytics Models
class ChatAnalyticsResponse(BaseResponse):
    data: Dict[str, Any]

# AI Response Request
class AIResponseRequest(PydanticBaseModel):
    message: str = Field(..., min_length=1, description="User message for AI response")
    context: Optional[Dict[str, Any]] = None
    temperature: Optional[float] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2048, ge=1, le=4096)

# Simple test models for API testing
class ConversationCreateTest(PydanticBaseModel):
    """Simplified model for API testing"""
    title: Optional[str] = "Test Conversation"
    agent_id: Optional[int] = 1

class MessageCreateTest(PydanticBaseModel):
    """Simplified model for API testing"""
    content: str = "Test message"
    sender_type: str = "user" 