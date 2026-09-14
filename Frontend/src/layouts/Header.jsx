import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle,
  Activity,
  User,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { fileService } from '../services/fileService';

const PAGE_TITLES = {
  '/': { title: 'Dashboard Overview', subtitle: 'Monitoring datasets, throughput speed, and pipeline health' },
  '/upload': { title: 'Upload Dataset', subtitle: 'Stream massive CSV / JSON datasets directly into ingestion pipeline' },
  '/datasets': { title: 'Dataset Catalog', subtitle: 'Manage uploaded datasets, schemas, and preview raw chunks' },
  '/pipelines': { title: 'Pipeline Builder', subtitle: 'Visual mapping, transforms, and ETL flow configuration' },
  '/jobs': { title: 'Active Processing Jobs', subtitle: 'Real-time WebSocket monitoring and batch insertion tracking' },
  '/history': { title: 'Execution History', subtitle: 'Audit log of past ETL jobs, row counts, and error reports' },
  '/settings': { title: 'System Settings', subtitle: 'Tune stream buffers, highWaterMark, and MongoDB bulk write size' },
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageMeta = PAGE_TITLES[currentPath] || {
    title: 'StreamWeaver Platform',
    subtitle: 'High-Throughput No-Code ETL Engine',
  };

  const [backendHealthy, setBackendHealthy] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function check() {
      const res = await fileService.checkHealth();
      if (isMounted) {
        setBackendHealthy(Boolean(res));
      }
    }
    check();
    const interval = setInterval(check, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left Context & Mobile Menu */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900 tracking-tight truncate">
              {pageMeta.title}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
              Week 1: Phase 1
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate hidden md:block">
            {pageMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden xl:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets, jobs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        {/* Backend Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            backendHealthy
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={backendHealthy ? 'Backend API connected' : 'Backend offline - Standalone mode'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendHealthy ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span className="hidden sm:inline">
            {backendHealthy ? 'API Connected' : 'Standalone Mode'}
          </span>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                <span>System Notifications</span>
                <span className="text-[10px] text-indigo-600 font-normal">Mark all read</span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100/50 text-slate-700">
                  <div className="font-medium text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Ingestion Pipeline Ready
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Frontend streaming upload architecture initialized.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                  <div className="font-medium text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Vite + Tailwind v4 Configured
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Production SaaS layout and design system activated.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100">
            JD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Jit Das</div>
            <div className="text-[10px] text-slate-500 font-medium">Frontend Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
