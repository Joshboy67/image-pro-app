"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { BackgroundRemover } from '@/components/tools/background-remover';
import { ImageUpscaler } from '@/components/tools/image-upscaler';
import { RemoveObject } from '@/components/tools/remove-object';
import { Enhancement } from '@/components/tools/enhancement';
import { Settings, UserCircle, Image, Paintbrush, Wand2 } from 'lucide-react';
import Link from 'next/link';

type Tool = 'background-remover' | 'upscaler' | 'remove-object' | 'enhancement';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Get the active tool from URL search params
  useEffect(() => {
    const tool = searchParams.get('tool');
    setActiveTool(tool);
  }, [searchParams]);

  // Update URL when tool changes
  const handleToolChange = (toolId: string | null) => {
    setActiveTool(toolId);
    const params = new URLSearchParams(searchParams.toString());
    if (toolId) {
      params.set('tool', toolId);
    } else {
      params.delete('tool');
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'background-remover':
        return <BackgroundRemover />;
      case 'upscaler':
        return <ImageUpscaler />;
      case 'remove-object':
        return <RemoveObject />;
      case 'enhancement':
        return <Enhancement />;
      default:
        return null;
    }
  };

  const tools = [
    { id: 'background-remover', name: 'Background Remover', icon: Image },
    { id: 'upscaler', name: 'Image Upscaler', icon: Paintbrush },
    { id: 'remove-object', name: 'Remove Object', icon: Settings },
    { id: 'enhancement', name: 'Enhancement', icon: Wand2 },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
            ImagePro
          </Link>
          <nav className="flex items-center space-x-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolChange(tool.id as string | null)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTool === tool.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tool.icon className="mr-2 h-5 w-5" />
                {tool.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderToolPanel()}
        </div>
      </main>

      {/* User Profile Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <Link 
                href="/dashboard/profile"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Manage Account
              </Link>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </footer>
    </div>
  );
} 