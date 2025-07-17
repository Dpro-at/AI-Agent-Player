"""
Board and Workflow Database Models
Supporting visual workflow builder functionality
"""

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from datetime import datetime
from typing import List, Optional, Dict, Any
from .base import Base

class Board(Base):
    """Board model - represents a visual workflow board"""
    __tablename__ = "boards"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    agent_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("agents.id"), nullable=True)
    
    # Board configuration
    board_type: Mapped[str] = mapped_column(String(50), default="workflow")  # workflow, training, automation
    status: Mapped[str] = mapped_column(String(50), default="draft")  # draft, active, archived
    visibility: Mapped[str] = mapped_column(String(50), default="private")  # private, shared, public
    
    # Visual properties
    zoom_level: Mapped[float] = mapped_column(Float, default=1.0)
    pan_x: Mapped[float] = mapped_column(Float, default=0.0)
    pan_y: Mapped[float] = mapped_column(Float, default=0.0)
    connection_type: Mapped[str] = mapped_column(String(50), default="curved")  # curved, straight, stepped
    theme: Mapped[str] = mapped_column(String(20), default="light")  # light, dark
    
    # Metadata
    board_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    settings: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    # Workflow execution
    is_executable: Mapped[bool] = mapped_column(Boolean, default=False)
    execution_count: Mapped[int] = mapped_column(Integer, default=0)
    last_execution: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    nodes: Mapped[List["BoardNode"]] = relationship("BoardNode", back_populates="board", cascade="all, delete-orphan")
    connections: Mapped[List["BoardConnection"]] = relationship("BoardConnection", back_populates="board", cascade="all, delete-orphan")
    executions: Mapped[List["BoardExecution"]] = relationship("BoardExecution", back_populates="board", cascade="all, delete-orphan")

class BoardNode(Base):
    """Board node model - represents individual components in workflow"""
    __tablename__ = "board_nodes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    board_id: Mapped[str] = mapped_column(String(36), ForeignKey("boards.id"), nullable=False)
    
    # Node identity
    node_type: Mapped[str] = mapped_column(String(100), nullable=False)  # webhook, ai, database, email, etc.
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Visual properties
    position_x: Mapped[float] = mapped_column(Float, nullable=False)
    position_y: Mapped[float] = mapped_column(Float, nullable=False)
    width: Mapped[int] = mapped_column(Integer, default=120)
    height: Mapped[int] = mapped_column(Integer, default=60)
    color: Mapped[str] = mapped_column(String(20), default="#667eea")
    icon: Mapped[str] = mapped_column(String(100), default="fas fa-cog")
    
    # Node configuration
    config: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    input_schema: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    output_schema: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    # Node state
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_start_node: Mapped[bool] = mapped_column(Boolean, default=False)
    is_end_node: Mapped[bool] = mapped_column(Boolean, default=False)
    execution_order: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    board: Mapped["Board"] = relationship("Board", back_populates="nodes")
    source_connections: Mapped[List["BoardConnection"]] = relationship(
        "BoardConnection", 
        foreign_keys="BoardConnection.source_node_id",
        back_populates="source_node",
        cascade="all, delete-orphan"
    )
    target_connections: Mapped[List["BoardConnection"]] = relationship(
        "BoardConnection", 
        foreign_keys="BoardConnection.target_node_id",
        back_populates="target_node",
        cascade="all, delete-orphan"
    )

class BoardConnection(Base):
    """Board connection model - represents connections between nodes"""
    __tablename__ = "board_connections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    board_id: Mapped[str] = mapped_column(String(36), ForeignKey("boards.id"), nullable=False)
    
    # Connection endpoints
    source_node_id: Mapped[str] = mapped_column(String(36), ForeignKey("board_nodes.id"), nullable=False)
    target_node_id: Mapped[str] = mapped_column(String(36), ForeignKey("board_nodes.id"), nullable=False)
    source_port: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # output port name
    target_port: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # input port name
    
    # Connection properties
    connection_type: Mapped[str] = mapped_column(String(50), default="data")  # data, control, conditional
    color: Mapped[str] = mapped_column(String(20), default="#667eea")
    style: Mapped[str] = mapped_column(String(50), default="solid")  # solid, dashed, dotted
    
    # Conditional logic
    condition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JavaScript condition
    condition_config: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    # Connection state
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    execution_order: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    board: Mapped["Board"] = relationship("Board", back_populates="connections")
    source_node: Mapped["BoardNode"] = relationship(
        "BoardNode", 
        foreign_keys=[source_node_id],
        back_populates="source_connections"
    )
    target_node: Mapped["BoardNode"] = relationship(
        "BoardNode", 
        foreign_keys=[target_node_id],
        back_populates="target_connections"
    )

class BoardExecution(Base):
    """Board execution model - tracks workflow execution history"""
    __tablename__ = "board_executions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    board_id: Mapped[str] = mapped_column(String(36), ForeignKey("boards.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Execution details
    status: Mapped[str] = mapped_column(String(50), default="running")  # running, completed, failed, cancelled
    execution_type: Mapped[str] = mapped_column(String(50), default="manual")  # manual, scheduled, triggered
    trigger_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    # Execution metrics
    total_nodes: Mapped[int] = mapped_column(Integer, default=0)
    completed_nodes: Mapped[int] = mapped_column(Integer, default=0)
    failed_nodes: Mapped[int] = mapped_column(Integer, default=0)
    execution_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Results
    result_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    execution_log: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    # Timestamps
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    board: Mapped["Board"] = relationship("Board", back_populates="executions")

class BoardTemplate(Base):
    """Board template model - predefined board templates"""
    __tablename__ = "board_templates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # automation, ai, data, etc.
    
    # Template data
    template_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    preview_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    
    # Template properties
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    difficulty_level: Mapped[str] = mapped_column(String(50), default="beginner")  # beginner, intermediate, advanced
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Author
    created_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 