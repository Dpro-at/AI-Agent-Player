# 👤 PROFILE API - Complete Guide

## 📋 Overview
Complete guide for Profile API endpoints, database structure, and implementation examples.

**Base URL:** `http://localhost:8000/users`  
**Authentication:** JWT Bearer Token Required  
**Total Endpoints:** 9 endpoints ✅

---

## 🗄️ Database Structure

### Table: `user_profiles`
```sql
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    bio TEXT,
    company VARCHAR(200),
    job_title VARCHAR(150),
    website VARCHAR(255),
    location VARCHAR(200),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    social_links TEXT, -- JSON object with social media links
    is_public BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table: `user_preferences`
```sql
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'auto'
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(10) DEFAULT '24h', -- '12h', '24h'
    currency VARCHAR(10) DEFAULT 'USD',
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_browser BOOLEAN DEFAULT TRUE,
    notifications_marketing BOOLEAN DEFAULT FALSE,
    privacy_profile_public BOOLEAN DEFAULT FALSE,
    privacy_show_activity BOOLEAN DEFAULT TRUE,
    privacy_show_email BOOLEAN DEFAULT FALSE,
    security_login_alerts BOOLEAN DEFAULT TRUE,
    security_session_timeout INTEGER DEFAULT 3600, -- seconds
    ui_sidebar_collapsed BOOLEAN DEFAULT FALSE,
    ui_animations_enabled BOOLEAN DEFAULT TRUE,
    ai_suggestions_enabled BOOLEAN DEFAULT TRUE,
    ai_auto_complete BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table: `activity_logs`
```sql
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'agent', 'conversation', 'task', etc.
    resource_id INTEGER,
    details TEXT, -- JSON object with action details
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Complete API Endpoints

### 1. Get User Profile
```javascript
// GET /users/profile
const response = await fetch('/users/profile', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
        "user": {
            "id": 1,
            "email": "john.doe@example.com",
            "username": "johndoe",
            "role": "user",
            "is_active": true,
            "last_activity": "2024-06-29T15:30:00Z",
            "created_at": "2024-01-15T10:00:00Z"
        },
        "profile": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John Doe",
            "bio": "AI enthusiast and software developer",
            "company": "Tech Solutions Inc",
            "job_title": "Senior Developer",
            "website": "https://johndoe.dev",
            "location": "San Francisco, CA",
            "phone": "+1-555-0123",
            "timezone": "America/Los_Angeles",
            "language": "en",
            "avatar_url": "/uploads/avatars/user-1-avatar.jpg",
            "cover_image_url": "/uploads/covers/user-1-cover.jpg",
            "social_links": {
                "linkedin": "https://linkedin.com/in/johndoe",
                "twitter": "https://twitter.com/johndoe",
                "github": "https://github.com/johndoe"
            },
            "is_public": true,
            "email_verified": true,
            "phone_verified": false,
            "two_factor_enabled": true
        },
        "statistics": {
            "agents_created": 15,
            "conversations_count": 234,
            "tasks_completed": 67,
            "total_api_calls": 15420,
            "joined_days_ago": 165
        }
    }
}
```

### 2. Update Profile
```javascript
// PUT /users/profile
const response = await fetch('/users/profile', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        first_name: "John",
        last_name: "Doe",
        display_name: "John D.",
        bio: "AI enthusiast, software developer, and tech innovator",
        company: "Tech Solutions Inc",
        job_title: "Senior AI Developer",
        website: "https://johndoe.dev",
        location: "San Francisco, CA",
        phone: "+1-555-0123",
        timezone: "America/Los_Angeles",
        language: "en",
        social_links: {
            "linkedin": "https://linkedin.com/in/johndoe",
            "twitter": "https://twitter.com/johndoe",
            "github": "https://github.com/johndoe"
        },
        is_public: true
    })
});

// Response
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "profile": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "display_name": "John D.",
            "bio": "AI enthusiast, software developer, and tech innovator",
            "updated_at": "2024-06-29T16:30:00Z"
        }
    }
}
```

### 3. Get User Settings
```javascript
// GET /users/settings
const response = await fetch('/users/settings', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Settings retrieved successfully",
    "data": {
        "preferences": {
            "theme": "dark",
            "language": "en",
            "timezone": "America/Los_Angeles",
            "date_format": "MM/DD/YYYY",
            "time_format": "12h",
            "currency": "USD",
            "notifications": {
                "email": true,
                "browser": true,
                "marketing": false
            },
            "privacy": {
                "profile_public": true,
                "show_activity": true,
                "show_email": false
            },
            "security": {
                "login_alerts": true,
                "session_timeout": 3600,
                "two_factor_enabled": true
            },
            "ui": {
                "sidebar_collapsed": false,
                "animations_enabled": true
            },
            "ai": {
                "suggestions_enabled": true,
                "auto_complete": true
            }
        }
    }
}
```

### 4. Update Settings
```javascript
// PUT /users/settings
const response = await fetch('/users/settings', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        theme: "dark",
        language: "en",
        timezone: "America/Los_Angeles",
        notifications_email: true,
        notifications_browser: true,
        notifications_marketing: false,
        privacy_profile_public: true,
        privacy_show_activity: true,
        security_login_alerts: true,
        ui_animations_enabled: true,
        ai_suggestions_enabled: true
    })
});

