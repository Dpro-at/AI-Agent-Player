"""
Database Models
Base SQLAlchemy model and common database utilities
"""

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Enum as SQLEnum, MetaData, text, Column, Text
from datetime import datetime
import enum
from sqlalchemy.sql import func
from .base import Base

# Create metadata with naming convention
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s"
    }
)

class AgentType(str, enum.Enum):
    """Agent type enumeration"""
    MAIN = "main"
    CHILD = "child"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(String, default="user", nullable=False)
    gemini_auth = Column(JSON, nullable=True)
    gemini_api_key = Column(String, nullable=True)
    gemini_auth_type = Column(String, nullable=True)
    preferences = Column(JSON, nullable=True)  # User preferences and settings
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    boards = relationship("Board", back_populates="user")
    board_executions = relationship("BoardExecution", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_token = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    agent_type = Column(String(50), nullable=False)
    status = Column(String(50), default="active")
    model_provider = Column(String(50), nullable=False)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=True)
    system_prompt = Column(Text, nullable=True)
    temperature = Column(Float, nullable=True)
    max_tokens = Column(Integer, nullable=True)
    top_p = Column(Float, nullable=True)
    frequency_penalty = Column(Float, nullable=True)
    presence_penalty = Column(Float, nullable=True)
    stop_sequences = Column(JSON, nullable=True)
    api_key_encrypted = Column(String(255), nullable=True)  # Changed from api_key to api_key_encrypted
    api_endpoint = Column(String(500), nullable=True)  # For local models like Ollama
    custom_parameters = Column(JSON, nullable=True)
    capabilities = Column(JSON, nullable=True)
    parent_agent_id = Column(Integer, nullable=True)
    child_agents_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    usage_count = Column(Integer, default=0)
    success_rate = Column(Float, nullable=True)
    avg_response_time = Column(Float, nullable=True)
    rating_average = Column(Float, nullable=True)
    rating_count = Column(Integer, default=0)
    tags = Column(JSON, nullable=True)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships - ADDED MISSING RELATIONSHIPS
    capabilities_rel = relationship("AgentCapability", back_populates="agent")
    performance_records = relationship("AgentPerformance", back_populates="agent")

class AgentCapability(Base):
    """Agent capability model - represents specific skills and abilities of agents"""
    __tablename__ = "agent_capabilities"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    capability_type = Column(String(50), nullable=False)  # language, reasoning, knowledge, etc.
    proficiency_level = Column(Float, nullable=False)  # 0.0 to 10.0
    configuration = Column(JSON, nullable=True)  # Capability-specific configuration
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships - FIXED TO USE CORRECT RELATIONSHIP NAME
    agent = relationship("Agent", back_populates="capabilities_rel")

