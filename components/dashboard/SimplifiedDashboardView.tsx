'use client';

import React, { useState, useEffect } from 'react';
import { usePGS } from '@/context/PGSContext';
import ViewSwitcherBar from '@/components/dashboard/ViewSwitcherBar';
import {
  Building2,
  Layers,
  Camera,
  Activity,
  Calendar,
  Clock,
  Video,
  X,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Shield,
  Zap,
  Download,
  Flame,
  Ban,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';
import DownloadReportModal from '@/components/header/DownloadReportModal';
import HeatMapReportModal from '@/components/header/HeatMapReportModal';
import BlocklistModal from '@/components/header/BlocklistModal';
import FloatableReportCard from '@/components/dashboard/FloatableReportCard';

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
    buildingName: 'Neptune Tower A',
    connection: 'CAM136 (Lane 1 Entry)',
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
    buildingName: 'Neptune Tower A',
    connection: 'CAM49 (Basement 1 Main)',
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
    buildingName: 'Neptune Tower A',
    connection: 'CAM50 (Basement 1 Ramp)',
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
    buildingName: 'Neptune Tower A',
    connection: 'CAM3 (Basement 2 West)',
    ipAddress: '192.168.1.103:554',
    location: 'Tower A • B2 West Deck',
    status: 'Active',
    latency: '11ms',
    hourlyStatus: '71% Peak (10:00-12:00) • Active',
    dailyStatus: '68% Daily Avg • 182 Vehicles • Active',
    weeklyStatus: '65% Weekly Avg • Staff Overflow • Active',
  },
  {
    id: 'cam-04',
    buildingId: 'tower-b',
    buildingName: 'Neptune Tower B',
    connection: 'CAM4 (Basement 3 EV Station)',
    ipAddress: '192.168.1.104:554',
    location: 'Tower B • B3 EV Station',
    status: 'Active',
    latency: '9ms',
    hourlyStatus: '55% Peak (14:00-16:00) • Active',
    dailyStatus: '52% Daily Avg • 140 Vehicles • Active',
    weeklyStatus: '49% Weekly Avg • Low Variation • Active',
  },
  {
    id: 'cam-05',
    buildingId: 'tower-b',
    buildingName: 'Neptune Tower B',
    connection: 'CAM5 (Ground Floor Exit)',
    ipAddress: '192.168.1.105:554',
    location: 'Tower B • Ground Floor Outgate',
    status: 'Active',
    latency: '14ms',
    hourlyStatus: '42% Low Traffic • Active',
    dailyStatus: '48% Daily Avg • 125 Vehicles • Active',
    weeklyStatus: '45% Weekly Avg • Smooth Exit Flow • Active',
  },
  {
    id: 'cam-06',
    buildingId: 'tower-b',
    buildingName: 'Neptune Tower B',
    connection: 'CAM6 (Commercial Ingate)',
    ipAddress: '192.168.1.106:554',
    location: 'Tower B • Commercial Ingate',
    status: 'Active',
    latency: '10ms',
    hourlyStatus: '62% Peak (10:30-12:30) • Active',
    dailyStatus: '59% Daily Avg • 170 Vehicles • Active',
    weeklyStatus: '56% Weekly Avg • Mid Load • Active',
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
    name: 'Neptune Tower A (Main HQ)',
    shortName: 'Tower A',
    occupied: 50,
    capacity: 85,
    free: 35,
    longStay: 5,
  },
  {
    id: 'tower-b',
    name: 'Neptune Tower B (Commercial)',
    shortName: 'Tower B',
    occupied: 32,
    capacity: 71,
    free: 39,
    longStay: 3,
  },
];

const allBasementsData: BasementItem[] = [
  {
    id: 'b1',
    buildingId: 'tower-a',
    name: 'Basement 1 (B1)',
    occupied: 28,
    capacity: 45,
    free: 17,
    longStay: 3,
  },
  {
    id: 'b2',
    buildingId: 'tower-a',
    name: 'Basement 2 (B2)',
    occupied: 22,
    capacity: 40,
    free: 18,
    longStay: 2,
  },
  {
    id: 'b3',
    buildingId: 'tower-b',
    name: 'Basement 3 (B3)',
    occupied: 14,
    capacity: 35,
    free: 21,
    longStay: 1,
  },
  {
    id: 'gf',
    buildingId: 'tower-b',
    name: 'Ground Floor (GF)',
    occupied: 18,
    capacity: 36,
    free: 18,
    longStay: 2,
  },
];

