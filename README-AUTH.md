# Setting up Authentication with Supabase

This document provides instructions for setting up authentication with Supabase in the ImagePro application.

## Prerequisites

1. A Supabase account
2. A project created in Supabase dashboard

## Configuration Steps

### 1. Set environment variables

Copy the `.env.local` file and update it with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project dashboard under Settings > API.

### 2. Initialize the Profiles Table

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `sql/init-profiles.sql`
5. Run the query

This will:
- Create a profiles table to store user information
- Set up row-level security policies
- Create a trigger to automatically create profile entries for new users

### 3. Set up Google OAuth (Optional)

To enable Google sign-in:

1. Create a Google Cloud project and OAuth credentials
2. In your Supabase dashboard, go to Authentication > Providers > Google
3. Enable Google authentication
4. Enter your Google Client ID and Secret
5. Add your application's domains to the redirect URLs in both Google Console and Supabase

### 4. Storage for User Avatars

Set up a storage bucket for user avatars:

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `avatars`
3. Configure access permissions as needed (public or private)

## Usage

The authentication system provides the following features:

- User registration with email and password
- Email verification
- Login with email and password
- OAuth login with Google
- User profile management
- Password reset

## Components

- `AuthProvider`: Context provider for authentication state
- `SignUpForm`: User registration form
- `SignInForm`: Login form
- `ProfileForm`: User profile management
- `ProfileAvatar`: Avatar upload and management

## Protected Routes

Routes under `/dashboard/*` are protected and require authentication. Unauthenticated users will be redirected to the login page. 