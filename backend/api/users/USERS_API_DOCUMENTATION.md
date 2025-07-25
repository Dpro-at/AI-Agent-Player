# Users API Documentation

## CRITICAL UPDATE REQUIREMENT
⚠️ MANDATORY: When modifying ANY users endpoint, you MUST update this file immediately!

---

## USERS API OVERVIEW

### Module Information
- Location: backend/api/users/endpoints.py
- Service: backend/services/user_service.py
- Models: backend/models/shared.py (User models)
- Prefix: /users
- Tags: ["Users"]

### Features
- User Profile Management: View and update user information
- User Settings: Manage preferences and configuration
- Admin Operations: User management for administrators
- User Statistics: Activity and usage analytics

---

## USER ENDPOINTS

### 1. Get Current User Profile
```http
GET /users/profile
```

**Description**: Get the profile of the currently authenticated user

**Authentication**: Required

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "username": "john_doe",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z",
    "profile_info": {
      "last_login": "2024-12-22T09:00:00Z",
      "total_agents": 5,
      "total_conversations": 12,
      "account_type": "standard"
    }
  },
  "message": "User profile retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Profile retrieved successfully
- 401: Authentication required

---

### 2. Update User Profile
```http
PUT /users/profile
```

**Description**: Update the current user's profile information

**Authentication**: Required

**Request Body**:
```json
{
  "username": "john_doe_updated",
  "full_name": "John Doe Jr.",
  "email": "john.doe.jr@example.com"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john.doe.jr@example.com",
    "username": "john_doe_updated",
    "full_name": "John Doe Jr.",
    "role": "user",
    "is_active": true,
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Profile updated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Username already exists",
  "error_code": "USERNAME_ALREADY_EXISTS",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Profile updated successfully
- 400: Invalid request data
- 409: Username or email already exists
- 401: Authentication required

---

### 3. Get User Settings
```http
GET /users/settings
```

**Description**: Get user preferences and settings

**Authentication**: Required

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "browser": true,
      "chat": true
    },
    "privacy": {
      "profile_visibility": "private",
      "activity_tracking": true
    },
    "ai_preferences": {
      "default_model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "max_tokens": 1000,
      "auto_response": false
    },
    "dashboard": {
      "layout": "default",
      "sidebar_collapsed": false,
      "auto_save": true
    },
    "advanced": {
      "keyboard_shortcuts": true,
      "chat_sound": true,
      "agent_suggestions": true,
      "debug_mode": false
    }
  },
  "message": "User settings retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Settings retrieved successfully
- 401: Authentication required

---

### 4. Update User Settings
```http
PUT /users/settings
```

**Description**: Update user preferences and settings

**Authentication**: Required

**Request Body**:
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": {
    "email": false,
    "browser": true,
    "chat": true
  },
  "ai_preferences": {
    "default_model": "gpt-4",
    "temperature": 0.8,
    "max_tokens": 1500
  },
  "dashboard": {
    "layout": "compact",
    "sidebar_collapsed": true
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": false,
      "browser": true,
      "chat": true
    },
    "ai_preferences": {
      "default_model": "gpt-4",
      "temperature": 0.8,
      "max_tokens": 1500,
      "auto_response": false
    },
    "dashboard": {
      "layout": "compact",
      "sidebar_collapsed": true,
      "auto_save": true
    },
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "Settings updated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Settings updated successfully
- 400: Invalid settings data
- 401: Authentication required

---

### 5. Get All Users (Admin Only)
```http
GET /users/admin/all
```

**Description**: Get list of all users in the system (admin access required)

**Authentication**: Required (Admin Role)

**Query Parameters**:
- `limit` (integer): Number of users to return (default: 50)
- `offset` (integer): Number of users to skip (default: 0)
- `role` (string): Filter by user role ('admin', 'user')
- `is_active` (boolean): Filter by active status
- `search` (string): Search by username, email, or full name

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin",
      "full_name": "System Administrator",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-12-22T09:00:00Z",
      "stats": {
        "total_agents": 3,
        "total_conversations": 25,
        "total_messages": 150
      }
    },
    {
      "id": 2,
      "email": "john.doe@example.com",
      "username": "john_doe",
      "full_name": "John Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-02T00:00:00Z",
      "updated_at": "2024-12-22T10:00:00Z",
      "last_login": "2024-12-22T08:30:00Z",
      "stats": {
        "total_agents": 5,
        "total_conversations": 12,
        "total_messages": 89
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "has_next": false,
    "has_prev": false
  },
  "message": "Users retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Users retrieved successfully
- 401: Authentication required
- 403: Admin role required

---

### 6. Get User Statistics (Admin Only)
```http
GET /users/admin/statistics
```

**Description**: Get comprehensive user statistics (admin access required)

**Authentication**: Required (Admin Role)

**Query Parameters**:
- `period` (string): Time period ('day', 'week', 'month', default: 'week')

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 25,
      "active_users": 22,
      "inactive_users": 3,
      "admin_users": 2,
      "regular_users": 23,
      "new_users_this_week": 3,
      "new_users_this_month": 8
    },
    "activity": {
      "daily_active_users": 15,
      "weekly_active_users": 20,
      "monthly_active_users": 24,
      "average_session_duration": 45.5,
      "total_sessions_today": 35
    },
    "usage": {
      "total_agents_created": 125,
      "total_conversations": 450,
      "total_messages": 2750,
      "average_agents_per_user": 5.2,
      "average_conversations_per_user": 18.5
    },
    "growth": {
      "user_growth_rate": 0.12,
      "retention_rate": 0.85,
      "churn_rate": 0.05
    },
    "top_users": [
      {
        "id": 5,
        "username": "power_user",
        "full_name": "Power User",
        "total_agents": 15,
        "total_conversations": 45,
        "total_messages": 325
      }
    ],
    "registration_trends": {
      "daily": [2, 1, 3, 0, 2, 1, 1],
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  },
  "message": "User statistics retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Statistics retrieved successfully
- 401: Authentication required
- 403: Admin role required

---

### 7. Update User by Admin
```http
PUT /users/admin/{user_id}
```

**Description**: Update any user's information (admin access required)

**Authentication**: Required (Admin Role)

**Path Parameters**:
- `user_id` (integer): ID of the user to update

**Request Body**:
```json
{
  "username": "updated_username",
  "full_name": "Updated Full Name",
  "email": "updated@example.com",
  "role": "user",
  "is_active": false
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "email": "updated@example.com",
    "username": "updated_username",
    "full_name": "Updated Full Name",
    "role": "user",
    "is_active": false,
    "updated_at": "2024-12-22T10:00:00Z"
  },
  "message": "User updated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: User updated successfully
