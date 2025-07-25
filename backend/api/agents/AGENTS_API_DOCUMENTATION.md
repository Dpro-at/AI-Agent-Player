# Agents API Documentation

## CRITICAL UPDATE REQUIREMENT
⚠️ MANDATORY: When modifying ANY agents endpoint, you MUST update this file immediately!

---

## AGENTS API OVERVIEW

### Module Information
- Location: backend/api/agents/endpoints.py
- Service: backend/services/agent_service.py
- Models: backend/models/agent.py
- Prefix: /agents
- Tags: ["Agents"]

### Features
- Agent CRUD Operations: Create, read, update, delete agents
- Agent Testing: Test agent functionality
- Agent Statistics: Performance metrics and analytics
- Child Agents: Nested agent relationships
- Agent Types: Main agents and child agents

---

## AGENT ENDPOINTS

### 1. List All Agents
```http
GET /agents
```

**Description**: Get list of all agents (main and child)

**Authentication**: Optional (public agents visible without auth)

**Query Parameters**:
- `include_inactive` (boolean): Include inactive agents (default: false)
- `agent_type` (string): Filter by type ('main', 'child', 'all')
- `limit` (integer): Number of agents to return (default: 50)
- `offset` (integer): Number of agents to skip (default: 0)

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Customer Support Agent",
      "description": "Handles customer inquiries and support",
      "agent_type": "main",
      "is_active": true,
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "configuration": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.7,
        "max_tokens": 1000
      },
      "statistics": {
        "total_conversations": 25,
        "success_rate": 0.95,
        "average_response_time": 1.2
      }
    }
  ],
  "message": "Agents retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Agents retrieved successfully
- 401: Invalid token (if accessing private agents)

---

### 2. Get Main Agents Only
```http
GET /agents/main
```

**Description**: Get list of main agents only (excluding child agents)

**Authentication**: Optional

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Customer Support Agent",
      "description": "Handles customer inquiries and support",
      "agent_type": "main",
      "is_active": true,
      "user_id": 1,
      "child_agents_count": 3,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Main agents retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

---

### 3. Get Child Agents Only
```http
GET /agents/child
```

**Description**: Get list of child agents only

**Authentication**: Required

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Email Handler",
      "description": "Specialized in email responses",
      "agent_type": "child",
      "parent_agent_id": 1,
      "is_active": true,
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Child agents retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

---

### 4. Get Specific Agent
```http
GET /agents/{agent_id}
```

**Description**: Get detailed information about a specific agent

**Authentication**: Required (if private agent)

**Path Parameters**:
- `agent_id` (integer): ID of the agent to retrieve

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Support Agent",
    "description": "Handles customer inquiries and support",
    "agent_type": "main",
    "is_active": true,
    "user_id": 1,
    "configuration": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "max_tokens": 1000,
      "system_prompt": "You are a helpful customer support assistant."
    },
    "statistics": {
      "total_conversations": 25,
      "total_messages": 150,
      "success_rate": 0.95,
      "average_response_time": 1.2,
      "last_used": "2024-12-22T09:30:00Z"
    },
    "child_agents": [
      {
        "id": 5,
        "name": "Email Handler",
        "is_active": true
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Agent retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Agent retrieved successfully
- 404: Agent not found
- 401: Authentication required
- 403: Access denied

---

### 5. Create New Agent
```http
POST /agents
```

**Description**: Create a new main agent

**Authentication**: Required

**Request Body**:
```json
{
  "name": "New Support Agent",
  "description": "Handles technical support queries",
  "agent_type": "main",
  "configuration": {
    "model": "gpt-4",
    "temperature": 0.8,
    "max_tokens": 1500,
    "system_prompt": "You are a technical support specialist."
  },
  "is_active": true
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "New Support Agent",
    "description": "Handles technical support queries",
    "agent_type": "main",
    "is_active": true,
    "user_id": 1,
    "configuration": {
      "model": "gpt-4",
      "temperature": 0.8,
      "max_tokens": 1500,
      "system_prompt": "You are a technical support specialist."
    },
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Agent created successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: Agent created successfully
- 400: Invalid request data
- 401: Authentication required
- 422: Validation error

---

### 6. Create Child Agent
```http
POST /agents/child
```

**Description**: Create a new child agent under a parent agent

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Chat Handler",
  "description": "Specialized in chat conversations",
  "parent_agent_id": 1,
  "configuration": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.6,
    "max_tokens": 800,
    "system_prompt": "You are a chat support specialist."
  },
  "is_active": true
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "Chat Handler",
    "description": "Specialized in chat conversations",
    "agent_type": "child",
    "parent_agent_id": 1,
    "is_active": true,
    "user_id": 1,
    "configuration": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.6,
      "max_tokens": 800,
      "system_prompt": "You are a chat support specialist."
    },
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Child agent created successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: Child agent created successfully
- 400: Invalid request data
- 404: Parent agent not found
- 401: Authentication required

---

### 7. Update Agent
```http
PUT /agents/{agent_id}
```

**Description**: Update an existing agent

**Authentication**: Required (must be agent owner or admin)

**Path Parameters**:
- `agent_id` (integer): ID of the agent to update

**Request Body**:
```json
{
  "name": "Updated Agent Name",
  "description": "Updated description",
  "configuration": {
    "temperature": 0.9,
    "max_tokens": 2000
  },
  "is_active": false
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Agent Name",
    "description": "Updated description",
    "agent_type": "main",
    "is_active": false,
    "user_id": 1,
    "configuration": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.9,
      "max_tokens": 2000,
      "system_prompt": "You are a helpful customer support assistant."
    },
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Agent updated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Agent updated successfully
- 400: Invalid request data
- 404: Agent not found
- 401: Authentication required
- 403: Permission denied

---

### 8. Delete Agent
```http
DELETE /agents/{agent_id}
```

**Description**: Delete an agent (soft delete - marks as inactive)

**Authentication**: Required (must be agent owner or admin)

**Path Parameters**:
- `agent_id` (integer): ID of the agent to delete

**Response (Success)**:
```json
{
  "success": true,
  "message": "Agent deleted successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 204: Agent deleted successfully
- 404: Agent not found
- 401: Authentication required
- 403: Permission denied

---

### 9. Test Agent
```http
POST /agents/{agent_id}/test
```

**Description**: Test agent functionality with a sample message

**Authentication**: Required

**Path Parameters**:
- `agent_id` (integer): ID of the agent to test

**Request Body**:
```json
{
  "test_message": "Hello, can you help me with my account?",
  "test_parameters": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "test_message": "Hello, can you help me with my account?",
    "agent_response": "Hello! I'd be happy to help you with your account. Could you please provide more details about what specific assistance you need?",
    "response_time": 1.23,
    "tokens_used": 45,
    "model_used": "gpt-3.5-turbo",
    "test_timestamp": "2024-12-22T10:00:00Z"
  },
  "message": "Agent test completed successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Test completed successfully
- 400: Invalid test parameters
- 404: Agent not found
- 401: Authentication required
- 500: Test execution failed

---

### 10. Get Agent Children
```http
GET /agents/{agent_id}/children
```

**Description**: Get all child agents of a specific parent agent

**Authentication**: Required

**Path Parameters**:
- `agent_id` (integer): ID of the parent agent

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Email Handler",
      "description": "Specialized in email responses",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 6,
      "name": "Chat Handler",
      "description": "Specialized in chat conversations",
      "is_active": true,
      "created_at": "2024-01-02T00:00:00Z"
    }
  ],
  "message": "Child agents retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Child agents retrieved successfully
