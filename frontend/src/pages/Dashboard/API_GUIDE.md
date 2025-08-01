# 📊 DASHBOARD API - Complete Guide

## 📋 Overview
Complete Dashboard API for analytics, statistics, and overview data across all system components.

**Base URL:** `/dashboard`  
**Total Endpoints:** 10 endpoints ✅  
**Authentication:** JWT Bearer Token Required  
**Real-time Updates:** WebSocket support

---

## 🗄️ Database Structure

### dashboard_widgets table
```sql
CREATE TABLE dashboard_widgets (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    widget_type VARCHAR(100) NOT NULL, -- 'agents_overview', 'tasks_summary', 'chat_analytics'
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    config_data TEXT, -- JSON widget configuration
    is_visible BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### user_analytics table
```sql
CREATE TABLE user_analytics (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    metric_name VARCHAR(100) NOT NULL, -- 'agents_created', 'messages_sent', 'time_spent'
    metric_value INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    additional_data TEXT, -- JSON additional metrics
    created_at DATETIME NOT NULL,
    UNIQUE(user_id, metric_name, metric_date),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### system_analytics table
```sql
CREATE TABLE system_analytics (
    id INTEGER PRIMARY KEY,
    metric_category VARCHAR(50) NOT NULL, -- 'performance', 'usage', 'errors'
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(20), -- 'count', 'percentage', 'ms', 'mb'
    recorded_at DATETIME NOT NULL,
    details TEXT, -- JSON additional details
    created_at DATETIME NOT NULL
);
```

---

## 🔗 Complete API Endpoints

### 1. Dashboard Overview - GET /dashboard/overview
```javascript
// GET /dashboard/overview
const response = await fetch('/dashboard/overview', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "data": {
        "user_stats": {
            "agents_count": 8,
            "active_conversations": 3,
            "tasks_pending": 12,
            "tasks_completed": 45,
            "total_messages": 1250,
            "training_sessions": 5
        },
        "recent_activity": [
            {
                "id": 1,
                "type": "agent_created",
                "title": "New agent 'Customer Support' created",
                "description": "GPT-4 based customer support agent",
                "timestamp": "2024-06-29T15:30:00Z",
                "icon": "robot"
            },
            {
                "id": 2,
                "type": "task_completed",
                "title": "Task 'API Documentation' completed",
                "description": "Documentation task finished successfully",
                "timestamp": "2024-06-29T14:45:00Z",
                "icon": "check-circle"
            }
        ],
        "quick_stats": {
            "today": {
                "messages_sent": 45,
                "agents_used": 3,
                "tasks_completed": 2,
                "time_spent_minutes": 180
            },
            "this_week": {
                "messages_sent": 320,
                "agents_used": 6,
                "tasks_completed": 15,
                "time_spent_minutes": 1260
            }
        },
        "performance_metrics": {
            "avg_response_time": 1.2,
            "success_rate": 98.5,
            "user_satisfaction": 4.8
        }
    }
}
```

### 2. Analytics Data - GET /dashboard/analytics
```javascript
// GET /dashboard/analytics?period=7d&metrics=agents,tasks,messages
const response = await fetch('/dashboard/analytics?' + new URLSearchParams({
    period: '7d',
    metrics: 'agents,tasks,messages',
    granularity: 'daily'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "period": "7d",
        "granularity": "daily",
        "metrics": {
            "agents": {
                "total": 8,
                "change": "+2",
                "change_percentage": 33.3,
                "trend": "up",
                "daily_data": [
                    { "date": "2024-06-23", "value": 6 },
                    { "date": "2024-06-24", "value": 6 },
                    { "date": "2024-06-25", "value": 7 },
                    { "date": "2024-06-26", "value": 7 },
                    { "date": "2024-06-27", "value": 8 },
                    { "date": "2024-06-28", "value": 8 },
                    { "date": "2024-06-29", "value": 8 }
                ]
            },
            "tasks": {
                "completed": 15,
                "pending": 12,
                "total": 27,
                "completion_rate": 55.6,
                "daily_data": [
                    { "date": "2024-06-23", "completed": 2, "created": 3 },
                    { "date": "2024-06-24", "completed": 1, "created": 2 },
                    { "date": "2024-06-25", "completed": 3, "created": 4 },
                    { "date": "2024-06-26", "completed": 2, "created": 1 },
                    { "date": "2024-06-27", "completed": 4, "created": 5 },
                    { "date": "2024-06-28", "completed": 1, "created": 2 },
                    { "date": "2024-06-29", "completed": 2, "created": 3 }
                ]
            },
            "messages": {
                "total": 320,
                "avg_per_day": 45.7,
                "peak_day": "2024-06-27",
                "daily_data": [
                    { "date": "2024-06-23", "sent": 35, "received": 42 },
                    { "date": "2024-06-24", "sent": 28, "received": 31 },
                    { "date": "2024-06-25", "sent": 52, "received": 48 },
                    { "date": "2024-06-26", "sent": 41, "received": 39 },
                    { "date": "2024-06-27", "sent": 67, "received": 59 },
                    { "date": "2024-06-28", "sent": 33, "received": 28 },
                    { "date": "2024-06-29", "sent": 45, "received": 38 }
                ]
            }
        }
    }
}
```

### 3. Real-time Statistics - GET /dashboard/realtime
```javascript
// GET /dashboard/realtime
const response = await fetch('/dashboard/realtime', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "active_sessions": {
            "total": 3,
            "agents": [
                {
                    "agent_id": 5,
                    "agent_name": "Customer Support",
                    "conversation_id": 101,
                    "last_activity": "2024-06-29T16:45:00Z",
                    "status": "responding"
                },
                {
                    "agent_id": 8,
                    "agent_name": "Content Writer",
                    "conversation_id": 105,
                    "last_activity": "2024-06-29T16:43:00Z",
                    "status": "idle"
                }
            ]
        },
        "system_health": {
            "status": "healthy",
            "cpu_usage": 45.2,
            "memory_usage": 67.8,
            "response_time": 120,
            "error_rate": 0.1
        },
        "live_metrics": {
            "messages_per_minute": 15,
            "api_requests_per_minute": 89,
            "active_users": 25,
            "queue_size": 3
        },
        "recent_events": [
            {
                "timestamp": "2024-06-29T16:45:12Z",
                "type": "message_sent",
                "agent_id": 5,
                "conversation_id": 101
            },
            {
                "timestamp": "2024-06-29T16:44:55Z",
                "type": "task_created",
                "task_id": 89,
                "user_id": 15
            }
        ]
    }
}
```

### 4. Performance Metrics - GET /dashboard/performance
```javascript
// GET /dashboard/performance?timeframe=24h
const response = await fetch('/dashboard/performance?timeframe=24h', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "timeframe": "24h",
        "api_performance": {
            "avg_response_time": 125,
            "95th_percentile": 340,
            "99th_percentile": 890,
            "total_requests": 8450,
            "successful_requests": 8397,
            "error_rate": 0.63,
            "success_rate": 99.37
        },
        "agent_performance": {
            "avg_response_time": 2.3,
            "total_conversations": 145,
            "total_messages": 1250,
            "avg_messages_per_conversation": 8.6,
            "user_satisfaction": 4.7
        },
        "database_performance": {
            "avg_query_time": 45,
            "slow_queries": 12,
            "connection_pool_usage": 67,
            "cache_hit_rate": 89.5
        },
        "hourly_breakdown": [
            {
                "hour": "2024-06-29T00:00:00Z",
                "requests": 234,
                "avg_response_time": 110,
                "error_count": 2
            },
            {
                "hour": "2024-06-29T01:00:00Z",
                "requests": 189,
                "avg_response_time": 105,
                "error_count": 1
            }
            // ... more hourly data
        ]
    }
}
```

### 5. User Widgets - GET /dashboard/widgets
```javascript
// GET /dashboard/widgets
const response = await fetch('/dashboard/widgets', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "widgets": [
            {
                "id": 1,
                "type": "agents_overview",
                "position": { "x": 0, "y": 0 },
                "size": { "width": 6, "height": 4 },
                "config": {
                    "show_inactive": false,
                    "group_by": "type",
                    "refresh_interval": 30
                },
                "is_visible": true,
                "data": {
                    "total_agents": 8,
                    "active_agents": 6,
                    "by_type": {
                        "conversational": 5,
                        "analytical": 2,
                        "creative": 1
                    }
                }
            },
            {
                "id": 2,
                "type": "tasks_summary",
                "position": { "x": 6, "y": 0 },
                "size": { "width": 6, "height": 4 },
                "config": {
                    "show_completed": true,
                    "time_period": "week"
                },
                "is_visible": true,
                "data": {
                    "pending": 12,
                    "in_progress": 5,
                    "completed": 15,
                    "completion_rate": 68.2
                }
            }
        ],
        "available_widgets": [
            {
                "type": "agents_overview",
                "name": "Agents Overview",
                "description": "Summary of all agents and their status",
                "default_size": { "width": 6, "height": 4 }
            },
            {
                "type": "tasks_summary",
                "name": "Tasks Summary",
                "description": "Task statistics and progress",
                "default_size": { "width": 6, "height": 4 }
            },
            {
                "type": "chat_analytics",
                "name": "Chat Analytics",
                "description": "Conversation and message statistics",
                "default_size": { "width": 8, "height": 6 }
            }
        ]
    }
}
```

### 6. Save Widget Layout - POST /dashboard/widgets/layout
```javascript
// POST /dashboard/widgets/layout
const response = await fetch('/dashboard/widgets/layout', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        widgets: [
            {
                "id": 1,
                "position": { "x": 0, "y": 0 },
                "size": { "width": 8, "height": 4 },
                "is_visible": true
            },
            {
                "id": 2,
                "position": { "x": 8, "y": 0 },
                "size": { "width": 4, "height": 4 },
                "is_visible": true
            }
        ]
    })
});

// Response
{
    "success": true,
    "message": "Widget layout saved successfully",
    "data": {
        "widgets_updated": 2,
        "updated_at": "2024-06-29T17:00:00Z"
    }
}
```

### 7. Export Dashboard Data - GET /dashboard/export
```javascript
// GET /dashboard/export?format=pdf&sections=overview,analytics&period=30d
const response = await fetch('/dashboard/export?' + new URLSearchParams({
    format: 'pdf',
    sections: 'overview,analytics',
    period: '30d'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "export": {
            "file_url": "https://example.com/exports/dashboard_2024-06-29.pdf",
            "format": "pdf",
            "sections": ["overview", "analytics"],
            "period": "30d",
            "file_size": "2.1 MB",
            "expires_at": "2024-06-30T17:00:00Z"
        }
    }
}
```

### 8. Get Activity Feed - GET /dashboard/activity
```javascript
// GET /dashboard/activity?limit=20&types=agent,task,message
const response = await fetch('/dashboard/activity?' + new URLSearchParams({
    limit: '20',
    types: 'agent,task,message',
    since: '2024-06-29T00:00:00Z'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "activities": [
            {
                "id": 1,
                "type": "agent_created",
                "title": "Created new agent 'Data Analyst'",
                "description": "Claude-3 based data analysis agent",
                "timestamp": "2024-06-29T16:30:00Z",
                "icon": "plus-circle",
                "metadata": {
                    "agent_id": 9,
                    "agent_name": "Data Analyst",
                    "model": "claude-3-sonnet"
                }
            },
            {
                "id": 2,
                "type": "task_updated",
                "title": "Task 'API Testing' moved to In Progress",
                "description": "Status changed from Pending to In Progress",
                "timestamp": "2024-06-29T16:15:00Z",
                "icon": "arrow-right",
                "metadata": {
                    "task_id": 87,
                    "old_status": "pending",
                    "new_status": "in_progress"
                }
            },
            {
                "id": 3,
                "type": "message_sent",
                "title": "Conversation with Customer Support agent",
                "description": "15 messages exchanged in support session",
                "timestamp": "2024-06-29T16:00:00Z",
                "icon": "message-circle",
                "metadata": {
                    "conversation_id": 101,
                    "agent_id": 5,
                    "message_count": 15
                }
            }
        ],
        "pagination": {
            "total": 150,
            "limit": 20,
            "has_more": true,
            "next_cursor": "eyJpZCI6MywidGltZXN0YW1wIjoiMjAyNC0wNi0yOVQxNjowMDowMFoifQ=="
        }
    }
}
```

### 9. Dashboard Notifications - GET /dashboard/notifications
```javascript
// GET /dashboard/notifications?status=unread&priority=high
const response = await fetch('/dashboard/notifications?' + new URLSearchParams({
    status: 'unread',
    priority: 'high',
    limit: '10'
}), {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Response
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": 1,
                "type": "system_alert",
                "priority": "high",
                "title": "Agent Response Time Warning",
                "message": "Agent 'Customer Support' is responding slower than usual",
                "status": "unread",
                "action_required": true,
                "action_url": "/agents/5/performance",
                "created_at": "2024-06-29T16:45:00Z",
                "metadata": {
                    "agent_id": 5,
                    "avg_response_time": 5.2,
                    "threshold": 3.0
                }
            },
            {
                "id": 2,
                "type": "license_warning",
                "priority": "medium",
                "title": "License Expiration Notice",
                "message": "Your premium license expires in 30 days",
                "status": "unread",
                "action_required": true,
                "action_url": "/license/renew",
                "created_at": "2024-06-29T16:30:00Z",
                "metadata": {
                    "expires_at": "2024-07-29T23:59:59Z",
                    "days_remaining": 30
                }
            }
        ],
        "summary": {
            "total": 5,
            "unread": 3,
            "high_priority": 1,
            "action_required": 2
        }
    }
}
```

### 10. Mark Notification Read - PUT /dashboard/notifications/{id}/read
```javascript
// PUT /dashboard/notifications/1/read
const response = await fetch('/dashboard/notifications/1/read', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Notification marked as read",
    "data": {
        "notification_id": 1,
        "status": "read",
        "read_at": "2024-06-29T17:00:00Z"
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class DashboardService {
    private baseUrl = '/dashboard';
    
    // Get dashboard overview
    async getOverview() {
        const response = await fetch(`${this.baseUrl}/overview`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get analytics data
    async getAnalytics(period: string = '7d', metrics: string = 'agents,tasks,messages', granularity: string = 'daily') {
        const params = new URLSearchParams({ period, metrics, granularity });
        const response = await fetch(`${this.baseUrl}/analytics?${params}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get real-time statistics
    async getRealtimeStats() {
        const response = await fetch(`${this.baseUrl}/realtime`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get performance metrics
    async getPerformanceMetrics(timeframe: string = '24h') {
        const params = new URLSearchParams({ timeframe });
        const response = await fetch(`${this.baseUrl}/performance?${params}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get user widgets
    async getWidgets() {
        const response = await fetch(`${this.baseUrl}/widgets`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Save widget layout
    async saveWidgetLayout(widgets: any[]) {
        const response = await fetch(`${this.baseUrl}/widgets/layout`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ widgets })
        });
        return await response.json();
    }
    
    // Export dashboard data
    async exportData(format: 'pdf' | 'excel' | 'csv' = 'pdf', sections: string = 'overview,analytics', period: string = '30d') {
        const params = new URLSearchParams({ format, sections, period });
        const response = await fetch(`${this.baseUrl}/export?${params}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get activity feed
    async getActivity(limit: number = 20, types?: string, since?: string) {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (types) params.append('types', types);
        if (since) params.append('since', since);
        
        const response = await fetch(`${this.baseUrl}/activity?${params}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get notifications
    async getNotifications(status?: string, priority?: string, limit: number = 10) {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        
        const response = await fetch(`${this.baseUrl}/notifications?${params}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Mark notification as read
    async markNotificationRead(notificationId: number) {
        const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // WebSocket connection for real-time updates
    connectWebSocket(): WebSocket {
        const token = localStorage.getItem('access_token');
        const wsUrl = `ws://localhost:8000/ws/dashboard?token=${token}`;
        return new WebSocket(wsUrl);
    }
    
    // Utility methods
    private getHeaders() {
        const token = localStorage.getItem('access_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    
    // Format helpers
    formatNumber(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    formatPercentage(value: number): string {
        return value.toFixed(1) + '%';
    }
    
    formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }
    
    getStatusColor(status: string): string {
        const colors = {
            'healthy': 'green',
            'warning': 'yellow',
            'error': 'red',
            'up': 'green',
            'down': 'red'
        };
        return colors[status] || 'gray';
    }
    
    formatResponseTime(ms: number): string {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    }
}

// Types
interface DashboardOverview {
    user_stats: {
        agents_count: number;
        active_conversations: number;
        tasks_pending: number;
        tasks_completed: number;
        total_messages: number;
        training_sessions: number;
    };
    recent_activity: Activity[];
    quick_stats: {
        today: QuickStats;
        this_week: QuickStats;
    };
    performance_metrics: {
        avg_response_time: number;
        success_rate: number;
        user_satisfaction: number;
    };
}

interface Activity {
    id: number;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    metadata?: any;
}

interface QuickStats {
    messages_sent: number;
    agents_used: number;
    tasks_completed: number;
    time_spent_minutes: number;
}

interface Widget {
    id: number;
    type: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    config: any;
    is_visible: boolean;
    data?: any;
}
```

---

## 📊 Complete API Reference

| Method | Endpoint | Description | Real-time |
|--------|----------|-------------|-----------|
| GET | `/dashboard/overview` | Dashboard overview data | ❌ |
| GET | `/dashboard/analytics` | Analytics with time periods | ❌ |
| GET | `/dashboard/realtime` | Real-time statistics | ✅ |
| GET | `/dashboard/performance` | Performance metrics | ❌ |
| GET | `/dashboard/widgets` | User widget layout | ❌ |
| POST | `/dashboard/widgets/layout` | Save widget layout | ❌ |
| GET | `/dashboard/export` | Export dashboard data | ❌ |
| GET | `/dashboard/activity` | Activity feed | ❌ |
| GET | `/dashboard/notifications` | User notifications | ✅ |
| PUT | `/dashboard/notifications/{id}/read` | Mark notification read | ❌ |

---

## ⚡ Features Included

### Analytics & Statistics
- ✅ User activity tracking
- ✅ Agent performance metrics
- ✅ Task completion statistics
- ✅ Message analytics
- ✅ Real-time monitoring

### Customizable Dashboard
- ✅ Drag & drop widgets
- ✅ Customizable layout
- ✅ Widget configuration
- ✅ Personal preferences

### Real-time Updates
- ✅ Live system health
- ✅ Active session monitoring
- ✅ Real-time notifications
- ✅ WebSocket integration

### Data Export
- ✅ PDF reports
- ✅ Excel/CSV exports
- ✅ Customizable sections
- ✅ Scheduled exports

---

## ✨ Status: 100% Complete ✅

All Dashboard API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 3 tables integrated  
**API Endpoints:** 10 endpoints working  
**Real-time Features:** WebSocket support  
**Status:** Production ready
