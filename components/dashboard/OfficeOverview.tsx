'use client';

import React from 'react';
import { usePGS } from '@/context/PGSContext';
import {
  Building2,
  Car,
  CheckCircle2,
  ClockAlert,
  ParkingCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function OfficeOverview() {
  const { officeName, setOfficeName, availableOffices, stats } = usePGS();

  return (
    <div className="glass-panel p-2.5 border border-slate-200 dark:border-white/10 shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {/* Office Facility Name & Selector */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Facility & Office Overview
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="relative inline-block mt-0.5">
              <select
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                className="appearance-none font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent pr-6 cursor-pointer focus:outline-none hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {availableOffices.map((office) => (
                  <option
                    key={office}
                    value={office}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {office}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>
        </div>

        {/* 4 Office Metrics Grid (High-Density Desktop Strip) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-2xl lg:ml-4">
          {/* Total Number of Occupied Parking */}
          <div className="glass-panel px-2.5 py-1.5 border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tight block">
                Occupied
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-rose-600 dark:text-rose-400">
                  {stats.facilityOccupied}
                </span>
                <span className="text-[9.5px] opacity-65 font-mono">bays</span>
              </div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center bg-rose-500/15 text-rose-500">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Total Parking LOT Capacity */}
          <div className="glass-panel px-2.5 py-1.5 border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight block">
                Lot Capacity
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {stats.facilityTotal}
                </span>
                <span className="text-[9.5px] opacity-65 font-mono">total</span>
              </div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center bg-indigo-500/15 text-indigo-500">
              <ParkingCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Total Free Space */}
          <div className="glass-panel px-2.5 py-1.5 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight block">
                Free Space
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {stats.facilityFree}
                </span>
                <span className="text-[9.5px] opacity-65 font-mono">vacant</span>
              </div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Total Number of Long Stay in parking */}
          <div className="glass-panel px-2.5 py-1.5 border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight block">
                Long Stay (&gt;4h)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  {stats.facilityLongStay}
                </span>
                <span className="text-[9.5px] opacity-65 font-mono">vehicles</span>
              </div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center bg-amber-500/15 text-amber-500">
              <ClockAlert className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
