from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    agent_type = Column(String(50), nullable=False)
    model_provider = Column(String(50), nullable=False)
    model_name = Column(String(50), nullable=False)
    deployment_type = Column(String(10), default="cloud")  # "cloud" or "local"
    local_host = Column(String(255))
    local_port = Column(String(10))
    system_prompt = Column(Text)
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2048)
    is_public = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="agents")
    endpoints = relationship("AgentEndpoint", back_populates="agent", cascade="all, delete-orphan")

class AgentEndpoint(Base):
    __tablename__ = "agent_endpoints"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    name = Column(String(100), nullable=False)
    path = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    agent = relationship("Agent", back_populates="endpoints") 