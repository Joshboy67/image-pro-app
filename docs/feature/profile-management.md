# Profile Management

## Overview
The profile management feature allows users to manage their personal information, preferences, and avatar. It includes integration with Google OAuth for automatic avatar synchronization.

## Components

### ProfileForm
A form component for managing profile information:

```typescript
interface ProfileFormProps {
  initialData?: Profile;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

interface ProfileFormData {
  full_name: string;
  username: string;
  bio: string;
  website: string;
  location: string;
  avatar_url?: string;
}
```

### AvatarUpload
A component for handling avatar uploads:

```typescript
interface AvatarUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => Promise<void>;
  onRemove: () => Promise<void>;
}
```

## Google OAuth Integration

### Avatar Synchronization
When a user signs in with Google, their profile picture is automatically synchronized:

1. **Initial Sign-in**:
   - The Google avatar URL is stored in the profile
   - The avatar is downloaded and stored in Supabase storage
   - The profile is updated with the new avatar URL

2. **Avatar Updates**:
   - The system checks for changes in the Google avatar URL
   - If changed, the new avatar is automatically downloaded and updated

### Implementation Details

```typescript
// Google OAuth sign-in flow
async function handleGoogleSignIn(user: User) {
  const googleAvatarUrl = user.user_metadata?.avatar_url;
  
  if (googleAvatarUrl) {
    // Create/update profile with Google data
    await supabase.from('profiles').upsert({
      id: user.id,
      google_avatar_url: googleAvatarUrl,
      full_name: user.user_metadata?.full_name,
      email: user.email,
      avatar_url: googleAvatarUrl,
    });

    // Download and store Google avatar
    await downloadAndStoreGoogleAvatar(user.id, googleAvatarUrl);
  }
}

// Avatar storage function
async function downloadAndStoreGoogleAvatar(userId: string, googleAvatarUrl: string) {
  // Download avatar from Google
  const response = await fetch(googleAvatarUrl);
  const blob = await response.blob();
  
  // Upload to Supabase storage
  const filePath = `${userId}/avatar.png`;
  await supabase.storage
    .from('avatars')
    .upload(filePath, blob, {
      contentType: 'image/png',
      upsert: true
    });
  
  // Update profile with new URL
  const { data: publicURL } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
    
  await supabase
    .from('profiles')
    .update({ avatar_url: publicURL.publicUrl })
    .eq('id', userId);
}
```

## API Endpoints

### Profile Management
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update profile information
- `POST /api/profile/avatar` - Upload new avatar
- `DELETE /api/profile/avatar` - Remove avatar

### Google OAuth
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback and avatar sync

## Database Schema

