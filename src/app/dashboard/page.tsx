"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { BackgroundRemover } from '@/components/tools/background-remover';
import { ImageUpscaler } from '@/components/tools/image-upscaler';
import { RemoveObject } from '@/components/tools/remove-object';
import { Enhancement } from '@/components/tools/enhancement';
import ImageConverter from '@/components/tools/image-converter';
import { ImageProAI } from '@/components/tools/image-pro-ai';
import { 
  Image, FileImage, Zap, Crown, History, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [recentFiles, setRecentFiles] = useState([
    { id: 1, name: 'vacation-photo.jpg', type: 'image/jpeg', date: '2 hours ago', size: '2.4 MB' },
    { id: 2, name: 'profile-picture.png', type: 'image/png', date: '5 hours ago', size: '1.8 MB' },
    { id: 3, name: 'document-scan.jpg', type: 'image/jpeg', date: 'Yesterday', size: '3.1 MB' },
  ]);

  const stats = [
    { 
      id: 1, 
      name: 'Images Processed', 
      value: '1,234', 
      icon: Image, 
      change: '+12%',
      description: 'Total images processed this month'
    },
    { 
      id: 2, 
      name: 'Storage Used', 
      value: '2.4 GB', 
      icon: FileImage, 
      change: '+5%',
      description: 'Total storage space used'
    },
    { 
      id: 3, 
      name: 'Processing Credits', 
      value: '850', 
      icon: Zap, 
      change: '-3%',
      description: 'Remaining processing credits'
    },
    { 
      id: 4, 
      name: 'Pro Features Used', 
      value: '15/20', 
      icon: Crown, 
      change: '+2%',
      description: 'Pro features utilized this month'
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const tool = searchParams.get('tool');
    setActiveTool(tool);
  }, [searchParams]);

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
      case 'image-converter':
        return <ImageConverter />;
      case 'image-pro-ai':
        return <ImageProAI />;
      default:
  return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome to ImagePro</h1>
              <p className="text-blue-100 mb-4">
                Get started by selecting a tool from the sidebar or explore your recent activity below.
              </p>
              <div className="inline-flex items-center text-sm font-medium text-blue-100 hover:text-white transition-colors">
                View Tutorial
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            {/* Stats Section */}
            {showStats && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.id}
                      className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-blue-50">
                          <stat.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </p>
                          <div className="flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </p>
                            <span className={cn(
                              "ml-2 text-xs font-medium",
                              stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            )}>
                              {stat.change}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {stat.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
        </div>
        </div>
            )}

            {/* Recent Files Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Files
                </h2>
                <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
            </div>
              <div className="rounded-lg overflow-hidden bg-white shadow-sm divide-y divide-gray-200">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="p-2 rounded-full bg-blue-50">
                        <FileImage className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span>{file.date}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <History className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className={cn(
        "h-full rounded-lg bg-white shadow-sm",
        "transition-all duration-200 ease-in-out",
        activeTool ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "min-h-[calc(100vh-16rem)]",
          activeTool && "animate-in fade-in duration-300"
        )}>
          {renderToolPanel()}
        </div>
      </div>
    </div>
  );
} 