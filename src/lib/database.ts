import { createClient } from './supabase';
import type { Profile, Image, ProcessingHistory, UserSettings } from '../types';

export class DatabaseService {
  private supabase = createClient();

  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Image operations
  async createImage(image: Omit<Image, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('images')
      .insert(image)
      .select()
      .single();

    if (error) throw error;
    return data as Image;
  }

  async getImages(userId: string) {
    const { data, error } = await this.supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Image[];
  }

  async updateImage(imageId: string, updates: Partial<Image>) {
    const { data, error } = await this.supabase
      .from('images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return data as Image;
  }

  async deleteImage(imageId: string) {
    const { error } = await this.supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  }

  // Processing history operations
  async createProcessingHistory(history: Omit<ProcessingHistory, 'id' | 'created_at'>) {
    const { data, error } = await this.supabase
      .from('processing_history')
      .insert(history)
      .select()
      .single();

    if (error) throw error;
    return data as ProcessingHistory;
  }

  async getProcessingHistory(userId: string) {
    const { data, error } = await this.supabase
      .from('processing_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProcessingHistory[];
  }

  // User settings operations
  async getUserSettings(userId: string) {
    const { data, error } = await this.supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as UserSettings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>) {
    const { data, error } = await this.supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  }
}

export const databaseService = new DatabaseService(); 