### Profiles Table
```sql
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  username text unique,
  bio text,
  website text,
  location text,
  avatar_url text,
  google_avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Security Considerations

1. **Avatar Storage**:
   - Avatars are stored in a private bucket
   - Access is controlled through RLS policies
   - File size and type restrictions are enforced

2. **Google OAuth**:
   - Secure token handling
   - Avatar URL validation
   - Error handling for failed downloads

3. **Profile Updates**:
   - Only authenticated users can update their profiles
   - Username uniqueness is enforced
   - Input validation and sanitization

## Error Handling

1. **Avatar Upload Failures**:
   - Retry mechanism for failed downloads
   - Fallback to existing avatar
   - User-friendly error messages

2. **Google OAuth Errors**:
   - Token refresh handling
   - Connection error recovery
   - Rate limiting consideration

## Performance Optimization

1. **Avatar Processing**:
   - Image optimization before storage
   - Caching of public URLs
   - Lazy loading of avatars

2. **Database Operations**:
   - Efficient indexing
   - Batch updates when possible
   - Connection pooling

## Usage Examples

### Sign in with Google
```typescript
const handleGoogleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
};
```

### Update Profile
```typescript
const updateProfile = async (data: ProfileFormData) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Profile update error:', error);
  }
};
```

## Testing

1. **Unit Tests**:
   - Profile form validation
   - Avatar upload handling
   - Google OAuth flow

2. **Integration Tests**:
   - End-to-end sign-in flow
   - Avatar synchronization
   - Profile updates

3. **Security Tests**:
   - RLS policy verification
   - Token handling
   - Input validation 

## Frontend CRUD Integration

### Data Flow Architecture

1. **Profile Data Management**:
   ```typescript
   // src/lib/profile-service.ts
   export class ProfileService {
     private static instance: ProfileService;
     private supabase: SupabaseClient;

     private constructor() {
       this.supabase = createClientComponentClient();
     }

     static getInstance(): ProfileService {
       if (!ProfileService.instance) {
         ProfileService.instance = new ProfileService();
       }
       return ProfileService.instance;
     }

     async getProfile(userId: string): Promise<Profile> {
       const { data, error } = await this.supabase
         .from('profiles')
         .select('*')
         .eq('id', userId)
         .single();

       if (error) throw error;
       return data;
     }

     async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
       const { data: updated, error } = await this.supabase
         .from('profiles')
         .update(data)
         .eq('id', userId)
         .select()
         .single();

       if (error) throw error;
       return updated;
     }

     async uploadAvatar(userId: string, file: File): Promise<string> {
       const fileExt = file.name.split('.').pop();
       const filePath = `${userId}/avatar.${fileExt}`;

       const { error: uploadError } = await this.supabase.storage
         .from('avatars')
         .upload(filePath, file, { upsert: true });

       if (uploadError) throw uploadError;

       const { data: publicURL } = this.supabase.storage
         .from('avatars')
         .getPublicUrl(filePath);

       return publicURL.publicUrl;
     }
   }
   ```

2. **React Query Integration**:
   ```typescript
   // src/hooks/use-profile.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { profileService } from '@/lib/profile-service';

   export function useProfile(userId: string) {
     const queryClient = useQueryClient();

     const { data: profile, isLoading, error } = useQuery({
       queryKey: ['profile', userId],
       queryFn: () => profileService.getProfile(userId),
     });

     const updateProfileMutation = useMutation({
       mutationFn: (data: Partial<Profile>) => 
         profileService.updateProfile(userId, data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['profile', userId] });
       },
     });

     const uploadAvatarMutation = useMutation({
       mutationFn: (file: File) => profileService.uploadAvatar(userId, file),
       onSuccess: (avatarUrl) => {
         updateProfileMutation.mutate({ avatar_url: avatarUrl });
       },
     });

     return {
       profile,
       isLoading,
       error,
       updateProfile: updateProfileMutation.mutate,
       uploadAvatar: uploadAvatarMutation.mutate,
     };
   }
   ```

3. **Profile Form Component with CRUD**:
   ```typescript
   // src/components/profile/profile-form.tsx
   'use client';

   import { useProfile } from '@/hooks/use-profile';
   import { ProfileAvatar } from './profile-avatar';

   export function ProfileForm({ userId }: { userId: string }) {
     const {
       profile,
       isLoading,
       error,
       updateProfile,
       uploadAvatar,
     } = useProfile(userId);

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       const formData = new FormData(e.currentTarget);
       const data = {
         full_name: formData.get('full_name') as string,
         username: formData.get('username') as string,
         bio: formData.get('bio') as string,
         website: formData.get('website') as string,
         location: formData.get('location') as string,
       };
       updateProfile(data);
     };

     const handleAvatarUpload = async (file: File) => {
       uploadAvatar(file);
     };

     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error loading profile</div>;

     return (
       <form onSubmit={handleSubmit} className="space-y-6">
         <div className="flex items-start gap-6">
           <ProfileAvatar
             url={profile?.avatar_url}
             onUpload={handleAvatarUpload}
           />
           <div className="flex-1 space-y-4">
             {/* Form fields */}
             <div>
               <label htmlFor="full_name">Full Name</label>
               <input
                 id="full_name"
                 name="full_name"
                 defaultValue={profile?.full_name}
                 className="w-full rounded-md border p-2"
               />
             </div>
             {/* Add other form fields */}
           </div>
         </div>
         <button
           type="submit"
           className="bg-primary text-white px-4 py-2 rounded-md"
         >
           Save Changes
         </button>
       </form>
     );
   }
   ```

4. **Profile Page with Data Fetching**:
   ```typescript
   // src/app/dashboard/profile/page.tsx
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
   import { cookies } from 'next/headers';
   import { redirect } from 'next/navigation';
   import { ProfileForm } from '@/components/profile/profile-form';

   export default async function ProfilePage() {
     const supabase = createServerComponentClient({ cookies });
     
     const { data: { session } } = await supabase.auth.getSession();
     
     if (!session) {
       redirect('/auth/login');
     }

     return (
       <div className="container max-w-4xl py-12">
         <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
         <ProfileForm userId={session.user.id} />
       </div>
     );
   }
   ```

### State Management

1. **React Query Configuration**:
   ```typescript
   // src/lib/react-query.ts
   import { QueryClient } from '@tanstack/react-query';

   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 1000 * 60 * 5, // 5 minutes
         cacheTime: 1000 * 60 * 30, // 30 minutes
       },
     },
   });
   ```

2. **Provider Setup**:
   ```typescript
   // src/app/providers.tsx
   'use client';

   import { QueryClientProvider } from '@tanstack/react-query';
   import { queryClient } from '@/lib/react-query';

   export function Providers({ children }: { children: React.ReactNode }) {
     return (
       <QueryClientProvider client={queryClient}>
         {children}
       </QueryClientProvider>
     );
   }
   ```

### Error Handling and Loading States

1. **Error Boundaries**:
   ```typescript
   // src/components/error-boundary.tsx
   'use client';

   import { Component, ErrorInfo, ReactNode } from 'react';

   interface Props {
     children: ReactNode;
   }

   interface State {
     hasError: boolean;
     error?: Error;
   }

   export class ErrorBoundary extends Component<Props, State> {
     public state: State = {
       hasError: false
     };

     public static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
       console.error('Uncaught error:', error, errorInfo);
     }

     public render() {
       if (this.state.hasError) {
         return (
           <div className="p-4 bg-red-50 border border-red-200 rounded-md">
             <h2 className="text-red-800 font-semibold">Something went wrong</h2>
             <p className="text-red-600 text-sm mt-2">
               {this.state.error?.message}
             </p>
           </div>
         );
       }

       return this.props.children;
     }
   }
   ```

2. **Loading States**:
   ```typescript
   // src/components/loading.tsx
   export function LoadingSpinner() {
     return (
       <div className="flex items-center justify-center p-4">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
   }
   ```

### Form Validation

1. **Zod Schema**:
   ```typescript
   // src/lib/validations/profile.ts
   import { z } from 'zod';

   export const profileSchema = z.object({
     full_name: z.string().min(2, 'Name must be at least 2 characters'),
     username: z.string()
       .min(3, 'Username must be at least 3 characters')
       .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
     bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
     website: z.string().url('Invalid website URL').optional(),
     location: z.string().max(100, 'Location must be less than 100 characters').optional(),
   });

   export type ProfileFormData = z.infer<typeof profileSchema>;
   ```

2. **Form Validation Integration**:
   ```typescript
   // src/components/profile/profile-form.tsx
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { profileSchema, type ProfileFormData } from '@/lib/validations/profile';

   export function ProfileForm({ userId }: { userId: string }) {
     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm<ProfileFormData>({
       resolver: zodResolver(profileSchema),
     });

     const onSubmit = async (data: ProfileFormData) => {
       updateProfile(data);
     };

     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         {/* Form fields with validation */}
       </form>
     );
   }
   ```

### Real-time Updates

1. **Supabase Realtime Subscription**:
   ```typescript
   // src/hooks/use-profile-updates.ts
   import { useEffect } from 'react';
   import { supabase } from '@/lib/supabase';

   export function useProfileUpdates(userId: string) {
     useEffect(() => {
       const channel = supabase
         .channel(`profile:${userId}`)
         .on(
           'postgres_changes',
           {
             event: 'UPDATE',
             schema: 'public',
             table: 'profiles',
             filter: `id=eq.${userId}`,
           },
           (payload) => {
             // Handle profile update
             console.log('Profile updated:', payload.new);
           }
         )
         .subscribe();

       return () => {
         supabase.removeChannel(channel);
       };
     }, [userId]);
   }
   ``` 