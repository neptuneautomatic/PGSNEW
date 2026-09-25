'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FrequencyItem {
  sno: number;
  id: string;
  parameterName: string;
  intervalMs: string;
  unit: string;
  status: string;
}

export default function FrequencyPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [frequencyList, setFrequencyList] = useState<FrequencyItem[]>([
    {
      sno: 1,
      id: 'freq-1',
      parameterName: 'Ultrasonic Sensor Polling Rate',
      intervalMs: '500',
      unit: 'Milliseconds (ms)',
      status: 'Active',
    },
    {
      sno: 2,
      id: 'freq-2',
      parameterName: 'Camera ANPR Inference Cycle',
      intervalMs: '1000',
      unit: 'Milliseconds (ms)',
      status: 'Active',
    },
    {
      sno: 3,
      id: 'freq-3',
      parameterName: 'VMS & LED Signage Display Refresh',
      intervalMs: '2000',
      unit: 'Milliseconds (ms)',
      status: 'Active',
    },
    {
      sno: 4,
      id: 'freq-4',
      parameterName: 'Hardware Controller Bus Broadcast',
      intervalMs: '1500',
      unit: 'Milliseconds (ms)',
      status: 'Active',
    },
    {
      sno: 5,
      id: 'freq-5',
      parameterName: 'System Watchdog Heartbeat Timeout',
      intervalMs: '10000',
      unit: 'Milliseconds (ms)',
      status: 'Active',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateInterval = (id: string, val: string) => {
    setFrequencyList(prev => prev.map(item => item.id === id ? { ...item, intervalMs: val } : item));
  };

  const handleSave = () => {
    showToast('Frequency timings saved successfully');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Centered Title */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Frequency
          </h1>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Frequency Table */}
        <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm bg-white dark:bg-slate-900 min-h-[300px] flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#4a72b8] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-center w-14 border-r border-white/40">SNO</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">PARAMETER NAME</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40 w-48">INTERVAL VALUE</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40 w-44">UNIT</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-28">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {frequencyList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {item.sno}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200">
                      {item.parameterName}
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="text"
                        value={item.intervalMs}
                        onChange={(e) => handleUpdateInterval(item.id, e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      {item.unit}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty Space matching screenshot */}
          <div className="flex-1 min-h-[100px]" />
        </div>

        {/* Bottom Right Cyan Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 text-white font-medium text-xs px-6 py-1.5 rounded shadow-sm transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
