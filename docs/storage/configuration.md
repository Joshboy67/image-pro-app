# Storage Configuration

## Buckets

### avatars
- Purpose: Store user profile pictures
- Access: Public read, authenticated write
- File Types: JPEG, PNG, GIF, WebP
- Max File Size: 5MB
- Naming Convention: `{userId}-{uuid}.{extension}`

### processed-images
- Purpose: Store processed images
- Access: Public read, authenticated write
- File Types: JPEG, PNG, GIF, WebP
- Max File Size: 5MB
- Naming Convention: `{userId}-{uuid}.{extension}`

### temp-uploads
- Purpose: Store temporary uploads
- Access: Private, authenticated read/write
- File Types: JPEG, PNG, GIF, WebP
- Max File Size: 5MB
- Naming Convention: `{userId}-{uuid}.{extension}`

## File Validation

### Allowed File Types
- image/jpeg
- image/png
- image/gif
- image/webp

### File Size Limits
- Maximum file size: 5MB
- Minimum file size: 1KB

### File Naming
- Files are renamed using UUID to prevent collisions
- Original file extension is preserved
- User ID is included for ownership tracking

## Security

### Access Control
- Public buckets: Readable by anyone, writable by authenticated users
- Private buckets: Readable and writable only by authenticated users
- File ownership is enforced through user ID in filename

### File Validation
- File type validation before upload
- File size validation before upload
- Malware scanning (if configured)
- File integrity checks

## Usage

### Uploading Files
```typescript
// Upload avatar
const avatarUrl = await storageService.uploadAvatar(userId, file);

// Upload image
const imageUrl = await storageService.uploadImage(userId, file);

// Save processed image
const processedUrl = await storageService.saveProcessedImage(userId, file, originalFileName);
```

### Deleting Files
```typescript
// Delete file
await storageService.deleteImage(bucket, path);
```

## Error Handling

### Common Errors
- Invalid file type
- File size too large
- Upload failed
- Delete failed
- Permission denied

### Error Messages
- Clear error messages for users
- Proper error logging
- Graceful fallbacks 