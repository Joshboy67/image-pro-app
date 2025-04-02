# API Documentation

## Base URL
```
https://api.imagepro.com/v1
```

## Authentication

### Register User (Supabase Auth)
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "fullName": "John Doe"
}
```

**Response**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-03-24T12:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### Login (Supabase Auth)
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

## Projects

### List Projects
```http
GET /projects
Authorization: Bearer {access_token}
```

**Response**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project Description",
      "created_at": "2024-03-24T12:00:00Z",
      "updated_at": "2024-03-24T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Create Project
```http
POST /projects
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project Description"
}
```

**Response**
```json
{
  "id": "uuid",
  "name": "New Project",
  "description": "Project Description",
  "created_at": "2024-03-24T12:00:00Z",
  "updated_at": "2024-03-24T12:00:00Z"
}
```

## Images

### Upload Image
```http
POST /images/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "file": "image_file",
  "projectId": "uuid"
}
```

**Response**
```json
{
  "id": "uuid",
  "originalUrl": "https://storage.supabase.com/original/image.jpg",
  "status": "pending",
  "created_at": "2024-03-24T12:00:00Z"
}
```

### Process Image
```http
POST /images/{image_id}/process
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "background_removal",
  "options": {
    "format": "png",
    "quality": 90
  }
}
```

**Response**
```json
{
  "id": "uuid",
  "status": "processing",
  "processedUrl": null,
  "updated_at": "2024-03-24T12:00:00Z"
}
```

### Get Image Status
```http
GET /images/{image_id}
Authorization: Bearer {access_token}
```

**Response**
```json
{
  "id": "uuid",
  "originalUrl": "https://storage.supabase.com/original/image.jpg",
  "processedUrl": "https://storage.supabase.com/processed/image.png",
  "status": "completed",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png",
    "size": 1024000
  },
  "created_at": "2024-03-24T12:00:00Z",
  "updated_at": "2024-03-24T12:00:00Z"
}
```

## Subscriptions

### List Plans
```http
GET /subscriptions/plans
Authorization: Bearer {access_token}
```

**Response**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": [
        "Basic image editing",
        "Standard quality",
        "5 images per month"
      ]
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 29.99,
      "features": [
        "Advanced AI tools",
        "High quality",
        "Unlimited images",
        "Priority processing"
      ]
    }
  ]
}
```

### Subscribe to Plan (Paystack)
```http
POST /subscriptions
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "planId": "pro",
  "email": "user@example.com",
  "amount": 2999,
  "currency": "NGN"
}
```

**Response**
```json
{
  "id": "uuid",
  "planId": "pro",
  "status": "pending",
  "paystackReference": "ref_123456",
  "currentPeriodStart": "2024-03-24T12:00:00Z",
  "currentPeriodEnd": "2024-04-24T12:00:00Z",
  "created_at": "2024-03-24T12:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input parameters",
    "details": {
      "email": ["Invalid email format"]
    }
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## Rate Limiting

- Free tier: 100 requests per hour
- Pro tier: 1000 requests per hour
- Enterprise tier: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1616630400
```

## Webhooks

### Available Events
- `image.processing.completed`
- `image.processing.failed`
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`

### Webhook Payload
```json
{
  "event": "image.processing.completed",
  "timestamp": "2024-03-24T12:00:00Z",
  "data": {
    "imageId": "uuid",
    "status": "completed",
    "processedUrl": "https://storage.supabase.com/processed/image.png"
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js'
import { ImagePro } from '@imagepro/sdk'

const supabase = createClient(
  'your-supabase-url',
  'your-supabase-anon-key'
)

const client = new ImagePro({
  supabase,
  apiKey: 'your_api_key'
})

// Upload and process image
const result = await client.images.process({
  file: imageFile,
  type: 'background_removal',
  options: {
    format: 'png',
    quality: 90
  }
})
```

### Python
```python
from supabase import create_client
from imagepro import ImagePro

supabase = create_client(
    'your-supabase-url',
    'your-supabase-anon-key'
)

client = ImagePro(
    supabase=supabase,
    api_key='your_api_key'
)

# Upload and process image
result = client.images.process(
    file=image_file,
    type='background_removal',
    options={
        'format': 'png',
        'quality': 90
    }
)
``` 