- 404: Parent agent not found
- 401: Authentication required

---

### 11. Get Agent Statistics Overview
```http
GET /agents/statistics/overview
```

**Description**: Get overall statistics for all agents (admin only)

**Authentication**: Required (Admin Role)

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "total_agents": 15,
    "active_agents": 12,
    "inactive_agents": 3,
    "main_agents": 8,
    "child_agents": 7,
    "total_conversations": 450,
    "total_messages": 2750,
    "average_success_rate": 0.94,
    "average_response_time": 1.35,
    "most_used_agents": [
      {
        "id": 1,
        "name": "Customer Support Agent",
        "usage_count": 125
      }
    ],
    "performance_metrics": {
      "daily_usage": 85,
      "weekly_usage": 420,
      "monthly_usage": 1680
    }
  },
  "message": "Agent statistics retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Statistics retrieved successfully
- 401: Authentication required
- 403: Admin role required

---

## ERROR HANDLING

### Common Error Codes
- AGENT_NOT_FOUND: Agent with specified ID not found
- AGENT_ACCESS_DENIED: User doesn't have permission to access agent
- AGENT_CREATION_FAILED: Failed to create agent
- AGENT_UPDATE_FAILED: Failed to update agent
- AGENT_DELETE_FAILED: Failed to delete agent
- AGENT_TEST_FAILED: Agent test execution failed
- PARENT_AGENT_NOT_FOUND: Parent agent not found for child agent creation

---

## TESTING EXAMPLES

### Using curl
```bash
# Get all agents
curl -X GET http://localhost:8000/agents

# Get specific agent
curl -X GET http://localhost:8000/agents/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create new agent
curl -X POST http://localhost:8000/agents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "description": "Test description",
    "agent_type": "main"
  }'

# Test agent
curl -X POST http://localhost:8000/agents/1/test \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"test_message": "Hello, test message"}'
```

---

## MODIFICATION GUIDELINES

### Before Modifying Agents API:
1. Read This Documentation: Understand current structure completely
2. Check Agent Dependencies: Identify conversations and relationships
3. Plan Changes: Ensure data consistency maintained
4. Test Thoroughly: Verify all agent operations work

### After Modifying Agents API:
1. Update This File: Add/modify endpoint documentation
2. Update Examples: Ensure all code examples work
3. Test Integration: Verify frontend integration works
4. Update Main API Docs: Update API_COMPLETE_DOCUMENTATION.md

---

⚠️ CRITICAL REMINDER: UPDATE THIS DOCUMENTATION WITH EVERY CHANGE!
⚠️ ALL CODE MUST BE IN ENGLISH ONLY!

Last Updated: 2024-12-22
Agents API Version: 2.0.0
