'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  GripHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Move,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface FloatableReportCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  headerAccentClass: string;
  badge?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  resetTrigger?: number; // Increment to reset position
}

export default function FloatableReportCard({
  id,
  title,
  icon,
  headerAccentClass,
  badge,
  headerActions,
  children,
  resetTrigger = 0,
}: FloatableReportCardProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Reset position when parent triggers a reset
  useEffect(() => {
    if (resetTrigger > 0) {
      setPosition({ x: 0, y: 0 });
    }
  }, [resetTrigger]);

  const isFloated = position.x !== 0 || position.y !== 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag when clicking the header bar, not on interactive action elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, select, a, [role="button"], [data-no-drag="true"]')) {
      return;
    }

    e.preventDefault();
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        zIndex: isDragging ? 30 : isFloated ? 20 : 1,
      }}
      className={`rounded-lg overflow-hidden bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl transition-shadow duration-200 ${
        isDragging
          ? 'shadow-2xl ring-2 ring-blue-400/70 shadow-blue-500/25 select-none'
          : isFloated
          ? 'shadow-2xl ring-1 ring-blue-400/40 shadow-black/30'
          : 'hover:shadow-2xl hover:border-white/40'
      }`}
    >
      {/* Floatable Header Bar with Drag Grip & Actions */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`px-3 py-2 sm:px-3.5 sm:py-2.5 ${headerAccentClass} backdrop-blur-md border-b border-white/20 flex flex-wrap items-center justify-between gap-2 cursor-grab active:cursor-grabbing select-none touch-none`}
        title="Click & drag to float this sub-report anywhere over the background"
      >
        {/* Left: Drag Handle, Icon & Title */}
        <div className="flex items-center gap-2 text-white min-w-0">
          <div
            className="flex items-center gap-0.5 text-white/70 hover:text-white transition cursor-grab"
            title="Drag Handle - Hold and move card"
          >
            <GripHorizontal className="w-4 h-4 opacity-80 shrink-0" />
          </div>

          <div className="shrink-0">{icon}</div>

          <h2 className="text-xs sm:text-[13px] font-medium uppercase tracking-wider truncate">
            {title}
          </h2>

          {isFloated && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-blue-500/30 border border-blue-400/40 text-blue-100">
              <Move className="w-3 h-3 text-blue-300 animate-pulse" />
              <span>Floated</span>
            </span>
          )}
        </div>

        {/* Right: Badge, Timeframe/Custom Actions, Reset & Minimize Buttons */}
        <div className="flex items-center gap-1.5 shrink-0" data-no-drag="true">
          {/* Custom Header Actions (e.g. Hourly/Daily/Weekly Tabs) */}
          {headerActions}

          {/* Badge Content */}
          {badge}

          {/* Reset Position Button (appears when card is moved from default dock) */}
          {isFloated && (
            <button
              type="button"
              onClick={handleResetPosition}
              title="Snap back to default dock position"
              className="px-2 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/20 transition flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Dock</span>
            </button>
          )}

          {/* Minimize / Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Table View' : 'Minimize to Float Bar'}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Card Content (Collapsible) */}
      {!isCollapsed && (
        <div className="overflow-x-auto transition-all duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
