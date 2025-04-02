# Database Schema

## Tables

### profiles
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `username`: TEXT (Unique)
- `full_name`: TEXT
- `avatar_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### images
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `title`: TEXT
- `description`: TEXT
- `original_url`: TEXT
- `processed_url`: TEXT
- `status`: TEXT (pending, processing, completed, failed)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### processing_history
- `id`: UUID (Primary Key)
- `image_id`: UUID (Foreign Key to images)
- `user_id`: UUID (Foreign Key to auth.users)
- `operation`: TEXT
- `status`: TEXT (success, failed)
- `details`: TEXT
- `created_at`: TIMESTAMP

### user_settings
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `theme`: TEXT (light, dark, system)
- `notifications_enabled`: BOOLEAN
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Row Level Security (RLS) Policies

### profiles
- Users can view their own profile
- Users can update their own profile

### images
- Users can view their own images
- Users can insert their own images
- Users can update their own images
- Users can delete their own images

### processing_history
- Users can view their own processing history
- Users can insert their own processing history

### user_settings
- Users can view their own settings
- Users can update their own settings

## Triggers

### Automatic Profile Creation
- Trigger: `on_auth_user_created`
- Fires: After INSERT on auth.users
- Creates: Profile and user settings for new users

### Updated At
- Trigger: `update_updated_at_column`
- Fires: Before UPDATE on profiles, images, and user_settings
- Updates: The updated_at timestamp 