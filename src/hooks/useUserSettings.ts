import { useState, useEffect } from 'react';
import { userSettingsService, UserSettings } from '@/lib/user-settings';

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await userSettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load settings'));
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      setLoading(true);
      const updatedSettings = await userSettingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update settings'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    return updateSettings({ theme });
  };

  const toggleNotifications = async (enabled: boolean) => {
    return updateSettings({ notifications_enabled: enabled });
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateTheme,
    toggleNotifications,
    refreshSettings: loadSettings,
  };
} 