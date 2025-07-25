# Chat API Documentation

## CRITICAL UPDATE REQUIREMENT
⚠️ MANDATORY: When modifying ANY chat endpoint, you MUST update this file immediately!

---

## CHAT API OVERVIEW

### Module Information
- Location: backend/api/chat/endpoints.py
- Service: backend/services/chat_service.py
- Models: backend/models/chat.py
- Prefix: /chat
- Tags: ["Chat"]

### Features
- Conversation Management: Create, read, update, delete conversations
- Message Handling: Send and retrieve messages
- AI Integration: Generate AI responses
- Analytics: Chat statistics and insights
- Search: Search messages and conversations

---

## CHAT ENDPOINTS

### 1. Get User Conversations
```http
GET /chat/conversations
```

**Description**: Get list of conversations for the authenticated user

**Authentication**: Required

**Query Parameters**:
- `limit` (integer): Number of conversations to return (default: 20)
- `offset` (integer): Number of conversations to skip (default: 0)
- `is_active` (boolean): Filter by active status (default: true)
- `agent_id` (integer): Filter by specific agent

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-uuid-123",
      "title": "Customer Support Chat",
      "user_id": 1,
      "agent_id": 5,
      "agent_name": "Support Agent",
      "is_active": true,
      "message_count": 15,
      "last_message_at": "2024-12-22T09:30:00Z",
      "created_at": "2024-12-22T08:00:00Z",
      "updated_at": "2024-12-22T09:30:00Z"
    },
    {
      "id": "conv-uuid-456",
      "title": "Technical Help",
      "user_id": 1,
      "agent_id": 3,
      "agent_name": "Tech Agent",
      "is_active": true,
      "message_count": 8,
      "last_message_at": "2024-12-21T15:20:00Z",
      "created_at": "2024-12-21T14:00:00Z",
      "updated_at": "2024-12-21T15:20:00Z"
    }
  ],
  "message": "Conversations retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Conversations retrieved successfully
- 401: Authentication required

---

### 2. Create New Conversation
```http
POST /chat/conversations
```

**Description**: Create a new conversation

**Authentication**: Required

