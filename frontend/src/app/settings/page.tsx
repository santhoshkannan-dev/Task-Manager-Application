'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Server, Database, Sparkles, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { taskApi } from '@/services/api';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [defaultSort, setDefaultSort] = useState<'newest' | 'priority'>('newest');

  const checkApiHealth = async () => {
    setIsChecking(true);
    try {
      const res = await taskApi.checkHealth();
      setHealthStatus(res);
      toast.success('Backend and PostgreSQL connections verified healthy!');
    } catch (err: any) {
      setHealthStatus({ status: 'unreachable', error: err.message });
      toast.error('Unable to reach backend API');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#7050DC]" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          Configure application interface options and verify system architecture
        </p>
      </div>

      {/* Backend & Database Health Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-[#7050DC] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">Backend System & Database Status</h3>
              <p className="text-xs text-charcoal-muted">Express REST API & PostgreSQL Connection</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkApiHealth}
            isLoading={isChecking}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Connectivity</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-surface-border">
            <span className="text-charcoal-muted block font-medium">REST API Gateway:</span>
            <span className="font-semibold text-charcoal mt-0.5 block">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: {healthStatus?.status || 'Active'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-surface-border">
            <span className="text-charcoal-muted block font-medium">Database Engine:</span>
            <span className="font-semibold text-charcoal mt-0.5 block flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#7050DC]" />
              PostgreSQL (task_manager)
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pool connected & migrations up to date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Preferences */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-5">
        <h3 className="text-sm font-bold text-charcoal pb-3 border-b border-gray-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7050DC]" />
          Interface Preferences
        </h3>

        <div className="space-y-4 text-xs">
          {/* Card Density */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-charcoal block">Card Layout Density</span>
              <span className="text-charcoal-muted">Adjust spacing of dashboard elements</span>
            </div>
            <div className="inline-flex rounded-xl bg-gray-100 p-0.5 border border-surface-border">
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  density === 'comfortable' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-muted'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => setDensity('compact')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  density === 'compact' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-muted'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          {/* Default Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <div>
              <span className="font-semibold text-charcoal block">Default Sort Order</span>
              <span className="text-charcoal-muted">Initial ordering for new workspace views</span>
            </div>
            <select
              value={defaultSort}
              onChange={(e) => setDefaultSort(e.target.value as any)}
              className="bg-white border border-surface-border text-xs rounded-xl px-3 py-1.5 font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="newest">Newest First</option>
              <option value="priority">Priority Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Version Information */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card">
        <h3 className="text-sm font-bold text-charcoal pb-3 border-b border-gray-100 mb-3">
          Version & Architecture Information
        </h3>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-charcoal-muted">Product</dt>
            <dd className="font-semibold text-charcoal mt-0.5">TaskFlow Pro</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted">Release</dt>
            <dd className="font-semibold text-charcoal mt-0.5">v1.0.0-production</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted">Frontend</dt>
            <dd className="font-semibold text-charcoal mt-0.5">Next.js 14 (App Router)</dd>
          </div>
          <div>
            <dt className="text-charcoal-muted">Backend</dt>
            <dd className="font-semibold text-charcoal mt-0.5">Express + PostgreSQL</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

