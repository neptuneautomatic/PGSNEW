'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import {
  BarChart3,
  Calendar,
  Clock,
  Download,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Car,
  Layers,
} from 'lucide-react';

export default function OccupancyReportsView() {
  const { stats, screens, activeScreen } = usePGS();
  const [reportTab, setReportTab] = useState<'HOURLY' | 'DAILY' | 'WEEKLY'>('HOURLY');

  // 1. Today Hourly Data (06:00 to 22:00)
  const hourlyReport = [
    { time: '06:00', occupied: 6, capacity: 68, rate: 9, peak: false, turnover: 4 },
    { time: '07:00', occupied: 14, capacity: 68, rate: 21, peak: false, turnover: 12 },
    { time: '08:00', occupied: 36, capacity: 68, rate: 53, peak: false, turnover: 26 },
    { time: '09:00', occupied: 58, capacity: 68, rate: 85, peak: true, turnover: 32 },
    { time: '10:00', occupied: 64, capacity: 68, rate: 94, peak: true, turnover: 18 },
    { time: '11:00', occupied: 66, capacity: 68, rate: 97, peak: true, turnover: 15 },
    { time: '12:00', occupied: 62, capacity: 68, rate: 91, peak: true, turnover: 22 },
    { time: '13:00', occupied: 59, capacity: 68, rate: 87, peak: true, turnover: 28 },
    { time: '14:00', occupied: 55, capacity: 68, rate: 81, peak: false, turnover: 24 },
    { time: '15:00', occupied: 52, capacity: 68, rate: 76, peak: false, turnover: 20 },
    { time: '16:00', occupied: 58, capacity: 68, rate: 85, peak: true, turnover: 25 },
    { time: '17:00', occupied: 65, capacity: 68, rate: 96, peak: true, turnover: 30 },
    { time: '18:00', occupied: 61, capacity: 68, rate: 90, peak: true, turnover: 34 },
    { time: '19:00', occupied: 45, capacity: 68, rate: 66, peak: false, turnover: 28 },
    { time: '20:00', occupied: 28, capacity: 68, rate: 41, peak: false, turnover: 19 },
    { time: '21:00', occupied: 15, capacity: 68, rate: 22, peak: false, turnover: 12 },
    { time: '22:00', occupied: 8, capacity: 68, rate: 12, peak: false, turnover: 6 },
  ];

  // 2. Today Daily Data (Past 10 Days)
  const dailyReport = [
    { date: '10 Sep', day: 'Wed', avgOccupied: 48, peakOccupied: 65, rate: 71, dwellAvg: '2h 15m', vehicles: 290 },
    { date: '11 Sep', day: 'Thu', avgOccupied: 52, peakOccupied: 67, rate: 76, dwellAvg: '2h 30m', vehicles: 310 },
    { date: '12 Sep', day: 'Fri', avgOccupied: 56, peakOccupied: 68, rate: 82, dwellAvg: '2h 45m', vehicles: 345 },
    { date: '13 Sep', day: 'Sat', avgOccupied: 25, peakOccupied: 38, rate: 37, dwellAvg: '1h 40m', vehicles: 150 },
    { date: '14 Sep', day: 'Sun', avgOccupied: 18, peakOccupied: 28, rate: 26, dwellAvg: '1h 20m', vehicles: 110 },
    { date: '15 Sep', day: 'Mon', avgOccupied: 50, peakOccupied: 66, rate: 74, dwellAvg: '2h 20m', vehicles: 305 },
    { date: '16 Sep', day: 'Tue', avgOccupied: 54, peakOccupied: 67, rate: 79, dwellAvg: '2h 35m', vehicles: 325 },
    { date: '17 Sep', day: 'Wed', avgOccupied: 55, peakOccupied: 68, rate: 81, dwellAvg: '2h 40m', vehicles: 330 },
    { date: '18 Sep', day: 'Thu', avgOccupied: 53, peakOccupied: 66, rate: 78, dwellAvg: '2h 25m', vehicles: 318 },
    { date: '19 Sep (Today)', day: 'Fri', avgOccupied: 58, peakOccupied: 66, rate: 85, dwellAvg: '2h 45m', vehicles: 350 },
  ];

  // 3. Today Weekly Data (Days of Week)
  const weeklyReport = [
    { day: 'Monday', avgOccupancy: 74, peakHour: '11:00 AM', turnoverRate: 4.8, status: 'High Traffic' },
    { day: 'Tuesday', avgOccupancy: 79, peakHour: '11:30 AM', turnoverRate: 5.1, status: 'High Traffic' },
    { day: 'Wednesday', avgOccupancy: 81, peakHour: '11:00 AM', turnoverRate: 5.3, status: 'Peak Congestion' },
    { day: 'Thursday', avgOccupancy: 78, peakHour: '10:30 AM', turnoverRate: 4.9, status: 'High Traffic' },
    { day: 'Friday (Today)', avgOccupancy: 85, peakHour: '11:00 AM', turnoverRate: 5.6, status: 'Maximum Peak' },
    { day: 'Saturday', avgOccupancy: 37, peakHour: '02:00 PM', turnoverRate: 2.2, status: 'Off-Peak / Weekend' },
    { day: 'Sunday', avgOccupancy: 26, peakHour: '01:00 PM', turnoverRate: 1.6, status: 'Minimum Load' },
  ];

  const handleExport = () => {
    let csv = '';
    if (reportTab === 'HOURLY') {
      csv = 'Time,Occupied,Capacity,Rate %,Peak Status,Turnover\n' +
        hourlyReport.map((h) => `${h.time},${h.occupied},${h.capacity},${h.rate}%,${h.peak ? 'PEAK' : 'NORMAL'},${h.turnover}`).join('\n');
    } else if (reportTab === 'DAILY') {
      csv = 'Date,Day,Avg Occupied,Peak Occupied,Rate %,Avg Dwell,Total Vehicles\n' +
        dailyReport.map((d) => `${d.date},${d.day},${d.avgOccupied},${d.peakOccupied},${d.rate}%,${d.dwellAvg},${d.vehicles}`).join('\n');
    } else {
      csv = 'Day,Avg Occupancy %,Peak Hour,Turnover Rate,Status\n' +
        weeklyReport.map((w) => `${w.day},${w.avgOccupancy}%,${w.peakHour},${w.turnoverRate}x,${w.status}`).join('\n');
    }

    const encoded = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `PGS_${reportTab}_Occupied_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col h-full">
      {/* Report Header & Tab Switcher */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Occupancy Telemetry Reports</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Facility Load: {stats.occupancyPercent}%
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Live audit reports for today: Hourly Distribution, Daily Turnover, and Weekly Trends
            </p>
          </div>
        </div>

        {/* 3 Report Tabs & Export Button */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="flex items-center gap-0.5 glass-panel p-0.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setReportTab('HOURLY')}
              className={`px-2.5 py-1 text-xs font-semibold transition ${
                reportTab === 'HOURLY'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today Hourly Report
            </button>
            <button
              onClick={() => setReportTab('DAILY')}
              className={`px-2.5 py-1 text-xs font-semibold transition ${
                reportTab === 'DAILY'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today Daily Report
            </button>
            <button
              onClick={() => setReportTab('WEEKLY')}
              className={`px-2.5 py-1 text-xs font-semibold transition ${
                reportTab === 'WEEKLY'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today Weekly Report
            </button>
          </div>

          <button
            onClick={handleExport}
            className="px-2.5 py-1 font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1 transition"
            title="Download CSV report"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Report Content Body */}
      <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
        {reportTab === 'HOURLY' && (
          <div className="space-y-3">
            {/* Visual Bar Graph */}
            <div className="glass-panel p-3 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Today Hourly Occupied Distribution (06:00 - 22:00)
                </span>
                <span className="text-[10px] font-mono text-indigo-500 font-semibold">
                  Peak Today: 11:00 AM (97% Load)
                </span>
              </div>
              <div className="h-36 flex items-end gap-1 sm:gap-2 pt-4 px-1 overflow-x-auto">
                {hourlyReport.map((h) => {
                  const barHeight = Math.round((h.occupied / 68) * 100);
                  return (
                    <div key={h.time} className="flex-1 min-w-[28px] flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 glass-panel text-[9.5px] py-0.5 px-1 font-mono rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                        {h.occupied} bays ({h.rate}%)
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-white/10 h-24 flex items-end overflow-hidden">
                        <div
                          className={`w-full transition-all duration-300 ${
                            h.peak ? 'bg-rose-500' : h.rate >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                        {h.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table of Hourly Data */}
            <div className="overflow-x-auto border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-500 font-bold border-b border-inherit">
                    <th className="py-2 px-3">Hour</th>
                    <th className="py-2 px-3">Occupied Bays</th>
                    <th className="py-2 px-3">Occupancy Rate</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Hourly Turnover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {hourlyReport.map((h) => (
                    <tr key={h.time} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {h.time}
                      </td>
                      <td className="py-1.5 px-3 font-mono">
                        {h.occupied} / {h.capacity}
                      </td>
                      <td className="py-1.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{h.rate}%</span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1 overflow-hidden">
                            <div
                              className={`h-full ${h.peak ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${h.rate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-3">
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 font-bold ${
                            h.peak
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {h.peak ? 'PEAK CONGESTION' : 'NORMAL FLOW'}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">
                        +{h.turnover} cars
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportTab === 'DAILY' && (
          <div className="space-y-3">
            {/* Daily KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="glass-panel p-2 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 block">Avg Daily Utilization</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">78.4%</span>
              </div>
              <div className="glass-panel p-2 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 block">Peak Dwell Duration</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">2h 45m</span>
              </div>
              <div className="glass-panel p-2 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 block">Today Vehicle Turnover</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">350 Cars</span>
              </div>
              <div className="glass-panel p-2 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 block">Peak Day in Period</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">12 Sep (82%)</span>
              </div>
            </div>

            {/* Daily Report Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-500 font-bold border-b border-inherit">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Day</th>
                    <th className="py-2 px-3">Avg Occupied</th>
                    <th className="py-2 px-3">Peak Occupied</th>
                    <th className="py-2 px-3">Load %</th>
                    <th className="py-2 px-3">Avg Dwell Time</th>
                    <th className="py-2 px-3 text-right">Daily Vehicles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {dailyReport.map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {d.date}
                      </td>
                      <td className="py-2 px-3 font-semibold">{d.day}</td>
                      <td className="py-2 px-3 font-mono">{d.avgOccupied} bays</td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {d.peakOccupied} bays
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold">{d.rate}%</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">
                        {d.dwellAvg}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {d.vehicles}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportTab === 'WEEKLY' && (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-500 font-bold border-b border-inherit">
                    <th className="py-2.5 px-3">Day of Week</th>
                    <th className="py-2.5 px-3">Avg Occupancy %</th>
                    <th className="py-2.5 px-3">Peak Congestion Hour</th>
                    <th className="py-2.5 px-3">Turnover Rate</th>
                    <th className="py-2.5 px-3 text-right">Operational Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {weeklyReport.map((w) => (
                    <tr key={w.day} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {w.day}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono">{w.avgOccupancy}%</span>
                          <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                w.avgOccupancy >= 80
                                  ? 'bg-rose-500'
                                  : w.avgOccupancy >= 50
                                  ? 'bg-indigo-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${w.avgOccupancy}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {w.peakHour}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {w.turnoverRate}x / bay
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`text-[10px] px-2 py-0.5 font-bold border ${
                            w.status.includes('Peak')
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : w.status.includes('High')
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
