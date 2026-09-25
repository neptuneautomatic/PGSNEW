'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sensor } from '@/types';
import { usePGS } from '@/context/PGSContext';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Edit3,
  Check,
  Plus,
  Car,
  Clock,
  Camera,
  Layers,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { formatDuration, getStatusBadge } from '@/lib/utils';

interface ParkingCanvasProps {
  sensors: Sensor[];
  searchQuery?: string;
  selectedSensorId?: string | null;
  onSlotClick?: (sensor: Sensor) => void;
  isEditMode?: boolean;
  onSensorsChange?: (sensors: Sensor[]) => void;
  floorName?: string;
  showInternalModal?: boolean;
}

export default function ParkingCanvas({
  sensors,
  searchQuery = '',
  selectedSensorId,
  onSlotClick,
  isEditMode = false,
  onSensorsChange,
  floorName = 'Floor Layout',
  showInternalModal = false,
}: ParkingCanvasProps) {
  const { theme } = usePGS();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transforms
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected sensor for inspection modal
  const [inspectedSensor, setInspectedSensor] = useState<Sensor | null>(null);
  const [draggedSensorId, setDraggedSensorId] = useState<string | null>(null);
  const [localSensors, setLocalSensors] = useState<Sensor[]>(sensors);

  // Sync prop changes when not in active edit mode
  useEffect(() => {
    setLocalSensors(sensors);
  }, [sensors]);

  // Touch pinch zoom state
  const touchDistanceRef = useRef<number | null>(null);

  // Draw Canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Apply viewport transformation
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // --- 1. Draw Architectural Floor Plan Grid & Driving Lanes ---
    const floorWidth = 1350;
    const floorHeight = 700;

    const isLight = theme === 'light';

    // Floor Base Card
    ctx.fillStyle = isLight ? '#f8fafc' : '#0f172a';
    ctx.fillRect(0, 0, floorWidth, floorHeight);

    // Subtle Grid lines
    ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.6)' : 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < floorWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, floorHeight);
      ctx.stroke();
    }
    for (let y = 0; y < floorHeight; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(floorWidth, y);
      ctx.stroke();
    }

    // Outer Perimeter Wall
    ctx.strokeStyle = isLight ? '#6366f1' : '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, floorWidth - 8, floorHeight - 8);

    // Driving Aisles / Lanes
    ctx.fillStyle = isLight ? '#e2e8f0' : '#1e293b';
    ctx.fillRect(60, 310, floorWidth - 120, 140); // Center drive lane
    ctx.fillRect(40, 60, 80, floorHeight - 120);   // Left drive lane
    ctx.fillRect(floorWidth - 120, 60, 80, floorHeight - 120); // Right drive lane

    // Lane dividing dashed lines
    ctx.strokeStyle = isLight ? '#94a3b8' : 'rgba(250, 204, 21, 0.7)';
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 380);
    ctx.lineTo(floorWidth - 120, 380);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Directional Arrows on Driveway
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ENTRY ➔', 220, 380);
    ctx.fillText('ONE WAY ➔ ➔', floorWidth / 2, 380);
    ctx.fillText('➔ EXIT', floorWidth - 220, 380);

    // Floor Label Watermark
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    ctx.font = '900 80px sans-serif';
    ctx.fillText(floorName.toUpperCase(), floorWidth / 2, 200);

    // Parking Bay Bay Marking Slots (Upper & Lower Row Bays)
    localSensors.forEach((sensor) => {
      const isUpper = sensor.y < 350;
      const bayW = 66;
      const bayH = 96;
      const bayX = sensor.x - bayW / 2;
      const bayY = isUpper ? sensor.y - 48 : sensor.y - 48;

      const isSelected = selectedSensorId ? sensor.id === selectedSensorId : false;

      // Draw Parking Bay Outline
      if (isSelected) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      ctx.strokeRect(bayX, bayY, bayW, bayH);
      ctx.shadowBlur = 0;

      // Bay Floor background
      ctx.fillStyle = isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.6)';
      ctx.fillRect(bayX, bayY, bayW, bayH);

      // Check search highlight
      const isSearched =
        searchQuery &&
        (sensor.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sensor.vehicleNo?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Draw Slot Circle
      ctx.beginPath();
      ctx.arc(sensor.x, sensor.y, 22, 0, Math.PI * 2);

      let slotColor = '#10b981'; // Free = Emerald
      let glowColor = 'rgba(16, 185, 129, 0.5)';
      if (sensor.status === 1) {
        slotColor = '#ef4444'; // Occupied = Red
        glowColor = 'rgba(239, 68, 68, 0.5)';
      } else if (sensor.status === 2) {
        slotColor = '#3b82f6'; // Reserved = Blue
        glowColor = 'rgba(59, 130, 246, 0.5)';
      } else if (sensor.status === 3) {
        slotColor = '#64748b'; // Offline = Gray
        glowColor = 'rgba(100, 116, 139, 0.3)';
      }

      if (isSelected) {
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 24;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      } else if (isSearched) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 24;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
      }

      ctx.fillStyle = slotColor;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // White circular inner border
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Slot text / Plate
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sensor.sensorName, sensor.x, sensor.y);

      // Category Tag below/above slot
      ctx.font = '9px sans-serif';
      if (sensor.reservedType && sensor.reservedType !== 'General') {
        ctx.fillStyle = sensor.reservedType === 'EV' ? '#06b6d4' : '#ec4899';
        ctx.fillText(sensor.reservedType, sensor.x, isUpper ? sensor.y - 30 : sensor.y + 30);
      }
    });

    ctx.restore();
    ctx.restore();
  }, [offset, scale, localSensors, floorName, searchQuery, theme, selectedSensorId]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  // Center & Fit Canvas Initially
  const handleResetView = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scaleX = (rect.width - 40) / 1350;
    const scaleY = (rect.height - 40) / 700;
    const fitScale = Math.min(Math.max(scaleX, scaleY), 1.2);
    setScale(Math.max(fitScale, 0.45));
    setOffset({
      x: (rect.width - 1350 * fitScale) / 2,
      y: (rect.height - 700 * fitScale) / 2,
    });
  };

  useEffect(() => {
    handleResetView();
  }, [floorName]);

  // Fullscreen state & handler
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Desktop keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((s) => Math.min(s * 1.2, 3.5));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setScale((s) => Math.max(s / 1.2, 0.3));
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleResetView();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    newScale = Math.min(Math.max(newScale, 0.3), 3.5);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setOffset({
      x: mouseX - ((mouseX - offset.x) / scale) * newScale,
      y: mouseY - ((mouseY - offset.y) / scale) * newScale,
    });
    setScale(newScale);
  };

  // Convert mouse/touch coordinates to canvas local coords
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    return {
      x: (clickX - offset.x) / scale,
      y: (clickY - offset.y) / scale,
    };
  };

  // Find slot hit test
  const findSensorAt = (x: number, y: number): Sensor | undefined => {
    return localSensors.find((s) => {
      const dist = Math.hypot(s.x - x, s.y - y);
      return dist <= 28; // hit radius
    });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const clickedSensor = findSensorAt(coords.x, coords.y);

    if (isEditMode && clickedSensor) {
      setDraggedSensorId(clickedSensor.id);
      setIsDragging(true);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    if (isEditMode && draggedSensorId) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      setLocalSensors((prev) =>
        prev.map((s) =>
          s.id === draggedSensorId ? { ...s, x: Math.round(coords.x), y: Math.round(coords.y) } : s
        )
      );
    } else {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isEditMode && draggedSensorId) {
      setDraggedSensorId(null);
      if (onSensorsChange) {
        onSensorsChange(localSensors);
      }
    } else if (isDragging) {
      // Check if it was a quick click rather than a big drag
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const clicked = findSensorAt(coords.x, coords.y);
      if (clicked) {
        if (showInternalModal) {
          setInspectedSensor(clicked);
        }
        if (onSlotClick) onSlotClick(clicked);
      }
    }
    setIsDragging(false);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const coords = getCanvasCoords(touch.clientX, touch.clientY);
      const clicked = findSensorAt(coords.x, coords.y);

      if (isEditMode && clicked) {
        setDraggedSensorId(clicked.id);
        setIsDragging(true);
      } else {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
      }
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      if (isEditMode && draggedSensorId) {
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        setLocalSensors((prev) =>
          prev.map((s) =>
            s.id === draggedSensorId ? { ...s, x: Math.round(coords.x), y: Math.round(coords.y) } : s
          )
        );
      } else {
        setOffset({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
      }
    } else if (e.touches.length === 2 && touchDistanceRef.current) {
      // Pinch to zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistanceRef.current;
      touchDistanceRef.current = dist;
      setScale((prev) => Math.min(Math.max(prev * factor, 0.4), 3.0));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchDistanceRef.current = null;
    if (isDragging && !draggedSensorId && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const coords = getCanvasCoords(touch.clientX, touch.clientY);
      const clicked = findSensorAt(coords.x, coords.y);
      if (clicked) {
        if (showInternalModal) {
          setInspectedSensor(clicked);
        }
        if (onSlotClick) onSlotClick(clicked);
      }
    }
    setDraggedSensorId(null);
    setIsDragging(false);
    if (onSensorsChange) {
      onSensorsChange(localSensors);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] lg:min-h-[560px] glass-panel overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl select-none"
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-full block ${isEditMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Floating Canvas Controls (Desktop, Tablet & Mobile) */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 glass-panel p-1 shadow-md z-10 border border-slate-200 dark:border-white/15">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.2, 3.5))}
          title="Zoom In (+)"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s / 1.2, 0.3))}
          title="Zoom Out (-)"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetView}
          title="Reset View (0 / R)"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen (F)"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Floor & Desktop Shortcuts HUD Bar */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2 glass-panel border border-slate-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{floorName}</span>
          <span className="opacity-40">•</span>
          <span>{Math.round(scale * 100)}% Zoom</span>
          <span className="opacity-40">•</span>
          <span>{localSensors.length} Bays</span>
          {isEditMode && (
            <>
              <span className="opacity-40">•</span>
              <span className="text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Sensor Plotting Mode
              </span>
            </>
          )}
        </div>

        <div className="hidden lg:flex pointer-events-auto items-center gap-2 glass-panel border border-slate-200 dark:border-white/10 px-2.5 py-1 text-[10.5px] text-slate-500 dark:text-slate-400 shadow-sm">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            [Wheel] Zoom &bull; [Drag] Pan &bull; [Click] Inspect &bull; [0] Fit &bull; [F] Fullscreen
          </span>
        </div>
      </div>

      {/* Slot Inspection Modal Popup */}
      {inspectedSensor && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-30 animate-in fade-in duration-150">
          <div className="glass-panel border border-slate-200 dark:border-slate-700/80 w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setInspectedSensor(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 flex items-center justify-center font-bold text-lg text-white shadow-lg ${
                  inspectedSensor.status === 1
                    ? 'bg-rose-600 shadow-rose-600/30'
                    : inspectedSensor.status === 2
                    ? 'bg-blue-600 shadow-blue-600/30'
                    : 'bg-emerald-600 shadow-emerald-600/30'
                }`}
              >
                {inspectedSensor.sensorName}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Parking Bay Details
                  <span
                    className={`text-xs px-2 py-0.5 border font-semibold ${
                      getStatusBadge(inspectedSensor.status).bg
                    }`}
                  >
                    {getStatusBadge(inspectedSensor.status).label}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Controller: {inspectedSensor.ipPort || 'N/A'}</p>
              </div>
            </div>

            {/* Data Grid */}
            <div className="space-y-3 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm p-4 border border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-400" /> Vehicle Plate:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {inspectedSensor.vehicleNo || '—'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Occupied Duration:
                </span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  {inspectedSensor.occupiedSince
                    ? formatDuration(inspectedSensor.occupiedSince)
                    : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Bay Category:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {inspectedSensor.reservedType || 'General'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-400" /> Camera IP:Port:
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-300">
                  {inspectedSensor.cameraIpPort || '192.168.1.240:554'}
                </span>
              </div>
            </div>

            {/* Camera Photo Mockup */}
            {inspectedSensor.status === 1 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> LPR Camera Verification Snapshot
                </p>
                <div className="relative h-32 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-sm border border-inherit overflow-hidden flex items-center justify-center">
                  <div className="text-center p-4">
                    <Car className="w-8 h-8 opacity-40 mx-auto mb-1" />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      LIVE SNAPSHOT: {inspectedSensor.vehicleNo}
                    </span>
                    <p className="text-[10px] opacity-60">Confidence: 98.4% • OCR Match</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setInspectedSensor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
