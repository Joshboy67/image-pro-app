export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          original_url: string
          processed_url: string | null
          prompt: string | null
          status: string
          metadata: Json
          processing_options: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          processed_url?: string | null
          prompt?: string | null
          status?: string
          metadata?: Json
          processing_options?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          processed_url?: string | null
          prompt?: string | null
          status?: string
          metadata?: Json
          processing_options?: Json
          created_at?: string
          updated_at?: string
        }
      }
      processing_history: {
        Row: {
          id: string
          image_id: string
          user_id: string
          status: string
          options: Json
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          image_id: string
          user_id: string
          status: string
          options?: Json
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          image_id?: string
          user_id?: string
          status?: string
          options?: Json
          error_message?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          notifications_enabled: boolean
          language: string
          timezone: string
          date_format: string
          number_format: string
          privacy: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          language?: string
          timezone?: string
          date_format?: string
          number_format?: string
          privacy?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          notifications_enabled?: boolean
          language?: string
          timezone?: string
          date_format?: string
          number_format?: string
          privacy?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 