'use client';

import React, { useState, useEffect } from 'react';
import { usePGS } from '@/context/PGSContext';
import {
  Building2,
  Layers,
  Camera,
  Activity,
  Calendar,
  Video,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Zap,
  Download,
  Flame,
  Ban,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import DownloadReportModal from '@/components/header/DownloadReportModal';
import HeatMapReportModal from '@/components/header/HeatMapReportModal';
import BlocklistModal from '@/components/header/BlocklistModal';
import FloatableReportCard from '@/components/dashboard/FloatableReportCard';
import BasementMapModal from '@/components/dashboard/BasementMapModal';

interface DeviceItem {
  id: string;
  buildingId: string;
  buildingName: string;
  connection: string;
  ipAddress: string;
  location: string;
  status: 'Active' | 'Warning' | 'Offline';
  latency: string;
  hourlyStatus: string;
  dailyStatus: string;
  weeklyStatus: string;
}

const mockDevices: DeviceItem[] = [
  {
    id: 'cam-136',
    buildingId: 'tower-a',
    buildingName: 'Tower A',
    connection: 'CAM136',
    ipAddress: '192.168.1.136:554',
    location: 'Tower A • Lane 1 Ingate',
    status: 'Active',
    latency: '12ms',
    hourlyStatus: '85% Peak (09:00-11:00) • Active',
    dailyStatus: '78% Daily Avg • 240 Vehicles • Active',
    weeklyStatus: '74% Weekly Avg • Mon-Fri Peak • Active',
  },
  {
    id: 'cam-49',
    buildingId: 'tower-a',
    buildingName: 'Tower A',
    connection: 'CAM49',
    ipAddress: '192.168.1.149:554',
    location: 'Tower A • B1 Center Bay',
    status: 'Active',
    latency: '8ms',
    hourlyStatus: '78% Peak (13:00-15:00) • Active',
    dailyStatus: '72% Daily Avg • 198 Vehicles • Active',
    weeklyStatus: '69% Weekly Avg • Normal Load • Active',
  },
  {
    id: 'cam-50',
    buildingId: 'tower-a',
    buildingName: 'Tower A',
    connection: 'CAM50',
    ipAddress: '192.168.1.150:554',
    location: 'Tower A • B1 Ramp Entrance',
    status: 'Active',
    latency: '15ms',
    hourlyStatus: '64% Peak (11:00-13:00) • Active',
    dailyStatus: '61% Daily Avg • 165 Vehicles • Active',
    weeklyStatus: '58% Weekly Avg • Steady Flow • Active',
  },
  {
    id: 'cam-03',
    buildingId: 'tower-a',
    buildingName: 'Tower A',
    connection: 'CAM3',
    ipAddress: '192.168.1.103:554',
    location: 'Tower A • B2 West Deck',
    status: 'Active',
    latency: '11ms',
    hourlyStatus: '71% Peak (10:00-12:00) • Active',
    dailyStatus: '68% Daily Avg • 182 Vehicles • Active',
    weeklyStatus: '65% Weekly Avg • Staff Overflow • Active',
  },
];

interface BuildingItem {
  id: string;
  name: string;
  shortName: string;
  occupied: number;
  capacity: number;
  free: number;
  longStay: number;
}

interface BasementItem {
  id: string;
  buildingId: string;
  name: string;
  occupied: number;
  capacity: number;
  free: number;
  longStay: number;
}

const allBuildingsData: BuildingItem[] = [
  {
    id: 'tower-a',
    name: 'Tower A',
    shortName: 'Tower A',
    occupied: 68,
    capacity: 123,
    free: 55,
    longStay: 7,
  },
];

const allBasementsData: BasementItem[] = [
  {
    id: 'b1',
    buildingId: 'tower-a',
    name: 'Basement 1',
    occupied: 28,
    capacity: 45,
    free: 17,
    longStay: 3,
  },
  {
    id: 'b2',
    buildingId: 'tower-a',
    name: 'Basement 2',
    occupied: 22,
    capacity: 40,
    free: 18,
    longStay: 2,
  },
  {
    id: 'b3',
    buildingId: 'tower-a',
    name: 'Basement 3',
    occupied: 18,
    capacity: 38,
    free: 20,
    longStay: 2,
  },
];

// Compact 2x2 Metric Card matching user mockup / hardware display (Accenture BDC9 style)
interface CompactOccupancyCardProps {
  title: string;
  occupied: number;
  free: number;
  capacity: number;
  longStay: number;
  subtitle?: string;
  isSelected?: boolean;
  onClick?: () => void;
  headerColorClass?: string;
  canHide?: boolean;
  isInitiallyHidden?: boolean;
}

function CompactOccupancyCard({
  title,
  occupied,
  free,
  capacity,
  longStay,
  subtitle,
  isSelected,
  onClick,
  headerColorClass = 'bg-[#2b4695]',
  canHide = true,
  isInitiallyHidden = false,
}: CompactOccupancyCardProps) {
  const [isSubTableHidden, setIsSubTableHidden] = useState(isInitiallyHidden);

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-1.5 sm:p-2 transition-all duration-200 border-2 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-400/80 shadow-xl bg-blue-500/15'
          : 'border-blue-400/40 dark:border-blue-500/30 bg-blue-500/5 hover:border-blue-400 hover:shadow-lg'
      }`}
    >
      <div className="rounded overflow-hidden border border-blue-400/50 dark:border-blue-400/30 shadow-sm flex flex-col">
        {/* Solid Blue Header Banner */}
        <div
          className={`${headerColorClass} text-white px-3.5 py-2 sm:py-2.5 flex items-center justify-between min-h-[40px]`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-medium text-sm sm:text-base tracking-wide truncate text-white">
              {title}
            </h3>
            {subtitle && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 text-white/90 font-mono">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canHide && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSubTableHidden(!isSubTableHidden);
                }}
                className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition active:scale-95 shadow-xs"
                title={isSubTableHidden ? `Expand ${title}` : `Collapse ${title}`}
              >
                {isSubTableHidden ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            )}
            {isSelected && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-blue-700 font-mono shadow-xs shrink-0">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* 2x2 Metric Quadrant Body in light lavender / dark blue glass (only shown when not minimized) */}
        {!isSubTableHidden && (
          <div className="bg-[#dce3f8] dark:bg-slate-900/95 p-3 sm:p-3.5 grid grid-cols-2 gap-x-3.5 sm:gap-x-5 gap-y-3 sm:gap-y-3.5">
            {/* Top-Left: OCCUPIED (Red) */}
            <div className="text-left">
              <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-medium text-[#e50914] text-red-600 leading-none tracking-tight">
                {occupied}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#e50914] text-red-600 uppercase tracking-wider mt-1.5">
                OCCUPIED
              </div>
            </div>

            {/* Top-Right: FREE SPACE (Green) */}
            <div className="text-right">
              <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-medium text-[#008037] text-emerald-700 dark:text-emerald-400 leading-none tracking-tight">
                {free}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#008037] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-1.5">
                FREE SPACE
              </div>
            </div>

            {/* Bottom-Left: LOT CAPACITY (Slate / Dark) */}
            <div className="text-left">
              <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-medium text-[#5c6b73] text-slate-600 dark:text-slate-300 leading-none tracking-tight">
                {capacity}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#1e293b] text-slate-900 dark:text-slate-100 uppercase tracking-wider mt-1.5">
                LOT CAPACITY
              </div>
            </div>

            {/* Bottom-Right: LONG STAY (Orange / Amber) */}
            <div className="text-right">
              <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-medium text-[#ff7700] text-amber-500 leading-none tracking-tight">
                {longStay}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#ff7700] text-amber-500 uppercase tracking-wider mt-1.5">
                LONG STAY
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimplifiedDashboardView() {
  const { screens, activeScreenSensors, sensors, setActiveScreenId } = usePGS();

  // Selected camera for live view modal simulation
  const [selectedCamera, setSelectedCamera] = useState<DeviceItem | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);

  // Selected Basement for Interactive Map View
  const [selectedBasementForMap, setSelectedBasementForMap] = useState<BasementItem | null>(null);
  const [isBasementMapModalOpen, setIsBasementMapModalOpen] = useState(false);

  const handleOpenBasementMap = (bm: BasementItem) => {
    setSelectedBasementForMap(bm);
    setIsBasementMapModalOpen(true);
  };

  // Timeframe Tab for Right Bottom Table: Hourly, Daily, Weekly
  const [occupiedTimeframe, setOccupiedTimeframe] = useState<'HOURLY' | 'DAILY' | 'WEEKLY'>('HOURLY');

  // Sub-table visibility toggles for Building Occupancy and Basements Occupancy
  const [isBuildingSubTableHidden, setIsBuildingSubTableHidden] = useState<boolean>(false);
  const [isBasementsSubTableHidden, setIsBasementsSubTableHidden] = useState<boolean>(false);

  // Trigger to reset all floated sub-report cards to default docked grid
  const [resetFloatTrigger, setResetFloatTrigger] = useState<number>(0);

  // Dynamic live clock with mounted hydration protection (used in Camera RTSP modal)
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Table 3: Resizable Column Widths (Live Device Status)
  const [deviceColWidths, setDeviceColWidths] = useState<{ [key: string]: number }>({
    connection: 100,
    ip: 95,
    live: 45,
    status: 70,
  });

  // Table 4: Resizable Column Widths (Occupied Status Analysis)
  const [analysisColWidths, setAnalysisColWidths] = useState<{ [key: string]: number }>({
    connection: 100,
    ip: 95,
    live: 45,
    status: 120,
  });

  const handleColResize = (
    e: React.PointerEvent<HTMLDivElement>,
    colKey: string,
    setWidths: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const parentTh = e.currentTarget.parentElement;
    const startW = parentTh ? parentTh.getBoundingClientRect().width : 80;
    const target = e.currentTarget;

    const onPointerMove = (evt: PointerEvent) => {
      const delta = evt.clientX - startX;
      const newWidth = Math.max(40, Math.round(startW + delta));
      setWidths((prev) => ({
        ...prev,
        [colKey]: newWidth,
      }));
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {}
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
  };

  // Filtered Buildings for Table 1
  const displayedBuildings = allBuildingsData;

  // Filtered Basements for Table 2
  const displayedBasements = allBasementsData;

  // Filtered Devices for Table 3 and Table 4
  const displayedDevices = mockDevices;

  // Matrix format occupancy status formatter (compact, tight spacing, matrix readout)
  const renderOccupiedStatusBadge = (statusText: string) => {
    const cleaned = statusText.replace(/•\s*Active/gi, '').trim();
    const parts = cleaned.split('•').map((p) => p.trim());
    const primary = parts[0] || '';
    const secondary = parts[1] || '';

    const parenMatch = primary.match(/^(.+?)\s*\(([^)]+)\)$/);
    const mainLabel = parenMatch ? parenMatch[1] : primary;
    const timeLabel = parenMatch ? parenMatch[2] : null;

    return (
      <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono leading-tight whitespace-nowrap">
        <span className="font-medium text-[#55aedd] dark:text-[#55aedd]">
          {mainLabel}
        </span>
        {timeLabel && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            ({timeLabel})
          </span>
        )}
        {secondary && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-white/20 pl-1.5">
            {secondary}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col gap-2.5 pb-6">
      {/* 4. Main 4-Column Grid (Col 1: 20% Building, Col 2: 20% Basements, Col 3: 30% Live Device, Col 4: 30% Occupied Analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[20%_20%_30%_30%] gap-2.5 sm:gap-3 items-start">
        {/* ================= COLUMN 1: BUILDING OCCUPANCY ================= */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <FloatableReportCard
            id="report-building-overview"
            title="Building Occupancy"
            icon={<Building2 className="w-3.5 h-3.5" />}
            headerAccentClass="bg-[#2b4695]"
            resetTrigger={resetFloatTrigger}
            hideRightControls={true}
            headerActions={
              <button
                type="button"
                onClick={() => setIsBuildingSubTableHidden(!isBuildingSubTableHidden)}
                className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition active:scale-95 shadow-xs"
                title={isBuildingSubTableHidden ? 'Expand Building Occupancy' : 'Collapse Building Occupancy'}
              >
                {isBuildingSubTableHidden ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            }
          >
            {isBuildingSubTableHidden ? (
              <div
                onClick={() => setIsBuildingSubTableHidden(false)}
                className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/10 dark:bg-black/20 rounded-md border border-dashed border-white/25 flex items-center justify-center gap-2 py-3.5 cursor-pointer hover:bg-white/15 transition select-none"
                title="Click to expand"
              >
                <span className="text-slate-700 dark:text-slate-200 font-medium text-[11.5px]">Sub-table collapsed</span>
                <ChevronDown className="w-4 h-4 text-[#2b4695] dark:text-blue-300" />
              </div>
            ) : (
              <div className="p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3">
                {displayedBuildings.map((b) => (
                  <CompactOccupancyCard
                    key={b.id}
                    title={b.name}
                    occupied={b.occupied}
                    free={b.free}
                    capacity={b.capacity}
                    longStay={b.longStay}
                    headerColorClass="bg-[#2b4695]"
                  />
                ))}
              </div>
            )}
          </FloatableReportCard>
        </div>

        {/* ================= COLUMN 2: BASEMENTS OCCUPANCY ================= */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <FloatableReportCard
            id="report-basements-details"
            title="Basements Occupancy"
            icon={<Layers className="w-3.5 h-3.5" />}
            headerAccentClass="bg-[#2b4695]"
            resetTrigger={resetFloatTrigger}
            hideRightControls={true}
            headerActions={
              <button
                type="button"
                onClick={() => setIsBasementsSubTableHidden(!isBasementsSubTableHidden)}
                className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition active:scale-95 shadow-xs"
                title={isBasementsSubTableHidden ? 'Expand Basements Occupancy' : 'Collapse Basements Occupancy'}
              >
                {isBasementsSubTableHidden ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            }
          >
            {isBasementsSubTableHidden ? (
              <div
                onClick={() => setIsBasementsSubTableHidden(false)}
                className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/10 dark:bg-black/20 rounded-md border border-dashed border-white/25 flex items-center justify-center gap-2 py-3.5 cursor-pointer hover:bg-white/15 transition select-none"
                title="Click to expand"
              >
                <span className="text-slate-700 dark:text-slate-200 font-medium text-[11.5px]">Sub-tables collapsed</span>
                <ChevronDown className="w-4 h-4 text-[#2b4695] dark:text-blue-300" />
              </div>
            ) : (
              <div className="p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3">
                {displayedBasements.map((bm) => (
                  <CompactOccupancyCard
                    key={bm.id}
                    title={bm.name}
                    occupied={bm.occupied}
                    free={bm.free}
                    capacity={bm.capacity}
                    longStay={bm.longStay}
                    headerColorClass="bg-[#2b4695]"
                    isSelected={selectedBasementForMap?.id === bm.id && isBasementMapModalOpen}
                    onClick={() => handleOpenBasementMap(bm)}
                  />
                ))}
              </div>
            )}
          </FloatableReportCard>
        </div>

        {/* ================= COLUMN 3: LIVE DEVICE STATUS ================= */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <FloatableReportCard
            id="report-device-status"
            title="Live Device Status"
            icon={<Camera className="w-3.5 h-3.5" />}
            headerAccentClass="bg-[#2b4695]"
            resetTrigger={resetFloatTrigger}
            hideRightControls={true}
          >
            <div className="overflow-x-auto overflow-y-auto max-h-[380px] scrollbar-thin">
              <table className="w-full text-left border-collapse border border-white/20 dark:border-white/10 min-w-[460px]">
                <thead className="sticky top-0 z-10 shadow-xs">
                  <tr className="bg-[#2b4695] text-white border-b border-white/20 text-xs font-medium uppercase tracking-wider select-none">
                    <th
                      style={{ width: `${deviceColWidths.connection}px` }}
                      className="relative py-2 px-2.5 border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>Connection</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'connection', setDeviceColWidths)}
                        onDoubleClick={() => setDeviceColWidths((w) => ({ ...w, connection: 100 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${deviceColWidths.ip}px` }}
                      className="relative py-2 px-2.5 border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>IP Address</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'ip', setDeviceColWidths)}
                        onDoubleClick={() => setDeviceColWidths((w) => ({ ...w, ip: 95 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${deviceColWidths.live}px` }}
                      className="relative py-2 px-2 text-center border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>Live</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'live', setDeviceColWidths)}
                        onDoubleClick={() => setDeviceColWidths((w) => ({ ...w, live: 45 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${deviceColWidths.status}px` }}
                      className="relative py-2 px-2.5 text-center group whitespace-nowrap"
                    >
                      <span>Status</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'status', setDeviceColWidths)}
                        onDoubleClick={() => setDeviceColWidths((w) => ({ ...w, status: 70 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/15 dark:divide-white/10 text-xs sm:text-[13px]">
                  {displayedDevices.map((dev) => (
                    <tr
                      key={dev.id}
                      className="hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    >
                      <td className="py-2 px-2.5 font-normal text-slate-900 dark:text-white border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-medium truncate">{dev.connection.replace(/\s*\(.*?\)/g, '')}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                        {dev.ipAddress}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCamera(dev)}
                          className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-800 dark:text-blue-200 font-medium text-[11px] transition inline-flex items-center gap-1 mx-auto shadow-sm"
                          title={`Inspect Live Stream for ${dev.connection}`}
                        >
                          <Video className="w-3 h-3 text-blue-500 animate-pulse" />
                          <span>View</span>
                        </button>
                      </td>
                      <td className="py-2 px-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{dev.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FloatableReportCard>
        </div>

        {/* ================= COLUMN 4: OCCUPIED STATUS ANALYSIS ================= */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <FloatableReportCard
            id="report-occupied-analysis"
            title="Occupied Status Analysis"
            icon={<Activity className="w-3.5 h-3.5" />}
            headerAccentClass="bg-[#2b4695]"
            resetTrigger={resetFloatTrigger}
            badge={
              <div className="flex items-center gap-0.5 p-0.5 rounded bg-black/35 border border-white/20">
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('HOURLY')}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition ${
                    occupiedTimeframe === 'HOURLY'
                      ? 'bg-[#55aedd] text-white font-medium shadow-xs'
                      : 'text-[#55aedd] hover:text-white'
                  }`}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('DAILY')}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition ${
                    occupiedTimeframe === 'DAILY'
                      ? 'bg-[#55aedd] text-white font-medium shadow-xs'
                      : 'text-[#55aedd] hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('WEEKLY')}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition ${
                    occupiedTimeframe === 'WEEKLY'
                      ? 'bg-[#55aedd] text-white font-medium shadow-xs'
                      : 'text-[#55aedd] hover:text-white'
                  }`}
                >
                  Weekly
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto overflow-y-auto max-h-[380px] scrollbar-thin">
              <table className="w-full text-left border-collapse border border-white/20 dark:border-white/10 min-w-[500px]">
                <thead className="sticky top-0 z-10 shadow-xs">
                  <tr className="bg-[#2b4695] text-white border-b border-white/20 text-xs font-medium uppercase tracking-wider select-none">
                    <th
                      style={{ width: `${analysisColWidths.connection}px` }}
                      className="relative py-2 px-2.5 border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>Connection</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'connection', setAnalysisColWidths)}
                        onDoubleClick={() => setAnalysisColWidths((w) => ({ ...w, connection: 100 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${analysisColWidths.ip}px` }}
                      className="relative py-2 px-2.5 border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>IP Address</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'ip', setAnalysisColWidths)}
                        onDoubleClick={() => setAnalysisColWidths((w) => ({ ...w, ip: 95 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${analysisColWidths.live}px` }}
                      className="relative py-2 px-2 text-center border-r border-white/15 dark:border-white/10 group whitespace-nowrap"
                    >
                      <span>Live</span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'live', setAnalysisColWidths)}
                        onDoubleClick={() => setAnalysisColWidths((w) => ({ ...w, live: 45 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                    <th
                      style={{ width: `${analysisColWidths.status}px` }}
                      className="relative py-2 px-2.5 text-center group whitespace-nowrap"
                    >
                      <span>
                        {occupiedTimeframe === 'HOURLY' ? 'Hourly' : occupiedTimeframe === 'DAILY' ? 'Daily' : 'Weekly'} Status
                      </span>
                      <div
                        onPointerDown={(e) => handleColResize(e, 'status', setAnalysisColWidths)}
                        onDoubleClick={() => setAnalysisColWidths((w) => ({ ...w, status: 140 }))}
                        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition z-10 touch-none"
                        title="Drag to resize column (Double-click to reset)"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/15 dark:divide-white/10 text-xs sm:text-[13px]">
                  {displayedDevices.map((dev) => {
                    const statusText =
                      occupiedTimeframe === 'HOURLY'
                        ? dev.hourlyStatus
                        : occupiedTimeframe === 'DAILY'
                        ? dev.dailyStatus
                        : dev.weeklyStatus;

                    return (
                      <tr
                        key={dev.id}
                        className="hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                      >
                        <td className="py-2 px-2.5 font-normal text-slate-900 dark:text-white border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-[#55aedd] shrink-0" />
                            <span className="font-medium truncate">{dev.connection.replace(/\s*\(.*?\)/g, '')}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                          {dev.ipAddress}
                        </td>
                        <td className="py-2 px-2 text-center border-r border-white/10 dark:border-white/10 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedCamera(dev)}
                            className="px-2 py-0.5 rounded bg-[#55aedd]/20 hover:bg-[#55aedd]/40 border border-[#55aedd]/40 text-[#55aedd] dark:text-[#55aedd] font-medium text-[11px] transition inline-flex items-center gap-1 mx-auto shadow-xs"
                            title={`Inspect Camera Stream for ${dev.connection}`}
                          >
                            <Video className="w-3 h-3 text-[#55aedd] animate-pulse" />
                            <span>View</span>
                          </button>
                        </td>
                        <td className="py-2 px-2.5 text-center whitespace-nowrap">
                          {renderOccupiedStatusBadge(statusText)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FloatableReportCard>
        </div>
      </div>

      {/* 5. Live View RTSP Camera Stream Modal (Interactive Glass Modal) */}
      {selectedCamera && (
        <div
          onClick={() => setSelectedCamera(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-lg overflow-hidden bg-white/25 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/30 shadow-2xl flex flex-col my-auto"
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-900/80 border-b border-white/20 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm sm:text-base font-medium">{selectedCamera.connection}</h3>
                  <p className="text-xs text-slate-400 font-mono font-normal">
                    IP: {selectedCamera.ipAddress} • RTSP Stream @ 25 FPS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCamera(null)}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Stream Feed Viewport */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"
                alt="Live Camera Feed"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Stream Telemetry Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-normal text-xs flex items-center gap-1.5 shadow">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE REC
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 text-white font-mono font-normal text-xs border border-white/15">
                  {selectedCamera.location}
                </span>
              </div>

              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-emerald-400 font-mono font-normal text-xs border border-white/15 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>LATENCY: {selectedCamera.latency}</span>
              </div>

              {/* Simulated AI Object Recognition Bounding Boxes */}
              <div className="absolute inset-0 p-6 pointer-events-none flex items-center justify-around">
                <div className="border border-dashed border-emerald-400 bg-emerald-500/15 p-2 rounded text-xs font-mono text-emerald-300">
                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-normal">SLOT 01: FREE</span>
                </div>
                <div className="border border-rose-500 bg-rose-500/20 p-2 rounded text-xs font-mono text-rose-300">
                  <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded font-normal">SLOT 02: OCCUPIED</span>
                  <div className="text-[11px] text-white mt-0.5">PLATE: DL-01-AB-1234</div>
                </div>
              </div>

              {/* Bottom Timestamp Bar */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm flex items-center justify-between text-xs font-mono font-normal text-slate-300 border border-white/15">
                <span>RTSP H.264 / 1080p High-Bitrate</span>
                <span>{timeString} • {dateString}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-900/80 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-300">
                Status: <span className="text-emerald-400 font-medium">{selectedCamera.status}</span>
              </span>
              <button
                onClick={() => setSelectedCamera(null)}
                className="px-3 py-1 rounded bg-white/15 hover:bg-white/25 text-white font-normal transition"
              >
                Close Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Modals */}
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

      {/* Interactive Basement Floor Map & Sensor Layout Modal */}
      <BasementMapModal
        isOpen={isBasementMapModalOpen}
        onClose={() => setIsBasementMapModalOpen(false)}
        basement={selectedBasementForMap}
        onSelectBasement={(b) => setSelectedBasementForMap(b as BasementItem)}
        allBasements={displayedBasements}
      />
    </div>
  );
}