class AgentPerformance(Base):
    """Agent performance model - tracks performance metrics for agents"""
    __tablename__ = "agent_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_type = Column(String(50), nullable=False)  # response_time, accuracy, efficiency, etc.
    measurement_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    context_data = Column(JSON, nullable=True)  # Additional context for the measurement
    
    # Relationships
    agent = relationship("Agent", back_populates="performance_records")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, nullable=False)  # NEW: Unique conversation link
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(Text, default='text', nullable=True)
    message_role = Column(Text, nullable=False)  # user, assistant, system
    tokens_used = Column(Integer, default=0, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    model_used = Column(Text, nullable=True)
    cost = Column(Float, default=0.0, nullable=True)
    attachments = Column(Text, nullable=True)  # JSON string
    is_edited = Column(Boolean, default=False, nullable=True)
    edit_history = Column(Text, nullable=True)  # JSON string
    is_educational = Column(Boolean, default=False, nullable=True)
    lesson_context = Column(Text, nullable=True)
    feedback_provided = Column(Text, nullable=True)
    parent_message_id = Column(Integer, nullable=True)
    thread_count = Column(Integer, default=0, nullable=True)
    status = Column(Text, default='sent', nullable=True)
    visibility = Column(Text, default='normal', nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    edited_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    message_type = Column(String(50), default='text', nullable=True)  # ADDED: The missing column
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    
    def __init__(self, **kwargs):
        # Set defaults for important fields if not provided
        if 'content_type' not in kwargs:
            kwargs['content_type'] = 'text'
        if 'message_type' not in kwargs:
            kwargs['message_type'] = 'text'
        if 'status' not in kwargs:
            kwargs['status'] = 'sent'
        if 'visibility' not in kwargs:
            kwargs['visibility'] = 'normal'
        if 'tokens_used' not in kwargs:
            kwargs['tokens_used'] = 0
        if 'cost' not in kwargs:
            kwargs['cost'] = 0.0
        if 'is_edited' not in kwargs:
            kwargs['is_edited'] = False
        if 'is_educational' not in kwargs:
            kwargs['is_educational'] = False
        if 'thread_count' not in kwargs:
            kwargs['thread_count'] = 0
        super().__init__(**kwargs)

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")
    priority = Column(String, default="medium")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Chat Session History for debug purposes
class ChatSessionHistory(Base):
    __tablename__ = "chat_session_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)  # renamed from metadata
    event_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Board Models - NEW ADDITIONS
class Board(Base):
    """Board model - represents a visual workflow board"""
    __tablename__ = "boards"

    id = Column(String(36), primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    board_type = Column(String(50), default="workflow", nullable=False)
    status = Column(String(20), default="draft", nullable=False)
    visibility = Column(String(20), default="private", nullable=False)
    zoom_level = Column(Float, default=1.0, nullable=False)
    pan_x = Column(Float, default=0.0, nullable=False)
    pan_y = Column(Float, default=0.0, nullable=False)
    connection_type = Column(String(20), default="curved", nullable=False)
    theme = Column(String(20), default="light", nullable=False)
    board_data = Column(JSON, nullable=True)
    settings = Column(JSON, nullable=True)
    is_executable = Column(Boolean, default=False, nullable=False)
    execution_count = Column(Integer, default=0, nullable=False)
    last_execution = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="boards")
    nodes = relationship("BoardNode", back_populates="board", cascade="all, delete-orphan")
    connections = relationship("BoardConnection", back_populates="board", cascade="all, delete-orphan")
    executions = relationship("BoardExecution", back_populates="board", cascade="all, delete-orphan")

class BoardNode(Base):
    """Board node model - represents elements on the board"""
    __tablename__ = "board_nodes"

    id = Column(String(36), primary_key=True)
    board_id = Column(String(36), ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    node_type = Column(String(50), nullable=False)
    label = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    width = Column(Integer, default=120, nullable=False)
    height = Column(Integer, default=60, nullable=False)
    color = Column(String(7), default="#667eea", nullable=False)
    icon = Column(String(50), default="fas fa-cog", nullable=False)
    config = Column(JSON, nullable=True)
    input_schema = Column(JSON, nullable=True)
    output_schema = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_start_node = Column(Boolean, default=False, nullable=False)
    is_end_node = Column(Boolean, default=False, nullable=False)
    execution_order = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    board = relationship("Board", back_populates="nodes")
    source_connections = relationship("BoardConnection", foreign_keys="BoardConnection.source_node_id", back_populates="source_node")
    target_connections = relationship("BoardConnection", foreign_keys="BoardConnection.target_node_id", back_populates="target_node")

class BoardConnection(Base):
    """Board connection model - represents connections between nodes"""
    __tablename__ = "board_connections"

    id = Column(String(36), primary_key=True)
    board_id = Column(String(36), ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    source_node_id = Column(String(36), ForeignKey("board_nodes.id", ondelete="CASCADE"), nullable=False)
    target_node_id = Column(String(36), ForeignKey("board_nodes.id", ondelete="CASCADE"), nullable=False)
    source_port = Column(String(50), nullable=True)
    target_port = Column(String(50), nullable=True)
    connection_type = Column(String(50), default="data", nullable=False)
    color = Column(String(7), default="#667eea", nullable=False)
    style = Column(String(20), default="solid", nullable=False)
    condition = Column(String(500), nullable=True)
    condition_config = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    execution_order = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    board = relationship("Board", back_populates="connections")
    source_node = relationship("BoardNode", foreign_keys=[source_node_id], back_populates="source_connections")
    target_node = relationship("BoardNode", foreign_keys=[target_node_id], back_populates="target_connections")

class BoardExecution(Base):
    """Board execution model - tracks workflow executions"""
    __tablename__ = "board_executions"

    id = Column(String(36), primary_key=True)
    board_id = Column(String(36), ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="running", nullable=False)
    execution_type = Column(String(50), default="manual", nullable=False)
    trigger_data = Column(JSON, nullable=True)
    total_nodes = Column(Integer, default=0, nullable=False)
    completed_nodes = Column(Integer, default=0, nullable=False)
    failed_nodes = Column(Integer, default=0, nullable=False)
    execution_time_ms = Column(Integer, nullable=True)
    result_data = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    execution_log = Column(JSON, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    board = relationship("Board", back_populates="executions")
    user = relationship("User", back_populates="board_executions")

class BoardTemplate(Base):
    """Board template model - predefined board templates"""
    __tablename__ = "board_templates"

    id = Column(String(36), primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    template_data = Column(JSON, nullable=False)
    preview_image = Column(String(500), nullable=True)
    tags = Column(JSON, nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    difficulty_level = Column(String(20), default="beginner", nullable=False)
    usage_count = Column(Integer, default=0, nullable=False)
    rating = Column(Float, default=0.0, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class Notification(Base):
    """Notification model - system and user notifications"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info", nullable=False)
    priority = Column(String(20), default="normal", nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False)
    action_url = Column(String(500), nullable=True)
    action_data = Column(JSON, nullable=True)
    extra_data = Column(JSON, nullable=True)
    scheduled_for = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class UserAnalytics(Base):
    """User analytics model - tracks user behavior and engagement"""
    __tablename__ = "user_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    event_category = Column(String(50), nullable=False)
    event_data = Column(JSON, nullable=True)
    session_id = Column(String(50), nullable=True)
    page_url = Column(String(500), nullable=True)
    referrer = Column(String(500), nullable=True)
    user_agent = Column(String(1000), nullable=True)
    ip_address = Column(String(45), nullable=True)
    location_data = Column(JSON, nullable=True)
    device_info = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class SystemAnalytics(Base):
    """System analytics model - tracks system performance and health"""
    __tablename__ = "system_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_type = Column(String(50), nullable=False)
    metric_unit = Column(String(20), nullable=True)
    component = Column(String(50), nullable=False)
    environment = Column(String(20), default="production", nullable=False)
    extra_data = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class SystemSettings(Base):
    """System settings model - application configuration"""
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=True)
    data_type = Column(String(20), default="string", nullable=False)
    description = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False, nullable=False)
    is_encrypted = Column(Boolean, default=False, nullable=False)
    validation_rules = Column(JSON, nullable=True)
    default_value = Column(Text, nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False) 