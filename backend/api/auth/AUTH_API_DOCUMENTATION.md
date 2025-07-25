# Authentication API Documentation

## CRITICAL UPDATE REQUIREMENT
⚠️ MANDATORY: When modifying ANY authentication endpoint, you MUST update this file immediately!

---

## AUTHENTICATION API OVERVIEW

### Module Information
- Location: backend/api/auth/endpoints.py
- Service: backend/services/auth_service.py
- Models: backend/models/shared.py
- Prefix: /auth
- Tags: ["Authentication"]

### Security Features
- JWT Tokens: Secure token-based authentication
- Password Hashing: bcrypt encryption
- Role-Based Access: Admin and user roles
- Session Management: Token expiration handling

---

## AUTHENTICATION ENDPOINTS

### 1. System Status Check
```http
GET /auth/system/status
```

**Description**: Check if system is initialized and admin exists

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "data": {
    "admin_exists": true,
    "system_initialized": true,
    "requires_setup": false,
    "message": "System ready for operation"
  },
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Use Cases**:
- Frontend initialization check
- Determine if admin setup is needed
- System health verification

---

### 2. User Login
```http
POST /auth/login
```

**Description**: Authenticate user and return JWT token

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe",
      "full_name": "John Doe",
      "role": "user",
      "is_active": true
    }
  },
  "message": "Login successful",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error_code": "AUTH_INVALID_CREDENTIALS",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Login successful
- 400: Invalid request data
- 401: Invalid credentials
- 403: Account deactivated

---

### 3. Admin Registration
```http
POST /auth/register/admin
```

**Description**: Register first admin user (only when no admin exists)

**Authentication**: Not required (only for initial setup)

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "secure_admin_password",
  "username": "admin",
  "full_name": "System Administrator"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin",
      "full_name": "System Administrator",
      "role": "admin",
      "is_active": true
    }
  },
  "message": "Admin account created successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 201: Admin created successfully
- 400: Invalid request data
- 409: Admin already exists

---

### 4. Get Current User
```http
GET /auth/me
```

**Description**: Get current authenticated user information

**Authentication**: Required (Bearer Token)

**Headers**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-12-22T10:00:00Z"
  },
  "message": "User information retrieved",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: User data retrieved
- 401: Invalid or missing token
- 403: Token expired

---

### 5. User Logout
```http
POST /auth/logout
```

**Description**: Logout user and invalidate token

**Authentication**: Required (Bearer Token)

**Response (Success)**:
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Logout successful
- 401: Invalid token

---

### 6. Get All Users (Admin Only)
```http
GET /auth/users
```

**Description**: Get list of all users (admin access required)

**Authentication**: Required (Bearer Token + Admin Role)

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
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "username": "john_doe",
      "full_name": "John Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-02T00:00:00Z"
    }
  ],
  "message": "Users retrieved successfully",
  "timestamp": "2024-12-22T10:00:00Z"
}
```

**Status Codes**:
- 200: Users list retrieved
- 401: Invalid token
- 403: Admin role required

---

## AUTHENTICATION FLOW

### Frontend Login Process
```javascript
// Step 1: Login request
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const authData = await loginResponse.json();

// Step 2: Store token
localStorage.setItem('access_token', authData.data.access_token);
localStorage.setItem('user', JSON.stringify(authData.data.user));

// Step 3: Use token for authenticated requests
const profileResponse = await fetch('/auth/me', {
  headers: {
    'Authorization': `Bearer ${authData.data.access_token}`
  }
});
```

---

## ERROR HANDLING

### Common Error Codes
- AUTH_INVALID_CREDENTIALS: Invalid email or password
- AUTH_TOKEN_INVALID: Invalid or malformed JWT token
- AUTH_TOKEN_EXPIRED: JWT token has expired
- AUTH_ADMIN_REQUIRED: Admin role required for operation
- AUTH_ADMIN_EXISTS: Admin already exists in system
- AUTH_USER_INACTIVE: User account is deactivated

---

## TESTING EXAMPLES

### Using curl
```bash
# System status
curl -X GET http://localhost:8000/auth/system/status

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## MODIFICATION GUIDELINES

### Before Modifying Authentication API:
1. Read This Documentation: Understand current structure completely
2. Check Dependencies: Identify what depends on the endpoint
3. Plan Changes: Ensure backward compatibility
4. Test Thoroughly: Verify all authentication flows work

### After Modifying Authentication API:
1. Update This File: Add/modify endpoint documentation
2. Update Examples: Ensure all code examples work
3. Test Integration: Verify frontend integration works
4. Update Main API Docs: Update API_COMPLETE_DOCUMENTATION.md

---

⚠️ CRITICAL REMINDER: UPDATE THIS DOCUMENTATION WITH EVERY CHANGE!
⚠️ ALL CODE MUST BE IN ENGLISH ONLY!

Last Updated: 2024-12-22
Authentication API Version: 2.0.0
