"""
🤖 Agent Models
Pydantic models for agent management
"""

from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from models.shared import BaseResponse

# Pydantic Models for API
class LocalEndpoint(PydanticBaseModel):
    """Additional endpoint configuration"""
    name: str = Field(..., description="Endpoint name")
    host: str = Field(..., description="Endpoint host")
    port: int = Field(..., description="Endpoint port") 
    endpoint: str = Field(..., description="Endpoint path")
    model: str = Field(..., description="Model name for this endpoint")
    is_active: bool = Field(default=True, description="Whether endpoint is active")

class LocalModelConfig(PydanticBaseModel):
    """Local model configuration"""
    host: str = Field(default="localhost", description="Local model host")
    port: int = Field(default=8080, description="Local model port")
    endpoint: str = Field(default="/api/chat", description="Local model endpoint")
    model_name: Optional[str] = Field(default=None, description="Local model name (auto-detected if not specified)")
    additional_endpoints: Optional[List[LocalEndpoint]] = Field(default=[], description="Additional endpoints")

class AgentCreateRequest(PydanticBaseModel):
    """Request model for creating an agent"""
    name: str
    description: Optional[str] = None
    agent_type: str = "main"
    model_provider: str
    model_name: str
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None
    capabilities: List[str] = []
    tools_enabled: List[str] = ["chat", "analysis"]
    temperature: float = 0.7  # Changed from str to float
    max_tokens: int = 4000
    timeout_seconds: int = 300
    is_system: bool = False
    # New fields for local model support
    is_local_model: bool = False
    local_config: Optional[LocalModelConfig] = None
    api_endpoint: Optional[str] = Field(None, description="Custom API endpoint for local models like Ollama")
    # Fields that may be set by endpoints
    user_id: Optional[int] = None
    parent_agent_id: Optional[int] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Customer Service Agent",
                "description": "Handles customer inquiries",
                "agent_type": "main",
                "model_provider": "openai",
                "model_name": "gpt-4",
                "api_key": "sk-...",
                "system_prompt": "You are a helpful customer service agent...",
                "capabilities": ["chat", "analysis"],
                "tools_enabled": ["chat", "analysis"],
                "temperature": 0.7,
                "max_tokens": 4000,

                "is_system": False,
                "is_local_model": False,
                "local_config": None
            }
        }

class AgentUpdateRequest(PydanticBaseModel):
    class Config:
        protected_namespaces = ()  # Disable protected namespace warnings
    
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    model_provider: Optional[str] = Field(None, pattern="^(openai|anthropic|google|azure|mistral|cohere|perplexity|huggingface|together|replicate|openrouter|ai21|anyscale|ollama|lmstudio|textgen|localai|llamafile|jan|vllm|llamacppserver|local)$")
    model_name: Optional[str] = None
    system_prompt: Optional[str] = Field(None, max_length=2000)
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(None, ge=1, le=4000)
    api_key: Optional[str] = None
    is_active: Optional[bool] = None
    # Add Local Configuration support
    is_local_model: Optional[bool] = None
    local_config: Optional[LocalModelConfig] = None
    api_endpoint: Optional[str] = Field(None, description="Custom API endpoint for local models like Ollama")

class AgentTestRequest(PydanticBaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    include_system_prompt: bool = True

# Agent Response Models
class AgentResponse(PydanticBaseModel):
    class Config:
        protected_namespaces = ()  # Disable protected namespace warnings
        from_attributes = True
    
    id: int
    name: str
    description: Optional[str]
    agent_type: str
    model_provider: str
    model_name: str
    system_prompt: Optional[str]
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    api_key: Optional[str] = None
    parent_agent_id: Optional[int] = None
    user_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    is_local_model: Optional[bool] = None
    local_config: Optional[Dict[str, Any]] = None

class AgentListResponse(BaseResponse):
    data: List[AgentResponse]
    total: int

class AgentDetailResponse(BaseResponse):
    data: AgentResponse

class AgentTestResponse(BaseResponse):
    data: Dict[str, Any]  # Contains test result and performance metrics

class AgentStatistics(PydanticBaseModel):
    total_agents: int
    main_agents: int
    child_agents: int
    active_agents: int
    inactive_agents: int
    agents_by_provider: Dict[str, int]
    recent_agents: List[AgentResponse]

class AgentStatsResponse(BaseResponse):
    data: AgentStatistics

# Child Agent Models
class ChildAgentCreateRequest(AgentCreateRequest):
    parent_agent_id: int  # Required for child agents
    agent_type: Literal["child"] = Field(default="child")

class ParentAgentInfo(PydanticBaseModel):
    id: int
    name: str
    description: Optional[str]
    model_provider: str

class ChildAgentResponse(AgentResponse):
    parent_agent: Optional[ParentAgentInfo]

# Agent Performance Models
class AgentPerformanceMetrics(PydanticBaseModel):
    agent_id: int
    total_interactions: int
    average_response_time: float
    success_rate: float
    error_count: int
    last_used: Optional[datetime]

class AgentPerformanceResponse(BaseResponse):
    data: AgentPerformanceMetrics 