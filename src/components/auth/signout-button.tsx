'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';

type SignOutButtonProps = {
  className?: string;
  onClick?: () => void;
};

export function SignOutButton({ className = '', onClick }: SignOutButtonProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (onClick) {
      onClick();
    }
    
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary ${className}`}
    >
      <LogOut
        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary"
        aria-hidden="true"
      />
      Sign out
    </button>
  );
} 