'use client';

import { SignInForm } from '@/components/auth/signin-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignInForm />
    </div>
  );
} 