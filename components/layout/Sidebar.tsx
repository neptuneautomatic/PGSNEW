'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  ScreenShare,
  CreditCard,
  Monitor,
  Cast,
  MonitorSmartphone,
  Settings,
  Users,
  FileSignature,
  Inbox,
  Camera,
  Lightbulb,
  FileText,
  Calendar,
  Activity,
  Bell,
  Tv,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  // legacy compatibility
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubNavItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  subItems?: SubNavItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Live Dashboard',
        href: '/detailed',
        icon: LayoutDashboard,
        subItems: [
          { label: 'Simplified View', href: '/simplified' },
          { label: 'Detailed View', href: '/detailed' },
        ],
      },
    ],
  },
  {
    title: 'System & Devices',
    items: [
      { label: 'Connections', href: '/connections', icon: Link2 },
      { label: 'Screen', href: '/screens', icon: ScreenShare },
      { label: 'Display Model', href: '/display-models', icon: CreditCard },
      { label: 'Display', href: '/displays', icon: Monitor },
      { label: 'Virtual Display', href: '/virtual-display', icon: Cast },
      { label: 'Main Display', href: '/main-display', icon: MonitorSmartphone },
      { label: 'Setting', href: '/settings', icon: Settings },
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Page Rights', href: '/page-rights', icon: FileSignature },
      { label: 'Instance', href: '/instance', icon: Inbox },
      { label: 'CamSlot', href: '/cam-slots', icon: Camera },
      { label: 'LED', href: '/leds', icon: Lightbulb },
      { label: 'Vehicle Occupancy Report', href: '/reports', icon: FileText },
      { label: 'Occupancy Schedular', href: '/occupancy-schedular', icon: Calendar },
      { label: 'Frequency', href: '/frequency', icon: Activity },
      { label: 'Severity', href: '/severity', icon: Bell },
    ],
  },
  {
    title: 'Public Displays',
    items: [
      { label: 'Kiosk / Big Display', href: '/kiosk', icon: Tv, highlight: true },
    ],
  },
];

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const mobileActive = isMobileOpen ?? isOpen ?? false;
  const handleCloseMobile = onCloseMobile || onClose || (() => {});

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileActive && (
        <div
          onClick={handleCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Side Panel: Attached directly under Header with zero gaps */}
      <aside
        className={`fixed lg:relative top-0 lg:top-0 bottom-0 left-0 z-30 lg:z-10 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl shadow-sm ${
          mobileActive ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Top Attached Action Header (Flush with main navbar) */}
        <div className="h-11 px-3.5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-white/[0.02] shrink-0">
          {/* Mobile Header view */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img src="/images/neptune-logo.webp" alt="Neptune" className="h-4 w-auto object-contain" />
              <span className="font-bold text-xs">Menu</span>
            </div>
            <button
              onClick={handleCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Header view */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    System Navigation
                  </span>
                </div>
                <button
                  onClick={onToggleCollapse}
                  title="Minimize Sidebar (Ctrl+B)"
                  className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition flex items-center gap-1"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggleCollapse}
                title="Expand Sidebar (Ctrl+B)"
                className="w-full flex items-center justify-center p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition"
              >
                <PanelLeftOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-1.5 space-y-3 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={section.title || `sec-${idx}`} className="space-y-1">
              {/* Section Header */}
              {section.title && !isCollapsed ? (
                <div className="px-3 pt-1.5 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </div>
              ) : (
                idx > 0 && <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800 mx-auto my-1" />
              )}

              {/* Items in Section */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isItemActive =
                  item.href === '/detailed'
                    ? pathname === '/' || pathname === '/detailed'
                    : pathname === item.href;
                const isParentActive =
                  isItemActive || (item.subItems && item.subItems.some((s) => pathname === s.href));

                return (
                  <div key={item.href} className="relative group space-y-0.5">
                    <Link
                      href={item.href}
                      onClick={handleCloseMobile}
                      className={`flex items-center transition-all ${
                        isCollapsed
                          ? 'justify-center w-full h-10 rounded-md'
                          : 'justify-between px-3 py-2 rounded-md'
                      } text-[13px] sm:text-sm font-normal ${
                        isParentActive
                          ? isCollapsed
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium border-l-[3px] border-blue-600'
                          : item.highlight
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isParentActive
                              ? isCollapsed ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                              : item.highlight
                              ? 'text-cyan-500'
                              : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="text-[13px] truncate tracking-normal">{item.label}</span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center gap-1.5">
                          {item.subItems && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
                              2
                            </span>
                          )}
                          {isParentActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 opacity-80" />
                          )}
                        </div>
                      )}
                    </Link>

                    {/* Expanded Sub-items (e.g. Simplified View & Detailed View) */}
                    {item.subItems && !isCollapsed && (
                      <div className="pl-3.5 pr-1 py-1 space-y-1 ml-3 border-l-2 border-slate-200 dark:border-slate-800">
                        {item.subItems.map((sub) => {
                          const isSubActive =
                            sub.href === '/detailed'
                              ? pathname === '/' || pathname === '/detailed'
                              : pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={handleCloseMobile}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-normal transition ${
                                isSubActive
                                  ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/30'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isSubActive ? 'bg-white' : 'bg-slate-400 dark:bg-slate-600'
                                  }`}
                                />
                                <span className="text-xs">{sub.label}</span>
                              </div>
                              {isSubActive && (
                                <span className="text-[9px] uppercase font-medium tracking-wider opacity-90">LIVE</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsed Mode Floating Tooltip & Quick Sub-item Links */}
                    {isCollapsed && (
                      <div className="hidden lg:flex flex-col gap-1.5 absolute left-full top-1/2 -translate-y-1/2 ml-2 p-2 rounded-md bg-slate-900 text-white text-xs font-normal whitespace-nowrap shadow-2xl border border-slate-700 pointer-events-auto z-50 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
                        <span className="font-medium text-slate-300 pb-1 border-b border-slate-800 text-xs">{item.label}</span>
                        {item.subItems ? (
                          <div className="flex flex-col gap-1 pt-0.5">
                            {item.subItems.map((sub) => {
                              const isSubActive =
                                sub.href === '/detailed'
                                  ? pathname === '/' || pathname === '/detailed'
                                  : pathname === sub.href;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-white/10 transition ${
                                    isSubActive ? 'text-blue-400 font-medium bg-white/5' : 'text-slate-300'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSubActive ? 'bg-blue-400' : 'bg-slate-600'
                                    }`}
                                  />
                                  <span className="text-xs">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          isItemActive && <span className="w-2 h-2 rounded-full bg-blue-400 self-center"></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Attached Footer with Quick Collapse Button */}
        <div className="p-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-white/[0.01] shrink-0">
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Minimize Sidebar (Ctrl+B)'}
            className={`w-full py-1.5 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition text-xs font-normal ${
              isCollapsed ? '' : 'gap-1.5 px-2'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-xs">Minimize Sidebar</span>
                <span className="text-[10px] opacity-60 ml-auto font-mono">Ctrl+B</span>
              </>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex flex-col items-center justify-center pt-2 mt-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
              <img src="/images/neptune-logo.webp" alt="Neptune India" className="h-4 w-auto object-contain opacity-85" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 tracking-wider">
                Smart Guidance System
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