- 400: Invalid request data
- 404: User not found
- 409: Username or email already exists
- 401: Authentication required
- 403: Admin role required

---

### 8. Deactivate User (Admin Only)
```http
POST /users/admin/{user_id}/deactivate
```

**Description**: Deactivate a user account (admin access required)

**Authentication**: Required (Admin Role)

**Path Parameters**:
- `user_id` (integer): ID of the user to deactivate

**Response (Success)**:
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: User deactivated successfully
- 404: User not found
- 401: Authentication required
- 403: Admin role required

---

### 9. Activate User (Admin Only)
```http
POST /users/admin/{user_id}/activate
```

**Description**: Activate a user account (admin access required)

**Authentication**: Required (Admin Role)

**Path Parameters**:
- `user_id` (integer): ID of the user to activate

**Response (Success)**:
```json
{
  "success": true,
  "message": "User activated successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: User activated successfully
- 404: User not found
- 401: Authentication required
- 403: Admin role required

---

### 10. Get User Activity Log
```http
GET /users/activity
```

**Description**: Get activity log for the current user

**Authentication**: Required

**Query Parameters**:
- `limit` (integer): Number of activities to return (default: 50)
- `offset` (integer): Number of activities to skip (default: 0)
- `action_type` (string): Filter by action type

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "action": "agent_created",
      "details": "Created agent: Customer Support Bot",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-12-22T09:45:00Z"
    },
    {
      "id": 122,
      "action": "conversation_started",
      "details": "Started conversation with agent ID 5",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-12-22T08:30:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 50,
    "offset": 0,
    "has_next": true,
    "has_prev": false
  },
  "message": "Activity log retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Activity log retrieved successfully
- 401: Authentication required

---

### 11. Change Password
```http
PUT /users/password
```

**Description**: Change the current user's password

**Authentication**: Required

**Request Body**:
```json
{
  "current_password": "old_password123",
  "new_password": "new_secure_password456",
  "confirm_password": "new_secure_password456"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "error_code": "INVALID_CURRENT_PASSWORD",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Password changed successfully
- 400: Invalid request data
- 401: Authentication required or current password incorrect

---

## ERROR HANDLING

### Common Error Codes
- USER_NOT_FOUND: User with specified ID not found
- USERNAME_ALREADY_EXISTS: Username is already taken
- EMAIL_ALREADY_EXISTS: Email address is already registered
- INVALID_CURRENT_PASSWORD: Current password is incorrect
- SETTINGS_UPDATE_FAILED: Failed to update user settings
- PERMISSION_DENIED: User doesn't have required permissions
- ADMIN_REQUIRED: Admin role required for operation

### Password Requirements
- Minimum length: 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Special characters recommended

---

## TESTING EXAMPLES

### Using curl
```bash
# Get current user profile
curl -X GET http://localhost:8000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update profile
curl -X PUT http://localhost:8000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username",
    "full_name": "New Full Name"
  }'

# Get settings
curl -X GET http://localhost:8000/users/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update settings
curl -X PUT http://localhost:8000/users/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "en"
  }'

# Admin: Get all users
curl -X GET http://localhost:8000/users/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# Change password
curl -X PUT http://localhost:8000/users/password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "old_password",
    "new_password": "new_password",
    "confirm_password": "new_password"
  }'
```

---

## MODIFICATION GUIDELINES

### Before Modifying Users API:
1. Read This Documentation: Understand current structure completely
2. Check User Dependencies: Identify relationships with agents, conversations
3. Plan Changes: Ensure data consistency and security
4. Test Thoroughly: Verify all user operations work correctly

### After Modifying Users API:
1. Update This File: Add/modify endpoint documentation
2. Update Examples: Ensure all code examples work
3. Test Integration: Verify frontend user interface works
4. Update Main API Docs: Update API_COMPLETE_DOCUMENTATION.md

### Security Considerations
- Always validate user permissions before operations
- Hash passwords using bcrypt with appropriate salt rounds
- Log all administrative actions for audit trails
- Implement rate limiting for sensitive operations
- Sanitize all user input to prevent injection attacks

---

⚠️ CRITICAL REMINDER: UPDATE THIS DOCUMENTATION WITH EVERY CHANGE!
⚠️ ALL CODE MUST BE IN ENGLISH ONLY!

Last Updated: 2024-12-22
Users API Version: 2.0.0
