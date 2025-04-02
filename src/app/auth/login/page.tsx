'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct login path
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-gray-500">Redirecting to login page...</p>
    </div>
  );
} 