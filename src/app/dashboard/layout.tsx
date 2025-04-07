"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  Settings,
  User,
  Menu,
  X,
  ArrowUpRight,
  Trash2,
  Wand2,
  Bell,
  Moon,
  Sun,
  Search,
  LogOut,
  HelpCircle,
  FileImage,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SignOutButton } from '@/components/auth/signout-button-simple';

// Tool definitions with improved descriptions and organization
const tools = [
  { 
    id: 'background-remover',
    name: "Background Remover", 
    icon: ImageIcon,
    description: "Remove backgrounds from your images with one click",
    category: "Essential"
  },
  { 
    id: 'upscaler',
    name: "Image Upscaler", 
    icon: ArrowUpRight,
    description: "Enhance resolution and quality of your images",
    category: "Enhancement"
  },
  { 
    id: 'remove-object',
    name: "Remove Object", 
    icon: Trash2,
    description: "Intelligently remove unwanted objects from images",
    category: "Essential"
  },
  { 
    id: 'enhancement',
    name: "Enhancement", 
    icon: Wand2,
    description: "Improve colors, contrast, and overall image quality",
    category: "Enhancement"
  },
  {
    id: 'image-converter',
    name: "Image Converter",
    icon: FileImage,
    description: "Convert images between different formats",
    category: "Utility"
  },
  {
    id: 'image-pro-ai',
    name: "Image Pro AI",
    icon: Sparkles,
    description: "AI-powered image enhancements",
    category: "Pro"
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Sample notifications
  const notifications = [
    { id: 1, message: 'Your image has been processed successfully', time: '2 minutes ago', read: false },
    { id: 2, message: 'New feature available: Image Pro AI', time: '1 hour ago', read: true },
    { id: 3, message: 'System maintenance scheduled for tomorrow', time: '2 hours ago', read: true },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get active tool from URL search params
  useEffect(() => {
    const tool = searchParams.get('tool');
    setActiveTool(tool);
  }, [searchParams]);

  // Handle tool selection
  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('tool');
      router.push(`/dashboard?${params.toString()}`);
    } else {
      setActiveTool(toolId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tool', toolId);
      router.push(`/dashboard?${params.toString()}`);
    }
    setSidebarOpen(false);
  };

  // Update the renderAvatar function to use profile image first
  const renderAvatar = (size: 'sm' | 'lg') => {
    const dimensions = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
    const imageToUse = user?.profileImage || user?.photoURL;
    
    return imageToUse ? (
      <div className={cn(
        dimensions,
        "rounded-full overflow-hidden",
        "ring-2 ring-white dark:ring-gray-800"
      )}>
        <img
          src={imageToUse}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className={cn(
        dimensions,
        "rounded-full bg-gradient-to-r from-blue-500 to-blue-600",
        "flex items-center justify-center text-white",
        size === 'sm' ? "text-sm" : "text-base",
        "font-semibold"
      )}>
        {user?.email?.charAt(0).toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-gray-900/80 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col lg:translate-x-0">
        {/* Sidebar with improved spacing and organization */}
        <div className={cn(
          "flex h-full flex-1 flex-col transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          "border-r"
        )}>
          {/* Logo with improved alignment */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/" className={cn(
              "flex items-center space-x-2.5 text-xl font-bold",
              darkMode ? 'text-white' : 'text-gray-800',
              "hover:text-blue-600 transition-colors"
            )}>
              <ImageIcon className="h-7 w-7" />
              <span>ImagePro</span>
            </Link>
          </div>

          {/* Tools Navigation with improved spacing */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-10">
              {/* Overview Button */}
              <div>
            <button
                  onClick={() => {
                    setActiveTool(null);
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('tool');
                    router.push(`/dashboard?${params.toString()}`);
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 text-base font-extrabold rounded-md transition-all",
                    !activeTool
                      ? darkMode 
                        ? "bg-gray-700 text-white" 
                        : "bg-blue-50 text-blue-700"
                      : darkMode 
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <LayoutDashboard className="mr-3.5 h-5 w-5" />
                  <span className="flex-1">Overview</span>
            </button>
          </div>

              {/* Essential Tools */}
              <div>
                <h3 className={cn(
                  "px-3 text-xs font-extrabold uppercase tracking-wider mb-4",
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Essential Tools
                </h3>
                <div className="space-y-1.5">
                  {tools.filter(tool => tool.category === "Essential").map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={cn(
                        "flex items-center w-full px-4 py-2.5 text-base font-extrabold rounded-md transition-all",
                        activeTool === tool.id
                          ? darkMode 
                            ? "bg-gray-700 text-white" 
                            : "bg-blue-50 text-blue-700"
                          : darkMode 
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <tool.icon className="mr-3.5 h-5 w-5" />
                      <span className="flex-1">{tool.name}</span>
                    </button>
                ))}
                </div>
            </div>

              {/* Enhancement Tools */}
              <div>
                <h3 className={cn(
                  "px-3 text-xs font-extrabold uppercase tracking-wider mb-4",
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Enhancement Tools
                </h3>
                <div className="space-y-1.5">
                  {tools.filter(tool => tool.category === "Enhancement").map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={cn(
                        "flex items-center w-full px-4 py-2.5 text-base font-extrabold rounded-md transition-all",
                        activeTool === tool.id
                          ? darkMode 
                            ? "bg-gray-700 text-white" 
                            : "bg-blue-50 text-blue-700"
                          : darkMode 
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <tool.icon className="mr-3.5 h-5 w-5" />
                      <span className="flex-1">{tool.name}</span>
                    </button>
                  ))}
                </div>
            </div>

              {/* Utility Tools */}
              <div>
                <h3 className={cn(
                  "px-3 text-xs font-extrabold uppercase tracking-wider mb-4",
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Utility Tools
                </h3>
                <div className="space-y-1.5">
                  {tools.filter(tool => tool.category === "Utility").map((tool) => (
              <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={cn(
                        "flex items-center w-full px-4 py-2.5 text-base font-extrabold rounded-md transition-all",
                        activeTool === tool.id
                          ? darkMode 
                            ? "bg-gray-700 text-white" 
                            : "bg-blue-50 text-blue-700"
                          : darkMode 
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <tool.icon className="mr-3.5 h-5 w-5" />
                      <span className="flex-1">{tool.name}</span>
              </button>
                  ))}
        </div>
      </div>

              {/* Pro Tools */}
              <div>
                <h3 className={cn(
                  "px-3 text-xs font-extrabold uppercase tracking-wider mb-4",
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Pro Tools
                </h3>
                <div className="space-y-1.5">
                  {tools.filter(tool => tool.category === "Pro").map((tool) => (
                      <button
                      key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={cn(
                        "flex items-center w-full px-4 py-2.5 text-base font-extrabold rounded-md transition-all",
                          activeTool === tool.id
                          ? darkMode 
                            ? "bg-gray-700 text-white" 
                            : "bg-blue-50 text-blue-700"
                          : darkMode 
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <tool.icon className="mr-3.5 h-5 w-5" />
                      <span className="flex-1">{tool.name}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                        Pro
                      </span>
                      </button>
                  ))}
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <h3 className={cn(
                  "px-3 text-xs font-extrabold uppercase tracking-wider mb-4",
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Settings
                </h3>
                <div className="space-y-1.5">
                      <Link
                    href="/dashboard/profile"
                        className={cn(
                      "flex items-center px-4 py-2.5 text-base font-extrabold rounded-md transition-colors",
                      darkMode 
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <User className="mr-3.5 h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/help"
                          className={cn(
                      "flex items-center px-4 py-2.5 text-base font-extrabold rounded-md transition-colors",
                      darkMode 
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <HelpCircle className="mr-3.5 h-5 w-5" />
                    Help & Support
                      </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile with improved styling */}
          <div className={cn(
            "flex-shrink-0 border-t p-4",
            darkMode ? 'border-gray-700' : 'border-gray-200'
          )}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {renderAvatar('lg')}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-bold truncate max-w-[180px]",
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {user?.email}
                </p>
                <div className="flex items-center mt-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold",
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}>
                    Free Plan
                  </span>
                  <button className={cn(
                    "ml-2 text-xs font-bold",
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  )}>
                    Upgrade
                </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

      {/* Main Content Area */}
      <div className="lg:pl-80">
        <div className="flex min-h-screen flex-col">
          {/* Top Navigation with improved alignment */}
          <header className={cn(
            "sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b px-6",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center text-sm">
              <span className={cn(
                "font-medium",
                darkMode ? "text-gray-200" : "text-gray-900"
              )}>
                {activeTool ? tools.find(t => t.id === activeTool)?.name : "Dashboard"}
              </span>
            </div>

            {/* Search with improved positioning */}
            <div className="flex-1 px-4 flex justify-center max-w-5xl mx-auto">
              <div className="w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg border",
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                  <Search className={cn(
                    "absolute left-3 top-2.5 h-5 w-5",
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  )} />
                </div>
              </div>
            </div>

            {/* Right Navigation with improved spacing */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={cn(
                    "p-2 rounded-full transition-colors relative",
                    darkMode 
                      ? "text-gray-300 hover:bg-gray-700" 
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>
                
                {showNotifications && (
                  <div className={cn(
                    "absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden",
                    darkMode ? "bg-gray-800" : "bg-white",
                    "ring-1 ring-black ring-opacity-5 z-50"
                  )}>
                    <div className="divide-y divide-gray-200">
                      <div className={cn(
                        "px-4 py-3 flex items-center justify-between",
                        darkMode ? "bg-gray-800" : "bg-gray-50"
                      )}>
                        <h3 className={cn(
                          "text-sm font-semibold",
                          darkMode ? "text-gray-200" : "text-gray-900"
                        )}>
                          Notifications
                        </h3>
                        <button className={cn(
                          "text-xs font-medium",
                          darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                        )}>
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "px-4 py-3 hover:bg-gray-50",
                              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
                              !notification.read && (darkMode ? "bg-gray-700/50" : "bg-blue-50")
                            )}
                          >
                            <p className={cn(
                              "text-sm",
                              darkMode ? "text-gray-300" : "text-gray-900"
                            )}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
              ))}
            </div>
          </div>
                  </div>
                )}
              </div>

              {/* Settings Dropdown */}
              <div ref={settingsRef} className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <SignOutButton 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Button */}
              <Link
                href="/dashboard/profile"
                className={cn(
                  "flex-shrink-0 transition-opacity hover:opacity-80",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "rounded-full"
                )}
              >
                {renderAvatar('sm')}
              </Link>
                </div>
          </header>

          {/* Main Content Area with improved padding and max-width */}
          <main className={cn(
            "flex-1 px-4 py-8 sm:px-6 lg:px-8",
            darkMode ? "bg-gray-900" : "bg-gray-50"
          )}>
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 