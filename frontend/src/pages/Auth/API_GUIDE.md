# 🔐 AUTH API - Complete Guide

## 📋 Overview
Authentication API endpoints with JWT tokens, email verification, and session management.

**Base URL:** `/auth`  
**Total Endpoints:** 8 endpoints ✅  
**Authentication:** JWT Bearer Tokens

---

## 🗄️ Database Tables

### users table (15 columns)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

### user_sessions table (10 columns)
```sql
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(512) UNIQUE NOT NULL,
    refresh_token VARCHAR(512) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 API Endpoints

### 1. Login - POST /auth/login
```javascript
const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "user@example.com",
        password: "password123"
    })
});
```

### 2. Register - POST /auth/register/admin
```javascript
const response = await fetch('/auth/register/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "admin@example.com",
        username: "admin",
        full_name: "Admin User",
        password: "securepass123"
    })
});
```

### 3. Get Current User - GET /auth/me
```javascript
const response = await fetch('/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### 4. Logout - POST /auth/logout
```javascript
const response = await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### 5. Refresh Token - POST /auth/refresh
```javascript
const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        refresh_token: "refresh_token_here"
    })
});
```

### 6. System Status - GET /auth/system/status
```javascript
const response = await fetch('/auth/system/status');
```

### 7. Get Users - GET /auth/users
```javascript
const response = await fetch('/auth/users', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### 8. Get Sessions - GET /auth/sessions
```javascript
const response = await fetch('/auth/sessions', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🛠️ React Service

```typescript
export class AuthService {
    private baseUrl = '/auth';
    
    async login(email: string, password: string) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    }
    
    async register(userData: any) {
        const response = await fetch(`${this.baseUrl}/register/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }
    
    async getCurrentUser() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${this.baseUrl}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
    
    async logout() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
        
        return await response.json();
    }
}
```

---

## 📊 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/register/admin` | Admin registration | ❌ |
| GET | `/auth/me` | Current user | ✅ |
| POST | `/auth/logout` | User logout | ✅ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| GET | `/auth/system/status` | System status | ❌ |
| GET | `/auth/users` | Get users | ✅ |
| GET | `/auth/sessions` | Get sessions | ✅ |

**Status:** ✅ Complete
