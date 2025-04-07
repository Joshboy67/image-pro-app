'use client';

import { useState, useEffect } from 'react';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Database connection is working');
        } else {
          setStatus('error');
          setMessage(data.error || 'Database connection failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to connect to database');
      }
    };

    checkDatabase();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Database Status</h2>
      <div className={`p-3 rounded-md ${
        status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
        status === 'success' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status === 'loading' && 'Checking database connection...'}
        {status === 'success' && message}
        {status === 'error' && message}
      </div>
    </div>
  );
} 