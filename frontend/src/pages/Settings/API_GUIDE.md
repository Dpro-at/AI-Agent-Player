# ⚙️ SETTINGS API - Complete Guide

## 📋 Overview
Complete guide for Settings API endpoints, database structure, and implementation examples.

**Base URL:** `http://localhost:8000/api/settings`  
**Authentication:** JWT Bearer Token Required  
**Total Endpoints:** 10 endpoints ✅

---

## 🗄️ Database Structure

### Table: `system_settings`
```sql
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) NOT NULL, -- 'string', 'number', 'boolean', 'json'
    category VARCHAR(100) NOT NULL, -- 'general', 'security', 'email', 'ai', 'storage'
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be read by non-admin users
    is_sensitive BOOLEAN DEFAULT FALSE, -- Requires extra security
    validation_rules TEXT, -- JSON validation rules
    default_value TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
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
    custom_settings TEXT, -- JSON for additional custom settings
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Complete API Endpoints

### 1. Get User Settings
```javascript
// GET /api/settings/user
const response = await fetch('/api/settings/user', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "User settings retrieved successfully",
    "data": {
        "preferences": {
            "appearance": {
                "theme": "dark",
                "language": "en",
                "animations_enabled": true,
                "sidebar_collapsed": false
            },
            "localization": {
                "timezone": "America/Los_Angeles",
                "date_format": "MM/DD/YYYY",
                "time_format": "12h",
                "currency": "USD"
            },
            "notifications": {
                "email": true,
                "browser": true,
                "marketing": false,
                "sound_enabled": true,
                "desktop_enabled": true
            },
            "privacy": {
                "profile_public": true,
                "show_activity": true,
                "show_email": false,
                "data_sharing": false
            },
            "security": {
                "login_alerts": true,
                "session_timeout": 3600,
                "two_factor_enabled": true,
                "backup_codes_generated": true
            },
            "ai_preferences": {
                "suggestions_enabled": true,
                "auto_complete": true,
                "model_preference": "gpt-4",
                "response_length": "medium"
            }
        }
    }
}
```

### 2. Update User Settings
```javascript
// PUT /api/settings/user
const response = await fetch('/api/settings/user', {
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
        security_login_alerts: true,
        ai_suggestions_enabled: true,
        custom_settings: {
            dashboard_layout: "list",
            favorite_features: ["chat", "agents", "tasks", "training"]
        }
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
            "updated_at": "2024-06-29T16:30:00Z"
        },
        "changes_applied": [
            "theme changed from light to dark",
            "custom dashboard layout updated",
            "favorite features list updated"
        ]
    }
}
```

### 3. Get System Settings (Admin)
```javascript
// GET /api/settings/system
const response = await fetch('/api/settings/system?category=general', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "System settings retrieved successfully",
    "data": {
        "settings": {
            "general": {
                "app_name": "DPRO AI Agent",
                "app_version": "1.0.0",
                "app_description": "AI Agent Management Platform",
                "support_email": "support@dproai.com",
                "max_users": 10000,
                "maintenance_mode": false
            },
            "security": {
                "password_min_length": 8,
                "session_timeout": 3600,
                "max_login_attempts": 5,
                "require_email_verification": true,
                "enable_two_factor": true
            },
            "ai": {
                "default_model": "gpt-4",
                "max_tokens": 4096,
                "temperature": 0.7,
                "rate_limit_per_minute": 60,
                "enable_streaming": true
            }
        }
    }
}
```

### 4. Reset User Settings
```javascript
// POST /api/settings/user/reset
const response = await fetch('/api/settings/user/reset', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        categories: ["appearance", "notifications"], // Optional: specific categories
        confirm: true
    })
});

// Response
{
    "success": true,
    "message": "Settings reset successfully",
    "data": {
        "reset_categories": ["appearance", "notifications"],
        "reset_count": 12,
        "new_preferences": {
            "theme": "light",
            "language": "en",
            "notifications_email": true,
            "notifications_browser": true,
            "notifications_marketing": false
        }
    }
}
```

### 5. Get Available Setting Options
```javascript
// GET /api/settings/options
const response = await fetch('/api/settings/options', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Setting options retrieved",
    "data": {
        "options": {
            "themes": [
                { "value": "light", "label": "Light Theme", "preview": "/themes/light.png" },
                { "value": "dark", "label": "Dark Theme", "preview": "/themes/dark.png" },
                { "value": "auto", "label": "Auto (System)", "preview": "/themes/auto.png" }
            ],
            "languages": [
                { "value": "en", "label": "English", "flag": "🇺🇸" },
                { "value": "es", "label": "Español", "flag": "🇪🇸" },
                { "value": "fr", "label": "Français", "flag": "🇫🇷" },
                { "value": "de", "label": "Deutsch", "flag": "🇩🇪" }
            ],
            "timezones": [
                { "value": "UTC", "label": "UTC", "offset": "+00:00" },
                { "value": "America/Los_Angeles", "label": "Pacific Time", "offset": "-08:00" },
                { "value": "America/New_York", "label": "Eastern Time", "offset": "-05:00" },
                { "value": "Europe/London", "label": "London", "offset": "+00:00" }
            ]
        }
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class SettingsService {
    private baseUrl = '/api/settings';
    
    // Get user settings
    async getUserSettings() {
        const response = await fetch(`${this.baseUrl}/user`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Update user settings
    async updateUserSettings(settings: any) {
        const response = await fetch(`${this.baseUrl}/user`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(settings)
        });
        return await response.json();
    }
    
    // Get system settings (admin only)
    async getSystemSettings(category?: string) {
        let url = `${this.baseUrl}/system`;
        if (category) url += `?category=${category}`;
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Reset user settings
    async resetUserSettings(categories?: string[]) {
        const response = await fetch(`${this.baseUrl}/user/reset`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ categories, confirm: true })
        });
        return await response.json();
    }
    
    // Get available options
    async getSettingsOptions() {
        const response = await fetch(`${this.baseUrl}/options`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Utility methods
    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    
    // Helper methods for specific settings
    async updateTheme(theme: string) {
        return await this.updateUserSettings({ theme });
    }
    
    async updateLanguage(language: string) {
        return await this.updateUserSettings({ language });
    }
    
    async updateNotifications(notifications: any) {
        return await this.updateUserSettings({
            notifications_email: notifications.email,
            notifications_browser: notifications.browser,
            notifications_marketing: notifications.marketing
        });
    }
}
```

---

## 📊 Complete API Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/settings/user` | Get user settings and preferences | ✅ |
| PUT | `/api/settings/user` | Update user settings | ✅ |
| GET | `/api/settings/system` | Get system settings (Admin) | ✅ |
| PUT | `/api/settings/system` | Update system settings (Admin) | ✅ |
| POST | `/api/settings/user/reset` | Reset user settings to defaults | ✅ |
| GET | `/api/settings/user/export` | Export user settings | ✅ |
| POST | `/api/settings/user/import` | Import user settings | ✅ |
| GET | `/api/settings/user/history` | Get settings change history | ✅ |
| GET | `/api/settings/options` | Get available setting options | ✅ |
| POST | `/api/settings/validate` | Validate settings before saving | ✅ |

---

## ✨ Status: 100% Complete ✅

All Settings API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 2 tables integrated  
**API Endpoints:** 10 endpoints working  
**Authentication:** JWT secured  
**Status:** Production ready
