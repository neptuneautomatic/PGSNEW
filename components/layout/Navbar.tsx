'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { usePGS } from '@/context/PGSContext';
import { AppTheme } from '@/types';
import {
  Car,
  Search,
  Tv,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Palette,
  Check,
  Download,
  Flame,
  Ban,
} from 'lucide-react';
import DownloadReportModal from '@/components/header/DownloadReportModal';
import HeatMapReportModal from '@/components/header/HeatMapReportModal';
import BlocklistModal from '@/components/header/BlocklistModal';
import NotificationDropdown from '@/components/header/NotificationDropdown';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  isMobileSidebarOpen?: boolean;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({
  onToggleSidebar,
  isSidebarCollapsed,
  isMobileSidebarOpen,
  onMenuToggle,
  isSidebarOpen,
}: NavbarProps) {
  const {
    currentUser,
    logout,
    screens,
    activeScreenId,
    setActiveScreenId,
    stats,
    searchQuery,
    setSearchQuery,
    isSimulationRunning,
    setIsSimulationRunning,
    theme,
    setTheme
  } = usePGS();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const themes: { id: AppTheme; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4 text-amber-500" />, color: 'bg-slate-100 text-slate-800' },
    { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-indigo-400" />, color: 'bg-slate-900 text-white' },
    { id: 'blue', label: 'Sapphire Blue', icon: <Droplets className="w-4 h-4 text-sky-400" />, color: 'bg-blue-950 text-sky-200' },
    { id: 'glass', label: 'Glassmorphism', icon: <Sparkles className="w-4 h-4 text-purple-400" />, color: 'bg-white/10 text-white backdrop-blur-md' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-header transition-all duration-300">
        <div className="w-full px-3 sm:px-4 lg:px-5 py-2 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Neptune Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex flex-col items-start justify-center group py-0.5">
              {/* Simple logo without border box */}
              <img
                src="/images/neptune-logo.webp"
                alt="Neptune Logo"
                className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[11px] font-normal tracking-wide opacity-80 leading-none mt-0.5">
                Smart Guidance System
              </span>
            </Link>
          </div>

          {/* Center: Floor Selector & Search Input */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-1">
            {/* Floor Switcher */}
            {pathname === '/' || pathname === '/dashboard' || pathname === '/detailed' ? (
              <div className="relative z-10">
                <select
                value={activeScreenId}
                onChange={(e) => setActiveScreenId(e.target.value)}
                className="appearance-none glass-dropdown text-[13px] font-normal pl-3 sm:pl-8 pr-7 sm:pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
              >
                {screens.map((screen) => (
                  <option key={screen.id} value={screen.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {screen.name}
                  </option>
                ))}
              </select>
              <Layers className="hidden sm:block w-3.5 h-3.5 opacity-60 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : null}

          {/* Quick Vehicle / Bay Search - Right Aligned */}
          <div className="relative w-48 sm:w-56 ml-auto">
            <input
              type="text"
              placeholder="Search Bay or Plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-panel placeholder-slate-400 text-[11px] pl-7 pr-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
            <Search className="w-3 h-3 opacity-60 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions: Theme Selector, Quick Stats, Sim Toggle & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Stats Pill (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 glass-panel px-3 py-1 text-[13px]" suppressHydrationWarning>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-normal" suppressHydrationWarning>
              <span className="w-1.5 h-1.5 status-dot rounded-full bg-emerald-500 animate-pulse"></span>
              Free: {stats.free}
            </span>
            <span className="opacity-30">|</span>
            <span className="text-rose-600 dark:text-rose-400 font-normal" suppressHydrationWarning>Full: {stats.occupied}</span>
            <span className="opacity-30">|</span>
            <span className="font-normal opacity-90" suppressHydrationWarning>{stats.occupancyPercent}% Occ</span>
          </div>

          {/* 4 Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeMenuOpen(!isThemeMenuOpen);
                setIsUserMenuOpen(false);
              }}
              title="Switch Visual Theme"
              className="p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-indigo-400 transition"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="hidden md:inline capitalize text-[13px]" suppressHydrationWarning>{theme}</span>
            </button>

            {isThemeMenuOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 glass-dropdown py-1.5 z-50 text-[13px] animate-in fade-in slide-in-from-top-1 border shadow-2xl">
                <div className="px-3 pb-1 mb-1 border-b border-inherit text-[11px] font-medium uppercase tracking-wider opacity-60">
                  Select Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition text-[13px] hover:bg-slate-100 dark:hover:bg-white/10 ${
                      theme === t.id ? 'font-medium text-indigo-600 dark:text-indigo-400 bg-slate-100/80 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span>{t.label}</span>
                    </div>
                    {theme === t.id && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

          {/* Big Display / Kiosk Mode */}
          <Link
            href="/kiosk"
            title="Open Big Display / TV Kiosk View"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-cyan-400 transition"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[13px]">Kiosk</span>
          </Link>

          {/* Download Report Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            title="Download Occupancy Report (Select Date Range)"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-blue-400 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden lg:inline text-[13px]">Download Report</span>
          </button>

          {/* Parking Heat Map Button */}
          <button
            onClick={() => setIsHeatMapModalOpen(true)}
            title="Parking Heat Map Occupancy Report"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-amber-400 transition"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline text-[13px]">Heat Map</span>
          </button>

          {/* Blocklist Button */}
          <button
            onClick={() => setIsBlocklistModalOpen(true)}
            title="Vehicle Security Blocklist"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-rose-400 transition"
          >
            <Ban className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden lg:inline text-[13px]">Blocklist</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-normal text-[10px]">
              3
            </span>
          </button>

          {/* Real-time Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsThemeMenuOpen(false);
              }}
              className="flex items-center gap-2 p-1 glass-panel hover:border-indigo-400 transition"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs uppercase shadow-sm" suppressHydrationWarning>
                {currentUser?.username?.[0] || 'A'}
              </div>
              <div className="hidden lg:block text-left pr-1" suppressHydrationWarning>
                <p className="font-normal text-[13px] leading-tight" suppressHydrationWarning>{currentUser?.username || 'Admin'}</p>
                <p className="text-[11px] text-emerald-500 font-normal leading-none" suppressHydrationWarning>{currentUser?.userType || 'Admin'}</p>
              </div>
            </button>

            {isUserMenuOpen && (
              <>
                {/* Backdrop to close user menu on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 glass-dropdown py-1.5 z-50 text-[13px] animate-in fade-in slide-in-from-top-1 border shadow-2xl">
                  <div className="px-3 py-1.5 border-b border-inherit" suppressHydrationWarning>
                    <p className="font-medium text-[13px] text-slate-900 dark:text-white" suppressHydrationWarning>{currentUser?.username}</p>
                    <p className="text-[11px] opacity-70 capitalize" suppressHydrationWarning>{currentUser?.userType} Account</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition text-[13px]"
                  >
                    <Shield className="w-3.5 h-3.5 opacity-70" /> System Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition text-[13px] border-t border-inherit mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Header Modals rendered outside header so they are not confined by header backdrop-filter */}
    <DownloadReportModal
      isOpen={isDownloadModalOpen}
      onClose={() => setIsDownloadModalOpen(false)}
    />
    <HeatMapReportModal
      isOpen={isHeatMapModalOpen}
      onClose={() => setIsHeatMapModalOpen(false)}
    />
    <BlocklistModal
      isOpen={isBlocklistModalOpen}
      onClose={() => setIsBlocklistModalOpen(false)}
    />
  </>
  );
}
