"""
Chat Service - Fixed
Simplified chat and conversation management service using SQLAlchemy
Compatible with actual database models
"""

from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, and_, func, desc
from models.database import Conversation, Message
from fastapi import HTTPException
from datetime import datetime
import logging
import uuid  # NEW: For generating unique conversation links

class ChatService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def get_user_conversations(
        self, db: AsyncSession, user_id: int, limit: int = 20, offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get user conversations"""
        try:
            query = (
                select(Conversation)
                .where(Conversation.user_id == user_id)
                .order_by(desc(Conversation.updated_at))
                .offset(offset)
                .limit(limit)
            )
            result = await db.execute(query)
            conversations = result.scalars().all()
            return [self._conversation_to_dict(conv) for conv in conversations]
        except Exception as e:
            logging.error(f"Error getting user conversations: {e}")
            return []
    
    async def get_user_conversations_count(self, db: AsyncSession, user_id: int) -> int:
        """Get total count of user conversations"""
        try:
            query = select(func.count()).select_from(Conversation).where(
                Conversation.user_id == user_id
            )
            result = await db.execute(query)
            return result.scalar() or 0
        except Exception as e:
            logging.error(f"Error getting conversation count: {e}")
            return 0
    
    async def create_conversation(
        self, db: AsyncSession, title: str, user_id: int, agent_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Create new conversation with unique UUID link"""
        try:
            # NEW: Generate unique UUID for conversation link
            conversation_uuid = str(uuid.uuid4())
            
            # Create new conversation with UUID
            new_conversation = Conversation(
                uuid=conversation_uuid,  # NEW: Unique conversation identifier
                title=title,
                user_id=user_id,
                agent_id=agent_id
            )
            
            db.add(new_conversation)
            await db.commit()
            await db.refresh(new_conversation)
            
            self.logger.info(f"Created conversation with UUID: {conversation_uuid}")
            
            return {
                "conversation_id": new_conversation.id,
                "conversation_uuid": conversation_uuid,  # NEW: Return UUID for frontend
                "conversation_link": f"/chat/c/{conversation_uuid}",  # NEW: Unique link like ChatGPT
                "title": title,
                "user_id": user_id,
                "agent_id": agent_id,
                "created_at": new_conversation.created_at.isoformat()
            }
            
        except Exception as e:
            await db.rollback()
            self.logger.error(f"Error creating conversation: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")

    async def get_conversation_by_uuid(
        self, db: AsyncSession, conversation_uuid: str, user_id: int
    ) -> Optional[Dict[str, Any]]:
        """Get conversation by UUID with ownership validation"""
        try:
            # Select specific columns to avoid any column issues
            query = (
                select(Conversation)
                .where(
                    and_(
                        Conversation.uuid == conversation_uuid,
                        Conversation.user_id == user_id
                    )
                )
            )
            
            result = await db.execute(query)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                return None
                
            return {
                "id": conversation.id,
                "uuid": conversation.uuid,
                "title": conversation.title,
                "agent_id": conversation.agent_id,
                "user_id": conversation.user_id,
                "created_at": conversation.created_at,
                "updated_at": conversation.updated_at
            }
            
        except Exception as e:
            self.logger.error(f"Error getting conversation by UUID: {e}")
            return None

    async def get_conversation_by_id(
        self, db: AsyncSession, conversation_id: int, user_id: int = None
    ) -> Optional[Dict[str, Any]]:
        """Get conversation by ID with optional ownership validation"""
        try:
            # Build query conditions
            conditions = [Conversation.id == conversation_id]
            if user_id is not None:
                conditions.append(Conversation.user_id == user_id)
            
            query = select(Conversation).where(and_(*conditions))
            result = await db.execute(query)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                return None
                
            return {
                "id": conversation.id,
                "uuid": conversation.uuid,
                "title": conversation.title,
                "agent_id": conversation.agent_id,
                "user_id": conversation.user_id,
                "created_at": conversation.created_at,
                "updated_at": conversation.updated_at
            }
            
        except Exception as e:
            self.logger.error(f"Error getting conversation by ID: {e}")
            return None

    async def update_conversation_by_uuid(
        self, db: AsyncSession, conversation_uuid: str, update_data: Dict[str, Any], user_id: int
    ) -> bool:
        """Update conversation by UUID with user ownership validation"""
        try:
            # Update the conversation with user ownership check
            query = (
                update(Conversation)
                .where(
                    and_(
                        Conversation.uuid == conversation_uuid,
                        Conversation.user_id == user_id
                    )
                )
                .values(**update_data, updated_at=datetime.utcnow())
            )
            
            result = await db.execute(query)
            await db.commit()
            
            return result.rowcount > 0
            
        except Exception as e:
            await db.rollback()
            self.logger.error(f"Error updating conversation by UUID: {e}")
            return False

    async def update_conversation(
        self, db: AsyncSession, conversation_id: int, update_data: Dict[str, Any]
    ) -> bool:
        """Update conversation by ID"""
        try:
            # Add updated_at timestamp
            update_data["updated_at"] = datetime.utcnow()
            
            # Update the conversation
            query = (
                update(Conversation)
                .where(Conversation.id == conversation_id)
                .values(**update_data)
            )
            
            result = await db.execute(query)
            await db.commit()
            
            return result.rowcount > 0
            
        except Exception as e:
            await db.rollback()
            self.logger.error(f"Error updating conversation: {e}")
            return False
    
    async def delete_conversation(self, db: AsyncSession, conversation_id: str) -> bool:
        """Delete conversation (soft delete by setting title to null)"""
        try:
            conv_id = int(conversation_id) if conversation_id.isdigit() else conversation_id
            
            query = update(Conversation).where(
                Conversation.id == conv_id
            ).values(title=None, updated_at=datetime.utcnow())
            result = await db.execute(query)
            await db.commit()
            return result.rowcount > 0
        except Exception as e:
            await db.rollback()
            logging.error(f"Error deleting conversation: {e}")
            return False
    
    async def get_conversation_messages(
        self, db: AsyncSession, conversation_id: str, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get messages for a conversation"""
        try:
            conv_id = int(conversation_id) if conversation_id.isdigit() else conversation_id
            
            query = (
                select(Message)
                .where(Message.conversation_id == conv_id)
                .order_by(Message.created_at)
                .offset(offset)
                .limit(limit)
            )
            result = await db.execute(query)
            messages = result.scalars().all()
            return [self._message_to_dict(msg) for msg in messages]
        except Exception as e:
            logging.error(f"Error getting conversation messages: {e}")
            return []
    
    async def get_conversation_messages_count(
        self, db: AsyncSession, conversation_id: str
    ) -> int:
        """Get total count of messages in conversation"""
        try:
            conv_id = int(conversation_id) if conversation_id.isdigit() else conversation_id
            
            query = select(func.count()).select_from(Message).where(
                Message.conversation_id == conv_id
            )
            result = await db.execute(query)
            return result.scalar() or 0
        except Exception as e:
            logging.error(f"Error getting message count: {e}")
            return 0
    
    async def add_message_to_conversation(
        self, db: AsyncSession, conversation_id: str, content: str,
        sender_type: str = "user", agent_id: Optional[int] = None,
        tokens_used: int = 0, processing_time: int = 0, model_used: str = "unknown"
    ) -> Dict[str, Any]:
        """Add message to conversation - updated for new schema"""
        try:
            # Convert conversation_id to int with proper error handling
            try:
                conv_id = int(conversation_id)
            except (ValueError, TypeError) as e:
                self.logger.error(f"Invalid conversation_id: {conversation_id}")
                raise Exception(f"Invalid conversation ID: {conversation_id}")
            
            # Verify conversation exists
            query = select(Conversation).where(Conversation.id == conv_id)
            result = await db.execute(query)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                self.logger.error(f"Conversation {conv_id} not found")
                raise Exception(f"Conversation {conv_id} not found")
            
            # Create message with all required fields
            message = Message(
                conversation_id=conv_id,
                content=content,
                message_role=sender_type,  # user, assistant, system
                content_type='text',
                message_type='text',
                status='sent',
                visibility='normal',
                tokens_used=tokens_used,
                cost=0.0,
                is_edited=False,
                is_educational=False,
                thread_count=0
            )
            
            # Add and commit
            db.add(message)
            await db.flush()
            
            # Update conversation timestamp
            conversation.updated_at = datetime.utcnow()
            await db.commit()
            
            self.logger.info(f"Message {message.id} added successfully to conversation {conv_id}")
            
            return {
                "message_id": message.id,
                "content": content,
                "sender": sender_type,  # Keep as 'sender' for API compatibility
                "message_role": sender_type,
                "conversation_id": conv_id,
                "content_type": message.content_type,
                "message_type": message.message_type,
                "status": message.status,
                "tokens_used": message.tokens_used,
                "cost": message.cost,
                "created_at": message.created_at.isoformat() if message.created_at else None
            }
            
        except Exception as e:
            await db.rollback()
            error_msg = f"Failed to add message: {str(e)}"
            self.logger.error(f"Error in add_message_to_conversation: {error_msg}")
            self.logger.error(f"  Input: conversation_id={conversation_id}, content='{content[:50]}...', sender={sender_type}")
            raise Exception(error_msg)
    
    async def generate_ai_response(
        self, db: AsyncSession, conversation_id: str, message: str,
        agent_id: Optional[int] = None, conversation_history: Optional[List] = None,
        include_context: bool = True
    ) -> Dict[str, Any]:
        """Generate AI response using real agent system"""
        try:
            # ✅ FIXED: Use real agent instead of mock responses
            if not agent_id:
                # Try to get agent_id from conversation
                conversation = await self.get_conversation_by_id(db=db, conversation_id=conversation_id)
                if conversation and conversation.get("agent_id"):
                    agent_id = conversation["agent_id"]
                    logging.info(f"🔗 Using agent_id from conversation: {agent_id}")
                else:
                    # If still no agent, try to get default agent
                    from sqlalchemy import select
                    from models.database import Agent
                    
                    query = select(Agent).where(
                        and_(
                            Agent.is_active == True,
                            Agent.model_name.like('%qwen%')  # Prefer qwen model
                        )
                    ).limit(1)
                    result = await db.execute(query)
                    default_agent = result.scalar()
                    
                    if default_agent:
                        agent_id = default_agent.id
                        logging.info(f"🎯 Using default qwen agent: {agent_id}")
                    else:
                        # Last resort: get any active agent
                        query = select(Agent).where(Agent.is_active == True).limit(1)
                        result = await db.execute(query)
                        fallback_agent = result.scalar()
                        
                        if fallback_agent:
                            agent_id = fallback_agent.id
                            logging.info(f"⚠️ Using fallback agent: {agent_id}")
                        else:
                            logging.error("❌ No active agents found in system")
                            return {
                                "response": "No AI agents are available. Please create an agent first.",
                                "status": "error",
                                "error": "No agents available"
                            }
            
            # Import and use AgentService for real AI responses
            from services.agent_service import AgentService
            agent_service = AgentService()
            
            logging.info(f"🤖 Generating AI response using Agent {agent_id} for message: {message[:100]}...")
            
            # ✅ USE REAL AGENT INSTEAD OF MOCK
            result = await agent_service.test_agent(db, agent_id, message)
            
            if result.get("status") == "error":
                error_msg = result.get("message", "Agent test failed")
                logging.error(f"❌ Agent {agent_id} test failed: {error_msg}")
                
                # Return helpful error message
                return {
                    "response": f"I'm having trouble connecting to the AI model. Error: {error_msg}",
                    "status": "error",
                    "error": error_msg
                }
            
            # Extract response from agent test results
            test_results = result.get("test_results", {})
            # FIXED: Use correct key name - agent_response instead of response
            ai_response = test_results.get("agent_response", test_results.get("response", "I apologize, but I couldn't generate a response."))
            
            # Extract performance metrics
            performance = result.get("performance", {})
            tokens_used = test_results.get("tokens_used", 0)
            processing_time = performance.get("response_time_ms", 0) / 1000.0  # Convert to seconds
            
            # FIXED: Get model info from agent_info section
            agent_info = result.get("agent_info", {})
            model_used = agent_info.get("model_name", test_results.get("model_info", "unknown"))
            
            logging.info(f"✅ Agent {agent_id} responded successfully. Tokens: {tokens_used}, Time: {processing_time}s")
            
            # Add the AI response as a message with metadata
            await self.add_message_to_conversation(
                db=db,
                conversation_id=conversation_id,
                content=ai_response,
                sender_type="agent",
                agent_id=agent_id,
                tokens_used=tokens_used,
                processing_time=int(processing_time * 1000),  # Store as milliseconds
                model_used=model_used
            )
            
            return {
                "response": ai_response,
                "agent_id": agent_id,
                "processing_time": processing_time,
                "tokens_used": tokens_used,
                "model_used": model_used,
                "status": "success"
            }
            
        except ImportError as e:
            logging.error(f"Failed to import AgentService: {e}")
            return {
                "response": "AI service is temporarily unavailable. Please try again later.",
                "status": "error",
                "error": "AgentService import failed"
            }
        except Exception as e:
            logging.error(f"Error generating AI response: {e}")
            return {
                "response": "I apologize, but I'm having trouble generating a response right now.",
                "status": "error",
                "error": str(e)
            }
    
    async def get_user_chat_analytics(
        self, db: AsyncSession, user_id: int
    ) -> Dict[str, Any]:
        """Get chat analytics for user"""
        try:
            # Get conversation count
            conv_count = await db.scalar(
                select(func.count())
                .select_from(Conversation)
                .where(Conversation.user_id == user_id)
            ) or 0
            
            # Get message count
            msg_count = await db.scalar(
                select(func.count())
                .select_from(Message)
                .join(Conversation)
                .where(Conversation.user_id == user_id)
            ) or 0
            
            # Calculate average messages per conversation
            avg_msgs = msg_count / conv_count if conv_count > 0 else 0
            
            return {
                "total_conversations": conv_count,
                "total_messages": msg_count,
                "active_conversations": conv_count,
                "average_messages_per_conversation": round(avg_msgs, 2),
                "most_used_agents": [],
                "recent_activity": []
            }
            
        except Exception as e:
            logging.error(f"Error getting user analytics: {e}")
            return {
                "total_conversations": 0,
                "total_messages": 0,
                "active_conversations": 0,
                "average_messages_per_conversation": 0,
                "most_used_agents": [],
                "recent_activity": []
            }
    
    async def get_global_chat_analytics(self, db: AsyncSession) -> Dict[str, Any]:
        """Get global chat analytics"""
        try:
            # Get total counts
            conv_count = await db.scalar(
                select(func.count()).select_from(Conversation)
            ) or 0
            
            msg_count = await db.scalar(
                select(func.count()).select_from(Message)
            ) or 0
            
            # Calculate average messages per conversation
            avg_msgs = msg_count / conv_count if conv_count > 0 else 0
            
            return {
                "total_conversations": conv_count,
                "total_messages": msg_count,
                "active_conversations": conv_count,
                "average_messages_per_conversation": round(avg_msgs, 2),
                "most_used_agents": [],
                "recent_activity": []
            }
            
        except Exception as e:
            logging.error(f"Error getting global analytics: {e}")
            return {
                "total_conversations": 0,
                "total_messages": 0,
                "active_conversations": 0,
                "average_messages_per_conversation": 0,
                "most_used_agents": [],
                "recent_activity": []
            }
    
    async def search_user_messages(
        self, db: AsyncSession, user_id: int, query: str,
        conversation_id: Optional[str] = None, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Search messages for user"""
        try:
            base_query = (
                select(Message)
                .join(Conversation)
                .where(and_(
                    Conversation.user_id == user_id,
                    Message.content.ilike(f"%{query}%")
                ))
            )
            
            if conversation_id:
                conv_id = int(conversation_id) if conversation_id.isdigit() else conversation_id
                base_query = base_query.where(Message.conversation_id == conv_id)
                
            base_query = base_query.order_by(desc(Message.created_at)).limit(limit)
            
            result = await db.execute(base_query)
            messages = result.scalars().all()
            return [self._message_to_dict(msg) for msg in messages]
            
        except Exception as e:
            logging.error(f"Error searching messages: {e}")
            return []
    
    def _conversation_to_dict(self, conversation: Conversation) -> Dict[str, Any]:
        """Convert Conversation model to dictionary"""
        if not conversation:
            return {}
            
        return {
            "id": conversation.id,
            "title": conversation.title,
            "user_id": conversation.user_id,
            "agent_id": conversation.agent_id,
            "created_at": conversation.created_at.isoformat() if conversation.created_at else None,
            "updated_at": conversation.updated_at.isoformat() if conversation.updated_at else None
        }
    
    def _message_to_dict(self, message: Message) -> Dict[str, Any]:
        """Convert Message model to dictionary - updated for new schema"""
        if not message:
            return {}
            
        return {
            "id": message.id,
            "conversation_id": message.conversation_id,
            "content": message.content,
            "content_type": getattr(message, 'content_type', 'text'),
            "sender": message.message_role,  # API compatibility - map message_role to sender
            "message_role": message.message_role,
            "message_type": getattr(message, 'message_type', 'text'),
            "tokens_used": getattr(message, 'tokens_used', 0),
            "processing_time_ms": getattr(message, 'processing_time_ms', None),
            "model_used": getattr(message, 'model_used', None),
            "cost": getattr(message, 'cost', 0.0),
            "attachments": getattr(message, 'attachments', None),
            "is_edited": getattr(message, 'is_edited', False),
            "edit_history": getattr(message, 'edit_history', None),
            "is_educational": getattr(message, 'is_educational', False),
            "lesson_context": getattr(message, 'lesson_context', None),
            "feedback_provided": getattr(message, 'feedback_provided', None),
            "parent_message_id": getattr(message, 'parent_message_id', None),
            "thread_count": getattr(message, 'thread_count', 0),
            "status": getattr(message, 'status', 'sent'),
            "visibility": getattr(message, 'visibility', 'normal'),
            "created_at": message.created_at.isoformat() if message.created_at else None,
            "edited_at": message.edited_at.isoformat() if getattr(message, 'edited_at', None) else None,
            "read_at": message.read_at.isoformat() if getattr(message, 'read_at', None) else None
        } 