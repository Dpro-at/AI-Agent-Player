# 🛡️ ADMIN API - Complete Guide

## 📋 Overview
Complete Admin API for user management, system monitoring, and administrative tasks.

**Base URL:** `/admin`  
**Total Endpoints:** 12 endpoints ✅  
**Authentication:** JWT Bearer Token (Admin role required)  
**Role Required:** admin, super_admin

---

## 🗄️ Database Structure

### admin_actions table
```sql
CREATE TABLE admin_actions (
    id INTEGER PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- 'user_create', 'user_update', 'user_delete', 'system_config'
    target_type VARCHAR(50) NOT NULL, -- 'user', 'agent', 'system', 'license'
    target_id INTEGER,
    action_data TEXT, -- JSON data
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
```

### system_settings table
```sql
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) NOT NULL, -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by non-admin users
    updated_by INTEGER,
    updated_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### system_logs table
```sql
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY,
    log_level VARCHAR(20) NOT NULL, -- 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'
    log_category VARCHAR(50) NOT NULL, -- 'auth', 'api', 'database', 'system'
    message TEXT NOT NULL,
    details TEXT, -- JSON additional data
    user_id INTEGER,
    ip_address VARCHAR(45),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Complete API Endpoints

### 1. Get All Users - GET /admin/users
```javascript
// GET /admin/users?page=1&limit=20&search=john&role=user&status=active
const response = await fetch('/admin/users?' + new URLSearchParams({
    page: '1',
    limit: '20',
    search: 'john',
    role: 'user',
    status: 'active'
}), {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "data": {
        "users": [
            {
                "id": 1,
                "email": "user@example.com",
                "username": "johndoe",
                "full_name": "John Doe",
                "role": "user",
                "is_active": true,
                "is_verified": true,
                "last_login": "2024-06-29T16:00:00Z",
                "created_at": "2024-01-15T10:00:00Z",
                "agents_count": 5,
                "license_type": "premium"
            }
        ],
        "pagination": {
            "total": 150,
            "page": 1,
            "pages": 8,
            "limit": 20,
            "has_next": true,
            "has_prev": false
        }
    }
}
```

### 2. Get User Details - GET /admin/users/{id}
```javascript
// GET /admin/users/123
const response = await fetch('/admin/users/123', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "user": {
            "id": 123,
            "email": "user@example.com",
            "username": "johndoe",
            "full_name": "John Doe",
            "role": "user",
            "is_active": true,
            "is_verified": true,
            "last_login": "2024-06-29T16:00:00Z",
            "created_at": "2024-01-15T10:00:00Z",
            "profile": {
                "bio": "AI enthusiast",
                "avatar_url": "https://example.com/avatar.jpg",
                "location": "New York",
                "website": "https://johndoe.com"
            },
            "statistics": {
                "agents_count": 5,
                "conversations_count": 45,
                "tasks_completed": 23,
                "training_sessions": 8
            },
            "license": {
                "type": "premium",
                "expires_at": "2025-06-29T23:59:59Z",
                "features": ["unlimited_agents", "training_lab", "premium_support"]
            },
            "sessions": [
                {
                    "id": "sess_123",
                    "ip_address": "192.168.1.1",
                    "user_agent": "Chrome/126.0.0.0",
                    "last_activity": "2024-06-29T18:00:00Z",
                    "is_current": true
                }
            ]
        }
    }
}
```

### 3. Create User - POST /admin/users
```javascript
// POST /admin/users
const response = await fetch('/admin/users', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: "newuser@example.com",
        username: "newuser123",
        full_name: "New User",
        password: "SecurePass123!",
        role: "user",
        is_verified: true,
        send_welcome_email: true
    })
});

// Response
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "user": {
            "id": 124,
            "email": "newuser@example.com",
            "username": "newuser123",
            "full_name": "New User",
            "role": "user",
            "is_active": true,
            "is_verified": true,
            "created_at": "2024-06-29T19:00:00Z"
        },
        "actions": {
            "welcome_email_sent": true,
            "default_license_assigned": true
        }
    }
}
```

