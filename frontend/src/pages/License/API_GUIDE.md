# 🔑 LICENSE API - Complete Guide

## 📋 Overview
Complete guide for License API endpoints, database structure, and implementation examples.

**Base URL:** `http://localhost:8000/license/licensing`  
**Authentication:** JWT Bearer Token Required  
**Total Endpoints:** 8 endpoints ✅

---

## 🗄️ Database Structure

### Table: `user_licenses`
```sql
CREATE TABLE user_licenses (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    license_key VARCHAR(255) UNIQUE NOT NULL,
    license_type VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'enterprise'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'suspended', 'cancelled'
    issued_at DATETIME NOT NULL,
    expires_at DATETIME,
    auto_renew BOOLEAN DEFAULT FALSE,
    max_activations INTEGER DEFAULT 5,
    current_activations INTEGER DEFAULT 0,
    features TEXT, -- JSON array of enabled features
    metadata TEXT, -- JSON additional license data
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table: `license_activations`
```sql
CREATE TABLE license_activations (
    id INTEGER PRIMARY KEY,
    license_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    device_fingerprint VARCHAR(512) NOT NULL,
    device_name VARCHAR(255),
    device_info TEXT, -- JSON device information
    activation_token VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'deactivated', 'suspended'
    last_used_at DATETIME,
    ip_address VARCHAR(45),
    user_agent TEXT,
    activated_at DATETIME NOT NULL,
    deactivated_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (license_id) REFERENCES user_licenses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Complete API Endpoints

### 1. Validate License
```javascript
// POST /license/licensing/validate
const response = await fetch('/license/licensing/validate', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        license_key: "DPRO-XXXX-XXXX-XXXX",
        device_fingerprint: "abc123def456ghi789",
        device_info: {
            os: "Windows 11",
            cpu: "Intel i7-12700K",
            ram: "32GB",
            mac_address: "00:1B:44:11:3A:B7"
        }
    })
});

// Response
{
    "success": true,
    "message": "License validated successfully",
    "data": {
        "is_valid": true,
        "license_type": "premium",
        "status": "active",
        "expires_at": "2025-06-29T23:59:59Z",
        "days_remaining": 365,
        "features": [
            "training_lab",
            "unlimited_agents",
            "premium_models",
            "priority_support",
            "advanced_analytics"
        ],
        "activation_count": 2,
        "max_activations": 5,
        "device_registered": true
    }
}
```

### 2. Get License Status
```javascript
// GET /license/licensing/status
const response = await fetch('/license/licensing/status', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "License status retrieved",
    "data": {
        "license_key": "DPRO-****-****-XXXX",
        "license_type": "premium",
        "status": "active",
        "issued_at": "2024-06-29T00:00:00Z",
        "expires_at": "2025-06-29T23:59:59Z",
        "days_remaining": 365,
        "auto_renew": true,
        "features": [
            {
                "name": "training_lab",
                "display_name": "Training Lab",
                "enabled": true,
                "usage_limit": null,
                "usage_current": 0
            },
            {
                "name": "agent_limit",
                "display_name": "Agent Limit",
                "enabled": true,
                "usage_limit": null,
                "usage_current": 15
            },
            {
                "name": "premium_models",
                "display_name": "Premium AI Models",
                "enabled": true,
                "usage_limit": 10000,
                "usage_current": 2500
            }
        ],
        "activations": [
            {
                "id": 1,
                "device_name": "John's Laptop",
                "device_fingerprint": "abc123***",
                "activated_at": "2024-06-29T10:00:00Z",
                "last_used_at": "2024-06-29T15:30:00Z",
                "is_current": true,
                "status": "active"
            }
        ],
        "warnings": [],
        "notifications": []
    }
}
```

### 3. Activate License
```javascript
// POST /license/licensing/activate
const response = await fetch('/license/licensing/activate', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        license_key: "DPRO-XXXX-XXXX-XXXX",
        device_name: "John's Workstation",
        device_info: {
            os: "Windows 11 Pro",
            cpu: "Intel i7-12700K",
            ram: "32GB DDR4",
            disk_serial: "WD-WCC4N5XXXXXX",
            mac_address: "00:1B:44:11:3A:B7"
        }
    })
});

// Response
{
    "success": true,
    "message": "License activated successfully",
    "data": {
        "activation_id": 2,
        "activation_token": "AT-789456123ABC",
        "device_fingerprint": "def456ghi789abc123",
        "activated_at": "2024-06-29T16:00:00Z",
        "features_activated": [
            "training_lab",
            "unlimited_agents",
            "premium_models",
            "priority_support"
        ],
        "activation_count": 3,
        "max_activations": 5,
        "remaining_activations": 2
    }
}
```

### 4. Get Hardware Info
```javascript
// GET /license/licensing/hardware-info
const response = await fetch('/license/licensing/hardware-info', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Hardware info generated",
    "data": {
        "device_fingerprint": "abc123def456ghi789",
        "device_info": {
            "os": "Windows 11 Pro",
            "os_version": "10.0.22000",
            "cpu": "Intel(R) Core(TM) i7-12700K CPU @ 3.60GHz",
            "cpu_cores": 12,
            "ram_total": "32768MB",
            "disk_serial": "WD-WCC4N5XXXXXX",
            "mac_addresses": ["00:1B:44:11:3A:B7"],
            "screen_resolution": "3840x2160",
            "timezone": "UTC+02:00",
            "computer_name": "DESKTOP-ABC123"
        },
        "fingerprint_components": [
            "cpu_id",
            "disk_serial", 
            "mac_address",
            "motherboard_serial"
        ],
        "security_score": 95.5
    }
}
```

### 5. Environment Check
```javascript
// GET /license/licensing/environment-check
const response = await fetch('/license/licensing/environment-check', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Environment check completed",
    "data": {
        "system_compatibility": {
            "os_supported": true,
            "ram_sufficient": true,
            "disk_space_sufficient": true,
            "network_connection": true,
            "required_ports_open": true
        },
        "license_requirements": {
            "license_valid": true,
            "features_available": true,
            "activation_available": true,
            "no_conflicts": true
        },
        "recommendations": [
            "Update to latest version for optimal performance",
            "Consider upgrading RAM for better performance with large models"
        ],
        "warnings": [],
        "errors": []
    }
}
```

### 6. Get Available Features
```javascript
// GET /license/licensing/features
const response = await fetch('/license/licensing/features', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Features retrieved",
    "data": {
        "available_features": [
            {
                "name": "training_lab",
                "display_name": "Training Lab",
                "description": "Advanced AI agent training workspace",
                "enabled": true,
                "required_license": "premium",
                "usage_limit": null,
                "usage_current": 0,
                "cost_per_use": 0,
                "benefits": [
                    "Unlimited training sessions",
                    "Advanced analytics",
                    "Custom training templates"
                ]
            },
            {
                "name": "premium_models",
                "display_name": "Premium AI Models",
                "description": "Access to GPT-4, Claude, and other premium models",
                "enabled": true,
                "required_license": "premium",
                "usage_limit": 10000,
                "usage_current": 2500,
                "cost_per_use": 0.002,
                "benefits": [
                    "GPT-4 Access",
                    "Claude 3 Access", 
                    "Custom fine-tuned models"
                ]
            },
            {
                "name": "unlimited_agents",
                "display_name": "Unlimited Agents",
                "description": "Create unlimited AI agents",
                "enabled": true,
                "required_license": "premium",
                "usage_limit": null,
                "usage_current": 15,
                "cost_per_use": 0,
                "benefits": [
                    "No agent limits",
                    "Advanced agent types",
                    "Agent templates"
                ]
            }
        ],
        "license_type": "premium",
        "total_features": 12,
        "enabled_features": 12,
        "usage_summary": {
            "premium_models_used": 2500,
            "premium_models_limit": 10000,
            "agents_created": 15,
            "training_sessions": 8
        }
    }
}
```

### 7. Deployment Check
```javascript
// POST /license/licensing/deployment-check
const response = await fetch('/license/licensing/deployment-check', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        deployment_type: "production",
        environment_info: {
            server_count: 3,
            expected_users: 100,
            features_needed: ["training_lab", "premium_models"]
        }
    })
});

// Response
{
    "success": true,
    "message": "Deployment check completed",
    "data": {
        "deployment_valid": true,
        "license_sufficient": true,
        "recommendations": [
            {
                "type": "optimization",
                "message": "Consider load balancing for 100+ users",
                "priority": "medium"
            },
            {
                "type": "scaling",
                "message": "Monitor API usage limits",
                "priority": "high"
            }
        ],
        "requirements_met": {
            "server_license": true,
            "user_capacity": true,
            "feature_access": true,
            "api_limits": true
        },
        "estimated_costs": {
            "monthly_api_usage": 156.50,
            "feature_costs": 0,
            "total_estimated": 156.50
        }
    }
}
```

### 8. Get Deployment Guide
```javascript
// GET /license/licensing/deployment-guide
const response = await fetch('/license/licensing/deployment-guide?type=production', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Deployment guide retrieved",
    "data": {
        "deployment_type": "production",
        "license_requirements": [
            "Premium or Enterprise license",
            "Valid activation on production servers",
            "Sufficient API quota"
        ],
        "setup_steps": [
            {
                "step": 1,
                "title": "License Activation",
                "description": "Activate license on production servers",
                "commands": [
                    "POST /license/licensing/activate",
                    "Verify activation status"
                ]
            },
            {
                "step": 2,
                "title": "Environment Configuration",
                "description": "Configure environment variables",
                "commands": [
                    "Set LICENSE_KEY environment variable",
                    "Configure API endpoints",
                    "Test connectivity"
                ]
            },
            {
                "step": 3,
                "title": "Feature Validation",
                "description": "Verify all required features are available",
                "commands": [
                    "GET /license/licensing/features",
                    "Test premium model access",
                    "Validate training lab access"
                ]
            }
        ],
        "best_practices": [
            "Use environment variables for license keys",
            "Implement license validation caching",
            "Monitor API usage and limits",
            "Set up license expiration alerts"
        ],
        "troubleshooting": [
            {
                "issue": "License validation fails",
                "solution": "Check internet connectivity and license key format"
            },
            {
                "issue": "Feature access denied",
                "solution": "Verify license type includes required features"
            }
        ]
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class LicenseService {
    private baseUrl = '/license/licensing';
    
    // Validate license
    async validateLicense(licenseKey: string, deviceInfo: any) {
        const response = await fetch(`${this.baseUrl}/validate`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                license_key: licenseKey,
                device_fingerprint: await this.generateDeviceFingerprint(),
                device_info: deviceInfo
            })
        });
        return await response.json();
    }
    
    // Get license status
    async getLicenseStatus() {
        const response = await fetch(`${this.baseUrl}/status`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Activate license
    async activateLicense(licenseKey: string, deviceName: string, deviceInfo: any) {
        const response = await fetch(`${this.baseUrl}/activate`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                license_key: licenseKey,
                device_name: deviceName,
                device_info: deviceInfo
            })
        });
        return await response.json();
    }
    
    // Get hardware info
    async getHardwareInfo() {
        const response = await fetch(`${this.baseUrl}/hardware-info`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Environment check
    async checkEnvironment() {
        const response = await fetch(`${this.baseUrl}/environment-check`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get available features
    async getAvailableFeatures() {
        const response = await fetch(`${this.baseUrl}/features`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Check feature access
    async checkFeatureAccess(featureName: string) {
        const features = await this.getAvailableFeatures();
        const feature = features.data.available_features.find((f: any) => f.name === featureName);
        return feature?.enabled || false;
    }
    
    // Deployment check
    async deploymentCheck(deploymentInfo: any) {
        const response = await fetch(`${this.baseUrl}/deployment-check`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(deploymentInfo)
        });
        return await response.json();
    }
    
    // Get deployment guide
    async getDeploymentGuide(deploymentType = 'production') {
        const response = await fetch(`${this.baseUrl}/deployment-guide?type=${deploymentType}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Generate device fingerprint
    private async generateDeviceFingerprint(): Promise<string> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx?.fillText('fingerprint', 10, 10);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return btoa(fingerprint);
    }
    
    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
}
```

---

## 📊 Complete API Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/license/licensing/validate` | Validate license key | ✅ |
| GET | `/license/licensing/status` | Get license status | ✅ |
| POST | `/license/licensing/activate` | Activate license | ✅ |
| GET | `/license/licensing/hardware-info` | Get hardware fingerprint | ✅ |
| GET | `/license/licensing/environment-check` | Check system environment | ✅ |
| GET | `/license/licensing/features` | Get available features | ✅ |
| POST | `/license/licensing/deployment-check` | Check deployment readiness | ✅ |
| GET | `/license/licensing/deployment-guide` | Get deployment guide | ✅ |

---

## ✨ Status: 100% Complete ✅

All License API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 2 tables integrated  
**API Endpoints:** 8 endpoints working  
**Authentication:** JWT secured  
**Status:** Production ready