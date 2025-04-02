# Settings Feature

## Overview
The settings feature allows users to customize their application experience, including theme preferences, notification settings, and other user-specific configurations.

## Components

### Theme Settings
- Light/Dark mode toggle
- System theme detection
- Theme persistence
- Smooth transitions

### Notification Settings
- Email notifications
- Push notifications
- Notification preferences
- Notification history

### Privacy Settings
- Profile visibility
- Data sharing preferences
- Account deletion
- Data export

### Account Settings
- Language preferences
- Time zone settings
- Date format
- Number format

## API Endpoints

### GET /api/settings
Get the current user's settings.

#### Response
```typescript
{
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  language: string;
  timezone: string;
  date_format: string;
  number_format: string;
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    data_sharing: boolean;
  };
  created_at: string;
  updated_at: string;
}
```

### PUT /api/settings
Update the current user's settings.

#### Request
```typescript
{
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  language?: string;
  timezone?: string;
  date_format?: string;
  number_format?: string;
  privacy?: {
    profile_visibility?: 'public' | 'private' | 'friends';
    data_sharing?: boolean;
  };
}
```

#### Response
```typescript
{
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  language: string;
  timezone: string;
  date_format: string;
  number_format: string;
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    data_sharing: boolean;
  };
  created_at: string;
  updated_at: string;
}
```

### POST /api/settings/export
Export user data.

#### Response
```typescript
{
  download_url: string;
  expires_at: string;
}
```

### DELETE /api/settings/account
Delete user account.

#### Response
```typescript
{
  success: true;
}
```

## Frontend Components

### SettingsPage
Main settings page component.

#### Features
- Tabbed interface
- Form validation
- Real-time updates
- Success/error notifications
- Loading states

#### Usage
```tsx
import { SettingsPage } from '@/components/settings/SettingsPage';

export default function Settings() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <SettingsPage />
    </div>
  );
}
```

### ThemeToggle
Theme switching component.

#### Features
- Light/Dark mode toggle
- System theme detection
- Smooth transitions
- Persistent selection

### NotificationSettings
Notification preferences component.

#### Features
- Email notifications
- Push notifications
- Notification types
- Schedule settings

### PrivacySettings
Privacy preferences component.

#### Features
- Profile visibility
- Data sharing
- Account deletion
- Data export

## State Management

### Settings Store
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  language: string;
  timezone: string;
  date_format: string;
  number_format: string;
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    data_sharing: boolean;
  };
}
```

### Actions
- Update settings
- Reset settings
- Export data
- Delete account

## Error Handling

### Common Errors
- Invalid settings
- Update failed
- Export failed
- Delete failed

### Error Messages
- Clear error messages
- User-friendly notifications
- Proper error logging
- Graceful fallbacks

## Performance

### Optimization
- Settings caching
- Debounced updates
- Lazy loading
- Minimal re-renders

### Monitoring
- Settings changes
- Error tracking
- Usage analytics
- Performance metrics 