### 4. Update User - PUT /admin/users/{id}
```javascript
// PUT /admin/users/123
const response = await fetch('/admin/users/123', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        full_name: "John Doe Updated",
        role: "moderator",
        is_active: true,
        license_type: "premium"
    })
});

// Response
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "user": {
            "id": 123,
            "email": "user@example.com",
            "username": "johndoe",
            "full_name": "John Doe Updated",
            "role": "moderator",
            "is_active": true,
            "updated_at": "2024-06-29T19:30:00Z"
        },
        "changes": [
            "full_name: John Doe → John Doe Updated",
            "role: user → moderator"
        ]
    }
}
```

### 5. Delete/Deactivate User - DELETE /admin/users/{id}
```javascript
// DELETE /admin/users/123?permanent=false
const response = await fetch('/admin/users/123?permanent=false', {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "message": "User deactivated successfully",
    "data": {
        "user_id": 123,
        "action": "deactivated",
        "deactivated_at": "2024-06-29T20:00:00Z",
        "affected_data": {
            "agents_archived": 5,
            "conversations_archived": 45,
            "sessions_terminated": 2
        }
    }
}
```

### 6. System Statistics - GET /admin/statistics
```javascript
// GET /admin/statistics
const response = await fetch('/admin/statistics', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "users": {
            "total": 1250,
            "active": 1180,
            "verified": 1100,
            "new_today": 15,
            "new_this_week": 89,
            "by_role": {
                "user": 1200,
                "moderator": 45,
                "admin": 5
            }
        },
        "agents": {
            "total": 3500,
            "active": 3200,
            "created_today": 45,
            "most_popular_type": "conversational"
        },
        "system": {
            "uptime": "15 days, 8 hours",
            "cpu_usage": 45.2,
            "memory_usage": 67.8,
            "disk_usage": 34.5,
            "database_size": "2.3 GB",
            "active_sessions": 234
        },
        "performance": {
            "avg_response_time": 120,
            "requests_per_minute": 450,
            "error_rate": 0.2,
            "success_rate": 99.8
        }
    }
}
```

### 7. System Settings - GET /admin/settings
```javascript
// GET /admin/settings?category=general
const response = await fetch('/admin/settings?category=general', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "settings": [
            {
                "key": "site_name",
                "value": "DPRO AI Agent",
                "type": "string",
                "description": "Site name displayed in header",
                "is_public": true,
                "category": "general"
            },
            {
                "key": "max_agents_per_user",
                "value": "20",
                "type": "number",
                "description": "Maximum agents per user",
                "is_public": false,
                "category": "limits"
            }
        ]
    }
}
```

### 8. Update Setting - PUT /admin/settings/{key}
```javascript
// PUT /admin/settings/max_agents_per_user
const response = await fetch('/admin/settings/max_agents_per_user', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        value: "25",
        description: "Increased limit for premium users"
    })
});

// Response
{
    "success": true,
    "message": "Setting updated successfully",
    "data": {
        "setting": {
            "key": "max_agents_per_user",
            "old_value": "20",
            "new_value": "25",
            "updated_at": "2024-06-29T21:00:00Z"
        }
    }
}
```

### 9. System Logs - GET /admin/logs
```javascript
// GET /admin/logs?level=ERROR&category=auth&limit=50
const response = await fetch('/admin/logs?' + new URLSearchParams({
    level: 'ERROR',
    category: 'auth',
    limit: '50',
    from: '2024-06-29T00:00:00Z',
    to: '2024-06-29T23:59:59Z'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "logs": [
            {
                "id": 1001,
                "level": "ERROR",
                "category": "auth",
                "message": "Failed login attempt",
                "details": {
                    "email": "hacker@example.com",
                    "attempts": 5,
                    "ip_address": "192.168.1.100"
                },
                "ip_address": "192.168.1.100",
                "created_at": "2024-06-29T15:30:00Z"
            }
        ],
        "summary": {
            "total_logs": 245,
            "by_level": {
                "ERROR": 15,
                "WARNING": 45,
                "INFO": 180,
                "DEBUG": 5
            }
        }
    }
}
```

