'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useBackground } from '@/context/BackgroundContext';
import BackgroundRotator from '@/components/dashboard/BackgroundRotator';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Sidebar collapsed state persisted in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { images, currentIndex } = useBackground();
  const isDashboard = pathname === '/' || pathname === '/detailed' || pathname === '/simplified';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pgs_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    }
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => {
        const next = !prev;
        if (typeof window !== 'undefined') {
          localStorage.setItem('pgs_sidebar_collapsed', String(next));
        }
        return next;
      });
    }
  };

  // Dedicated full-screen layouts
  if (pathname === '/login' || pathname === '/kiosk') {
    return <div className="min-h-screen transition-colors duration-300">{children}</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden transition-colors duration-300">
      {/* Top Navbar Header: elevated to z-50 so dropdowns and options render over all elements below */}
      <div className="relative z-50 shrink-0">
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
      </div>

      {/* Main Workspace: Sidebar attached directly beneath header with base stacking context */}
      <div className="flex-1 flex overflow-hidden relative z-0">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapse={toggleSidebar}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area with Fixed Background */}
        <div className="flex-1 h-full relative overflow-hidden">
          {/* Fixed Background Rotator: stays pinned in place while main content scrolls */}
          {isDashboard && <BackgroundRotator />}

          {/* Scrollable Dashboard Viewport */}
          <main className="w-full h-full overflow-y-auto p-2 sm:p-3 lg:p-4 transition-colors duration-300 scrollbar-thin relative z-10">
            <div className="w-full mx-auto relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
