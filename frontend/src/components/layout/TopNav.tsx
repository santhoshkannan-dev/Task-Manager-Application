'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

export function TopNav({ onOpenMobileMenu }: TopNavProps) {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    switch (pathname) {
      case '/':
        return 'Overview';
      case '/tasks':
        return 'All Tasks';
      case '/completed':
        return 'Completed Tasks';
      case '/analytics':
        return 'Productivity Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-surface-border bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-gray-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <Link href="/" className="text-charcoal-muted hover:text-charcoal transition-colors">
            Workspace
          </Link>
          <span className="text-charcoal-light">/</span>
          <span className="text-charcoal font-semibold">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right: Actions, Notifications, User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Environment pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-100 text-[11px] font-semibold text-brand-700">
          <Sparkles className="w-3 h-3 text-[#7050DC]" />
          <span>PostgreSQL Active</span>
        </div>

        {/* Notification Icon */}
        <button
          className="relative p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AC
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-charcoal leading-none">Alex Chen</span>
            <span className="text-[10px] text-charcoal-muted mt-0.5 leading-none">Product Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}

