import { useState } from 'react';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    processingComplete: true,
    processingFailed: true,
    newFeatures: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Notifications
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your notification preferences.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getNotificationDescription(key)}
              </p>
            </div>
            <button
              onClick={() => handleToggle(key as keyof typeof settings)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${value ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  switch (key) {
    case 'emailNotifications':
      return 'Receive notifications via email';
    case 'pushNotifications':
      return 'Receive push notifications in your browser';
    case 'processingComplete':
      return 'Get notified when image processing is complete';
    case 'processingFailed':
      return 'Get notified when image processing fails';
    case 'newFeatures':
      return 'Receive updates about new features and improvements';
    default:
      return '';
  }
} 