"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Users", href: "/users", icon: "👥", adminOnly: true },
    { name: "Leave Requests", href: "/leave-requests", icon: "📋", adminOnly: true },
    { name: "My Leave Requests", href: "/my-leave-requests", icon: "📝" },
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter((item) => {
    // Admin can see all pages
    if (user?.role === 1) {
      return true;
    }
    
    // Employees can only see non-admin-only pages
    if (item.adminOnly && user?.role !== 1) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Leaves Management System
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role === 1 ? "Admin" : "Employee"}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-6">
            <div className="px-3">
              {filteredNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md mb-1 transition-colors"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
