'use client';

import React from 'react';
import { usePGS } from '@/context/PGSContext';
import { Sensor } from '@/types';
import { GitCommit, Car, CheckCircle2, ClockAlert, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface LaneBreakdownProps {
  selectedLaneIndex: number | null;
  onSelectLane: (laneIndex: number | null) => void;
}

export default function LaneBreakdown({ selectedLaneIndex, onSelectLane }: LaneBreakdownProps) {
  const { activeScreenSensors, activeScreen, settings } = usePGS();

  const overstayMs = (settings.overstayHoursThreshold || 4) * 3600 * 1000;
  const nowMs = Date.now();

  // Partition active floor sensors into 4 lanes
  const totalSensors = activeScreenSensors.length;
  const laneCount = totalSensors > 0 ? 4 : 0;
  const laneSize = Math.ceil(totalSensors / 4) || 1;

  const laneNames = [
    'Lane 1 (North Aisle)',
    'Lane 2 (Central North)',
    'Lane 3 (Central South)',
    'Lane 4 (South VIP & EV)',
  ];

  const lanes = Array.from({ length: laneCount }).map((_, index) => {
    const startIndex = index * laneSize;
    const laneSensors = activeScreenSensors.slice(startIndex, startIndex + laneSize);

    const capacity = laneSensors.length;
    const occupied = laneSensors.filter((s) => s.status === 1).length;
    const free = laneSensors.filter((s) => s.status === 0).length;
    const longStay = laneSensors.filter(
      (s) => s.status === 1 && s.occupiedSince && nowMs - new Date(s.occupiedSince).getTime() >= overstayMs
    ).length;
    const occupancyPercent = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;

    return {
      index,
      name: laneNames[index] || `Lane ${index + 1}`,
      sensors: laneSensors,
      capacity,
      occupied,
      free,
      longStay,
      occupancyPercent,
    };
  });

  return (
    <div className="glass-panel p-2.5 border border-slate-200 dark:border-white/10 shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <GitCommit className="w-3.5 h-3.5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Parking Lanes Breakdown</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Total: {laneCount} Lanes
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Live per-lane capacity, occupancy, vacancy, and long-stay overstay monitoring
            </p>
          </div>
        </div>

        {selectedLaneIndex !== null && (
          <button
            onClick={() => onSelectLane(null)}
            className="text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
          >
            Clear Lane Filter
          </button>
        )}
      </div>

      {/* 4 Lanes Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {lanes.map((lane) => {
          const isSelected = selectedLaneIndex === lane.index;

          return (
            <button
              key={lane.index}
              onClick={() => onSelectLane(isSelected ? null : lane.index)}
              className={`p-2 border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-indigo-500 bg-indigo-500/10 border-indigo-500 shadow-sm'
                  : 'glass-panel hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-white/5'
              }`}
            >
              {/* Lane Name & Load Tag */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {lane.name}
                </span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 font-mono font-bold ${
                    lane.occupancyPercent >= 80
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      : lane.occupancyPercent >= 50
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {lane.occupancyPercent}%
                </span>
              </div>

              {/* 4 Sub-metrics Per Lane */}
              <div className="grid grid-cols-2 gap-1 text-[10.5px] mb-1.5 bg-slate-100/60 dark:bg-white/5 p-1.5 border border-slate-200/60 dark:border-white/5">
                {/* Occupied */}
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[10px]">Occupied:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{lane.occupied}</span>
                </div>
                {/* Capacity */}
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[10px]">Capacity:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lane.capacity}</span>
                </div>
                {/* Free Space */}
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[10px]">Free:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{lane.free}</span>
                </div>
                {/* Long Stay */}
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[10px]">Long Stay:</span>
                  <span
                    className={`font-bold font-mono ${
                      lane.longStay > 0
                        ? 'text-amber-600 dark:text-amber-400 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  >
                    {lane.longStay}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    lane.occupancyPercent >= 80
                      ? 'bg-rose-500'
                      : lane.occupancyPercent >= 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${lane.occupancyPercent}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
