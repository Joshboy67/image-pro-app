import { createClient } from './supabase';
import { Database } from '@/types/supabase';
import { DatabaseError } from './errors';
import { validateProfile, validateImage, validateUserSettings } from './validation';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Image = Tables['images']['Row'];
type ProcessingHistory = Tables['processing_history']['Row'];
type UserSettings = Tables['user_settings']['Row'];

const supabase = createClient();

// Profile CRUD Operations
export const profileOperations = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Profile;
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    validateProfile(updates);
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Profile;
  },

  // Create user profile (usually handled by trigger)
  createProfile: async (profile: Omit<Profile, 'created_at' | 'updated_at'>) => {
    validateProfile(profile);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Profile;
  },

  // Delete user profile (cascade handled by database)
  deleteProfile: async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw new DatabaseError(error.message, error.code);
  }
};

// User Settings CRUD Operations
export const userSettingsOperations = {
  // Get user settings
  getSettings: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as UserSettings;
  },

  // Update user settings
  updateSettings: async (userId: string, updates: Partial<UserSettings>) => {
    validateUserSettings(updates);
    
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as UserSettings;
  },

  // Create user settings (usually handled by trigger)
  createSettings: async (settings: Omit<UserSettings, 'created_at' | 'updated_at'>) => {
    validateUserSettings(settings);
    
    const { data, error } = await supabase
      .from('user_settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as UserSettings;
  },

  // Delete user settings (cascade handled by database)
  deleteSettings: async (userId: string) => {
    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', userId);

    if (error) throw new DatabaseError(error.message, error.code);
  }
};

// Image CRUD Operations
export const imageOperations = {
  // Get user's images
  getImages: async (userId: string) => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Image[];
  },

  // Get single image
  getImage: async (imageId: string) => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Image;
  },

  // Create new image
  createImage: async (image: Omit<Image, 'id' | 'created_at' | 'updated_at'>) => {
    validateImage(image);
    
    const { data, error } = await supabase
      .from('images')
      .insert(image)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Image;
  },

  // Update image
  updateImage: async (imageId: string, updates: Partial<Image>) => {
    validateImage(updates);
    
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Image;
  },

  // Delete image
  deleteImage: async (imageId: string) => {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (error) throw new DatabaseError(error.message, error.code);
  }
};

// Processing History CRUD Operations
export const processingHistoryOperations = {
  // Get processing history for an image
  getProcessingHistory: async (imageId: string) => {
    const { data, error } = await supabase
      .from('processing_history')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data as ProcessingHistory[];
  },

  // Get user's processing history
  getUserProcessingHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from('processing_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data as ProcessingHistory[];
  },

  // Create processing history entry
  createProcessingHistory: async (history: Omit<ProcessingHistory, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('processing_history')
      .insert(history)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as ProcessingHistory;
  },

  // Update processing history entry
  updateProcessingHistory: async (historyId: string, updates: Partial<ProcessingHistory>) => {
    const { data, error } = await supabase
      .from('processing_history')
      .update(updates)
      .eq('id', historyId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as ProcessingHistory;
  },

  // Delete processing history entry
  deleteProcessingHistory: async (historyId: string) => {
    const { error } = await supabase
      .from('processing_history')
      .delete()
      .eq('id', historyId);

    if (error) throw new DatabaseError(error.message, error.code);
  }
}; 