// Response
{
    "success": true,
    "message": "Settings updated successfully",
    "data": {
        "preferences": {
            "theme": "dark",
            "language": "en",
            "timezone": "America/Los_Angeles",
            "updated_at": "2024-06-29T16:35:00Z"
        }
    }
}
```

### 5. Upload Avatar
```javascript
// POST /users/profile/avatar
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('/users/profile/avatar', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
    },
    body: formData
});

// Response
{
    "success": true,
    "message": "Avatar uploaded successfully",
    "data": {
        "avatar_url": "/uploads/avatars/user-1-avatar-new.jpg",
        "thumbnail_url": "/uploads/avatars/thumbs/user-1-avatar-thumb.jpg"
    }
}
```

### 6. Upload Cover Image
```javascript
// POST /users/profile/cover
const formData = new FormData();
formData.append('cover', fileInput.files[0]);

const response = await fetch('/users/profile/cover', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});

// Response
{
    "success": true,
    "message": "Cover image uploaded successfully",
    "data": {
        "cover_image_url": "/uploads/covers/user-1-cover-new.jpg",
        "thumbnail_url": "/uploads/covers/thumbs/user-1-cover-thumb.jpg"
    }
}
```

### 7. Get Activity History
```javascript
// GET /users/activity
const response = await fetch('/users/activity?limit=50&offset=0', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Activity history retrieved",
    "data": {
        "activities": [
            {
                "id": 1,
                "action": "agent_created",
                "resource_type": "agent",
                "resource_id": 15,
                "details": {
                    "agent_name": "Customer Service Bot",
                    "agent_type": "conversational"
                },
                "created_at": "2024-06-29T15:30:00Z"
            },
            {
                "id": 2,
                "action": "conversation_started",
                "resource_type": "conversation",
                "resource_id": 234,
                "details": {
                    "conversation_title": "Project Discussion",
                    "agent_name": "Assistant"
                },
                "created_at": "2024-06-29T14:15:00Z"
            },
            {
                "id": 3,
                "action": "task_completed",
                "resource_type": "task",
                "resource_id": 67,
                "details": {
                    "task_title": "API Documentation",
                    "completion_time": "2.5 hours"
                },
                "created_at": "2024-06-29T12:00:00Z"
            }
        ],
        "total": 156,
        "limit": 50,
        "offset": 0,
        "has_more": true
    }
}
```

### 8. Get User Statistics
```javascript
// GET /users/statistics
const response = await fetch('/users/statistics', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Statistics retrieved successfully",
    "data": {
        "overview": {
            "agents_created": 15,
            "conversations_count": 234,
            "tasks_completed": 67,
            "total_api_calls": 15420,
            "joined_days_ago": 165
        },
        "monthly_stats": {
            "agents_created_this_month": 3,
            "conversations_this_month": 45,
            "tasks_completed_this_month": 12,
            "api_calls_this_month": 2340
        },
        "activity_breakdown": {
            "most_used_features": [
                { "feature": "AI Chat", "usage_count": 234 },
                { "feature": "Task Management", "usage_count": 67 },
                { "feature": "Agent Builder", "usage_count": 15 }
            ],
            "peak_usage_hours": [14, 15, 16], // 2-4 PM
            "favorite_agent_types": [
                { "type": "conversational", "count": 8 },
                { "type": "analytical", "count": 4 },
                { "type": "creative", "count": 3 }
            ]
        },
        "achievements": [
            {
                "id": "first_agent",
                "title": "First Agent",
                "description": "Created your first AI agent",
                "earned_at": "2024-01-16T10:30:00Z"
            },
            {
                "id": "conversation_master",
                "title": "Conversation Master",
                "description": "Had 100+ conversations with AI agents",
                "earned_at": "2024-05-15T14:20:00Z"
            }
        ]
    }
}
```

### 9. Delete Account
```javascript
// DELETE /users/profile
const response = await fetch('/users/profile', {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        confirmation: "DELETE_MY_ACCOUNT",
        password: "current_password"
    })
});

