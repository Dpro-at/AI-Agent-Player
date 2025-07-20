"""
Chat API Endpoints - FIXED VERSION
All chat and conversation related routes with improved validation
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from models.shared import SuccessResponse
from core.dependencies import get_current_user, get_optional_user, get_db
from services.chat_service import ChatService
from sqlalchemy import select, text
from models.database import Base
from config.database import async_engine  # FIXED: Import from config.database

# ADDED: Database initialization check
async def ensure_database_tables():
    """Ensure all required database tables exist"""
    try:
        async with async_engine.begin() as conn:
            # Create all tables if they don't exist
            await conn.run_sync(Base.metadata.create_all)
            
            # Check if messages table exists
            result = await conn.execute(text("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='messages';
            """))
            
            if not result.fetchone():
                # Create messages table manually if needed
                await conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        conversation_id INTEGER NOT NULL,
                        content TEXT NOT NULL,
                        sender VARCHAR(50) NOT NULL,
                        message_type VARCHAR(50) DEFAULT 'text',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                    );
                """))
                await conn.commit()
    except Exception as e:
        print(f"Database initialization warning: {e}")

# Fixed request models for better validation
class ConversationCreateRequest(BaseModel):
    title: Optional[str] = Field("New Conversation", max_length=300)
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None

class ConversationUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    agent_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class MessageCreateRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Message content")
    sender_type: Optional[str] = Field("user", description="Sender type: user, agent, or system")
    agent_id: Optional[int] = None

    class Config:
        # Allow extra fields for flexibility
        extra = "forbid"

class AIResponseRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message for AI response")
    context: Optional[Dict[str, Any]] = None
    temperature: Optional[float] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2048, ge=1, le=4096)

# Initialize router and service
router = APIRouter(tags=["Chat"])
chat_service = ChatService()

# FIXED: Get conversations endpoint
@router.get("/conversations", response_model=SuccessResponse)
async def get_conversations(
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Get user conversations with proper validation"""
    try:
        conversations = await chat_service.get_user_conversations(
            db=db,
            user_id=current_user["user_id"], 
            limit=limit, 
            offset=offset
        )
        total = await chat_service.get_user_conversations_count(db=db, user_id=current_user["user_id"])
        
        return SuccessResponse(
            message=f"Found {len(conversations)} conversations",
            data={
                "conversations": conversations,
                "total": total,
                "limit": limit,
                "offset": offset
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")

# FIXED: Create conversation endpoint with UUID
@router.post("/conversations", response_model=SuccessResponse)
async def create_conversation(
    request: ConversationCreateRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new conversation with unique UUID link (like ChatGPT)"""
    try:
        # Get user_id from authenticated user
        user_id = current_user["user_id"]
        
        # Use title from request or default
        title = request.title or "New Conversation"
        
        # Create conversation and get UUID link
        result = await chat_service.create_conversation(
            db=db,
            title=title,
            user_id=user_id,
            agent_id=request.agent_id
        )
        
        return SuccessResponse(
            message="Conversation created successfully",
            data={
                "conversation_id": result["conversation_id"],
                "conversation_uuid": result["conversation_uuid"],  # NEW: UUID for unique link
                "conversation_link": result["conversation_link"],  # NEW: ChatGPT-style link
                "title": result["title"],
                "agent_id": result["agent_id"],
                "created_at": result["created_at"],
                "redirect_url": f"/chat/c/{result['conversation_uuid']}"  # NEW: Frontend redirect URL
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating conversation: {str(e)}")

# NEW: Get conversation by UUID (ChatGPT-style URL)
@router.get("/c/{conversation_uuid}", response_model=SuccessResponse)
async def get_conversation_by_uuid(
    conversation_uuid: str,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get conversation by UUID - ChatGPT-style URL: /chat/c/{uuid}"""
    try:
        user_id = current_user["user_id"]
        
        conversation = await chat_service.get_conversation_by_uuid(
            db=db, 
            conversation_uuid=conversation_uuid,
            user_id=user_id  # Security: ensure user owns this conversation
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return SuccessResponse(
            message="Conversation found",
            data=conversation
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversation: {str(e)}")

# NEW: Update conversation by UUID
@router.put("/c/{conversation_uuid}", response_model=SuccessResponse)
async def update_conversation_by_uuid(
    conversation_uuid: str,
    request: ConversationUpdateRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update conversation by UUID - ChatGPT-style URL: /chat/c/{uuid}"""
    try:
        user_id = current_user["user_id"]
        
        # Prepare update data
        update_data = {}
        if request.title is not None:
            update_data["title"] = request.title
        if request.agent_id is not None:
            update_data["agent_id"] = request.agent_id
        if request.context_data is not None:
            update_data["context_data"] = request.context_data
        if request.is_active is not None:
            update_data["is_active"] = request.is_active
        
        result = await chat_service.update_conversation_by_uuid(
            db=db,
            conversation_uuid=conversation_uuid,
            update_data=update_data,
            user_id=user_id
        )
        
        return SuccessResponse(
            message="Conversation updated successfully",
            data=result
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating conversation: {str(e)}")

# FIXED: Get conversation endpoint
@router.get("/conversations/{conversation_id}", response_model=SuccessResponse)
async def get_conversation(
    conversation_id: str,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get conversation details with validation"""
    try:
        conversation = await chat_service.get_conversation_by_id(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user["user_id"]  # FIXED: Pass user_id for ownership validation
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check if user owns this conversation
        if conversation["user_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
            
        return SuccessResponse(
            message="Conversation found",
            data=conversation
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversation: {str(e)}")

# FIXED: Update conversation endpoint
@router.put("/conversations/{conversation_id}", response_model=SuccessResponse)
async def update_conversation(
    conversation_id: str,
    request: ConversationUpdateRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update conversation with improved validation"""
    try:
        # Check if conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_id(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user["user_id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if conversation["user_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Prepare update data - only include non-None values
        update_data = {}
        if request.title is not None:
            update_data["title"] = request.title
        if request.agent_id is not None:
            update_data["agent_id"] = request.agent_id
        if request.context_data is not None:
            update_data["context_data"] = request.context_data
        if request.is_active is not None:
            update_data["is_active"] = request.is_active
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid update data provided")
        
        # FIXED: Pass update_data dict instead of **kwargs
        success = await chat_service.update_conversation(
            db=db,
            conversation_id=conversation_id,
            update_data=update_data  # Changed from **update_data to update_data
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update conversation")
        
        # Return updated conversation
        updated_conversation = await chat_service.get_conversation_by_id(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user["user_id"]
        )
        
        return SuccessResponse(
            message="Conversation updated successfully",
            data=updated_conversation
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating conversation: {str(e)}")

# FIXED: Delete conversation endpoint
@router.delete("/conversations/{conversation_id}", response_model=SuccessResponse)
async def delete_conversation(
    conversation_id: int,  # FIXED: Changed from str to int
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete conversation with validation"""
    try:
        # Check if conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_id(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user["user_id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if conversation["user_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        await chat_service.delete_conversation(db=db, conversation_id=conversation_id)
        
        return SuccessResponse(
            message="Conversation deleted successfully",
            data={"conversation_id": conversation_id}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")

# NEW: Get messages by conversation UUID
@router.get("/c/{conversation_uuid}/messages", response_model=SuccessResponse)
async def get_messages_by_uuid(
    conversation_uuid: str,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get messages by conversation UUID - ChatGPT-style URL"""
    try:
        user_id = current_user["user_id"]
        
        # First verify conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_uuid(
            db=db, 
            conversation_uuid=conversation_uuid,
            user_id=user_id
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages using conversation ID
        messages = await chat_service.get_conversation_messages(
            db=db,
            conversation_id=str(conversation["id"]),
            limit=limit,
            offset=offset
        )
        
        total = await chat_service.get_conversation_messages_count(
            db=db,
            conversation_id=str(conversation["id"])
        )
        
        return SuccessResponse(
            message=f"Found {len(messages)} messages",
            data={
                "messages": messages,
                "conversation_uuid": conversation_uuid,
                "conversation_link": f"/chat/c/{conversation_uuid}",
                "total": total,
                "limit": limit,
                "offset": offset
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

# NEW: Send message by conversation UUID
@router.post("/c/{conversation_uuid}/messages", response_model=SuccessResponse)
async def send_message_by_uuid(
    conversation_uuid: str,
    request: MessageCreateRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send message by conversation UUID - ChatGPT-style URL"""
    try:
        # ADDED: Ensure database tables exist
        await ensure_database_tables()
        
        user_id = current_user["user_id"]
        
        # First verify conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_uuid(
            db=db, 
            conversation_uuid=conversation_uuid,
            user_id=user_id
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Add message using conversation ID
        try:
            result = await chat_service.add_message_to_conversation(
                db=db,
                conversation_id=str(conversation["id"]),
                content=request.content,
                sender_type=request.sender_type or "user",
                agent_id=request.agent_id
            )
            
            return SuccessResponse(
                message="Message sent successfully",
                data={
                    "message_id": result["message_id"],
                    "conversation_uuid": conversation_uuid,
                    "conversation_link": f"/chat/c/{conversation_uuid}",
                    "content": request.content,
                    "sender_type": request.sender_type or "user",
                    "status": "success"
                }
            )
        except Exception as service_error:
            # Enhanced error handling
            error_msg = str(service_error)
            
            if "table" in error_msg.lower() and "messages" in error_msg.lower():
                await ensure_database_tables()
                
                # Retry once
                result = await chat_service.add_message_to_conversation(
                    db=db,
                    conversation_id=str(conversation["id"]),
                    content=request.content,
                    sender_type=request.sender_type or "user",
                    agent_id=request.agent_id
                )
                
                return SuccessResponse(
                    message="Message sent successfully (after database fix)",
                    data={
                        "message_id": result["message_id"],
                        "conversation_uuid": conversation_uuid,
                        "conversation_link": f"/chat/c/{conversation_uuid}",
                        "content": request.content,
                        "sender_type": request.sender_type or "user",
                        "status": "success"
                    }
                )
            else:
                raise service_error
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error sending message: {str(e)}"
        )

# NEW: Delete conversation by UUID
@router.delete("/c/{conversation_uuid}", response_model=SuccessResponse)
async def delete_conversation_by_uuid(
    conversation_uuid: str,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete conversation by UUID - ChatGPT-style URL"""
    try:
        user_id = current_user["user_id"]
        
        # First verify conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_uuid(
            db=db, 
            conversation_uuid=conversation_uuid,
            user_id=user_id
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Delete conversation using conversation ID
        success = await chat_service.delete_conversation(
            db=db,
            conversation_id=str(conversation["id"])
        )
        
        if success:
            return SuccessResponse(
                message="Conversation deleted successfully",
                data={
                    "conversation_uuid": conversation_uuid,
                    "deleted": True
                }
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to delete conversation")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")

# FIXED: Get messages endpoint
@router.get("/conversations/{conversation_id}/messages", response_model=SuccessResponse)
async def get_conversation_messages(
    conversation_id: int,  # FIXED: Changed from str to int
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Get conversation messages with validation"""
    try:
        # Check if conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_id(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user["user_id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if conversation["user_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        messages = await chat_service.get_conversation_messages(
            db=db,
            conversation_id=conversation_id,
            limit=limit,
            offset=offset
        )
        
        total = await chat_service.get_conversation_messages_count(db=db, conversation_id=conversation_id)
        
        return SuccessResponse(
            message=f"Found {len(messages)} messages",
            data={
                "messages": messages,
                "total": total,
                "limit": limit,
                "offset": offset
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

# FIXED: Add message to conversation with database check
@router.post("/conversations/{conversation_id}/messages", response_model=SuccessResponse)
async def add_message_to_conversation(
    conversation_id: int,
    request: MessageCreateRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add message to conversation with enhanced error handling"""
    try:
        # Get user_id from authenticated user
        user_id = current_user["user_id"]
        
        # Add message using service with enhanced error handling
        result = await chat_service.add_message_to_conversation(
            db=db,
            conversation_id=str(conversation_id),  # Keep as string for service compatibility
            content=request.content,
            sender_type=request.sender_type or "user",
            agent_id=request.agent_id  # Re-added agent_id parameter
        )
        
        return SuccessResponse(
            message="Message added successfully",
            data={
                "message_id": result["message_id"],
                "conversation_id": conversation_id,
                "content": request.content,
                "sender_type": request.sender_type or "user",
                "created_at": result["created_at"].isoformat() if hasattr(result.get("created_at"), "isoformat") else str(result.get("created_at"))
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error adding message: {str(e)}"
        )

# FIXED: AI response endpoint
@router.post("/conversations/{conversation_id}/ai-response", response_model=SuccessResponse)
async def get_ai_response(
    conversation_id: str,
    request: AIResponseRequest,
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get AI response with improved validation"""
    try:
        # Check if conversation exists and user owns it
        conversation = await chat_service.get_conversation_by_id(db=db, conversation_id=conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if conversation["user_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get AI response
        ai_response = await chat_service.generate_ai_response(
            db=db,
            conversation_id=conversation_id,
            message=request.message,
            context=request.context,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        return SuccessResponse(
            message="AI response generated successfully",
            data=ai_response
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI response: {str(e)}")

# Analytics endpoints
@router.get("/analytics/dashboard", response_model=SuccessResponse)
async def get_chat_analytics_dashboard(
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chat analytics dashboard"""
    try:
        analytics = await chat_service.get_user_chat_analytics(
            db=db,
            user_id=current_user["user_id"]
        )
        
        return SuccessResponse(
            message="Chat analytics retrieved successfully",
            data=analytics
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

@router.get("/analytics/global", response_model=SuccessResponse)
async def get_global_chat_analytics(
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get global chat analytics (admin only)"""
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        analytics = await chat_service.get_global_chat_analytics(db=db)
        
        return SuccessResponse(
            message="Global chat analytics retrieved successfully",
            data=analytics
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching global analytics: {str(e)}")

@router.get("/search", response_model=SuccessResponse)
async def search_messages(
    query: str = Query(..., min_length=1, description="Search query"),
    current_user: Dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Search messages in user's conversations"""
    try:
        results = await chat_service.search_user_messages(
            db=db,
            user_id=current_user["user_id"],
            query=query,
            limit=limit,
            offset=offset
        )
        
        return SuccessResponse(
            message=f"Found {len(results)} matching messages",
            data={
                "results": results,
                "query": query,
                "limit": limit,
                "offset": offset
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching messages: {str(e)}") 