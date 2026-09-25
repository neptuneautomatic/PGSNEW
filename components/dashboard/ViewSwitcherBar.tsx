'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBackground } from '@/context/BackgroundContext';
import {
  Sparkles,
  LayoutDashboard,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RotateCw,
  Shuffle,
  Clock,
  Sliders,
} from 'lucide-react';

export default function ViewSwitcherBar() {
  const pathname = usePathname();
  const isSimplified = pathname === '/simplified';
  const isDetailed = pathname === '/' || pathname === '/detailed';

  const {
    images,
    currentIndex,
    settings,
    nextImage,
    prevImage,
    updateSettings,
    setIsModalOpen,
  } = useBackground();

  return (
    <div className="glass-panel px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">
      {/* Left: View Switcher (Simplified View vs Detailed View) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <Link
            href="/simplified"
            className={`px-3 py-1.5 text-xs sm:text-[13px] font-normal rounded transition flex items-center gap-1.5 ${
              isSimplified
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm shadow-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simplified View</span>
          </Link>

          <Link
            href="/detailed"
            className={`px-3 py-1.5 text-xs sm:text-[13px] font-normal rounded transition flex items-center gap-1.5 ${
              isDetailed
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm shadow-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Detailed View</span>
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-normal">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Facility Monitoring</span>
        </div>
      </div>

      {/* Right: Background Auto-Rotator Quick Controls */}
      <div className="flex items-center gap-2 text-xs">
        {/* Slide Counter & Mode Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-normal text-slate-600 dark:text-slate-300" suppressHydrationWarning>
          <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-medium text-slate-900 dark:text-white" suppressHydrationWarning>
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="flex items-center gap-1" suppressHydrationWarning>
            {settings.mode === 'sequence' ? (
              <RotateCw className="w-3 h-3 text-blue-400" />
            ) : (
              <Shuffle className="w-3 h-3 text-purple-400" />
            )}
            <span>{settings.intervalSeconds}s</span>
          </span>
        </div>

        {/* Prev / Play-Pause / Next Controls */}
        <div className="flex items-center gap-1 p-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={prevImage}
            title="Previous Background Image"
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ isPaused: !settings.isPaused })}
            title={settings.isPaused ? 'Resume Auto-Rotate' : 'Pause Auto-Rotate'}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
          >
            {settings.isPaused ? (
              <Play className="w-4 h-4 text-amber-500" />
            ) : (
              <Pause className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={nextImage}
            title="Next Background Image"
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Open Background Settings / Upload Modal Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-normal text-xs sm:text-[13px] flex items-center gap-1.5 shadow-sm transition"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Background Settings & Upload</span>
          <span className="md:hidden">BG Settings</span>
        </button>
      </div>
    </div>
  );
}