### 10. Admin Actions History - GET /admin/actions
```javascript
// GET /admin/actions?admin_id=1&action_type=user_update
const response = await fetch('/admin/actions?' + new URLSearchParams({
    admin_id: '1',
    action_type: 'user_update',
    limit: '20'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "actions": [
            {
                "id": 501,
                "admin": {
                    "id": 1,
                    "username": "admin",
                    "full_name": "System Admin"
                },
                "action_type": "user_update",
                "target_type": "user",
                "target_id": 123,
                "action_data": {
                    "changes": ["role: user → moderator"],
                    "reason": "Promotion to moderator"
                },
                "ip_address": "192.168.1.1",
                "created_at": "2024-06-29T19:30:00Z"
            }
        ]
    }
}
```

### 11. Bulk User Actions - POST /admin/users/bulk
```javascript
// POST /admin/users/bulk
const response = await fetch('/admin/users/bulk', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        action: "update_role",
        user_ids: [101, 102, 103, 104],
        data: {
            role: "premium_user"
        },
        reason: "Bulk promotion to premium"
    })
});

// Response
{
    "success": true,
    "message": "Bulk action completed",
    "data": {
        "action": "update_role",
        "affected_users": 4,
        "successful": 4,
        "failed": 0,
        "results": [
            {
                "user_id": 101,
                "status": "success",
                "changes": ["role: user → premium_user"]
            }
        ]
    }
}
```

