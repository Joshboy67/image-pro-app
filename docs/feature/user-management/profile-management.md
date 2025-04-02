# User Profile Management

## Overview

This document outlines the implementation plan for user profile management in ImagePro. The profile management feature allows users to view and update their personal information, preferences, and account settings.

## Technical Architecture

The user profile management will be built on the following components:

- Supabase database for storing user profile information
- Server-side validation of profile updates
- Client-side forms with real-time validation
- Image upload capability for profile pictures
- User preferences storage and retrieval

## Implementation Steps

### 1. Database Schema

We will use the `profiles` table created during authentication setup and extend it with additional fields:

```sql
-- Extend the profiles table with additional fields
ALTER TABLE profiles 
ADD COLUMN display_name TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN website TEXT,
ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN theme TEXT DEFAULT 'light',
ADD COLUMN image_quality TEXT DEFAULT 'high',
ADD COLUMN google_avatar_url TEXT; -- Store original Google avatar URL
```

### 2. Frontend Implementation

#### 2.1 Profile Page Component

Create a profile page component at `src/app/dashboard/profile/page.tsx`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/profile-form';
import { downloadAndUploadGoogleAvatar } from '@/lib/avatar-utils';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // If user has Google avatar but no local avatar, download and store it
  if (profile?.google_avatar_url && !profile?.avatar_url) {
    await downloadAndUploadGoogleAvatar(session.user.id, profile.google_avatar_url);
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileForm profile={profile} user={session.user} />
    </div>
  );
}
```

#### 2.2 Profile Form Component

Create a form component for editing profiles at `src/components/profile/profile-form.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ProfileAvatar } from './profile-avatar';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  display_name: string | null;
  bio: string | null;
  website: string | null;
  email_notifications: boolean;
  theme: string;
  image_quality: string;
};

type ProfileFormProps = {
  profile: Profile;
  user: User;
};

