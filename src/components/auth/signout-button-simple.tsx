'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface SignOutButtonProps {
  className?: string;
  onClick?: () => void;
}

export function SignOutButtonSimple({ className, onClick }: SignOutButtonProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out? You will need to sign in again to access your account.')) {
      setIsLoading(true);
      try {
        await supabase.auth.signOut();
        router.refresh();
        if (onClick) onClick();
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={`group flex w-full items-center gap-x-3 text-gray-700 hover:bg-gray-50 hover:text-primary ${className}`}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary" aria-hidden="true" />
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
} 