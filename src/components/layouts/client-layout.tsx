'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-1">
        {!isDashboard && <Navbar />}
        <main className={`${isDashboard ? '' : 'py-4'}`}>{children}</main>
        {!isDashboard && <Footer />}
      </div>
    </div>
  );
} 