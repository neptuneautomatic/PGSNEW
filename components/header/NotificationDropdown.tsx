'use client';

import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  ShieldAlert,
  Car,
  Wifi,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'OVERSTAY' | 'CAPACITY' | 'BLOCKLIST' | 'DEVICE';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  severity: 'high' | 'warning' | 'info';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'BLOCKLIST',
    title: 'Blocklist Intercept Triggered',
    message: 'Restricted vehicle DL-08-CC-9999 detected at Lane 1 Entry. Barrier hold active.',
    time: '2 mins ago',
    isRead: false,
    severity: 'high',
  },
  {
    id: 'n-2',
    type: 'OVERSTAY',
    title: 'Long Stay Alert (Bay B4_2)',
    message: 'Vehicle DL-01-AB-1234 has been parked for 04h 15m exceeding normal dwell threshold.',
    time: '14 mins ago',
    isRead: false,
    severity: 'warning',
  },
  {
    id: 'n-3',
    type: 'CAPACITY',
    title: 'Basement 1 High Density',
    message: 'Basement 1 reached 92% capacity. Automated guidance signs redirected to Basement 2.',
    time: '28 mins ago',
    isRead: false,
    severity: 'warning',
  },
  {
    id: 'n-4',
    type: 'DEVICE',
    title: 'Camera Connection Restored',
    message: 'CAM136 (Lane 1 Entry) heartbeat stabilized at 12ms latency.',
    time: '45 mins ago',
    isRead: true,
    severity: 'info',
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="View System Notifications & Alerts"
        className="relative p-1.5 sm:px-3 sm:py-1 glass-panel text-[13px] font-normal flex items-center gap-1.5 hover:border-amber-400 transition"
      >
        <Bell className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
        <span className="hidden md:inline text-[13px]">Alerts</span>
        {unreadCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-normal text-[10px] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop to close notifications on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-80 sm:w-96 glass-dropdown rounded-lg z-50 text-xs shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/[0.03] border-b border-inherit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">Facility Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[9.5px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10.5px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-inherit scrollbar-thin">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 transition cursor-pointer flex items-start gap-2.5 ${
                  !n.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-white/5 opacity-80'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === 'BLOCKLIST' && (
                    <div className="w-6 h-6 rounded bg-rose-500/20 text-rose-500 flex items-center justify-center">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {n.type === 'OVERSTAY' && (
                    <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {n.type === 'CAPACITY' && (
                    <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {n.type === 'DEVICE' && (
                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`font-bold text-[11px] truncate ${
                        !n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    {n.message}
                  </p>
                </div>

                {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-6 text-center text-slate-400">
                <Check className="w-6 h-6 mx-auto mb-1 text-emerald-500 opacity-60" />
                <span>All clear. No active facility alerts.</span>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-inherit bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[10.5px]">
              <span className="text-slate-400">Auto-refresh active</span>
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-500 transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </>
    )}
  </div>
  );
}
