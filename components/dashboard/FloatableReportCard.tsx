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
  hideRightControls?: boolean;
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
  hideRightControls = false,
}: FloatableReportCardProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    direction: 'both' as 'both' | 'vertical' | 'horizontal',
  });
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset position & size when parent triggers a reset
  useEffect(() => {
    if (resetTrigger > 0) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: null, height: null });
    }
  }, [resetTrigger]);

  const isFloated = position.x !== 0 || position.y !== 0;
  const isResized = size.width !== null || size.height !== null;

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

  // Resize Handlers
  const handleResizeDown = (
    e: React.PointerEvent<HTMLDivElement>,
    direction: 'both' | 'vertical' | 'horizontal'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
      direction,
    };
    setIsResizing(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    const { startX, startY, startW, startH, direction } = resizeRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newWidth =
      direction === 'vertical'
        ? size.width
        : Math.max(220, Math.min(window.innerWidth * 0.95, Math.round(startW + deltaX)));

    const newHeight =
      direction === 'horizontal'
        ? size.height
        : Math.max(120, Math.min(window.innerHeight * 0.9, Math.round(startH + deltaY)));

    setSize({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleResizeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) {
      setIsResizing(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition({ x: 0, y: 0 });
    setSize({ width: null, height: null });
  };

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        zIndex: isDragging || isResizing ? 30 : isFloated ? 20 : 1,
        width: size.width ? `${size.width}px` : undefined,
        height: size.height ? `${size.height}px` : undefined,
        minWidth: size.width ? `${size.width}px` : undefined,
        maxWidth: isFloated ? '95vw' : undefined,
      }}
      className={`rounded-lg relative flex flex-col overflow-hidden bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl transition-shadow duration-200 ${
        isDragging || isResizing
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
        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 ${headerAccentClass} backdrop-blur-md border-b border-white/20 flex flex-wrap items-center justify-between gap-2 cursor-grab active:cursor-grabbing select-none touch-none shrink-0`}
        title="Click & drag to float this sub-report anywhere over the background"
      >
        {/* Left: Drag Handle, Icon & Title */}
        <div className="flex items-center gap-2 text-white min-w-0">
          <div
            className="flex items-center gap-0.5 text-white/70 hover:text-white transition cursor-grab"
            title="Drag Handle - Hold and move card"
          >
            <GripHorizontal className="w-3.5 h-3.5 opacity-80 shrink-0" />
          </div>

          <div className="shrink-0">{icon}</div>

          <h2 className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider truncate">
            {title}
          </h2>

          {isFloated && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-blue-500/30 border border-blue-400/40 text-blue-100">
              <Move className="w-3 h-3 text-blue-300 animate-pulse" />
              <span>Floated</span>
            </span>
          )}
        </div>

        {/* Right: Custom Header Actions & Badge */}
        {(headerActions || badge) && (
          <div className="flex items-center gap-2" data-no-drag="true">
            {headerActions}
            {badge}
          </div>
        )}

        {/* Right: Default Reset & Minimize Buttons (when enabled) */}
        {!hideRightControls && (
          <div className="flex items-center gap-1.5" data-no-drag="true">
            {/* Reset Position & Size Button (appears when card is moved or resized) */}
            {(isFloated || isResized) && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset position and size to default dock"
                className="px-2 py-0.5 rounded text-white/90 hover:text-white hover:bg-white/20 transition flex items-center gap-1 text-xs border border-white/20 shadow-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">Reset</span>
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
        )}
      </div>

      {/* Card Content (Collapsible and Scrollable when height constrained) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-auto transition-all duration-200">
          {children}
        </div>
      )}

      {/* Resize Grips (Active when expanded) */}
      {!isCollapsed && (
        <>
          {/* Bottom-Right Corner Resize Handle */}
          <div
            onPointerDown={(e) => handleResizeDown(e, 'both')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
            onPointerCancel={handleResizeUp}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setSize({ width: null, height: null });
            }}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-20 group select-none touch-none text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors"
            title="Drag to resize table width & height (Double-click to reset size)"
            data-no-drag="true"
          >
            <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8" cy="8" r="1" />
              <circle cx="8" cy="4" r="1" />
              <circle cx="4" cy="8" r="1" />
              <circle cx="8" cy="0" r="1" />
              <circle cx="4" cy="4" r="1" />
              <circle cx="0" cy="8" r="1" />
            </svg>
          </div>

          {/* Bottom Edge Vertical Resize Bar */}
          <div
            onPointerDown={(e) => handleResizeDown(e, 'vertical')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
            onPointerCancel={handleResizeUp}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setSize((s) => ({ ...s, height: null }));
            }}
            className="absolute bottom-0 left-0 right-4 h-1.5 cursor-s-resize hover:bg-blue-500/30 transition-colors z-10 touch-none select-none"
            title="Drag to resize height (Double-click to reset height)"
            data-no-drag="true"
          />

          {/* Right Edge Horizontal Resize Bar */}
          <div
            onPointerDown={(e) => handleResizeDown(e, 'horizontal')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
            onPointerCancel={handleResizeUp}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setSize((s) => ({ ...s, width: null }));
            }}
            className="absolute top-10 right-0 bottom-4 w-1.5 cursor-e-resize hover:bg-blue-500/30 transition-colors z-10 touch-none select-none"
            title="Drag to resize width (Double-click to reset width)"
            data-no-drag="true"
          />
        </>
      )}
    </div>
  );
}
