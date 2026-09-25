'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import ParkingCanvas from '@/components/canvas/ParkingCanvas';
import OfficeOverview from '@/components/dashboard/OfficeOverview';
import LaneBreakdown from '@/components/dashboard/LaneBreakdown';
import LiveDeviceTable from '@/components/dashboard/LiveDeviceTable';
import OccupancyReportsView from '@/components/dashboard/OccupancyReportsView';
import ViewSwitcherBar from '@/components/dashboard/ViewSwitcherBar';
import { Sensor } from '@/types';
import {
  Car,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Tv,
  ArrowRight,
  Shield,
  Zap,
  Play,
  Pause,
  Camera,
  Activity,
  Maximize2,
  ChevronRight,
  Sparkles,
  Map,
  Table,
  BarChart3,
} from 'lucide-react';
import { formatDuration, getStatusBadge } from '@/lib/utils';

export default function DetailedDashboardView() {
  const {
    screens,
    activeScreenId,
    setActiveScreenId,
    activeScreen,
    activeScreenSensors,
    stats,
    searchQuery,
    setSearchQuery,
    selectedSensor,
    setSelectedSensor,
    updateSensor,
    isSimulationRunning,
    setIsSimulationRunning,
    logs,
  } = usePGS();

  // Active dashboard workstation tab
  const [activeDashboardView, setActiveDashboardView] = useState<'MAP' | 'DEVICES' | 'REPORTS'>('MAP');

  // Filter states
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FREE' | 'OCCUPIED' | 'RESERVED'>('ALL');
  const [selectedLaneIndex, setSelectedLaneIndex] = useState<number | null>(null);
  const [inspectedSensorId, setInspectedSensorId] = useState<string | null>(null);

  // Partition sensors into 4 lanes
  const totalSensors = activeScreenSensors.length;
  const laneSize = Math.ceil(totalSensors / 4) || 1;

  // Filtered sensors for list view
  const filteredSensors = activeScreenSensors.filter((s, idx) => {
    if (selectedLaneIndex !== null) {
      const laneStart = selectedLaneIndex * laneSize;
      const laneEnd = laneStart + laneSize;
      if (idx < laneStart || idx >= laneEnd) return false;
    }

    const matchesSearch =
      !searchQuery ||
      s.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicleNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.reservedType?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'FREE') return s.status === 0;
    if (activeFilter === 'OCCUPIED') return s.status === 1;
    if (activeFilter === 'RESERVED') return s.status === 2;
    return true;
  });

  // Active inspected sensor
  const activeInspectedSensor: Sensor | undefined =
    activeScreenSensors.find((s) => s.id === inspectedSensorId) ||
    filteredSensors.find((s) => s.status === 1) ||
    filteredSensors[0] ||
    activeScreenSensors[0];

  // Recent logs for active floor
  const floorLogs = logs
    .filter((l) => !activeScreen || l.screenName === activeScreen.name)
    .slice(0, 5);

  const handleToggleSensorStatus = (sensor: Sensor) => {
    const nextStatus = sensor.status === 1 ? 0 : 1;
    updateSensor(sensor.id, {
      status: nextStatus,
      vehicleNo: nextStatus === 1 ? 'DL-01-AB-' + Math.floor(1000 + Math.random() * 9000) : '',
      occupiedSince: nextStatus === 1 ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col gap-2.5 pb-4">
      {/* 1. Top Mode Switcher (Simplified View vs Detailed View) & Rotator Controls */}
      <ViewSwitcherBar />

      {/* 2. Office Name & Facility-Wide Overview */}
      <OfficeOverview />

      {/* 3. Total Number of Parking Lanes Breakdown */}
      <LaneBreakdown
        selectedLaneIndex={selectedLaneIndex}
        onSelectLane={setSelectedLaneIndex}
      />

      {/* 4. Dashboard Workstation Navigation & Quick Floor Controls */}
      <div className="glass-panel px-3 py-1.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 shrink-0 border border-slate-200 dark:border-white/10">
        {/* Left: View Switcher Tabs */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 glass-panel p-0.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveDashboardView('MAP')}
              className={`px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1.5 ${
                activeDashboardView === 'MAP'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Live Floor Map & Inspector</span>
            </button>
            <button
              onClick={() => setActiveDashboardView('DEVICES')}
              className={`px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1.5 ${
                activeDashboardView === 'DEVICES'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Live Device Status (Table)</span>
            </button>
            <button
              onClick={() => setActiveDashboardView('REPORTS')}
              className={`px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1.5 ${
                activeDashboardView === 'REPORTS'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Occupancy Reports</span>
            </button>
          </div>
        </div>

        {/* Right: Active Floor Switcher & Simulation Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Floor Switcher Pills */}
          <div className="flex items-center gap-1">
            {screens.map((scr) => {
              const isCurrent = scr.id === activeScreenId;
              return (
                <button
                  key={scr.id}
                  onClick={() => {
                    setActiveScreenId(scr.id);
                    setSelectedLaneIndex(null);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{scr.name}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-white/20 hidden sm:block" />

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            title={isSimulationRunning ? 'Pause Realtime Simulation' : 'Resume Realtime Simulation'}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold transition ${
              isSimulationRunning
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isSimulationRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isSimulationRunning ? 'Live Feed' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 5. Primary Workstation Content Area */}
      <div className="flex-1 min-h-[520px] flex flex-col">
        {/* VIEW 1: LIVE FLOOR MAP & TELEMETRY INSPECTOR */}
        {activeDashboardView === 'MAP' && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-2.5 min-h-[500px]">
            {/* Left: Master Interactive Floor Viewport */}
            <div className="flex-1 min-w-0 h-[480px] lg:h-full flex flex-col relative">
              <ParkingCanvas
                sensors={activeScreenSensors}
                searchQuery={searchQuery}
                selectedSensorId={activeInspectedSensor?.id}
                floorName={activeScreen?.name}
                showInternalModal={false}
                onSlotClick={(sensor) => {
                  setInspectedSensorId(sensor.id);
                  setSelectedSensor(sensor);
                }}
              />
            </div>

            {/* Right: Desktop Live Telemetry & Inspector Deck */}
            <div className="w-full lg:w-[370px] xl:w-[410px] 2xl:w-[440px] shrink-0 flex flex-col gap-2 h-auto lg:h-full">
              {/* Card 1: Active Bay & AI LPR Camera Telemetry */}
              {activeInspectedSensor ? (
                <div className="glass-panel p-2.5 border border-slate-200 dark:border-white/10 shrink-0">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                          activeInspectedSensor.status === 1
                            ? 'bg-rose-600'
                            : activeInspectedSensor.status === 2
                            ? 'bg-blue-600'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {activeInspectedSensor.sensorName}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Bay {activeInspectedSensor.sensorName}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 border font-semibold ${
                              getStatusBadge(activeInspectedSensor.status).bg
                            }`}
                          >
                            {getStatusBadge(activeInspectedSensor.status).label}
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Floor: {activeScreen?.name} • Zone {activeInspectedSensor.lotName || 'A'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSensorStatus(activeInspectedSensor)}
                      className={`px-2 py-0.5 text-[10.5px] font-bold transition flex items-center gap-1 ${
                        activeInspectedSensor.status === 1
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>{activeInspectedSensor.status === 1 ? 'Free Bay' : 'Park Vehicle'}</span>
                    </button>
                  </div>

                  {/* Camera Telemetry & OCR Detection Stream */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100 dark:bg-black/40 p-2 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 block">AI Detected Vehicle</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px] truncate block">
                        {activeInspectedSensor.vehicleNo || 'None (Empty)'}
                      </span>
                    </div>

                    <div className="bg-slate-100 dark:bg-black/40 p-2 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 block">Stay Duration</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px] block">
                        {activeInspectedSensor.occupiedSince
                          ? formatDuration(activeInspectedSensor.occupiedSince)
                          : '00:00:00'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Card 2: Filterable Live Bays Grid */}
              <div className="glass-panel p-2.5 border border-slate-200 dark:border-white/10 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Floor Bays ({filteredSensors.length})
                      {selectedLaneIndex !== null && (
                        <span className="text-indigo-500 font-normal ml-1">
                          (Lane {selectedLaneIndex + 1})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-0.5 glass-panel p-0.5 border border-slate-200 dark:border-white/10">
                    {(['ALL', 'FREE', 'OCCUPIED', 'RESERVED'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-1.5 py-0.5 text-[9.5px] font-semibold transition ${
                          activeFilter === filter
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {filter === 'ALL' ? 'ALL' : filter === 'FREE' ? 'FREE' : filter === 'OCCUPIED' ? 'FULL' : 'RES'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Filterable Bay Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-1.5 overflow-y-auto flex-1 pr-0.5 scrollbar-thin max-h-48 lg:max-h-none">
                  {filteredSensors.map((sensor) => {
                    const isOcc = sensor.status === 1;
                    const isRes = sensor.status === 2;
                    const isSelected = sensor.id === activeInspectedSensor?.id;

                    return (
                      <button
                        key={sensor.id}
                        onClick={() => {
                          setInspectedSensorId(sensor.id);
                          setSelectedSensor(sensor);
                        }}
                        className={`p-1.5 border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 bg-cyan-500/10 border-cyan-400'
                            : isOcc
                            ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 hover:border-rose-400'
                            : isRes
                            ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40 hover:border-blue-400'
                            : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[11px] text-slate-900 dark:text-white">
                            {sensor.sensorName}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOcc ? 'bg-rose-500' : isRes ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          {sensor.vehicleNo || (isRes ? sensor.reservedType : 'FREE')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Realtime Event Ticker Stream */}
              <div className="glass-panel p-2 border border-slate-200 dark:border-white/10 shrink-0 hidden xl:block">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-[10.5px] font-bold flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    Live Floor Events
                  </span>
                  <span className="text-[9.5px] text-emerald-500 font-mono">LIVE FEED</span>
                </div>
                <div className="space-y-1">
                  {floorLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[240px]">
                        <span
                          className={`w-1 h-1 rounded-full shrink-0 ${
                            log.status === 'Occupied'
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <strong className="text-slate-800 dark:text-slate-200">{log.slotName}</strong>: {log.status}{' '}
                        {log.vehicleNo ? `(${log.vehicleNo})` : ''}
                      </span>
                      <span className="font-mono text-[9px] opacity-70 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE DEVICE STATUS TABLE */}
        {activeDashboardView === 'DEVICES' && (
          <div className="flex-1 min-h-[460px]">
            <LiveDeviceTable />
          </div>
        )}

        {/* VIEW 3: OCCUPANCY STATUS REPORTS (HOURLY, DAILY, WEEKLY) */}
        {activeDashboardView === 'REPORTS' && (
          <div className="flex-1 min-h-[460px]">
            <OccupancyReportsView />
          </div>
        )}
      </div>
    </div>
  );
}