export default function SimplifiedDashboardView() {
  const { screens, activeScreenSensors, sensors } = usePGS();

  // Selected Building Filter: 'all' | 'tower-a' | 'tower-b'
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');

  // Selected camera for live view modal simulation
  const [selectedCamera, setSelectedCamera] = useState<DeviceItem | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);

  // Timeframe Tab for Right Bottom Table: Hourly, Daily, Weekly
  const [occupiedTimeframe, setOccupiedTimeframe] = useState<'HOURLY' | 'DAILY' | 'WEEKLY'>('HOURLY');

  // Trigger to reset all floated sub-report cards to default docked grid
  const [resetFloatTrigger, setResetFloatTrigger] = useState<number>(0);

  // Dynamic live clock with mounted hydration protection
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Buildings for Table 1
  const displayedBuildings =
    selectedBuildingId === 'all'
      ? allBuildingsData
      : allBuildingsData.filter((b) => b.id === selectedBuildingId);

  const totalBuildingOccupied = displayedBuildings.reduce((acc, b) => acc + b.occupied, 0);
  const totalBuildingCapacity = displayedBuildings.reduce((acc, b) => acc + b.capacity, 0);
  const totalBuildingFree = displayedBuildings.reduce((acc, b) => acc + b.free, 0);
  const totalBuildingLongStay = displayedBuildings.reduce((acc, b) => acc + b.longStay, 0);

  // Filtered Basements for Table 2
  const displayedBasements =
    selectedBuildingId === 'all'
      ? allBasementsData
      : allBasementsData.filter((bm) => bm.buildingId === selectedBuildingId);

  const totalBasementOccupied = displayedBasements.reduce((acc, b) => acc + b.occupied, 0);
  const totalBasementCapacity = displayedBasements.reduce((acc, b) => acc + b.capacity, 0);
  const totalBasementFree = displayedBasements.reduce((acc, b) => acc + b.free, 0);
  const totalBasementLongStay = displayedBasements.reduce((acc, b) => acc + b.longStay, 0);

  // Filtered Devices for Table 3 and Table 4
  const displayedDevices =
    selectedBuildingId === 'all'
      ? mockDevices
      : mockDevices.filter((dev) => dev.buildingId === selectedBuildingId);

  const currentBuilding = allBuildingsData.find((b) => b.id === selectedBuildingId);

  const occupancyPercentage =
    totalBuildingCapacity > 0
      ? Math.round((totalBuildingOccupied / totalBuildingCapacity) * 100)
      : 0;

  return (
    <div className="relative min-h-screen flex flex-col gap-3 pb-8">
      {/* 1. Top View Switcher & Background Rotator Toolbar */}
      <ViewSwitcherBar />

      {/* 2. Top Header Bar (Frosted Glass with desktop-friendly sizing) */}
      <div className="rounded-lg p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-white/25 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600/30 border border-blue-400/40 text-blue-500 dark:text-blue-300 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg md:text-xl font-medium text-slate-900 dark:text-white tracking-tight">
                Smart Parking Executive Overview
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium bg-emerald-500/20 border border-emerald-400/50 text-emerald-700 dark:text-emerald-300 tracking-wider">
                SIMPLIFIED VIEW
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal">
              Multi-Level Telemetry • Real-time Guidance Engine
            </p>
          </div>
        </div>

        {/* Actions: Download Report, Heat Map, Blocklist & Live Digital Clock */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            title="Download Occupancy Report"
            className="px-3 py-1.5 rounded-md bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 text-blue-800 dark:text-blue-100 font-normal text-xs sm:text-[13px] transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Download Report</span>
          </button>

          <button
            onClick={() => setIsHeatMapModalOpen(true)}
            title="Parking Heat Map Occupancy Report"
            className="px-3 py-1.5 rounded-md bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-800 dark:text-amber-100 font-normal text-xs sm:text-[13px] transition flex items-center gap-1.5 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Heat Map</span>
          </button>

          <button
            onClick={() => setIsBlocklistModalOpen(true)}
            title="Vehicle Security Blocklist"
            className="px-3 py-1.5 rounded-md bg-rose-500/25 hover:bg-rose-500/40 border border-rose-400/50 text-rose-800 dark:text-rose-100 font-normal text-xs sm:text-[13px] transition flex items-center gap-1.5 shadow-sm"
          >
            <Ban className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Blocklist</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-mono font-medium">3</span>
          </button>

          <div className="px-3 py-1 rounded-md bg-black/20 dark:bg-white/5 border border-white/20 text-right" suppressHydrationWarning>
            <div className="text-xs sm:text-sm font-mono font-medium text-slate-900 dark:text-white flex items-center gap-1.5 justify-end" suppressHydrationWarning>
              <Clock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span suppressHydrationWarning>{isMounted ? timeString : '--:--:--'}</span>
            </div>
            <div className="text-[11px] font-normal text-slate-600 dark:text-slate-400" suppressHydrationWarning>
              {isMounted ? dateString : 'Today'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Enhanced User-Friendly Building Filter Bar with Real-Time KPIs */}
      <div className="rounded-lg p-3 sm:p-4 bg-white/25 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-white/15 shadow-xl flex flex-col gap-3">
        {/* Top Filter Selection Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600/30 text-blue-900 dark:text-blue-100 font-medium text-xs sm:text-sm border border-blue-400/40 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Select Building:</span>
            </div>

            {/* Quick Segmented Building Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Option 1: All Buildings */}
              <button
                type="button"
                onClick={() => setSelectedBuildingId('all')}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-[13px] transition-all duration-200 flex items-center gap-2 ${
                  selectedBuildingId === 'all'
                    ? 'bg-blue-600 text-white font-medium shadow-md ring-2 ring-blue-400/80 scale-[1.02]'
                    : 'bg-white/30 dark:bg-slate-800/60 hover:bg-white/50 text-slate-800 dark:text-slate-200 border border-white/30 hover:border-blue-400/50'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>All Buildings</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  selectedBuildingId === 'all' ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}>
                  156 Spots
                </span>
                {selectedBuildingId === 'all' && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              {/* Individual Buildings */}
              {allBuildingsData.map((b) => {
                const isSelected = selectedBuildingId === b.id;
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBuildingId(b.id)}
                    className={`px-3.5 py-1.5 rounded-md text-xs sm:text-[13px] transition-all duration-200 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-md ring-2 ring-blue-400/80 scale-[1.02]'
                        : 'bg-white/30 dark:bg-slate-800/60 hover:bg-white/50 text-slate-800 dark:text-slate-200 border border-white/30 hover:border-blue-400/50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />
                    <span>{b.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}>
                      {b.capacity} Spots
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Reset Filter & Dock All Controls */}
          <div className="flex items-center gap-2">
            {/* Dock All Floating Cards Button */}
            <button
              type="button"
              onClick={() => setResetFloatTrigger((c) => c + 1)}
              className="px-3 py-1.5 rounded-md text-xs sm:text-[13px] font-normal bg-white/30 dark:bg-slate-800/70 hover:bg-white/50 text-slate-800 dark:text-slate-200 border border-white/30 transition flex items-center gap-1.5 shadow-sm"
              title="Snap all floated sub-report cards back to their original docked grid positions"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
              <span>Dock All Cards</span>
            </button>

            {/* Clear Filter / Show All Button */}
            {selectedBuildingId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedBuildingId('all')}
                className="px-3 py-1.5 rounded-md text-xs sm:text-[13px] font-normal bg-rose-500/25 hover:bg-rose-500/40 text-rose-900 dark:text-rose-100 border border-rose-400/50 transition flex items-center gap-1.5 shadow-sm"
                title="Clear filter and view all buildings"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset to All</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Filter Row: Scope Telemetry and Live Facility KPI Strip */}
        <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm">
          {/* Active Scope Description */}
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              {selectedBuildingId === 'all' ? (
                <span>
                  Viewing <span className="font-medium">All Buildings</span> (Consolidated) • <span className="font-medium">{displayedBasements.length}</span> Basements • <span className="font-medium">{displayedDevices.length}</span> Live Cameras
                </span>
              ) : (
                <span>
                  Filtered to <span className="font-medium">{currentBuilding?.name}</span> • <span className="font-medium">{displayedBasements.length}</span> Basements • <span className="font-medium">{displayedDevices.length}</span> Live Cameras
                </span>
              )}
            </span>
          </div>

          {/* Quick Metrics Badges for Selected Scope */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-2.5 py-1 rounded bg-black/10 dark:bg-white/5 border border-white/15 flex items-center gap-1.5 font-mono text-xs sm:text-[13px]">
              <span className="text-slate-600 dark:text-slate-400">Total Cap:</span>
              <span className="font-medium text-slate-900 dark:text-white">{totalBuildingCapacity}</span>
            </div>

            <div className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-400/30 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 font-mono text-xs sm:text-[13px]">
              <span>Occupied:</span>
              <span className="font-medium">{totalBuildingOccupied}</span>
              <span className="opacity-80">({occupancyPercentage}%)</span>
            </div>

            <div className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-xs sm:text-[13px]">
              <span>Free Space:</span>
              <span className="font-medium">{totalBuildingFree}</span>
            </div>

            <div className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-400/30 text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-mono text-xs sm:text-[13px]">
              <span>Long Stay:</span>
              <span className="font-medium">{totalBuildingLongStay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Grid (Left: Building & Basements, Right: Live Devices & Occupancy Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. TABLE 1 (LEFT CORNER TOP): BUILDING OVERVIEW */}
          <FloatableReportCard
            id="report-building-overview"
            title="Building Occupancy Overview"
            icon={<Building2 className="w-4 h-4" />}
            headerAccentClass="bg-blue-600/70 dark:bg-blue-600/50"
            resetTrigger={resetFloatTrigger}
            badge={
              <span className="text-xs font-mono font-normal text-blue-100 bg-black/30 px-2.5 py-0.5 rounded border border-white/20">
                {selectedBuildingId === 'all' ? 'All Buildings' : currentBuilding?.shortName}
              </span>
            }
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/25 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-b border-white/20 text-xs sm:text-[13px] font-medium tracking-wider">
                  <th className="py-2.5 px-3.5">Building Name</th>
                  <th className="py-2.5 px-3 text-center">Total Occupied Space</th>
                  <th className="py-2.5 px-3 text-center">Total Capacity</th>
                  <th className="py-2.5 px-3 text-center">Total Free Space</th>
                  <th className="py-2.5 px-3 text-center">Long Stay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15 dark:divide-white/10 text-xs sm:text-[13px]">
                {displayedBuildings.map((b) => {
                  const isRowSelected = selectedBuildingId === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBuildingId(selectedBuildingId === b.id ? 'all' : b.id)}
                      className={`transition-colors cursor-pointer ${
                        isRowSelected
                          ? 'bg-blue-500/30 dark:bg-blue-600/35 ring-1 ring-inset ring-blue-400/60'
                          : 'hover:bg-white/25 dark:hover:bg-white/10'
                      }`}
                      title="Click row to filter/toggle building"
                    >
                      <td className="py-2.5 px-3.5 font-normal text-slate-900 dark:text-white flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isRowSelected ? 'bg-blue-400 animate-pulse' : 'bg-blue-500'} shadow-sm`} />
                          <span className="font-medium">{b.name}</span>
                        </div>
                        {isRowSelected && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-600 text-white font-mono shadow-sm">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-normal text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                        {b.occupied}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-normal text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {b.capacity}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-normal text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        {b.free}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-normal text-amber-600 dark:text-amber-400">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-xs font-mono">
                          {b.longStay}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {/* Summary Row */}
                <tr
                  onClick={() => setSelectedBuildingId('all')}
                  className="bg-blue-600/25 dark:bg-blue-900/40 border-t-2 border-blue-500/50 font-medium text-slate-900 dark:text-white cursor-pointer hover:bg-blue-600/35 transition-colors text-xs sm:text-sm"
                  title="Click to show All Buildings"
                >
                  <td className="py-2.5 px-3.5 uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span>{selectedBuildingId === 'all' ? 'Total Facility' : `Total (${currentBuilding?.shortName})`}</span>
                    </div>
                    {selectedBuildingId !== 'all' && (
                      <span className="text-xs text-blue-600 dark:text-blue-300 font-normal underline">
                        Reset All
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-rose-600 dark:text-rose-300 text-xs sm:text-sm">
                    {totalBuildingOccupied}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                    {totalBuildingCapacity}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm">
                    {totalBuildingFree}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-amber-600 dark:text-amber-300 text-xs sm:text-sm">
                    {totalBuildingLongStay}
                  </td>
                </tr>
              </tbody>
            </table>
          </FloatableReportCard>

          {/* 2. TABLE 2 (LEFT CORNER BELOW ABOVE TABLE): BASEMENTS OVERVIEW */}
          <FloatableReportCard
            id="report-basements-details"
            title="Basements Occupancy Details"
            icon={<Layers className="w-4 h-4" />}
            headerAccentClass="bg-indigo-600/70 dark:bg-indigo-600/50"
            resetTrigger={resetFloatTrigger}
            badge={
              <span className="text-xs font-mono font-normal text-indigo-100 bg-black/30 px-2.5 py-0.5 rounded border border-white/20">
                {displayedBasements.length} Levels {selectedBuildingId !== 'all' ? `• ${currentBuilding?.shortName}` : '• All'}
              </span>
            }
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/25 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-b border-white/20 text-xs sm:text-[13px] font-medium tracking-wider">
                  <th className="py-2.5 px-3.5">Basements</th>
                  <th className="py-2.5 px-3 text-center">Total Occupied Space</th>
                  <th className="py-2.5 px-3 text-center">Total Capacity</th>
                  <th className="py-2.5 px-3 text-center">Total Free Space</th>
                  <th className="py-2.5 px-3 text-center">Long Stay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15 dark:divide-white/10 text-xs sm:text-[13px]">
                {displayedBasements.map((bm) => (
                  <tr
                    key={bm.id}
                    className="hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 font-normal text-slate-900 dark:text-white flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />
                        <span>{bm.name}</span>
                      </div>
                      {selectedBuildingId === 'all' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white/15 text-slate-700 dark:text-slate-300 font-mono font-normal">
                          {allBuildingsData.find((b) => b.id === bm.buildingId)?.shortName}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-normal text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                      {bm.occupied}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-normal text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {bm.capacity}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-normal text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                      {bm.free}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-normal text-amber-600 dark:text-amber-400">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-xs font-mono">
                        {bm.longStay}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Summary Row */}
                <tr className="bg-indigo-600/25 dark:bg-indigo-900/40 border-t-2 border-indigo-500/50 font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                  <td className="py-2.5 px-3.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedBuildingId === 'all' ? 'Total Basements' : `Total (${currentBuilding?.shortName} Basements)`}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-rose-600 dark:text-rose-300 text-xs sm:text-sm">
                    {totalBasementOccupied}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                    {totalBasementCapacity}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm">
                    {totalBasementFree}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-amber-600 dark:text-amber-300 text-xs sm:text-sm">
                    {totalBasementLongStay}
                  </td>
                </tr>
              </tbody>
            </table>
          </FloatableReportCard>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="flex flex-col gap-3">
          {/* 3. TABLE 3 (RIGHT TOP): LIVE DEVICE STATUS */}
          <FloatableReportCard
            id="report-device-status"
            title="Live Device Status"
            icon={<Camera className="w-4 h-4" />}
            headerAccentClass="bg-emerald-600/70 dark:bg-emerald-600/50"
            resetTrigger={resetFloatTrigger}
            badge={
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-normal text-emerald-100 bg-black/30 px-2.5 py-0.5 rounded border border-white/20">
                  {displayedDevices.length} Online Nodes {selectedBuildingId !== 'all' ? `(${currentBuilding?.shortName})` : ''}
                </span>
              </div>
            }
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/25 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-b border-white/20 text-xs sm:text-[13px] font-medium tracking-wider">
                  <th className="py-2.5 px-3.5">Connection</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-center">Live View</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15 dark:divide-white/10 text-xs sm:text-[13px]">
                {displayedDevices.map((dev) => (
                  <tr
                    key={dev.id}
                    className="hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 font-normal text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-medium truncate">{dev.connection}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs sm:text-[13px] font-normal text-slate-800 dark:text-slate-300">
                      {dev.ipAddress}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedCamera(dev)}
                        className="px-3 py-1 rounded-md bg-blue-600/35 hover:bg-blue-600/55 border border-blue-400/50 text-blue-800 dark:text-blue-200 font-normal text-xs transition flex items-center gap-1.5 mx-auto shadow-sm"
                        title={`Inspect Live Stream for ${dev.connection}`}
                      >
                        <Video className="w-3 h-3 text-blue-500 animate-pulse" />
                        <span>Live View</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-normal bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{dev.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FloatableReportCard>

          {/* 4. TABLE 4 (RIGHT BOTTOM): TODAY HOURLY, DAILY, WEEKLY OCCUPIED STATUS */}
          <FloatableReportCard
            id="report-occupied-analysis"
            title={`Occupied Status Analysis ${selectedBuildingId !== 'all' ? `• ${currentBuilding?.shortName}` : ''}`}
            icon={<Activity className="w-4 h-4" />}
            headerAccentClass="bg-purple-600/70 dark:bg-purple-600/50"
            resetTrigger={resetFloatTrigger}
            headerActions={
              <div className="flex items-center gap-1 p-1 rounded bg-black/35 border border-white/20">
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('HOURLY')}
                  className={`px-2.5 py-1 rounded text-xs sm:text-[13px] font-normal transition ${
                    occupiedTimeframe === 'HOURLY'
                      ? 'bg-purple-500 text-white font-medium shadow-sm'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  Today Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('DAILY')}
                  className={`px-2.5 py-1 rounded text-xs sm:text-[13px] font-normal transition ${
                    occupiedTimeframe === 'DAILY'
                      ? 'bg-purple-500 text-white font-medium shadow-sm'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setOccupiedTimeframe('WEEKLY')}
                  className={`px-2.5 py-1 rounded text-xs sm:text-[13px] font-normal transition ${
                    occupiedTimeframe === 'WEEKLY'
                      ? 'bg-purple-500 text-white font-medium shadow-sm'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  Weekly
                </button>
              </div>
            }
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/25 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-b border-white/20 text-xs sm:text-[13px] font-medium tracking-wider">
                  <th className="py-2.5 px-3.5">Connection</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-center">Live View</th>
                  <th className="py-2.5 px-3.5 text-center">
                    {occupiedTimeframe === 'HOURLY' && 'Today Hourly Occupied Status'}
                    {occupiedTimeframe === 'DAILY' && 'Daily Occupied Status'}
                    {occupiedTimeframe === 'WEEKLY' && 'Weekly Occupied Status'}
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
                      className="hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 font-normal text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-medium truncate">{dev.connection}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs sm:text-[13px] font-normal text-slate-800 dark:text-slate-300">
                        {dev.ipAddress}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedCamera(dev)}
                          className="px-3 py-1 rounded-md bg-purple-600/35 hover:bg-purple-600/55 border border-purple-400/50 text-purple-800 dark:text-purple-200 font-normal text-xs transition flex items-center gap-1.5 mx-auto shadow-sm"
                          title={`Inspect Camera Stream for ${dev.connection}`}
                        >
                          <Video className="w-3 h-3 text-purple-400 animate-pulse" />
                          <span>Live View</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-normal bg-purple-500/20 border border-purple-500/30 text-purple-900 dark:text-purple-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          <span>{statusText}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
    </div>
  );
}
