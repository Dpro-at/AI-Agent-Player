"""
🤖 Agent Models
Pydantic models for agent management
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from models.shared import BaseResponse

# Base Pydantic models for agents
class AgentBase(BaseModel):
    """Base agent model with common fields"""
    model_config = ConfigDict(
        protected_namespaces=(),  # Disable protected namespace warnings
        json_schema_extra={
            "example": {
                "name": "Customer Service Bot",
                "description": "AI agent specialized in customer service",
                "model_provider": "openai",
                "model_name": "gpt-4",
                "system_prompt": "You are a helpful customer service agent"
            }
        }
    )

# Pydantic Models for API
class LocalEndpoint(BaseModel):
    """Additional endpoint configuration"""
    name: str = Field(..., description="Endpoint name")
    host: str = Field(..., description="Endpoint host")
    port: int = Field(..., description="Endpoint port") 
    endpoint: str = Field(..., description="Endpoint path")
    model: str = Field(..., description="Model name for this endpoint")
    is_active: bool = Field(default=True, description="Whether endpoint is active")

class LocalModelConfig(BaseModel):
    """Local model configuration"""
    host: str = Field(default="localhost", description="Local model host")
    port: int = Field(default=8080, description="Local model port")
    endpoint: str = Field(default="/api/chat", description="Local model endpoint")
    model_name: Optional[str] = Field(default=None, description="Local model name (auto-detected if not specified)")
    additional_endpoints: Optional[List[LocalEndpoint]] = Field(default=[], description="Additional endpoints")

class AgentCreateRequest(AgentBase):
    """Request model for creating an agent"""
    name: str
    description: Optional[str] = None
    model_provider: str
    model_name: str
    system_prompt: str = "You are a helpful AI assistant"
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=2048, ge=1, le=8192)
    top_p: Optional[float] = Field(default=1.0, ge=0.0, le=1.0)
    frequency_penalty: Optional[float] = Field(default=0.0, ge=-2.0, le=2.0)
    presence_penalty: Optional[float] = Field(default=0.0, ge=-2.0, le=2.0)
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    agent_type: str = Field(default="main")
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    is_public: bool = False
    
    # Local model configuration
    local_config: Optional[LocalModelConfig] = None

class AgentUpdateRequest(AgentBase):
    """Request model for updating an agent"""
    name: Optional[str] = None
    description: Optional[str] = None
    model_provider: Optional[str] = Field(None, pattern="^(openai|anthropic|google|azure|mistral|cohere|perplexity|huggingface|together|replicate|openrouter|ai21|anyscale|ollama|lmstudio|textgen|localai|llamacpp|gpt4all|koboldai|oobabooga|fastchat|vllm|llamafile|jan)$")
    model_name: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(None, ge=1, le=8192)
    top_p: Optional[float] = Field(None, ge=0.0, le=1.0)
    frequency_penalty: Optional[float] = Field(None, ge=-2.0, le=2.0)
    presence_penalty: Optional[float] = Field(None, ge=-2.0, le=2.0)
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None

class AgentTestRequest(AgentBase):
    """Request model for testing an agent"""
    message: str = Field(..., min_length=1, max_length=1000)
    include_system_prompt: bool = True

# Agent Response Models
class AgentResponse(AgentBase):
    """Response model for agent operations"""
    id: int
    name: str
    description: Optional[str]
    agent_type: str
    model_provider: str
    model_name: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

class AgentListResponse(BaseResponse):
    data: List[AgentResponse]
    total: int

class AgentDetailResponse(BaseResponse):
    data: AgentResponse

class AgentTestResponse(AgentBase):
    """Response model for agent testing"""
    success: bool
    message: str
    data: Dict[str, Any]  # Contains test result and performance metrics

class AgentStatistics(AgentBase):
    """Agent statistics model"""
    total_agents: int
    main_agents: int
    child_agents: int
    active_agents: int
    average_performance: float

class ChildAgentRequest(AgentBase):
    """Request model for creating child agents"""
    name: str
    description: Optional[str] = None
    model_provider: str
    model_name: str
    system_prompt: str = "You are a helpful AI assistant"
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=2048, ge=1, le=8192)
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    parent_agent_id: Optional[int] = None
    agent_type: Literal["child"] = Field(default="child")

class ParentAgentInfo(AgentBase):
    """Parent agent information model"""
    id: int
    name: str
    agent_type: str

class AgentPerformanceMetrics(AgentBase):
    """Agent performance metrics model"""
    agent_id: int
    total_interactions: int
    average_response_time: float
    success_rate: float
    user_satisfaction: float
    last_used: Optional[datetime] = None

class AgentPerformanceResponse(BaseResponse):
    """Performance response model"""
    data: AgentPerformanceMetrics

class AgentStatsResponse(BaseResponse):
    """Statistics response model"""
    data: AgentStatistics

class AgentListResponse(BaseResponse):
    """Agent list response model"""
    data: List[AgentResponse]

class ChildAgentResponse(AgentResponse):
    """Child agent response model"""
    parent_agent: Optional[ParentAgentInfo] = None 