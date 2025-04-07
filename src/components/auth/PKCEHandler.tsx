'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handlePKCECallback } from '@/lib/pkce-client';

export default function PKCEHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          await handlePKCECallback(code);
          router.push('/dashboard');
        } else {
          router.push('/login?error=no_code');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        const errorMessage = error?.message || 'Authentication failed';
        router.push(`/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 