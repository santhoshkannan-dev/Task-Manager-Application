'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  CheckCircle2,
  BarChart3,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navItems = [
    {
      name: 'Overview',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      name: 'All Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname === '/tasks',
    },
    {
      name: 'Completed',
      href: '/completed',
      icon: CheckCircle2,
      active: pathname === '/completed',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      active: pathname === '/analytics',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#7050DC] flex items-center justify-center text-white shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-base text-charcoal tracking-tight">TaskFlow</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="py-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all',
                    item.active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-gray-50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      item.active ? 'text-[#7050DC]' : 'text-charcoal-muted'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-surface-border">
          <div className="bg-brand-50/70 border border-brand-100 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-brand-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            PostgreSQL Connected
          </div>
        </div>
      </div>
    </div>
  );
}

