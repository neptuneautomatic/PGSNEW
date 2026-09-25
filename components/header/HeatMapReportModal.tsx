'use client';

import React, { useState } from 'react';
import {
  X,
  Flame,
  Printer,
  Download,
  Calendar,
  Layers,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePGS } from '@/context/PGSContext';

interface HeatMapReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeatMapReportModal({ isOpen, onClose }: HeatMapReportModalProps) {
  const { screens } = usePGS();
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('TODAY');

  if (!isOpen) return null;

  // 24-hour heat map data for each parking level (occupancy percentages 0-100)
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const heatData = [
    {
      level: 'Lane 1 (Entry)',
      hourly: [10, 8, 5, 4, 12, 35, 68, 88, 94, 92, 85, 78, 82, 86, 90, 84, 75, 62, 45, 30, 22, 18, 14, 10],
    },
    {
      level: 'Basement 1 (B1)',
      hourly: [15, 12, 8, 6, 18, 42, 75, 95, 98, 96, 90, 85, 88, 92, 94, 88, 80, 68, 50, 35, 25, 20, 18, 15],
    },
    {
      level: 'Basement 2 (B2)',
      hourly: [8, 6, 4, 3, 10, 25, 55, 78, 85, 82, 75, 70, 72, 78, 82, 75, 65, 52, 38, 25, 18, 14, 10, 8],
    },
    {
      level: 'Basement 3 (B3)',
      hourly: [4, 3, 2, 2, 6, 15, 35, 58, 65, 62, 55, 50, 52, 58, 62, 55, 45, 35, 25, 18, 12, 8, 6, 4],
    },
    {
      level: 'Ground Floor (GF)',
      hourly: [12, 10, 6, 5, 15, 38, 70, 86, 90, 88, 80, 75, 78, 82, 85, 80, 70, 58, 42, 28, 20, 15, 12, 10],
    },
  ];

  const filteredHeatData =
    selectedLevel === 'ALL'
      ? heatData
      : heatData.filter((d) => d.level.toLowerCase().includes(selectedLevel.toLowerCase()));

