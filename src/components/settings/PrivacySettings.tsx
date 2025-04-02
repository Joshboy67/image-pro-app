import { useState } from 'react';

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    dataSharing: true,
    analytics: true,
  });

  const handleProfileVisibilityChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      profileVisibility: value,
    }));
  };

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'profileVisibility') return;
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Privacy
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your privacy settings and data sharing preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Visibility
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control who can see your profile and images.
          </p>
          <div className="mt-2 space-y-2">
            {[
              { value: 'public', label: 'Public' },
              { value: 'private', label: 'Private' },
              { value: 'friends', label: 'Friends Only' },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="profileVisibility"
                  value={option.value}
                  checked={settings.profileVisibility === option.value}
                  onChange={(e) => handleProfileVisibilityChange(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Sharing
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Allow us to collect and analyze usage data to improve the service.
            </p>
          </div>
          <button
            onClick={() => handleToggle('dataSharing')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${settings.dataSharing ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${settings.dataSharing ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analytics
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Allow us to collect analytics data to improve your experience.
            </p>
          </div>
          <button
            onClick={() => handleToggle('analytics')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${settings.analytics ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${settings.analytics ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={() => {/* Implement data export */}}
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Export my data
          </button>
        </div>
      </div>
    </div>
  );
} 