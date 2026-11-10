'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  CheckCircle2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

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
      name: 'My Tasks',
      href: '/my-tasks',
      icon: ListTodo,
      active: pathname === '/my-tasks',
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
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between border-r border-surface-border bg-white transition-all duration-300 relative z-30 shrink-0 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Branding & Nav */}
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-border">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#7050DC] flex items-center justify-center text-white shadow-sm shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-charcoal">
                  TaskFlow
                </span>
                <span className="text-[10px] font-medium tracking-wider text-charcoal-muted uppercase">
                  Workspace
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-brand-50 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative',
                  item.active
                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-gray-50'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {/* Active Indicator Bar */}
                {item.active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#7050DC] rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    item.active ? 'text-[#7050DC]' : 'text-charcoal-muted group-hover:text-charcoal'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Branding / Pro Card */}
      <div className="p-4 border-t border-surface-border">
        {!isCollapsed ? (
          <div className="bg-brand-50/70 border border-brand-100 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL Connected
            </div>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              TaskFlow Pro v1.0.0
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="PostgreSQL Connected" />
          </div>
        )}
      </div>
    </aside>
  );
}

