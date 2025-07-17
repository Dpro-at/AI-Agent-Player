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
    title: str = Field(..., min_length=1, max_length=300)
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

class ConversationCreate(ConversationBase):
    user_id: Optional[int] = None

class ConversationUpdate(PydanticBaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model
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
    sender_type: str = Field(..., pattern="^(user|agent|system)$")
    agent_id: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

class MessageCreate(MessageBase):
    conversation_id: str

class MessageResponse(MessageBase):
    id: int
    conversation_id: str
    tokens_used: Optional[int] = None
    processing_time: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChatAnalytics(PydanticBaseModel):
    total_conversations: int
    total_messages: int
    active_conversations: int
    average_messages_per_conversation: float
    most_used_agents: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]

class ConversationListResponse(BaseResponse):
    data: List[ConversationResponse]
    total: int

class ConversationDetailResponse(BaseResponse):
    data: ConversationResponse

class MessageListResponse(BaseResponse):
    data: List[MessageResponse]
    total: int

class MessageWithAIResponse(BaseResponse):
    data: Dict[str, Any]  # Contains user message and AI response

class ChatAnalyticsResponse(BaseResponse):
    data: ChatAnalytics

# WebSocket Models
class WebSocketMessage(PydanticBaseModel):
    type: str = Field(..., pattern="^(message|typing|join|leave|error)$")
    conversation_id: str
    content: Optional[str] = None
    user_id: Optional[int] = None
    agent_id: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

class WebSocketResponse(PydanticBaseModel):
    type: str
    conversation_id: str
    content: Optional[str] = None
    user_id: Optional[int] = None
    agent_id: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

# AI Response Models
class AIResponseRequest(PydanticBaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_history: Optional[List[Dict[str, str]]] = None
    agent_id: Optional[int] = None
    include_context: bool = True

class AIResponseResult(PydanticBaseModel):
    response: str
    agent_id: int
    processing_time: float
    tokens_used: Optional[int] = None
    cost: Optional[float] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

class AIResponseResponse(BaseResponse):
    data: AIResponseResult

# Chat Search Models
class ChatSearchRequest(PydanticBaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    conversation_id: Optional[str] = None
    limit: int = Field(default=20, ge=1, le=100)

class ChatSearchResult(PydanticBaseModel):
    message_id: int
    conversation_id: str
    content: str
    sender_type: str
    created_at: datetime
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from metadata to match model

class ChatSearchResponse(BaseResponse):
    data: List[ChatSearchResult]
    total: int 