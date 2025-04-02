'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        
        <div className="p-6 bg-muted rounded-lg">
          <div className="text-4xl mb-4">📧</div>
          <p className="text-sm">
            Click the link in the email to verify your account. If you don't see it, check your spam folder.
          </p>
        </div>

        <div className="mt-4">
          <Link 
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
} 