'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sensor } from '@/types';
import { usePGS } from '@/context/PGSContext';
import {
  X,
  Search,
  RefreshCw,
  Move,
  Car,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  Maximize2,
  Minimize2,
  Sliders,
  ArrowLeft,
} from 'lucide-react';

export interface BasementModalItem {
  id: string; // 'b1' | 'b2'
  name: string;
  occupied: number;
  capacity: number;
  free: number;
  longStay: number;
  buildingId?: string;
}

interface BasementMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  basement: BasementModalItem | null;
  onSelectBasement?: (b: BasementModalItem) => void;
  allBasements?: BasementModalItem[];
}

export default function BasementMapModal({
  isOpen,
  onClose,
  basement,
  onSelectBasement,
  allBasements = [],
}: BasementMapModalProps) {
  const {
    sensors: allSensors,
    bulkUpdateSensorPositions,
    updateSensor,
  } = usePGS();

  // Screen mapping
  const screenId = basement?.id === 'b3' ? 'scr-3' : basement?.id === 'b2' ? 'scr-2' : 'scr-1';

  // Local sensors state for this basement
  const [localSensors, setLocalSensors] = useState<Sensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [draggedSensorId, setDraggedSensorId] = useState<string | null>(null);
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);

  // Basement 3 Architectural Map Image
  const basement3ImgRef = useRef<HTMLImageElement | null>(null);
  const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);
  const initialAnchorsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.src = '/images/basement3-map.png';
    img.onload = () => {
      basement3ImgRef.current = img;
      setIsImgLoaded(true);
    };
  }, []);

  // Free move toggle (enabled by default per user request)
  const [isFreeMove, setIsFreeMove] = useState<boolean>(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>('');
  const [searchMatchCount, setSearchMatchCount] = useState<number>(0);

  // Refresh animation state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');

  // Browser Native Fullscreen state
  const [isNativeFs, setIsNativeFs] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsNativeFs(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Canvas viewport transform states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(0.95);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 30, y: 25 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Floating drag coordinate tooltip
  const [dragCoords, setDragCoords] = useState<{ x: number; y: number; sensorName: string } | null>(null);

  // Sync sensors for this basement screen when basement or global sensors change
  useEffect(() => {
    if (!isOpen || !basement) return;
    const filtered = allSensors.filter((s) => s.screenId === screenId);
    setLocalSensors(filtered);
    filtered.forEach((s) => {
      if (!initialAnchorsRef.current[s.id]) {
        initialAnchorsRef.current[s.id] = { x: s.x, y: s.y };
      }
    });
    if (filtered.length > 0) {
      setSelectedSensorId(filtered[0].id);
    }
  }, [isOpen, basement, screenId, allSensors]);

  // Selected sensor object
  const selectedSensor = localSensors.find((s) => s.id === selectedSensorId) || localSensors[0] || null;

  // Real-time calculated occupancy metrics from live sensors
  const totalSlots = localSensors.length > 0 ? localSensors.length : (basement?.capacity || 45);
  const occupiedCount = localSensors.filter((s) => s.status === 1).length;
  const freeCount = localSensors.filter((s) => s.status === 0).length;
  const reservedCount = localSensors.filter((s) => s.status === 2).length;
  const occupancyRate = totalSlots > 0 ? Math.round((occupiedCount / totalSlots) * 100) : 0;

  // Handle Search execution
  const handleSearch = () => {
    const term = searchQuery.trim().toLowerCase();
    setActiveSearchTerm(term);
    if (!term) {
      setSearchMatchCount(0);
      return;
    }
    const matches = localSensors.filter(
      (s) =>
        s.sensorName.toLowerCase().includes(term) ||
        s.vehicleNo?.toLowerCase().includes(term) ||
        s.sensorNum.toString().includes(term)
    );
    setSearchMatchCount(matches.length);
    if (matches.length > 0) {
      setSelectedSensorId(matches[0].id);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchTerm('');
    setSearchMatchCount(0);
  };

  // Handle Refresh execution
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshedAt(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 600);
  };

  // Reset zoom & pan to default
  const handleResetView = () => {
    setScale(0.95);
    setOffset({ x: 30, y: 25 });
  };

  // Convert mouse event coordinates to canvas world coordinates
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

  // Find sensor within hit distance (radius 26px)
  const findSensorAt = (x: number, y: number): Sensor | undefined => {
    return localSensors.find((s) => {
      const dist = Math.hypot(s.x - x, s.y - y);
      return dist <= 26;
    });
  };

  // Mouse / Pointer Events for Dragging and Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const clickedSensor = findSensorAt(coords.x, coords.y);

    if (clickedSensor) {
      setSelectedSensorId(clickedSensor.id);
      if (isFreeMove) {
        setDraggedSensorId(clickedSensor.id);
        setDragCoords({ x: clickedSensor.x, y: clickedSensor.y, sensorName: clickedSensor.sensorName });
      }
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedSensorId && isFreeMove) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const newX = Math.round(Math.max(30, Math.min(1370, coords.x)));
      const newY = Math.round(Math.max(30, Math.min(680, coords.y)));

      setLocalSensors((prev) =>
        prev.map((s) =>
          s.id === draggedSensorId ? { ...s, x: newX, y: newY } : s
        )
      );

      const activeS = localSensors.find((s) => s.id === draggedSensorId);
      setDragCoords({
        x: newX,
        y: newY,
        sensorName: activeS?.sensorName || 'Sensor',
      });
    } else if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const hovered = findSensorAt(coords.x, coords.y);
      setHoveredSensorId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    if (draggedSensorId) {
      // Persist dragged positions to context
      bulkUpdateSensorPositions(
        localSensors.map((s) => ({ id: s.id, x: s.x, y: s.y }))
      );
      setDraggedSensorId(null);
      setDragCoords(null);
    }
    setIsPanning(false);
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    newScale = Math.min(Math.max(newScale, 0.4), 2.5);

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

  // Fine-tuning coordinate changes via manual number input
  const handleManualCoordChange = (axis: 'x' | 'y', val: number) => {
    if (!selectedSensor) return;
    const updatedSensors = localSensors.map((s) =>
      s.id === selectedSensor.id ? { ...s, [axis]: val } : s
    );
    setLocalSensors(updatedSensors);
    updateSensor(selectedSensor.id, { [axis]: val });
  };

  // Render Canvas Map
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Viewport transform
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const floorW = 1380;
    const floorH = 700;

    // 1. Blueprint floor base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, floorW, floorH);

    // Subtle Grid lines (50px)
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)';
    ctx.lineWidth = 1;
    for (let x = 0; x < floorW; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, floorH);
      ctx.stroke();
    }
    for (let y = 0; y < floorH; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(floorW, y);
      ctx.stroke();
    }

    const isB3 = basement?.id === 'b3';

    if (isB3) {
      // 1. Blueprint floor base for Basement 3
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, floorW, floorH);

      // Subtle Grid lines (50px)
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < floorW; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, floorH);
        ctx.stroke();
      }
      for (let y = 0; y < floorH; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(floorW, y);
        ctx.stroke();
      }

      // Outer Perimeter Border
      ctx.strokeStyle = '#2b4695';
      ctx.lineWidth = 4;
      ctx.strokeRect(3, 3, floorW - 6, floorH - 6);

      // Draw the uploaded architectural floor map image
      if (basement3ImgRef.current) {
        const mapImg = basement3ImgRef.current;
        const mapW = 1180;
        const mapH = 680;
        const mapX = (floorW - mapW) / 2;
        const mapY = 10;
        ctx.drawImage(mapImg, mapX, mapY, mapW, mapH);
      }

      // Watermark Background Label
      ctx.fillStyle = 'rgba(43, 70, 149, 0.08)';
      ctx.font = '900 60px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BASEMENT 3 — RADIAL PARKING DECK', floorW / 2, 70);
    } else {
      // 1. Blueprint floor base for Basement 1 & 2
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, floorW, floorH);

      // Subtle Grid lines (50px)
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)';
      ctx.lineWidth = 1;
      for (let x = 0; x < floorW; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, floorH);
        ctx.stroke();
      }
      for (let y = 0; y < floorH; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(floorW, y);
        ctx.stroke();
      }

      // Outer Perimeter Border
      ctx.strokeStyle = '#2b4695';
      ctx.lineWidth = 4;
      ctx.strokeRect(3, 3, floorW - 6, floorH - 6);

      // Driving Aisles
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(50, 310, floorW - 100, 130); // Center drive lane
      ctx.fillRect(30, 40, 80, floorH - 80);    // Left drive lane
      ctx.fillRect(floorW - 110, 40, 80, floorH - 80); // Right drive lane

      // Dashed Center Divider Line
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.85)';
      ctx.setLineDash([18, 12]);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(110, 375);
      ctx.lineTo(floorW - 110, 375);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Directional Arrow Markings
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ENTRY ➔', 220, 375);
      ctx.fillText('ONE WAY ➔ ➔', floorW / 2, 375);
      ctx.fillText('➔ EXIT', floorW - 220, 375);

      // Watermark Background Label
      ctx.fillStyle = 'rgba(43, 70, 149, 0.05)';
      ctx.font = '900 70px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((basement?.name || 'BASEMENT MAP').toUpperCase(), floorW / 2, 180);
    }

    // 2. Parking Bays & Sensors
    localSensors.forEach((sensor, index) => {
      const isSelected = sensor.id === selectedSensorId;
      const isUpper = sensor.y < 350;
      const bayW = isB3 ? 36 : 72;
      const bayH = isB3 ? 46 : 100;

      // Base anchor position for the parking slot bay
      const colIndex = isUpper ? index : index - Math.ceil(localSensors.length / 2);
      const defaultAnchorX = isB3
        ? (initialAnchorsRef.current[sensor.id]?.x ?? sensor.x)
        : (140 + (colIndex >= 0 ? colIndex : 0) * 84);
      const defaultAnchorY = isB3
        ? (initialAnchorsRef.current[sensor.id]?.y ?? sensor.y)
        : (isUpper ? 140 : 540);

      if (!isB3) {
        // Draw Parking Bay Box Outline
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(defaultAnchorX - bayW / 2, defaultAnchorY - bayH / 2, bayW, bayH);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(defaultAnchorX - bayW / 2, defaultAnchorY - bayH / 2, bayW, bayH);

        // Bay Label inside parking space
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`BAY ${sensor.sensorNum || index + 1}`, defaultAnchorX, defaultAnchorY - bayH / 2 + 8);

        // Vehicle Plate (if occupied)
        if (sensor.status === 1 && sensor.vehicleNo) {
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText(sensor.vehicleNo, defaultAnchorX, defaultAnchorY - bayH / 2 + 24);
        }
        // Line connecting Parking Bay to Sensor (shows relationship when freely moved)
        const distFromAnchor = Math.hypot(sensor.x - defaultAnchorX, sensor.y - defaultAnchorY);
        if (distFromAnchor > 4) {
          ctx.strokeStyle = 'rgba(43, 70, 149, 0.6)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(defaultAnchorX, defaultAnchorY);
          ctx.lineTo(sensor.x, sensor.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Basement 3: Sensor free flows over map with NO square box and NO line connecting to square!
        // Show dotted lines from X axis and Y axis for selected, dragged, or hovered sensor
        const isHovered = hoveredSensorId === sensor.id;
        const isDragged = draggedSensorId === sensor.id;
        const showAxes = isSelected || isDragged || isHovered;

        if (showAxes) {
          ctx.save();
          // Dotted guide line from X and Y axis
          ctx.strokeStyle = isDragged ? '#f59e0b' : '#55aedd';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = isDragged ? 2 : 1.5;

          // Vertical dotted line from X-axis (top) to sensor
          ctx.beginPath();
          ctx.moveTo(sensor.x, 0);
          ctx.lineTo(sensor.x, sensor.y);
          ctx.stroke();

          // Horizontal dotted line from Y-axis (left) to sensor
          ctx.beginPath();
          ctx.moveTo(0, sensor.y);
          ctx.lineTo(sensor.x, sensor.y);
          ctx.stroke();

          // Axis coordinate chip labels at top (X) and left (Y)
          ctx.setLineDash([]);
          ctx.font = 'bold 9.5px monospace';

          // X-axis tag at top edge
          const xText = `X: ${sensor.x}`;
          const xTextW = ctx.measureText(xText).width;
          ctx.fillStyle = '#2b4695';
          ctx.fillRect(sensor.x - (xTextW + 12) / 2, 4, xTextW + 12, 17);
          ctx.strokeStyle = '#55aedd';
          ctx.lineWidth = 1;
          ctx.strokeRect(sensor.x - (xTextW + 12) / 2, 4, xTextW + 12, 17);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(xText, sensor.x, 12);

          // Y-axis tag at left edge
          const yText = `Y: ${sensor.y}`;
          const yTextW = ctx.measureText(yText).width;
          ctx.fillStyle = '#2b4695';
          ctx.fillRect(4, sensor.y - 8.5, yTextW + 12, 17);
          ctx.strokeStyle = '#55aedd';
          ctx.lineWidth = 1;
          ctx.strokeRect(4, sensor.y - 8.5, yTextW + 12, 17);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(yText, 4 + (yTextW + 12) / 2, sensor.y);

          ctx.restore();
        }
      }

      // 4. Draw Draggable Sensor Node with Sensor Name
      const isSearched =
        activeSearchTerm &&
        (sensor.sensorName.toLowerCase().includes(activeSearchTerm) ||
          sensor.vehicleNo?.toLowerCase().includes(activeSearchTerm) ||
          sensor.sensorNum.toString() === activeSearchTerm);

      // Sensor Status Colors
      let sensorFill = '#10b981'; // Free = Green
      let statusText = 'FREE';
      if (sensor.status === 1) {
        sensorFill = '#ef4444'; // Occupied = Red
        statusText = 'OCCUPIED';
      } else if (sensor.status === 2) {
        sensorFill = '#2b4695'; // Reserved = Blue
        statusText = 'RESERVED';
      } else if (sensor.status === 3) {
        sensorFill = '#64748b'; // Offline = Gray
        statusText = 'OFFLINE';
      }

      // Outer Selection / Search Halo
      if (isSelected || isSearched) {
        ctx.beginPath();
        ctx.arc(sensor.x, sensor.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = isSearched ? 'rgba(234, 179, 8, 0.35)' : 'rgba(43, 70, 149, 0.35)';
        ctx.fill();
        ctx.strokeStyle = isSearched ? '#eab308' : '#2b4695';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Main Sensor Circle
      ctx.beginPath();
      ctx.arc(sensor.x, sensor.y, 19, 0, Math.PI * 2);
      ctx.fillStyle = sensorFill;
      ctx.fill();

      // White inner ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // SENSOR NAME text in center
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sensor.sensorName, sensor.x, sensor.y);

      // Coordinates pill below/above sensor
      ctx.font = '8.5px monospace';
      ctx.fillStyle = '#1e293b';
      const coordY = isUpper ? sensor.y + 26 : sensor.y - 26;
      ctx.fillText(`(${sensor.x}, ${sensor.y})`, sensor.x, coordY);
    });

    // 5. Active Dragging Floating Tooltip Badge
    if (dragCoords) {
      ctx.fillStyle = '#1e293b';
      const tooltipW = 120;
      const tooltipH = 28;
      const tooltipX = dragCoords.x - tooltipW / 2;
      const tooltipY = dragCoords.y - 42;

      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipW, tooltipH, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `📍 ${dragCoords.sensorName}: ${dragCoords.x}, ${dragCoords.y}`,
        dragCoords.x,
        tooltipY + 14
      );
    }

    ctx.restore();
    ctx.restore();
  }, [
    offset,
    scale,
    localSensors,
    selectedSensorId,
    activeSearchTerm,
    dragCoords,
    basement?.name,
    basement?.id,
    isImgLoaded,
    hoveredSensorId,
  ]);

  // Redraw when dependencies change
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  if (!isOpen || !basement) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* ================= 1. HEADER (#2b4695 Enterprise Navy) ================= */}
      <div className="bg-[#2b4695] text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-md shrink-0 select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back to Dashboard Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition border border-white/25 shadow-xs shrink-0"
            title="Return to Simplified Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-5 w-px bg-white/25 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded bg-white/15 border border-white/20 hidden sm:flex shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {basement.name} — Full Screen Parking Map & Sensor Layout
                </h2>
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#2b4695] uppercase shrink-0">
                  Full Screen View
                </span>
              </div>
              <p className="text-[11px] text-blue-100 opacity-90 hidden lg:block truncate">
                View bay occupancy, inspect sensors, and freely drag & adjust (X, Y) coordinates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Basement Switcher Tabs */}
          {allBasements.length > 1 && (
            <div className="flex items-center gap-1 bg-black/25 p-0.5 rounded border border-white/20 text-xs">
              {allBasements.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBasement && onSelectBasement(b)}
                  className={`px-2 sm:px-3 py-1 rounded transition text-xs font-medium ${
                    b.id === basement.id
                      ? 'bg-white text-[#2b4695] font-bold shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}

          {/* Browser Native Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="p-1.5 rounded hover:bg-white/20 text-white transition hidden sm:flex items-center gap-1 text-xs"
            title={isNativeFs ? 'Exit OS Fullscreen' : 'OS Fullscreen'}
          >
            {isNativeFs ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span className="hidden xl:inline">{isNativeFs ? 'Exit Max' : 'Maximize'}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-rose-600 text-white transition ml-1"
            title="Close Full Screen View (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ================= 2. SPECIFIC BASEMENT OCCUPANCY DETAILS BANNER ================= */}
        <div className="bg-[#f0f4fd] dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-center sm:text-left">
            {/* Occupied */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded border border-red-200 dark:border-red-900/40 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-red-600 leading-none">
                  {occupiedCount}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Occupied Bays
                </div>
              </div>
            </div>

            {/* Free */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-900/40 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-emerald-600 leading-none">
                  {freeCount}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Free Space
                </div>
              </div>
            </div>

            {/* Total Capacity */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded border border-blue-200 dark:border-blue-900/40 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-100 text-[#2b4695] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-[#2b4695] leading-none">
                  {totalSlots}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Lot Capacity
                </div>
              </div>
            </div>

            {/* Long Stay */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded border border-amber-200 dark:border-amber-900/40 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-amber-600 leading-none">
                  {basement.longStay}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Long Stay
                </div>
              </div>
            </div>

            {/* Occupancy Percentage */}
            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Rate:</span>
                <span className="font-bold text-[#2b4695] dark:text-blue-400">{occupancyRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2b4695] transition-all duration-300"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. ACTION TOOLBAR (Search, Refresh, Free Move, Coordinates) ================= */}
        <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Left Group: Search Bar with Dedicated Search Button */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[280px] max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Sensor Name (e.g. B1-05), Bay No, Plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dedicated Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="px-3 py-1.5 rounded bg-[#2b4695] hover:bg-blue-800 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition shrink-0"
              title="Search sensor or bay"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {/* Dedicated Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition shrink-0"
              title={`Refresh data (Last updated: ${lastRefreshedAt})`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#2b4695] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* Right Group: Free Move Toggle & Live Coordinate Inspector */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Free Move Toggle */}
            <button
              type="button"
              onClick={() => setIsFreeMove(!isFreeMove)}
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shadow-xs ${
                isFreeMove
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
              title="Enable or disable free drag and drop of sensors"
            >
              <Move className="w-3.5 h-3.5" />
              <span>Free Move: {isFreeMove ? 'ON (Draggable)' : 'OFF'}</span>
            </button>

            {/* Selected Sensor Coordinate Display & Numeric Adjustment */}
            {selectedSensor && (
              <div className="flex items-center gap-1.5 bg-[#f0f4fd] dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-900/40 text-xs">
                <span className="font-bold text-[#2b4695] dark:text-blue-300">
                  {selectedSensor.sensorName}:
                </span>
                <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span>X:</span>
                  <input
                    type="number"
                    value={selectedSensor.x}
                    onChange={(e) =>
                      handleManualCoordChange('x', parseInt(e.target.value) || 0)
                    }
                    className="w-14 px-1 py-0.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-center"
                  />
                </label>
                <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span>Y:</span>
                  <input
                    type="number"
                    value={selectedSensor.y}
                    onChange={(e) =>
                      handleManualCoordChange('y', parseInt(e.target.value) || 0)
                    }
                    className="w-14 px-1 py-0.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-center"
                  />
                </label>
              </div>
            )}

            {/* Zoom / Reset View Controls */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(s * 1.15, 2.5))}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(s / 1.15, 0.4))}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search match notification banner if active */}
        {activeSearchTerm && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 px-4 py-1.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200 shrink-0">
            <span>
              Search query <strong>"{activeSearchTerm}"</strong>: found{' '}
              <strong>{searchMatchCount}</strong> matching bay/sensor(s).
            </span>
            <button
              onClick={handleClearSearch}
              className="text-amber-700 dark:text-amber-300 underline font-semibold"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ================= 4. MAP CANVAS (Interactive Drag & Drop) ================= */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full min-h-[380px] sm:min-h-[460px] bg-slate-100 dark:bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setHoveredSensorId(null)}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Map Guide Overlay Pill */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-md text-xs pointer-events-none flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Move className="w-3 h-3 text-amber-500" />
              {basement.id === 'b3'
                ? 'Free-flow sensors with live X & Y axis dotted coordinates. Drag any sensor freely.'
                : 'Click & Drag any sensor circle to freely move coordinates (X, Y)'}
            </span>
            <span className="border-l border-slate-300 dark:border-slate-700 pl-2 text-slate-500">
              Scroll wheel to zoom • Drag background to pan
            </span>
          </div>

          {/* Status Legend Pill */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-md text-[11px] pointer-events-none flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Free
            </span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Occupied
            </span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Reserved
            </span>
          </div>
        </div>

        {/* ================= 5. FOOTER ================= */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Showing <strong>{localSensors.length}</strong> sensors for {basement.name}.
            Coordinates are automatically updated in real-time.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#2b4695] hover:bg-blue-800 text-white rounded font-medium transition shadow-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
    </div>
  );
}