### 12. Export Users Data - GET /admin/export/users
```javascript
// GET /admin/export/users?format=csv&filters=active
const response = await fetch('/admin/export/users?' + new URLSearchParams({
    format: 'csv',
    filters: 'active',
    include: 'profile,statistics'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response (for JSON format)
{
    "success": true,
    "data": {
        "export": {
            "format": "csv",
            "file_url": "https://example.com/exports/users_2024-06-29.csv",
            "expires_at": "2024-06-30T21:00:00Z",
            "total_records": 1180,
            "file_size": "2.5 MB"
        }
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class AdminService {
    private baseUrl = '/admin';
    
    // Get all users with filters
    async getUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
    } = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) queryParams.append(key, value.toString());
        });
        
        const response = await fetch(`${this.baseUrl}/users?${queryParams}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get user details
    async getUserDetails(userId: number) {
        const response = await fetch(`${this.baseUrl}/users/${userId}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Create user
    async createUser(userData: {
        email: string;
        username: string;
        full_name: string;
        password: string;
        role: string;
        is_verified?: boolean;
        send_welcome_email?: boolean;
    }) {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData)
        });
        return await response.json();
    }
    
    // Update user
    async updateUser(userId: number, updates: {
        full_name?: string;
        role?: string;
        is_active?: boolean;
        license_type?: string;
    }) {
        const response = await fetch(`${this.baseUrl}/users/${userId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(updates)
        });
        return await response.json();
    }
    
    // Delete/deactivate user
    async deleteUser(userId: number, permanent = false) {
        const response = await fetch(`${this.baseUrl}/users/${userId}?permanent=${permanent}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get system statistics
    async getSystemStatistics() {
        const response = await fetch(`${this.baseUrl}/statistics`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get system settings
    async getSettings(category?: string) {
        const url = category ? 
            `${this.baseUrl}/settings?category=${category}` : 
            `${this.baseUrl}/settings`;
            
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Update setting
    async updateSetting(key: string, value: string, description?: string) {
        const response = await fetch(`${this.baseUrl}/settings/${key}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ value, description })
        });
        return await response.json();
    }
    
    // Get system logs
    async getLogs(filters: {
        level?: string;
        category?: string;
        limit?: number;
        from?: string;
        to?: string;
    } = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) queryParams.append(key, value.toString());
        });
        
        const response = await fetch(`${this.baseUrl}/logs?${queryParams}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get admin actions history
    async getAdminActions(filters: {
        admin_id?: number;
        action_type?: string;
        limit?: number;
    } = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) queryParams.append(key, value.toString());
        });
        
        const response = await fetch(`${this.baseUrl}/actions?${queryParams}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Bulk user actions
    async bulkUserAction(action: string, userIds: number[], data: any, reason?: string) {
        const response = await fetch(`${this.baseUrl}/users/bulk`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                action,
                user_ids: userIds,
                data,
                reason
            })
        });
        return await response.json();
    }
    
    // Export users data
    async exportUsers(format: 'csv' | 'json' = 'csv', filters?: string, include?: string) {
        const queryParams = new URLSearchParams({ format });
        if (filters) queryParams.append('filters', filters);
        if (include) queryParams.append('include', include);
        
        const response = await fetch(`${this.baseUrl}/export/users?${queryParams}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Utility methods
    private getHeaders() {
        const token = localStorage.getItem('access_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    
    // Admin validation helpers
    isAdmin(): boolean {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return ['admin', 'super_admin'].includes(user.role);
    }
    
    formatUserRole(role: string): string {
        const roleMap = {
            'user': 'User',
            'premium_user': 'Premium User',
            'moderator': 'Moderator',
            'admin': 'Administrator',
            'super_admin': 'Super Admin'
        };
        return roleMap[role] || role;
    }
    
    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Types
interface AdminUser {
    id: number;
    email: string;
    username: string;
    full_name: string;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    last_login: string;
    created_at: string;
    agents_count?: number;
    license_type?: string;
}

interface SystemStatistics {
    users: {
        total: number;
        active: number;
        verified: number;
        new_today: number;
        new_this_week: number;
        by_role: Record<string, number>;
    };
    agents: {
        total: number;
        active: number;
        created_today: number;
        most_popular_type: string;
    };
    system: {
        uptime: string;
        cpu_usage: number;
        memory_usage: number;
        disk_usage: number;
        database_size: string;
        active_sessions: number;
    };
    performance: {
        avg_response_time: number;
        requests_per_minute: number;
        error_rate: number;
        success_rate: number;
    };
}
```

---

## 📊 Complete API Reference

| Method | Endpoint | Description | Admin Level |
|--------|----------|-------------|-------------|
| GET | `/admin/users` | Get all users with filters | Admin |
| GET | `/admin/users/{id}` | Get user details | Admin |
| POST | `/admin/users` | Create new user | Admin |
| PUT | `/admin/users/{id}` | Update user | Admin |
| DELETE | `/admin/users/{id}` | Delete/deactivate user | Super Admin |
| GET | `/admin/statistics` | System statistics | Admin |
| GET | `/admin/settings` | Get system settings | Admin |
| PUT | `/admin/settings/{key}` | Update setting | Super Admin |
| GET | `/admin/logs` | Get system logs | Admin |
| GET | `/admin/actions` | Admin actions history | Admin |
| POST | `/admin/users/bulk` | Bulk user actions | Admin |
| GET | `/admin/export/users` | Export users data | Admin |

---

## ⚡ Features Included

### User Management
- ✅ Complete CRUD operations for users
- ✅ Role-based access control
- ✅ Bulk user operations
- ✅ User statistics and activity tracking

### System Monitoring
- ✅ Real-time system statistics
- ✅ Performance metrics
- ✅ System logs with filtering
- ✅ Admin actions audit trail

### Configuration Management
- ✅ System settings management
- ✅ Dynamic configuration updates
- ✅ Settings categorization
- ✅ Public/private settings

### Data Export
- ✅ User data export (CSV/JSON)
- ✅ Filtered exports
- ✅ Secure download links
- ✅ File expiration

---

## ✨ Status: 100% Complete ✅

All Admin API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 3 tables integrated  
**API Endpoints:** 12 endpoints working  
**Admin Features:** Complete admin panel functionality  
**Status:** Production ready