**Request Body**:
```json
{
  "title": "New Support Request",
  "agent_id": 5
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid-789",
    "title": "New Support Request",
    "user_id": 1,
    "agent_id": 5,
    "agent_name": "Support Agent",
    "is_active": true,
    "message_count": 0,
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Conversation created successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: Conversation created successfully
- 400: Invalid request data
- 401: Authentication required
- 404: Agent not found

---

### 3. Get Specific Conversation
```http
GET /chat/conversations/{conversation_id}
```

**Description**: Get detailed information about a specific conversation

**Authentication**: Required (must be conversation owner)

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid-123",
    "title": "Customer Support Chat",
    "user_id": 1,
    "user_name": "john_doe",
    "agent_id": 5,
    "agent_name": "Support Agent",
    "is_active": true,
    "message_count": 15,
    "last_message_at": "2024-12-22T09:30:00Z",
    "created_at": "2024-12-22T08:00:00Z",
    "updated_at": "2024-12-22T09:30:00Z",
    "recent_messages": [
      {
        "id": 45,
        "content": "Thank you for your help!",
        "sender_type": "user",
        "created_at": "2024-12-22T09:30:00Z"
      },
      {
        "id": 46,
        "content": "You're welcome! Is there anything else I can help you with?",
        "sender_type": "agent",
        "agent_id": 5,
        "created_at": "2024-12-22T09:31:00Z"
      }
    ]
  },
  "message": "Conversation retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Conversation retrieved successfully
- 404: Conversation not found
- 401: Authentication required
- 403: Access denied

---

### 4. Update Conversation
```http
PUT /chat/conversations/{conversation_id}
```

**Description**: Update conversation details

**Authentication**: Required (must be conversation owner)

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Request Body**:
```json
{
  "title": "Updated Conversation Title",
  "agent_id": 7,
  "is_active": false
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid-123",
    "title": "Updated Conversation Title",
    "user_id": 1,
    "agent_id": 7,
    "agent_name": "New Agent",
    "is_active": false,
    "message_count": 15,
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Conversation updated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Conversation updated successfully
- 400: Invalid request data
- 404: Conversation not found
- 401: Authentication required
- 403: Access denied

---

### 5. Delete Conversation
```http
DELETE /chat/conversations/{conversation_id}
```

**Description**: Delete a conversation (soft delete - marks as inactive)

**Authentication**: Required (must be conversation owner)

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Response (Success)**:
```json
{
  "success": true,
  "message": "Conversation deleted successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 204: Conversation deleted successfully
- 404: Conversation not found
- 401: Authentication required
- 403: Access denied

---

### 6. Get Conversation Messages
```http
GET /chat/conversations/{conversation_id}/messages
```

**Description**: Get messages from a specific conversation

**Authentication**: Required (must be conversation participant)

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Query Parameters**:
- `limit` (integer): Number of messages to return (default: 50)
- `offset` (integer): Number of messages to skip (default: 0)
- `order` (string): Sort order ('asc' or 'desc', default: 'asc')

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "conversation_id": "conv-uuid-123",
      "content": "Hello, I need help with my account",
      "sender_type": "user",
      "agent_id": null,
      "agent_name": null,
      "created_at": "2024-12-22T08:05:00Z"
    },
    {
      "id": 43,
      "conversation_id": "conv-uuid-123",
      "content": "Hello! I'd be happy to help you with your account. What specific issue are you experiencing?",
      "sender_type": "agent",
      "agent_id": 5,
      "agent_name": "Support Agent",
      "tokens_used": 25,
      "response_time": 1.2,
      "created_at": "2024-12-22T08:05:30Z"
    }
  ],
  "message": "Messages retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Messages retrieved successfully
- 404: Conversation not found
- 401: Authentication required
- 403: Access denied

---

### 7. Send Message to Conversation
```http
POST /chat/conversations/{conversation_id}/messages
```

**Description**: Send a new message to a conversation

**Authentication**: Required (must be conversation participant)

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Request Body**:
```json
{
  "content": "I'm having trouble logging into my account",
  "sender_type": "user"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "message_id": 47,
    "conversation_id": "conv-uuid-123",
    "content": "I'm having trouble logging into my account",
    "sender_type": "user",
    "agent_id": null,
    "created_at": "2024-12-22T10:00:00Z",
    "ai_response": {
      "message_id": 48,
      "content": "I understand you're having trouble logging in. Let me help you with that. Could you please tell me what happens when you try to log in?",
      "sender_type": "agent",
      "agent_id": 5,
      "agent_name": "Support Agent",
      "tokens_used": 35,
      "response_time": 0.8,
      "created_at": "2024-12-22T10:00:01Z"
    }
  },
  "message": "Message sent successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: Message sent successfully
- 400: Invalid request data
- 404: Conversation not found
- 401: Authentication required
- 403: Access denied

---

### 8. Generate AI Response
```http
POST /chat/conversations/{conversation_id}/ai-response
```

**Description**: Manually trigger AI response generation for a conversation

**Authentication**: Required

**Path Parameters**:
- `conversation_id` (string): UUID of the conversation

**Request Body**:
```json
{
  "message": "Can you help me reset my password?",
  "agent_id": 5,
  "include_context": true,
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "response": "I'd be happy to help you reset your password. I can guide you through the process step by step. First, please go to the login page and click on 'Forgot Password'.",
    "agent_id": 5,
    "agent_name": "Support Agent",
    "message_id": 49,
    "model_used": "gpt-3.5-turbo",
    "tokens_used": 42,
    "response_time": 1.1,
    "timestamp": "2024-12-22T10:00:00Z"
  },
  "message": "AI response generated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: AI response generated successfully
- 400: Invalid request data
- 404: Conversation or agent not found
- 401: Authentication required
- 500: AI response generation failed

---

### 9. Get User Chat Analytics
```http
GET /chat/analytics/dashboard
```

**Description**: Get chat analytics for the authenticated user

**Authentication**: Required

**Query Parameters**:
- `period` (string): Time period ('day', 'week', 'month', default: 'week')

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "total_conversations": 12,
    "active_conversations": 8,
    "total_messages": 156,
    "messages_today": 15,
    "average_messages_per_conversation": 13,
    "most_used_agents": [
      {
        "agent_id": 5,
        "agent_name": "Support Agent",
        "conversation_count": 6,
        "message_count": 89
      }
    ],
    "conversation_activity": {
      "daily": [5, 8, 12, 7, 9, 11, 15],
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "response_times": {
      "average": 1.3,
      "fastest": 0.5,
      "slowest": 3.2
    }
  },
  "message": "User analytics retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Analytics retrieved successfully
- 401: Authentication required

---

### 10. Get Global Chat Analytics (Admin Only)
```http
GET /chat/analytics/global
```

**Description**: Get global chat analytics for all users (admin only)

**Authentication**: Required (Admin Role)

**Query Parameters**:
- `period` (string): Time period ('day', 'week', 'month', default: 'week')

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "total_conversations": 450,
    "active_conversations": 280,
    "total_messages": 5250,
    "messages_today": 185,
    "total_users": 35,
    "active_users_today": 12,
    "top_agents": [
      {
        "agent_id": 5,
        "agent_name": "Support Agent",
        "conversation_count": 125,
        "message_count": 1250,
        "success_rate": 0.94
      }
    ],
    "usage_statistics": {
      "daily_conversations": [15, 22, 18, 25, 30, 28, 32],
      "daily_messages": [180, 220, 195, 245, 290, 275, 315],
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "performance_metrics": {
      "average_response_time": 1.5,
      "customer_satisfaction": 0.89,
      "resolution_rate": 0.85
    }
  },
  "message": "Global analytics retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Global analytics retrieved successfully
- 401: Authentication required
- 403: Admin role required

---

### 11. Search Messages
```http
GET /chat/search
```

**Description**: Search for messages across user's conversations

**Authentication**: Required

**Query Parameters**:
- `query` (string): Search query (required)
- `conversation_id` (string): Limit search to specific conversation
- `limit` (integer): Number of results to return (default: 20)
- `offset` (integer): Number of results to skip (default: 0)

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "message_id": 43,
      "conversation_id": "conv-uuid-123",
      "conversation_title": "Customer Support Chat",
      "content": "I'd be happy to help you with your account. What specific issue are you experiencing?",
      "sender_type": "agent",
      "agent_name": "Support Agent",
      "created_at": "2024-12-22T08:05:30Z",
      "relevance_score": 0.95
    }
  ],
  "message": "Search completed successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Search completed successfully
- 400: Invalid search query
- 401: Authentication required

---

## ERROR HANDLING

### Common Error Codes
- CONVERSATION_NOT_FOUND: Conversation with specified ID not found
- CONVERSATION_ACCESS_DENIED: User doesn't have access to conversation
- MESSAGE_SEND_FAILED: Failed to send message
- AI_RESPONSE_FAILED: Failed to generate AI response
- SEARCH_QUERY_INVALID: Invalid search query parameters
- ANALYTICS_ACCESS_DENIED: Insufficient permissions for analytics

---

## TESTING EXAMPLES

### Using curl
```bash
# Get conversations
curl -X GET http://localhost:8000/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create conversation
curl -X POST http://localhost:8000/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Conversation",
    "agent_id": 5
  }'

# Send message
curl -X POST http://localhost:8000/chat/conversations/conv-uuid-123/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, I need help",
    "sender_type": "user"
  }'

# Search messages
curl -X GET "http://localhost:8000/chat/search?query=account&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## MODIFICATION GUIDELINES

### Before Modifying Chat API:
1. Read This Documentation: Understand current structure completely
2. Check Message Dependencies: Identify relationships and data integrity
3. Plan Changes: Ensure conversation flow is maintained
4. Test Thoroughly: Verify all chat operations work correctly

### After Modifying Chat API:
1. Update This File: Add/modify endpoint documentation
2. Update Examples: Ensure all code examples work
3. Test Integration: Verify frontend chat interface works
4. Update Main API Docs: Update API_COMPLETE_DOCUMENTATION.md

---

⚠️ CRITICAL REMINDER: UPDATE THIS DOCUMENTATION WITH EVERY CHANGE!
⚠️ ALL CODE MUST BE IN ENGLISH ONLY!

Last Updated: 2024-12-22
Chat API Version: 2.0.0
