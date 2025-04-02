import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  full_name?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  bio: string;
  website: string;
  location: string;
  avatar_url: string;
  google_avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  user_id: string;
  original_url: string;
  processed_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  processing_options: {
    resize?: {
      width?: number;
      height?: number;
      fit?: 'cover' | 'contain' | 'fill';
    };
    format?: string;
    quality?: number;
    filters?: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
      blur?: number;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ProcessingHistory {
  id: string;
  image_id: string;
  user_id: string;
  status: 'success' | 'failed';
  options: {
    resize?: {
      width?: number;
      height?: number;
      fit?: 'cover' | 'contain' | 'fill';
    };
    format?: string;
    quality?: number;
    filters?: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
      blur?: number;
    };
  };
  error_message?: string;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
} 