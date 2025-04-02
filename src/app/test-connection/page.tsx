'use client';

import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';

export default function TestConnection() {
  const [status, setStatus] = useState<{
    connected: boolean;
    error?: string;
    data?: any;
  } | null>(null);

  useEffect(() => {
    async function checkConnection() {
      const result = await testSupabaseConnection();
      setStatus(result);
    }

    checkConnection();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      {status === null ? (
        <div className="text-gray-600">Testing connection...</div>
      ) : status.connected ? (
        <div className="text-green-600">
          <p className="font-semibold">✅ Connected to Supabase</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify(status.data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-red-600">
          <p className="font-semibold">❌ Connection Failed</p>
          <p className="mt-2">{status.error}</p>
        </div>
      )}
    </div>
  );
} 