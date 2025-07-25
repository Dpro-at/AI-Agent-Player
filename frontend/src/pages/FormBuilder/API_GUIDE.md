# 📝 FORMBUILDER API - Complete Guide

## 📋 Overview
Complete guide for FormBuilder API endpoints, database structure, and implementation examples.

**Base URL:** `http://localhost:8000/api/formbuilder`  
**Authentication:** JWT Bearer Token Required  
**Total Endpoints:** 12 endpoints ✅

---

## 🗄️ Database Structure

### Table: `forms`
```sql
CREATE TABLE forms (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    form_schema TEXT NOT NULL, -- JSON schema definition
    settings TEXT, -- JSON form settings
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    is_public BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    tags TEXT, -- JSON array of tags
    submissions_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    published_at DATETIME,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table: `form_submissions`
```sql
CREATE TABLE form_submissions (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    submitter_id INTEGER, -- NULL for anonymous submissions
    submission_data TEXT NOT NULL, -- JSON submission data
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'reviewed', 'approved', 'rejected'
    reviewer_id INTEGER,
    review_notes TEXT,
    submitted_at DATETIME NOT NULL,
    reviewed_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (form_id) REFERENCES forms(id),
    FOREIGN KEY (submitter_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);
```

### Table: `form_templates`
```sql
CREATE TABLE form_templates (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_schema TEXT NOT NULL, -- JSON template schema
    preview_image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_by INTEGER,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

## 🔗 Complete API Endpoints

### 1. List Forms
```javascript
// GET /api/formbuilder/forms
const response = await fetch('/api/formbuilder/forms?status=published&limit=20', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Forms retrieved successfully",
    "data": {
        "forms": [
            {
                "id": 1,
                "title": "Customer Feedback Form",
                "description": "Collect customer feedback and satisfaction ratings",
                "status": "published",
                "is_public": true,
                "category": "feedback",
                "tags": ["customer", "feedback", "satisfaction"],
                "submissions_count": 45,
                "views_count": 230,
                "created_at": "2024-06-25T10:00:00Z",
                "published_at": "2024-06-26T09:00:00Z",
                "expires_at": null
            },
            {
                "id": 2,
                "title": "Job Application Form",
                "description": "Application form for job candidates",
                "status": "published",
                "is_public": true,
                "category": "hr",
                "tags": ["jobs", "application", "hr"],
                "submissions_count": 12,
                "views_count": 156,
                "created_at": "2024-06-24T14:30:00Z",
                "published_at": "2024-06-24T16:00:00Z",
                "expires_at": "2024-12-31T23:59:59Z"
            }
        ],
        "total": 8,
        "limit": 20,
        "offset": 0,
        "has_more": false
    }
}
```

### 2. Create Form
```javascript
// POST /api/formbuilder/forms
const response = await fetch('/api/formbuilder/forms', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: "Product Survey",
        description: "Survey to gather product feedback",
        form_schema: {
            fields: [
                {
                    id: "name",
                    type: "text",
                    label: "Full Name",
                    required: true,
                    placeholder: "Enter your full name"
                },
                {
                    id: "email",
                    type: "email",
                    label: "Email Address",
                    required: true,
                    placeholder: "Enter your email"
                },
                {
                    id: "rating",
                    type: "rating",
                    label: "Overall Rating",
                    required: true,
                    max_value: 5,
                    min_value: 1
                },
                {
                    id: "feedback",
                    type: "textarea",
                    label: "Feedback",
                    required: false,
                    placeholder: "Share your thoughts..."
                }
            ]
        },
        settings: {
            allow_anonymous: true,
            send_confirmation_email: true,
            redirect_url: "/thank-you",
            max_submissions: null
        },
        category: "survey",
        tags: ["product", "feedback", "survey"]
    })
});

// Response
{
    "success": true,
    "message": "Form created successfully",
    "data": {
        "form": {
            "id": 3,
            "title": "Product Survey",
            "description": "Survey to gather product feedback",
            "status": "draft",
            "form_url": "/forms/3/product-survey",
            "embed_code": "<iframe src=\"/embed/forms/3\" width=\"100%\" height=\"600\"></iframe>",
            "created_at": "2024-06-29T16:00:00Z"
        }
    }
}
```

### 3. Get Form Details
```javascript
// GET /api/formbuilder/forms/{id}
const response = await fetch('/api/formbuilder/forms/1', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Form retrieved successfully",
    "data": {
        "form": {
            "id": 1,
            "title": "Customer Feedback Form",
            "description": "Collect customer feedback and satisfaction ratings",
            "form_schema": {
                "fields": [
                    {
                        "id": "name",
                        "type": "text",
                        "label": "Full Name",
                        "required": true,
                        "placeholder": "Enter your full name",
                        "validation": {
                            "min_length": 2,
                            "max_length": 100
                        }
                    },
                    {
                        "id": "email",
                        "type": "email",
                        "label": "Email Address",
                        "required": true,
                        "placeholder": "Enter your email"
                    },
                    {
                        "id": "satisfaction",
                        "type": "select",
                        "label": "Satisfaction Level",
                        "required": true,
                        "options": [
                            { "value": "very_satisfied", "label": "Very Satisfied" },
                            { "value": "satisfied", "label": "Satisfied" },
                            { "value": "neutral", "label": "Neutral" },
                            { "value": "dissatisfied", "label": "Dissatisfied" },
                            { "value": "very_dissatisfied", "label": "Very Dissatisfied" }
                        ]
                    }
                ]
            },
            "settings": {
                "allow_anonymous": true,
                "send_confirmation_email": true,
                "redirect_url": "/thank-you",
                "max_submissions": 100,
                "collect_ip_address": true
            },
            "status": "published",
            "is_public": true,
            "category": "feedback",
            "tags": ["customer", "feedback", "satisfaction"],
            "submissions_count": 45,
            "views_count": 230,
            "form_url": "/forms/1/customer-feedback-form",
            "embed_code": "<iframe src=\"/embed/forms/1\" width=\"100%\" height=\"600\"></iframe>",
            "created_at": "2024-06-25T10:00:00Z",
            "published_at": "2024-06-26T09:00:00Z"
        }
    }
}
```

### 4. Update Form
```javascript
// PUT /api/formbuilder/forms/{id}
const response = await fetch('/api/formbuilder/forms/1', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: "Updated Customer Feedback Form",
        description: "Enhanced customer feedback collection form",
        form_schema: {
            fields: [
                {
                    id: "name",
                    type: "text",
                    label: "Full Name",
                    required: true,
                    placeholder: "Enter your full name"
                },
                {
                    id: "email",
                    type: "email",
                    label: "Email Address",
                    required: true,
                    placeholder: "Enter your email"
                },
                {
                    id: "phone",
                    type: "tel",
                    label: "Phone Number",
                    required: false,
                    placeholder: "+1 (555) 123-4567"
                },
                {
                    id: "satisfaction",
                    type: "rating",
                    label: "Overall Satisfaction",
                    required: true,
                    max_value: 5,
                    min_value: 1
                }
            ]
        },
        settings: {
            allow_anonymous: false,
            send_confirmation_email: true,
            max_submissions: 200
        }
    })
});

// Response
{
    "success": true,
    "message": "Form updated successfully",
    "data": {
        "form": {
            "id": 1,
            "title": "Updated Customer Feedback Form",
            "description": "Enhanced customer feedback collection form",
            "updated_at": "2024-06-29T16:30:00Z"
        }
    }
}
```

### 5. Delete Form
```javascript
// DELETE /api/formbuilder/forms/{id}
const response = await fetch('/api/formbuilder/forms/1', {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Form deleted successfully",
    "data": {
        "deleted_form_id": 1,
        "submissions_archived": 45
    }
}
```

### 6. Publish Form
```javascript
// POST /api/formbuilder/forms/{id}/publish
const response = await fetch('/api/formbuilder/forms/3/publish', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Form published successfully",
    "data": {
        "form": {
            "id": 3,
            "status": "published",
            "published_at": "2024-06-29T16:45:00Z",
            "form_url": "/forms/3/product-survey",
            "public_url": "https://yourapp.com/forms/3/product-survey"
        }
    }
}
```

### 7. Get Form Submissions
```javascript
// GET /api/formbuilder/forms/{id}/submissions
const response = await fetch('/api/formbuilder/forms/1/submissions?limit=20&status=submitted', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Submissions retrieved successfully",
    "data": {
        "submissions": [
            {
                "id": 1,
                "form_id": 1,
                "submitter": {
                    "id": 5,
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                },
                "submission_data": {
                    "name": "John Doe",
                    "email": "john.doe@example.com",
                    "satisfaction": "very_satisfied",
                    "feedback": "Great service, very happy with the experience!"
                },
                "status": "submitted",
                "ip_address": "192.168.1.100",
                "submitted_at": "2024-06-29T15:30:00Z"
            },
            {
                "id": 2,
                "form_id": 1,
                "submitter": null, // Anonymous submission
                "submission_data": {
                    "name": "Jane Smith",
                    "email": "jane.smith@example.com",
                    "satisfaction": "satisfied",
                    "feedback": "Good overall experience."
                },
                "status": "submitted",
                "ip_address": "192.168.1.101",
                "submitted_at": "2024-06-29T14:15:00Z"
            }
        ],
        "total": 45,
        "limit": 20,
        "offset": 0,
        "has_more": true
    }
}
```

### 8. Submit Form Data
```javascript
// POST /api/formbuilder/forms/{id}/submit
const response = await fetch('/api/formbuilder/forms/1/submit', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        submission_data: {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            satisfaction: "very_satisfied",
            feedback: "Excellent customer service and fast response time!"
        }
    })
});

// Response
{
    "success": true,
    "message": "Form submitted successfully",
    "data": {
        "submission": {
            "id": 46,
            "form_id": 1,
            "submitted_at": "2024-06-29T16:50:00Z",
            "confirmation_code": "FB-2024-0629-46"
        },
        "confirmation_email_sent": true,
        "redirect_url": "/thank-you"
    }
}
```

### 9. Get Form Templates
```javascript
// GET /api/formbuilder/templates
const response = await fetch('/api/formbuilder/templates?category=survey&featured=true', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Templates retrieved successfully",
    "data": {
        "templates": [
            {
                "id": 1,
                "title": "Customer Satisfaction Survey",
                "description": "Standard customer satisfaction survey template",
                "category": "survey",
                "preview_image_url": "/templates/previews/customer-satisfaction.png",
                "is_featured": true,
                "usage_count": 150,
                "template_schema": {
                    "fields": [
                        {
                            "id": "name",
                            "type": "text",
                            "label": "Name",
                            "required": true
                        },
                        {
                            "id": "rating",
                            "type": "rating",
                            "label": "Overall Rating",
                            "required": true,
                            "max_value": 5
                        }
                    ]
                }
            },
            {
                "id": 2,
                "title": "Contact Form",
                "description": "Simple contact form template",
                "category": "contact",
                "preview_image_url": "/templates/previews/contact-form.png",
                "is_featured": true,
                "usage_count": 95
            }
        ],
        "total": 8,
        "categories": ["survey", "contact", "feedback", "registration", "application"]
    }
}
```

### 10. Create Form from Template
```javascript
// POST /api/formbuilder/forms/from-template
const response = await fetch('/api/formbuilder/forms/from-template', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        template_id: 1,
        title: "My Customer Survey",
        description: "Customer survey for our service",
        customizations: {
            fields: [
                {
                    id: "name",
                    label: "Your Full Name"
                }
            ]
        }
    })
});

// Response
{
    "success": true,
    "message": "Form created from template successfully",
    "data": {
        "form": {
            "id": 4,
            "title": "My Customer Survey",
            "description": "Customer survey for our service",
            "status": "draft",
            "template_used": "Customer Satisfaction Survey",
            "created_at": "2024-06-29T17:00:00Z"
        }
    }
}
```

### 11. Get Form Analytics
```javascript
// GET /api/formbuilder/forms/{id}/analytics
const response = await fetch('/api/formbuilder/forms/1/analytics?period=30d', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Analytics retrieved successfully",
    "data": {
        "analytics": {
            "overview": {
                "total_views": 230,
                "total_submissions": 45,
                "conversion_rate": 19.6,
                "completion_rate": 87.5,
                "average_time_to_complete": 180 // seconds
            },
            "daily_stats": [
                {
                    "date": "2024-06-29",
                    "views": 15,
                    "submissions": 3,
                    "conversion_rate": 20.0
                },
                {
                    "date": "2024-06-28",
                    "views": 12,
                    "submissions": 2,
                    "conversion_rate": 16.7
                }
            ],
            "field_analytics": [
                {
                    "field_id": "satisfaction",
                    "field_label": "Satisfaction Level",
                    "response_distribution": {
                        "very_satisfied": 20,
                        "satisfied": 15,
                        "neutral": 6,
                        "dissatisfied": 3,
                        "very_dissatisfied": 1
                    },
                    "abandonment_rate": 5.2
                }
            ],
            "traffic_sources": [
                { "source": "direct", "views": 120, "percentage": 52.2 },
                { "source": "email", "views": 75, "percentage": 32.6 },
                { "source": "social", "views": 35, "percentage": 15.2 }
            ]
        }
    }
}
```

### 12. Export Form Data
```javascript
// GET /api/formbuilder/forms/{id}/export
const response = await fetch('/api/formbuilder/forms/1/export?format=csv&date_from=2024-06-01', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Response
{
    "success": true,
    "message": "Export completed successfully",
    "data": {
        "export": {
            "format": "csv",
            "download_url": "/downloads/form-1-submissions-20240629.csv",
            "total_records": 45,
            "expires_at": "2024-06-30T17:30:00Z",
            "file_size": "15.2 KB"
        }
    }
}
```

---

## 🛠️ React Service Implementation

```typescript
export class FormBuilderService {
    private baseUrl = '/api/formbuilder';
    
    // Get forms list
    async getForms(filters?: any) {
        let url = `${this.baseUrl}/forms`;
        if (filters) {
            const params = new URLSearchParams(filters);
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Create new form
    async createForm(formData: any) {
        const response = await fetch(`${this.baseUrl}/forms`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(formData)
        });
        return await response.json();
    }
    
    // Get form details
    async getForm(formId: number) {
        const response = await fetch(`${this.baseUrl}/forms/${formId}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Update form
    async updateForm(formId: number, formData: any) {
        const response = await fetch(`${this.baseUrl}/forms/${formId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(formData)
        });
        return await response.json();
    }
    
    // Delete form
    async deleteForm(formId: number) {
        const response = await fetch(`${this.baseUrl}/forms/${formId}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Publish form
    async publishForm(formId: number) {
        const response = await fetch(`${this.baseUrl}/forms/${formId}/publish`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Get form submissions
    async getSubmissions(formId: number, filters?: any) {
        let url = `${this.baseUrl}/forms/${formId}/submissions`;
        if (filters) {
            const params = new URLSearchParams(filters);
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Submit form data
    async submitForm(formId: number, submissionData: any) {
        const response = await fetch(`${this.baseUrl}/forms/${formId}/submit`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ submission_data: submissionData })
        });
        return await response.json();
    }
    
    // Get templates
    async getTemplates(filters?: any) {
        let url = `${this.baseUrl}/templates`;
        if (filters) {
            const params = new URLSearchParams(filters);
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Create form from template
    async createFromTemplate(templateData: any) {
        const response = await fetch(`${this.baseUrl}/forms/from-template`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(templateData)
        });
        return await response.json();
    }
    
    // Get form analytics
    async getAnalytics(formId: number, period = '30d') {
        const response = await fetch(`${this.baseUrl}/forms/${formId}/analytics?period=${period}`, {
            headers: this.getHeaders()
        });
        return await response.json();
    }
    
    // Export form data
    async exportFormData(formId: number, format = 'csv', options?: any) {
        let url = `${this.baseUrl}/forms/${formId}/export?format=${format}`;
        if (options) {
            const params = new URLSearchParams(options);
            url += `&${params.toString()}`;
        }
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });
        return await response.json();
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
| GET | `/api/formbuilder/forms` | List user forms | ✅ |
| POST | `/api/formbuilder/forms` | Create new form | ✅ |
| GET | `/api/formbuilder/forms/{id}` | Get form details | ✅ |
| PUT | `/api/formbuilder/forms/{id}` | Update form | ✅ |
| DELETE | `/api/formbuilder/forms/{id}` | Delete form | ✅ |
| POST | `/api/formbuilder/forms/{id}/publish` | Publish form | ✅ |
| GET | `/api/formbuilder/forms/{id}/submissions` | Get submissions | ✅ |
| POST | `/api/formbuilder/forms/{id}/submit` | Submit form data | ✅ |
| GET | `/api/formbuilder/templates` | Get form templates | ✅ |
| POST | `/api/formbuilder/forms/from-template` | Create from template | ✅ |
| GET | `/api/formbuilder/forms/{id}/analytics` | Get form analytics | ✅ |
| GET | `/api/formbuilder/forms/{id}/export` | Export form data | ✅ |

---

## ✨ Status: 100% Complete ✅

All FormBuilder API endpoints are fully implemented and tested, ready for production use.

**Database Tables:** 3 tables integrated  
**API Endpoints:** 12 endpoints working  
**Authentication:** JWT secured  
**Status:** Production ready
