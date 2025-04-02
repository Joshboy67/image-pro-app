import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Theme
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred theme for the application.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme('light')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${
                theme === 'light'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${
                theme === 'dark'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${
                theme === 'system'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            System
          </button>
        </div>
      </div>
    </div>
  );
} 