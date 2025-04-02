import { useState } from 'react';

export function AccountSettings() {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'en-US',
  });

  const handleChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Account Settings
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize your account preferences and display settings.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Language
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Time Zone
          </label>
          <select
            id="timezone"
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dateFormat"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Date Format
          </label>
          <select
            id="dateFormat"
            value={settings.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="numberFormat"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Number Format
          </label>
          <select
            id="numberFormat"
            value={settings.numberFormat}
            onChange={(e) => handleChange('numberFormat', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="en-US">US (1,234.56)</option>
            <option value="de-DE">German (1.234,56)</option>
            <option value="fr-FR">French (1 234,56)</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={() => {/* Implement account deletion */}}
            className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
} 