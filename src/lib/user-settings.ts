import { createBrowserClient } from '@supabase/ssr';
import { DatabaseError } from '@/lib/errors';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export class UserSettingsService {
  private static instance: UserSettingsService;
  private constructor() {}

  static getInstance(): UserSettingsService {
    if (!UserSettingsService.instance) {
      UserSettingsService.instance = new UserSettingsService();
    }
    return UserSettingsService.instance;
  }

  async getSettings(): Promise<UserSettings | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new DatabaseError('Failed to get user', userError);
      if (!user) throw new DatabaseError('No user found');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw new DatabaseError('Failed to get settings', error);
      return data;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new DatabaseError('Failed to get user', userError);
      if (!user) throw new DatabaseError('No user found');

      // Validate theme
      if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
        throw new Error('Invalid theme value');
      }

      const { data, error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw new DatabaseError('Failed to update settings', error);
      return data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  async updateTheme(theme: 'light' | 'dark' | 'system'): Promise<UserSettings> {
    return this.updateSettings({ theme });
  }

  async toggleNotifications(enabled: boolean): Promise<UserSettings> {
    return this.updateSettings({ notifications_enabled: enabled });
  }

  async initializeSettings(userId: string): Promise<UserSettings> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          theme: 'system',
          notifications_enabled: true,
        })
        .select()
        .single();

      if (error) throw new DatabaseError('Failed to initialize settings', error);
      return data;
    } catch (error) {
      console.error('Error initializing user settings:', error);
      throw error;
    }
  }
}

export const userSettingsService = UserSettingsService.getInstance(); 