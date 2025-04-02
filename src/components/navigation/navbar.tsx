"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { 
    name: "Resources", 
    href: "#", 
    hasDropdown: true, 
    children: [
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "API Reference", href: "/api" },
    ]
  },
  { name: "Dashboard", href: "/dashboard", requiresAuth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo on left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black">image pro</span>
          </Link>
        </div>

        {/* Navigation in center */}
        <div className="hidden md:flex items-center justify-center space-x-8">
          {navigation.map((item) => {
            // Skip items that require auth if user is not authenticated
            if (item.requiresAuth && !isAuthenticated) {
              return null;
            }
            
            return (
              <div key={item.href} className="relative">
                {item.hasDropdown && item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "text-sm font-medium text-black transition-colors hover:text-primary relative py-2 flex items-center",
                        openDropdown === item.name ? "text-black" : "text-black/80"
                      )}
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        "ml-1 h-4 w-4 transition-transform",
                        openDropdown === item.name ? "rotate-180" : ""
                      )} />
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-2 w-48 z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm hover:bg-gray-100",
                              pathname === child.href ? "font-medium" : ""
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium text-black transition-colors hover:text-primary relative py-2",
                      pathname === item.href
                        ? "text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:content-['']"
                        : "text-black/80"
                    )}
                  >
                    <span className="flex items-center">
                      {item.name}
                      {item.hasDropdown && (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Auth buttons or user info on right */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  pathname === "/login" 
                    ? "bg-black text-white shadow" 
                    : "text-black border border-black hover:bg-black/5"
                )}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  pathname === "/signup" ? "bg-black/90" : "bg-black"
                )}
              >
                Sign up
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 