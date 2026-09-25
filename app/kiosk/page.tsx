'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePGS } from '@/context/PGSContext';
import ParkingCanvas from '@/components/canvas/ParkingCanvas';
import {
  Car,
  Maximize2,
  Minimize2,
  X,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
} from 'lucide-react';

export default function KioskPage() {
  const { screens, activeScreenId, setActiveScreenId, sensors, activeScreen } = usePGS();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [countdown, setCountdown] = useState(15);

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Auto-rotate floors every 15 seconds
  useEffect(() => {
    if (!autoRotate || screens.length <= 1) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          // Switch to next floor
          const currentIndex = screens.findIndex((s) => s.id === activeScreenId);
          const nextIndex = (currentIndex + 1) % screens.length;
          setActiveScreenId(screens[nextIndex].id);
          return 15;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRotate, screens, activeScreenId, setActiveScreenId]);

  // Screen stats
  const screenSensors = sensors.filter((s) => s.screenId === activeScreenId);
  const total = screenSensors.length;
  const occupied = screenSensors.filter((s) => s.status === 1).length;
  const free = screenSensors.filter((s) => s.status === 0).length;
  const reserved = screenSensors.filter((s) => s.status === 2).length;

  return (
    <div className="min-h-screen flex flex-col p-3 sm:p-4 select-none overflow-hidden transition-colors duration-300">
      {/* Kiosk Header */}
      <div className="flex items-center justify-between border-b border-inherit pb-2.5 mb-3">
        <div className="flex items-center gap-3">
          <img src="/images/neptune-logo.webp" alt="Neptune India" className="h-7 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
                {activeScreen?.name || 'PARKING GUIDANCE'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                KIOSK LIVE
              </span>
            </div>
            <p className="text-[10px] opacity-70">
              Smart Guidance System • Gate View
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Rotation Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-2 px-3 py-1.5 glass-panel text-xs font-semibold hover:border-indigo-400 transition"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRotate ? `Rotate (${countdown}s)` : 'Rotation Paused'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 glass-panel hover:border-indigo-400 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <Link
            href="/"
            className="p-2.5 glass-panel hover:bg-rose-500/20 hover:text-rose-500 transition"
            title="Exit Kiosk Mode"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Giant LED Summary Badges (Big Display Optimized) */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-4">
        {/* FREE SPACES */}
        <div className="glass-panel border-2 border-emerald-500/40 p-4 sm:p-6 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/10">
          <div className="text-xs sm:text-base font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
            Available Bays
          </div>
          <div className="text-5xl sm:text-7xl 3xl:text-8xl font-black text-emerald-600 dark:text-emerald-400 led-digits">
            {free.toString().padStart(2, '0')}
          </div>
          <p className="text-xs opacity-70 mt-2">Drive forward for parking</p>
        </div>

        {/* OCCUPIED SPACES */}
        <div className="glass-panel border-2 border-rose-500/40 p-4 sm:p-6 text-center relative overflow-hidden shadow-2xl shadow-rose-500/10">
          <div className="text-xs sm:text-base font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">
            Occupied
          </div>
          <div className="text-5xl sm:text-7xl 3xl:text-8xl font-black text-rose-600 dark:text-rose-400 led-digits">
            {occupied.toString().padStart(2, '0')}
          </div>
          <p className="text-xs opacity-70 mt-2">Total vehicles parked</p>
        </div>

        {/* TOTAL CAPACITY */}
        <div className="glass-panel border-2 border-indigo-500/30 p-4 sm:p-6 text-center relative overflow-hidden shadow-xl">
          <div className="text-xs sm:text-base font-bold opacity-70 uppercase tracking-widest mb-1">
            Total Capacity
          </div>
          <div className="text-5xl sm:text-7xl 3xl:text-8xl font-black led-digits">
            {total.toString().padStart(2, '0')}
          </div>
          <p className="text-xs opacity-70 mt-2">{reserved} Reserved / EV Bays</p>
        </div>
      </div>

      {/* Large Canvas Display Area */}
      <div className="flex-1 w-full relative min-h-[400px]">
        <ParkingCanvas sensors={screenSensors} floorName={activeScreen?.name} />
      </div>

      {/* Kiosk Footer: Multi-Floor selector navigation */}
      <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs opacity-80">
        <div className="flex items-center gap-2">
          <span>Active Floor:</span>
          <div className="flex items-center gap-1.5">
            {screens.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScreenId(s.id);
                  setCountdown(15);
                }}
                className={`px-3 py-1 font-bold transition ${
                  s.id === activeScreenId
                    ? 'bg-emerald-500 text-white dark:text-black shadow-md'
                    : 'glass-panel opacity-70 hover:opacity-100'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono opacity-60">
          System Time: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
