'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { usePGS } from '@/context/PGSContext';
import {
  Tv,
  LogOut,
  Shield,
  Image as ImageIcon,
  Download,
  Flame,
  Ban,
} from 'lucide-react';
import { useBackground } from '@/context/BackgroundContext';
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
  } = usePGS();
  const { setIsModalOpen } = useBackground();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
              <span className="text-xs font-medium tracking-wide opacity-85 leading-none mt-0.5">
                Smart Guidance System
              </span>
            </Link>
          </div>



        {/* Right Actions: Kiosk, Background, Reports, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Big Display / Kiosk Mode */}
          <Link
            href="/kiosk"
            title="Open Big Display / TV Kiosk View"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-sm font-medium flex items-center gap-1.5 hover:border-cyan-400 transition"
          >
            <Tv className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline text-sm">Kiosk</span>
          </Link>

          {/* Background Wallpaper Settings & Upload */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Background Wallpaper Settings & Upload"
            className="p-1.5 sm:px-2.5 sm:py-1 glass-panel text-sm font-medium flex items-center gap-1.5 hover:border-indigo-400 transition"
          >
            <ImageIcon className="w-4 h-4 text-blue-500" />
            <span className="hidden lg:inline text-sm">Background</span>
          </button>

          {/* Download Report Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            title="Download Occupancy Report (Select Date Range)"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-sm font-medium flex items-center gap-1.5 hover:border-blue-400 transition"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span className="hidden lg:inline text-sm">Download Report</span>
          </button>

          {/* Parking Heat Map Button */}
          <button
            onClick={() => setIsHeatMapModalOpen(true)}
            title="Parking Heat Map Occupancy Report"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-sm font-medium flex items-center gap-1.5 hover:border-amber-400 transition"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="hidden lg:inline text-sm">Heat Map</span>
          </button>

          {/* Blocklist Button */}
          <button
            onClick={() => setIsBlocklistModalOpen(true)}
            title="Vehicle Security Blocklist"
            className="p-1.5 sm:px-3 sm:py-1 glass-panel text-sm font-medium flex items-center gap-1.5 hover:border-rose-400 transition"
          >
            <Ban className="w-4 h-4 text-rose-500" />
            <span className="hidden lg:inline text-sm">Blocklist</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-medium text-xs">
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
              }}
              className="flex items-center gap-2 p-1 glass-panel hover:border-indigo-400 transition"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs uppercase shadow-sm" suppressHydrationWarning>
                {currentUser?.username?.[0] || 'A'}
              </div>
              <div className="hidden lg:block text-left pr-1" suppressHydrationWarning>
                <p className="font-medium text-sm leading-tight" suppressHydrationWarning>{currentUser?.username || 'Admin'}</p>
                <p className="text-xs text-emerald-500 font-medium leading-none mt-0.5" suppressHydrationWarning>{currentUser?.userType || 'Admin'}</p>
              </div>
            </button>

            {isUserMenuOpen && (
              <>
                {/* Backdrop to close user menu on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 glass-dropdown py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1 border shadow-2xl">
                  <div className="px-3 py-1.5 border-b border-inherit" suppressHydrationWarning>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white" suppressHydrationWarning>{currentUser?.username}</p>
                    <p className="text-xs opacity-70 capitalize mt-0.5" suppressHydrationWarning>{currentUser?.userType} Account</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition text-sm font-medium"
                  >
                    <Shield className="w-4 h-4 opacity-70" /> System Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition text-sm font-medium"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-500 opacity-80" /> Background Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition text-sm font-medium border-t border-inherit mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
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
