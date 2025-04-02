# User Authentication with Supabase

## Overview

This document outlines the implementation plan for user authentication in ImagePro using Supabase. We will support two authentication methods:

1. Email/Password authentication
2. Google Single Sign-On (SSO)

## Technical Architecture

Our authentication flow will be implemented using Supabase Auth, which provides a secure, token-based authentication system. The implementation will follow these principles:

- JWT (JSON Web Tokens) for secure authentication
- Server-side session validation
- Protected routes on both client and server
- Responsive login/signup experience

## Implementation Steps

### 1. Setup and Configuration

#### 1.1 Supabase Project Setup

1. Create a Supabase project in the [Supabase Dashboard](https://app.supabase.com/)
2. Note your Supabase URL and anon/public API key
3. Configure authentication providers in Supabase Dashboard:
   - Email/Password: Enable in the Authentication > Providers section
   - Google: Configure OAuth credentials in Google Cloud Console
   - Add authorized domains for redirects

#### 1.2 Environment Configuration

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Frontend Implementation

#### 2.1 Supabase Client Setup

Create a Supabase client provider in `src/lib/supabase.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// For legacy compatibility with existing code
export const supabase = createClient();
```

#### 2.2 Auth Context Provider

Create an auth context to manage authentication state in `src/contexts/auth-context.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Initial session check
    setIsLoading(true);
    
    // Get session from storage
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { error, data };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 2.3 Auth Forms Implementation

##### Sign Up Form Component (src/components/auth/signup-form.tsx)
```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Redirect to the email verification page
      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    await signInWithGoogle();
    // The redirect is handled by Supabase OAuth
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your journey with ImagePro
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-input px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <span className="border-t w-full absolute"></span>
        <span className="relative bg-background px-2 text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full border border-input flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          {/* Google logo SVG */}
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
```

##### Sign In Form Component (src/components/auth/signin-form.tsx)
Similar to the sign-up form, but using the `signIn` method:

```typescript
// Similar structure to sign-up form, but using signIn instead
// and redirecting to dashboard on success
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    // Redirect to dashboard on successful login
    router.push('/dashboard');
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

#### 2.4 Auth Callback Handler

Create a callback route for OAuth redirects at `src/app/auth/callback/route.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: any) => 
            cookieStore.set(name, value, options),
          remove: (name: string, options: any) => 
            cookieStore.set(name, '', { ...options, maxAge: 0 }),
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

### 3. Server-Side Authentication

#### 3.1 Server Component Auth

For server components, use the Supabase client with cookies:

```typescript
// src/app/dashboard/page.tsx (server component)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => 
          cookieStore.set(name, value, options),
        remove: (name: string, options: any) => 
          cookieStore.set(name, '', { ...options, maxAge: 0 }),
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login');
  }
  
  // Fetch user-specific data
  const { data: userData } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  return (
    <div>
      <h1>Welcome to your dashboard, {userData?.full_name || session.user.email}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

#### 3.2 Middleware for Protected Routes

Create a middleware to protect routes at `src/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set(name, value, options);
        },
        remove: (name: string, options: any) => {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if user is authenticated for protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect logged in users away from auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/login') || 
    req.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
```

### 4. User Profile Database Setup

Create the necessary tables in Supabase:

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a secure RLS policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Set up triggers for user creation
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5. Testing and Validation

Implement thorough testing for authentication flows:

1. Unit tests for authentication functions
2. Integration tests for login/signup flows
3. E2E tests for protected routes
4. Verify email flows and password reset functionality

### 6. Security Considerations

1. **Password Policies**: Enforce strong passwords (done by Supabase)
2. **Rate Limiting**: Prevent brute force attacks (configured in Supabase)
3. **Email Verification**: Require email verification before full access
4. **Session Management**: Configure appropriate token lifetimes
5. **CSRF Protection**: Implemented through Supabase's token approach

## Implementation Checklist

- [ ] Set up Supabase project and configure auth providers
- [ ] Configure environment variables
- [ ] Create Supabase client and auth context
- [ ] Implement sign-up and sign-in forms
- [ ] Create OAuth callback handler
- [ ] Set up server-side authentication
- [ ] Implement middleware for protected routes
- [ ] Create database tables and policies for user profiles
- [ ] Test all authentication flows
- [ ] Configure security settings

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google) 