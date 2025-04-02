# Image Processing Feature

## Overview
The image processing feature allows users to upload, process, and manage their images. It includes functionality for image upload, processing, and deletion.

## Components

### ImageUpload
A component that handles image uploads with drag-and-drop support.

#### Features
- Drag and drop interface
- File type validation
- File size limits (5MB)
- Title and description fields
- Progress indication
- Error handling

#### Usage
```tsx
import { ImageUpload } from '@/components/image/ImageUpload';

export default function UploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <ImageUpload />
    </div>
  );
}
```

### ImageList
A component that displays a grid of uploaded images with processing and deletion options.

#### Features
- Responsive grid layout
- Image preview
- Processing options
- Delete functionality
- Loading states
- Error handling

#### Usage
```tsx
import { ImageList } from '@/components/image/ImageList';

export default function ImagesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Images</h1>
      <ImageList />
    </div>
  );
}
```

## API Endpoints

### POST /api/images
Upload a new image.

#### Request
```typescript
{
  file: File;
  title: string;
  description?: string;
}
```

#### Response
```typescript
{
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  original_url: string;
  processed_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}
```

### GET /api/images
Get all images for the current user.

#### Response
```typescript
Array<{
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  original_url: string;
  processed_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}>
```

### POST /api/images/[id]
Process an image.

#### Request
```typescript
{
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
  };
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    sharpen?: number;
  };
}
```

#### Response
```typescript
{
  processed_url: string;
}
```

### DELETE /api/images/[id]
Delete an image.

#### Response
```typescript
{
  success: true;
}
```

## Error Handling

### Common Errors
- Invalid file type
- File size too large
- Upload failed
- Processing failed
- Delete failed
- Permission denied

### Error Messages
- Clear error messages for users
- Toast notifications
- Loading states
- Graceful fallbacks

## Security

### File Validation
- File type restrictions
- File size limits
- Malware scanning
- File integrity checks

### Access Control
- User authentication required
- Owner-only access
- Secure file storage
- Protected API endpoints

## Performance

### Image Optimization
- Lazy loading
- Responsive images
- Image compression
- CDN delivery

### Caching
- Browser caching
- CDN caching
- API response caching
- Image caching 