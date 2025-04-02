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
} from "lucide-react";
import { useState, useEffect } from "react";
import { SignOutButton } from "@/components/auth/signout-button";
import { useAuth } from "@/contexts/auth-context";

// Tool definitions
const tools = [
  { 
    name: "Background Remover", 
    id: "bg-remover", 
    icon: ImageIcon,
    description: "Remove backgrounds from your images with one click"
  },
  { 
    name: "Image Upscaler", 
    id: "upscaler", 
    icon: ArrowUpRight,
    description: "Enhance resolution and quality of your images"
  },
  { 
    name: "Remove Object", 
    id: "remove-object", 
    icon: Trash2,
    description: "Intelligently remove unwanted objects from images"
  },
  { 
    name: "Enhancement", 
    id: "enhancement", 
    icon: Wand2,
    description: "Improve colors, contrast, and overall image quality"
  },
];

// Navigation items
const navigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
  const { user } = useAuth();

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
  };

  // Navigate to profile page
  const navigateToProfile = () => {
    setActiveTool(null);
    router.push('/dashboard/profile');
  };

  // Check if we're on the main dashboard page
  const isDashboardPage = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-gray-900/80 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              ImagePro
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-8">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Tools</h3>
              <ul role="list" className="mt-2 -mx-2 space-y-1">
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => {
                        handleToolClick(tool.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        activeTool === tool.id
                          ? "bg-gray-50 text-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      )}
                    >
                      <tool.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          activeTool === tool.id
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-primary"
                        )}
                        aria-hidden="true"
                      />
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Navigation</h3>
              <ul role="list" className="mt-2 -mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        pathname === item.href
                          ? "bg-gray-50 text-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      )}
                      onClick={() => {
                        setActiveTool(null);
                        setSidebarOpen(false);
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          pathname === item.href
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-primary"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <button
                onClick={navigateToProfile}
                className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="truncate">{user?.email || "User"}</span>
              </button>
              <SignOutButton className="mt-4" onClick={() => setSidebarOpen(false)} />
            </div>
          </nav>
        </div>
      </div>

      {/* Main content with static sidebar */}
      <div className="flex min-h-screen">
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/" className="text-xl font-bold">
                ImagePro
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Tools</h3>
                <ul role="list" className="mt-2 -mx-2 space-y-1">
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => handleToolClick(tool.id)}
                        className={cn(
                          "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          activeTool === tool.id
                            ? "bg-gray-50 text-primary"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        )}
                      >
                        <tool.icon
                          className={cn(
                            "h-6 w-6 shrink-0",
                            activeTool === tool.id
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-primary"
                          )}
                          aria-hidden="true"
                        />
                        {tool.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Navigation</h3>
                <ul role="list" className="mt-2 -mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          pathname === item.href
                            ? "bg-gray-50 text-primary"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        )}
                        onClick={() => setActiveTool(null)}
                      >
                        <item.icon
                          className={cn(
                            "h-6 w-6 shrink-0",
                            pathname === item.href
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-primary"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <button
                  onClick={navigateToProfile}
                  className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span className="truncate">{user?.email || "User"}</span>
                </button>
                <SignOutButton className="mt-4" />
              </div>
            </nav>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:pl-72 w-full">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Top-right tool navigation */}
            <div className="ml-auto flex items-center space-x-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={cn(
                    "hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md",
                    activeTool === tool.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <tool.icon className="h-4 w-4 mr-1.5" />
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Tool panel or default content */}
              {isDashboardPage && activeTool ? (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {tools.find(t => t.id === activeTool)?.name}
                  </h2>
                  <p className="text-gray-500 mb-4">
                    {tools.find(t => t.id === activeTool)?.description}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    {/* This is where we'll render the tool-specific component */}
                    {activeTool === 'bg-remover' && <div>Background Remover Tool Panel</div>}
                    {activeTool === 'upscaler' && <div>Image Upscaler Tool Panel</div>}
                    {activeTool === 'remove-object' && <div>Remove Object Tool Panel</div>}
                    {activeTool === 'enhancement' && <div>Enhancement Tool Panel</div>}
                  </div>
                </div>
              ) : null}
              
              {/* Main dashboard content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 