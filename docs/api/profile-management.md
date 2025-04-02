# Profile Management API Documentation

## Overview

This document outlines the API endpoints and functionality for profile management in the application.

## Authentication

All endpoints require authentication using a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Get Profile

Retrieves the current user's profile information.

```http
GET /api/profile
```

#### Response

```json
{
  "data": {
    "id": "uuid",
    "full_name": "string",
    "username": "string",
    "bio": "string",
    "website": "string",
    "location": "string",
    "avatar_url": "string",
    "google_avatar_url": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

#### Error Responses

- `401 Unauthorized`: User is not authenticated
- `404 Not Found`: Profile does not exist

### Update Profile

Updates the current user's profile information.

```http
PUT /api/profile
```

#### Request Body

```json
{
  "full_name": "string",
  "username": "string",
  "bio": "string",
  "website": "string",
  "location": "string"
}
```

#### Validation Rules

- `full_name`: Minimum 2 characters
- `username`: 3-30 characters, alphanumeric with underscores and hyphens
- `bio`: Maximum 500 characters
- `website`: Valid URL format
- `location`: Maximum 100 characters

#### Response

```json
{
  "data": {
    "id": "uuid",
    "full_name": "string",
    "username": "string",
    "bio": "string",
    "website": "string",
    "location": "string",
    "avatar_url": "string",
    "google_avatar_url": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

#### Error Responses

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: User is not authenticated
- `409 Conflict`: Username already taken

### Upload Avatar

Uploads a new profile avatar.

```http
POST /api/profile/avatar
```

#### Request Body

```http
Content-Type: multipart/form-data

file: <image_file>
```

#### Supported File Types

- PNG
- JPEG
- GIF
- WebP

#### File Size Limit

Maximum 5MB

#### Response

```json
{
  "data": {
    "avatar_url": "string"
  }
}
```

#### Error Responses

- `400 Bad Request`: Invalid file type or size
- `401 Unauthorized`: User is not authenticated
- `413 Payload Too Large`: File size exceeds limit

### Delete Avatar

Removes the current user's profile avatar.

```http
DELETE /api/profile/avatar
```

#### Response

```json
{
  "data": {
    "success": true
  }
}
```

#### Error Responses

- `401 Unauthorized`: User is not authenticated
- `404 Not Found`: Avatar does not exist

### Sync Google Avatar

Synchronizes the profile avatar with Google account avatar.

```http
POST /api/profile/sync-google-avatar
```

#### Response

```json
{
  "data": {
    "avatar_url": "string"
  }
}
```

#### Error Responses

- `401 Unauthorized`: User is not authenticated
- `400 Bad Request`: No Google avatar URL available

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

## Error Format

All error responses follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": object | null
  }
}
```

## Webhooks

### Profile Update Webhook

Triggered when a profile is updated.

```json
{
  "event": "profile.updated",
  "data": {
    "id": "uuid",
    "updated_fields": ["field1", "field2"],
    "timestamp": "timestamp"
  }
}
```

### Avatar Update Webhook

Triggered when an avatar is updated.

```json
{
  "event": "avatar.updated",
  "data": {
    "id": "uuid",
    "avatar_url": "string",
    "timestamp": "timestamp"
  }
}
```

## Examples

### Update Profile

```bash
curl -X PUT https://api.example.com/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "username": "johndoe",
    "bio": "Software developer",
    "website": "https://example.com",
    "location": "New York"
  }'
```

### Upload Avatar

```bash
curl -X POST https://api.example.com/profile/avatar \
  -H "Authorization: Bearer <token>" \
  -F "file=@avatar.png"
```

## Best Practices

1. **Error Handling**
   - Always check response status codes
   - Handle rate limiting errors gracefully
   - Implement retry logic for transient errors

2. **File Uploads**
   - Validate file types and sizes before upload
   - Compress images before upload
   - Use multipart/form-data for file uploads

3. **Caching**
   - Cache profile data client-side
   - Implement ETag support for profile updates
   - Use conditional requests for avatar updates

4. **Security**
   - Validate all input data
   - Sanitize user-generated content
   - Implement proper CORS policies 