// Response
{
    "success": true,
    "message": "Account deletion initiated",
    "data": {
        "deletion_scheduled": true,
        "deletion_date": "2024-07-06T23:59:59Z", // 7 days from now
        "cancellation_deadline": "2024-07-05T23:59:59Z",
        "backup_download_url": "/exports/user-1-data-backup.zip"
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class ProfileService {
    private baseUrl = '/users';
    
    // Get user profile
    async getProfile() {
        const response = await fetch(`${this.baseUrl}/profile`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Update profile
    async updateProfile(profileData: any) {
        const response = await fetch(`${this.baseUrl}/profile`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(profileData)
        });
        return await response.json();
    }
    
    // Get user settings
    async getSettings() {
        const response = await fetch(`${this.baseUrl}/settings`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Update settings
    async updateSettings(settings: any) {
        const response = await fetch(`${this.baseUrl}/settings`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(settings)
        });
        return await response.json();
    }
    
    // Upload avatar
    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await fetch(`${this.baseUrl}/profile/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: formData
        });
        return await response.json();
    }
    
    // Upload cover image
    async uploadCoverImage(file: File) {
        const formData = new FormData();
        formData.append('cover', file);
        
        const response = await fetch(`${this.baseUrl}/profile/cover`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: formData
        });
        return await response.json();
    }
    
    // Get activity history
    async getActivity(limit = 50, offset = 0) {
        const response = await fetch(`${this.baseUrl}/activity?limit=${limit}&offset=${offset}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get user statistics
    async getStatistics() {
        const response = await fetch(`${this.baseUrl}/statistics`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Delete account
    async deleteAccount(password: string) {
        const response = await fetch(`${this.baseUrl}/profile`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify({
                confirmation: "DELETE_MY_ACCOUNT",
                password: password
            })
        });
        return await response.json();
    }
    
    // Utility methods
    private getToken(): string {
        return localStorage.getItem('token') || '';
    }
    
    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
    }
    
    // Validation helpers
    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    validateWebsite(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
```

---

## 🎨 React Component Examples

```typescript
// Profile Settings Component
import React, { useState, useEffect } from 'react';
import { ProfileService } from '../services/ProfileService';

export const ProfileSettings: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const profileService = new ProfileService();
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        try {
            const [profileData, settingsData] = await Promise.all([
                profileService.getProfile(),
                profileService.getSettings()
            ]);
            
            setProfile(profileData.data);
            setSettings(settingsData.data.preferences);
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleProfileUpdate = async (profileData: any) => {
        try {
            const response = await profileService.updateProfile(profileData);
            if (response.success) {
                setProfile({ ...profile, profile: response.data.profile });
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };
    
    const handleAvatarUpload = async (file: File) => {
        try {
            const response = await profileService.uploadAvatar(file);
            if (response.success) {
                setProfile({
                    ...profile,
                    profile: {
                        ...profile.profile,
                        avatar_url: response.data.avatar_url
                    }
                });
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
        }
    };
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div className="profile-settings">
            <div className="profile-header">
                <img src={profile?.profile?.avatar_url} alt="Avatar" />
                <h2>{profile?.profile?.display_name}</h2>
                <p>{profile?.profile?.bio}</p>
            </div>
            
            <div className="profile-stats">
                <div className="stat">
                    <span className="value">{profile?.statistics?.agents_created}</span>
                    <span className="label">Agents Created</span>
                </div>
                <div className="stat">
                    <span className="value">{profile?.statistics?.conversations_count}</span>
                    <span className="label">Conversations</span>
                </div>
                <div className="stat">
                    <span className="value">{profile?.statistics?.tasks_completed}</span>
                    <span className="label">Tasks Completed</span>
                </div>
            </div>
            
            {/* Profile edit form would go here */}
        </div>
    );
};
```

---

## 📊 Complete API Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile and statistics | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |
| GET | `/users/settings` | Get user preferences | ✅ |
| PUT | `/users/settings` | Update user preferences | ✅ |
| POST | `/users/profile/avatar` | Upload profile avatar | ✅ |
| POST | `/users/profile/cover` | Upload cover image | ✅ |
| GET | `/users/activity` | Get activity history | ✅ |
| GET | `/users/statistics` | Get user statistics | ✅ |
| DELETE | `/users/profile` | Delete user account | ✅ |

---

## ✨ Status: 100% Complete ✅

All Profile API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 3 tables integrated  
**API Endpoints:** 9 endpoints working  
**Authentication:** JWT secured  
**Status:** Production ready
