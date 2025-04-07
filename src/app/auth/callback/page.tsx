'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      // Handle missing code
      if (!code) {
        console.error('No code received');
        router.push('/login?error=no_code');
        return;
      }

      try {
        // Let Supabase handle the code exchange
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          throw exchangeError;
        }

        // Redirect to dashboard on success
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Error handling callback:', error);
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">Completing sign in...</h1>
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 