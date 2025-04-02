import { ValidationError } from './errors';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Image = Database['public']['Tables']['images']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];

export function validateProfile(profile: Partial<Profile>): void {
  if (profile.username && profile.username.length < 3) {
    throw new ValidationError('Username must be at least 3 characters long', 'username');
  }
  if (profile.username && profile.username.length > 30) {
    throw new ValidationError('Username must be less than 30 characters', 'username');
  }
  if (profile.full_name && profile.full_name.length > 100) {
    throw new ValidationError('Full name must be less than 100 characters', 'full_name');
  }
}

export function validateImage(image: Partial<Image>): void {
  if (!image.original_url) {
    throw new ValidationError('Original URL is required', 'original_url');
  }
  if (image.status && !['pending', 'processing', 'completed', 'failed'].includes(image.status)) {
    throw new ValidationError('Invalid status value', 'status');
  }
}

export function validateUserSettings(settings: Partial<UserSettings>): void {
  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    throw new ValidationError('Invalid theme value', 'theme');
  }
  if (settings.language && settings.language.length !== 2) {
    throw new ValidationError('Language code must be 2 characters', 'language');
  }
  if (settings.timezone && !/^[A-Za-z]+\/[A-Za-z_]+$/.test(settings.timezone)) {
    throw new ValidationError('Invalid timezone format', 'timezone');
  }
  if (settings.date_format && !/^[YMD\-\.]+$/.test(settings.date_format)) {
    throw new ValidationError('Invalid date format', 'date_format');
  }
  if (settings.number_format && !/^[a-z]{2}-[A-Z]{2}$/.test(settings.number_format)) {
    throw new ValidationError('Invalid number format', 'number_format');
  }
} 