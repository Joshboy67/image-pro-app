'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type AuthUser = {
  id: string;
  email: string | null;
  photoURL: string | null;
  profileImage: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfileImage: (imageUrl: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signInWithGoogle: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfileImage: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const fetchProfileData = async (userId: string) => {
    try {
      const cacheKey = `profile_${userId}`;
      
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData).avatar_url || null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (data) {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
      
      return data?.avatar_url || null;
    } catch (err) {
      console.error('Error in fetchProfileData:', err);
      return null;
    }
  };

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profileImage = await fetchProfileData(session.user.id);
        
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || null,
          photoURL: session.user.user_metadata?.avatar_url || null,
          profileImage: profileImage,
        };
        
        setUser(userData);
        setSession(session);
        
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cachedUserData = sessionStorage.getItem('userData');
    if (cachedUserData) {
      setUser(JSON.parse(cachedUserData));
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const profileImage = await fetchProfileData(session.user.id);
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || null,
            photoURL: session.user.user_metadata?.avatar_url || null,
            profileImage: profileImage,
          };
          setUser(userData);
          setSession(session);
          sessionStorage.setItem('userData', JSON.stringify(userData));
        } else {
          setUser(null);
          setSession(null);
          sessionStorage.removeItem('userData');
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfileImage = async (imageUrl: string) => {
    if (!user?.id || !session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        setUser({
          ...user,
          profileImage: imageUrl,
        });
      } else {
        console.error('Error updating profile image:', error);
      }
    } catch (err) {
      console.error('Error in updateProfileImage:', err);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      sessionStorage.clear();
      localStorage.removeItem('supabase.auth.token');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/');
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { error, data };
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      console.log("Google sign-in attempted:", error ? `Error: ${error.message}` : "Redirect initiated");
      return { error };
    } catch (err: any) {
      console.error("Error during Google sign-in setup:", err);
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
}; 