  // Heat color mapper function
  const getHeatColor = (pct: number) => {
    if (pct >= 85) return 'bg-rose-600 text-white font-bold'; // Severe Peak
    if (pct >= 70) return 'bg-orange-500 text-white font-semibold'; // High
    if (pct >= 45) return 'bg-amber-400 text-slate-950 font-medium'; // Moderate
    if (pct >= 20) return 'bg-emerald-500/80 text-white'; // Low
    return 'bg-blue-500/20 text-slate-400 dark:text-slate-300'; // Minimal
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-xs my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Parking Heat Map Occupancy Report</span>
                <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  PEAK DENSITY ANALYSIS
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hourly congestion distribution, dwell times & turnover intensity across facility levels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1 font-semibold text-[11px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Controls Bar */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] shrink-0">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-400">Filter Level:</span>
            <div className="flex items-center gap-1">
              {['ALL', 'B1', 'B2', 'B3', 'GF', 'Lane 1'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition ${
                    selectedLevel === lvl
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Levels' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Heat Intensity Legend */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Intensity:</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-500/50" />
              <span className="text-[10px]">&lt;20%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span className="text-[10px]">20-45%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" />
              <span className="text-[10px]">45-70%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-orange-500" />
              <span className="text-[10px]">70-85%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-600" />
              <span className="text-[10px] font-bold">&gt;85% Peak</span>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 scrollbar-thin">
          {/* Key Executive Insights Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 flex flex-col justify-between">
              <span className="text-[10.5px] uppercase font-bold text-rose-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Peak Congestion
              </span>
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                09:00 – 11:30
              </span>
              <span className="text-[10px] text-slate-500">98% Peak in B1 Main</span>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
              <span className="text-[10.5px] uppercase font-bold text-amber-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Avg Dwell Duration
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                01h 48m
              </span>
              <span className="text-[10px] text-slate-500">Turnover: 4.2x / Bay / Day</span>
            </div>

            <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 flex flex-col justify-between">
              <span className="text-[10.5px] uppercase font-bold text-blue-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Highest Volume Deck
              </span>
              <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                Basement 1
              </span>
              <span className="text-[10px] text-slate-500">240 Total Daily Ingress</span>
            </div>

            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
              <span className="text-[10.5px] uppercase font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Optimal Vacancy
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                Basement 3
              </span>
              <span className="text-[10px] text-slate-500">Best availability for overflow</span>
            </div>
          </div>

          {/* 24-Hour Heat Map Matrix Table */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900/60 shrink-0">
            <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>24-Hour Hourly Occupancy Density Matrix (% Full)</span>
              <span className="text-[10.5px] font-mono text-slate-500">Today vs 7-Day Average</span>
            </div>

            <div className="overflow-x-auto p-2 sm:p-3 scrollbar-thin">
              <table className="w-full min-w-[850px] text-center border-collapse text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    <th className="text-left py-2 px-2 text-xs font-bold w-36">Level / Deck</th>
                    {hours.map((h) => (
                      <th key={h} className="p-1 font-semibold">
                        {h.slice(0, 2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredHeatData.map((row) => (
                    <tr key={row.level} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="text-left py-2 px-2 font-bold text-slate-900 dark:text-white font-sans whitespace-nowrap">
                        {row.level}
                      </td>
                      {row.hourly.map((val, hIdx) => (
                        <td key={hIdx} className="p-0.5">
                          <div
                            className={`w-full py-1.5 rounded text-[9px] transition-transform hover:scale-110 shadow-xs cursor-default ${getHeatColor(
                              val
                            )}`}
                            title={`${row.level} @ ${hours[hIdx]}: ${val}% Occupied`}
                          >
                            {val}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2D Zone Turnover Heat Map Visualizer */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 sm:p-4 bg-slate-50/50 dark:bg-white/[0.01] shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Zone & Bay Proximity Heat Intensity (Turnover & Demand)</span>
              </h3>
              <span className="text-[10.5px] text-slate-400">
                Red bays indicate highest vehicle turnover & elevator demand
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { bay: 'B1-01', turnover: 'High', color: 'bg-rose-600 text-white', label: 'Elevator 1', occ: '96%' },
                { bay: 'B1-02', turnover: 'High', color: 'bg-rose-600 text-white', label: 'Elevator 1', occ: '98%' },
                { bay: 'B1-03', turnover: 'High', color: 'bg-rose-600 text-white', label: 'VIP Lane', occ: '94%' },
                { bay: 'B1-04', turnover: 'High', color: 'bg-orange-500 text-white', label: 'B1 Ramp', occ: '88%' },
                { bay: 'B1-05', turnover: 'Med', color: 'bg-amber-400 text-slate-950', label: 'Mid Bay', occ: '72%' },
                { bay: 'B1-06', turnover: 'Med', color: 'bg-amber-400 text-slate-950', label: 'Mid Bay', occ: '68%' },
                { bay: 'B1-07', turnover: 'Low', color: 'bg-emerald-500 text-white', label: 'Corner', occ: '42%' },
                { bay: 'B1-08', turnover: 'Low', color: 'bg-emerald-500 text-white', label: 'Far Wall', occ: '35%' },
                { bay: 'B2-01', turnover: 'High', color: 'bg-orange-500 text-white', label: 'EV Charger', occ: '85%' },
                { bay: 'B2-02', turnover: 'High', color: 'bg-orange-500 text-white', label: 'EV Charger', occ: '88%' },
                { bay: 'B2-03', turnover: 'Med', color: 'bg-amber-400 text-slate-950', label: 'B2 West', occ: '65%' },
                { bay: 'B2-04', turnover: 'Med', color: 'bg-amber-400 text-slate-950', label: 'B2 West', occ: '60%' },
                { bay: 'B2-05', turnover: 'Low', color: 'bg-emerald-500 text-white', label: 'B2 East', occ: '40%' },
                { bay: 'B2-06', turnover: 'Low', color: 'bg-emerald-500 text-white', label: 'B2 East', occ: '38%' },
                { bay: 'B3-01', turnover: 'Med', color: 'bg-amber-400 text-slate-950', label: 'B3 Ramp', occ: '55%' },
                { bay: 'B3-02', turnover: 'Low', color: 'bg-emerald-500 text-white', label: 'B3 Storage', occ: '22%' },
              ].map((slot) => (
                <div
                  key={slot.bay}
                  className={`p-2 rounded border border-white/10 flex flex-col justify-between shadow-xs ${slot.color}`}
                >
                  <div className="flex justify-between items-center font-bold text-[10px]">
                    <span>{slot.bay}</span>
                    <span className="text-[8px] opacity-80">{slot.turnover}</span>
                  </div>
                  <div className="text-[9px] mt-1 truncate">{slot.label}</div>
                  <div className="text-[11px] font-mono font-black mt-1">{slot.occ}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Heat density is computed automatically via live bay camera telemetry and stay duration algorithms.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition ml-auto"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