export function ProfileForm({ profile, user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    email_notifications: profile?.email_notifications || true,
    theme: profile?.theme || 'light',
    image_quality: profile?.image_quality || 'high',
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          display_name: formData.display_name,
          bio: formData.bio,
          website: formData.website,
          email_notifications: formData.email_notifications,
          theme: formData.theme,
          image_quality: formData.image_quality,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Profile updated successfully');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-600 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <ProfileAvatar 
            url={profile?.avatar_url} 
            uid={user.id} 
            onUploadComplete={() => router.refresh()} 
          />
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is how your name will appear publicly
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="email_notifications"
              name="email_notifications"
              type="checkbox"
              checked={formData.email_notifications}
              onChange={handleCheckboxChange}
              className="rounded border-input h-4 w-4"
            />
            <label htmlFor="email_notifications" className="ml-2 block text-sm">
              Receive email notifications
            </label>
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="image_quality" className="block text-sm font-medium mb-1">
              Default Image Quality
            </label>
            <select
              id="image_quality"
              name="image_quality"
              value={formData.image_quality}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="low">Low (faster)</option>
              <option value="medium">Medium</option>
              <option value="high">High (best quality)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
```

#### 2.3 Profile Avatar Component

Create a component for avatar upload at `src/components/profile/profile-avatar.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type ProfileAvatarProps = {
  url: string | null;
  uid: string;
  onUploadComplete: () => void;
};

export function ProfileAvatar({ url, uid, onUploadComplete }: ProfileAvatarProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}/avatar.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's avatar_url in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', uid);
      
      if (updateError) {
        throw updateError;
      }
      
      onUploadComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-muted">
        {url ? (
          <Image
            src={url}
            alt="Avatar"
            className="object-cover"
            fill
            sizes="128px"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <span className="text-3xl">
              {/* Placeholder user icon */}
              👤
            </span>
          </div>
        )}
      </div>
      
      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md text-sm font-medium">
        {uploading ? 'Uploading...' : 'Change Avatar'}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

#### 2.4 Avatar Utilities

Create a utility file for avatar handling at `src/lib/avatar-utils.ts`:

```typescript
import { supabase } from './supabase';

export async function downloadAndUploadGoogleAvatar(userId: string, googleAvatarUrl: string) {
  try {
    // Download the avatar from Google
    const response = await fetch(googleAvatarUrl);
    if (!response.ok) throw new Error('Failed to download Google avatar');
    
    const blob = await response.blob();
    const fileExt = 'png'; // Google avatars are typically PNG
    const filePath = `${userId}/avatar.${fileExt}`;
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: publicURL } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicURL.publicUrl })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error processing Google avatar:', error);
    return null;
  }
}

export async function updateGoogleAvatar(userId: string, googleAvatarUrl: string) {
  try {
    // Update the Google avatar URL in the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ google_avatar_url: googleAvatarUrl })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    // Download and upload the new avatar
    return await downloadAndUploadGoogleAvatar(userId, googleAvatarUrl);
  } catch (error) {
    console.error('Error updating Google avatar:', error);
    return null;
  }
}
```

### 3. Server-Side Implementation

#### 3.1 API Route for Profile Updates

Create an API route for profile updates at `src/app/api/profile/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { downloadAndUploadGoogleAvatar } from '@/lib/avatar-utils';

export async function PUT(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get profile data from request body
    const profileData = await request.json();
    
    // If Google avatar URL is provided, download and store it
    if (profileData.google_avatar_url) {
      const avatarUrl = await downloadAndUploadGoogleAvatar(
        session.user.id,
        profileData.google_avatar_url
      );
      if (avatarUrl) {
        profileData.avatar_url = avatarUrl;
      }
    }
    
    // Validate the data (implement more thorough validation as needed)
    if (profileData.website && !isValidUrl(profileData.website)) {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      );
    }
    
    // Update the profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Utility function to validate URLs
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

#### 3.2 Storage Configuration

Configure Supabase storage for avatar uploads:

1. Create a storage bucket named `avatars` in the Supabase dashboard
2. Set appropriate permissions for the bucket:

```sql
-- Allow users to upload their own avatars only
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Allow users to update/delete their own avatars
CREATE POLICY "Users can update/delete their own avatars"
ON storage.objects
FOR UPDATE
USING (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Allow public access for reading avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars'
);
```

### 4. Account Settings

#### 4.1 Account Settings Page

Create an account settings page at `src/app/dashboard/settings/page.tsx`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PasswordUpdateForm } from '@/components/profile/password-update-form';
import { AccountDeletionForm } from '@/components/profile/account-deletion-form';
import { updateGoogleAvatar } from '@/lib/avatar-utils';

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // If user has Google avatar URL in metadata, update it
  const googleAvatarUrl = session.user.user_metadata?.avatar_url;
  if (googleAvatarUrl) {
    await updateGoogleAvatar(session.user.id, googleAvatarUrl);
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">Email Address</h2>
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <p>{session.user.email}</p>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {session.user.email_confirmed_at ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          
          {!session.user.email_confirmed_at && (
            <button className="text-sm text-primary mt-2">
              Resend verification email
            </button>
          )}
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Update Password</h2>
          <div className="border rounded-md p-6">
            <PasswordUpdateForm />
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
          <div className="border border-red-200 rounded-md p-6 bg-red-50">
            <AccountDeletionForm userId={session.user.id} />
          </div>
        </section>
      </div>
    </div>
  );
}
```

#### 4.2 Password Update Form

Create a form for password updates at `src/components/profile/password-update-form.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function PasswordUpdateForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // Basic validation
    if (newPassword !== confirmNewPassword) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Clear form and show success message
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSuccessMessage('Password updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-600 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="new_password" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <input
          id="new_password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="confirm_new_password" className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <input
          id="confirm_new_password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}
```

#### 4.3 Account Deletion Form

Create a form for account deletion at `src/components/profile/account-deletion-form.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AccountDeletionFormProps = {
  userId: string;
};

export function AccountDeletionForm({ userId }: AccountDeletionFormProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Confirmation check
    if (confirmation !== 'DELETE MY ACCOUNT') {
      setError('Please type the confirmation text exactly as shown');
      setIsLoading(false);
      return;
    }
    
    try {
      // First delete profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        throw profileError;
      }
      
      // Then sign out to complete deletion
      await supabase.auth.signOut();
      
      // Redirect to homepage
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="text-sm text-red-600 space-y-2">
        <p className="font-medium">Warning: This action cannot be undone.</p>
        <p>
          When you delete your account, all your data, including your profile, 
          images, and preferences will be permanently removed.
        </p>
      </div>
      
      <div>
        <label htmlFor="confirmation" className="block text-sm font-medium mb-1">
          Type <span className="font-bold">DELETE MY ACCOUNT</span> to confirm
        </label>
        <input
          id="confirmation"
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700"
        >
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </form>
  );
}
```

### 5. User Preferences Service

Create a service to manage user preferences at `src/lib/user-preferences.ts`:

```typescript
import { supabase } from './supabase';

type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  image_quality: 'low' | 'medium' | 'high';
};

export async function getUserPreferences(userId: string): Promise<Partial<UserPreferences>> {
  const { data, error } = await supabase
    .from('profiles')
    .select('theme, email_notifications, image_quality')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user preferences:', error);
    return {};
  }
  
  return data;
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(preferences)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

export async function applyThemePreference(theme: 'light' | 'dark' | 'system'): Promise<void> {
  // Apply theme preference to the document
  const root = document.documentElement;
  
  if (theme === 'system') {
    // Use system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.toggle('dark', systemTheme === 'dark');
  } else {
    // Use user preference
    root.classList.toggle('dark', theme === 'dark');
  }
}
```

### 6. Navigation Integration

Add profile navigation to the dashboard at `src/components/dashboard/sidebar.tsx`:

```typescript
// Add profile and settings links to the sidebar
const navigationItems = [
  // ... existing links
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: UserIcon,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: SettingsIcon,
  },
];
```

## Implementation Checklist

- [ ] Extend the profiles table with additional fields
- [ ] Create the profile page component
- [ ] Implement the profile form component
- [ ] Create the avatar upload component
- [ ] Implement server-side API route for profile updates
- [ ] Configure Supabase storage for avatars
- [ ] Create account settings page
- [ ] Implement password update functionality
- [ ] Create account deletion flow
- [ ] Implement user preferences service
- [ ] Update dashboard navigation
- [ ] Test all profile management functionality

## Security Considerations

1. **Data Validation**: Validate all user inputs on both client and server sides
2. **Storage Security**: Set appropriate RLS policies for avatar storage
3. **Password Requirements**: Enforce strong password requirements for updates
4. **Delete Confirmation**: Require explicit confirmation for account deletion
5. **User Verification**: Only allow authenticated users to access/modify their own data

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hook Form](https://react-hook-form.com/) (optional for more complex forms) 