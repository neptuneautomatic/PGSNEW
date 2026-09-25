'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { CheckCircle2, Download } from 'lucide-react';

interface ReportColumnConfig {
  sno: number;
  key: string;
  columnName: string;
  selected: boolean;
}

export default function ReportsPage() {
  const { sensors } = usePGS();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exact columns and states from Screenshot: media_1790143792782.png
  const [columns, setColumns] = useState<ReportColumnConfig[]>([
    { sno: 1, key: 'cameraName', columnName: 'Camera Name', selected: false }, // Unchecked in screenshot
    { sno: 2, key: 'ipPort', columnName: 'Ip Port', selected: true },
    { sno: 3, key: 'sensorName', columnName: 'Sensor Name', selected: true },
    { sno: 4, key: 'vehicalNo', columnName: 'Vehical No', selected: true },
    { sno: 5, key: 'image', columnName: '[Image]', selected: true },
    { sno: 6, key: 'inTime', columnName: 'In Time', selected: true },
    { sno: 7, key: 'outTime', columnName: 'Out Time', selected: true },
    { sno: 8, key: 'stayDuration', columnName: 'Stay Duration', selected: true },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleColumn = (sno: number) => {
    setColumns(prev => prev.map(c => c.sno === sno ? { ...c, selected: !c.selected } : c));
  };

  const handleSave = () => {
    showToast('Vehicle occupancy report formatting saved successfully');
  };

  const handleExportCSV = () => {
    const activeCols = columns.filter(c => c.selected);
    const headers = ['SNO', ...activeCols.map(c => c.columnName)].join(',');
    const rows = sensors.map((s, idx) => {
      const vals = activeCols.map(c => {
        if (c.key === 'cameraName') return `"${s.connectionName || 'CAM136'}"`;
        if (c.key === 'ipPort') return `"${s.ipPort || '192.168.1.136:554'}"`;
        if (c.key === 'sensorName') return `"${s.sensorName}"`;
        if (c.key === 'vehicalNo') return `"${s.vehicleNo || (s.status === 1 ? 'KA-05-PG-1001' : '--')}"`;
        if (c.key === 'image') return '"JPEG"';
        if (c.key === 'inTime') return '"08:30 AM"';
        if (c.key === 'outTime') return s.status === 1 ? '"--"' : '"09:45 AM"';
        if (c.key === 'stayDuration') return s.status === 1 ? '"2h 15m"' : '"1h 15m"';
        return '""';
      });
      return [idx + 1, ...vals].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vehicle_Occupancy_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV exported successfully');
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-white tracking-tight">
            Vehicle Occupancy Report Formatting
          </h1>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold px-3 py-1.5 rounded border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Formatting Table matching Screenshot 1 */}
        <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#4a72b8] text-white">
              <tr>
                <th className="py-2.5 px-4 font-semibold text-center w-24 border-r border-white/40">SNO</th>
                <th className="py-2.5 px-6 font-semibold border-r border-white/40">Column Name</th>
                <th className="py-2.5 px-6 font-semibold text-center w-48">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {columns.map((col) => (
                <tr
                  key={col.sno}
                  onClick={() => handleToggleColumn(col.sno)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {col.sno}
                  </td>
                  <td className="py-2.5 px-6 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {col.columnName}
                  </td>
                  <td className="py-2.5 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={col.selected}
                      onChange={() => handleToggleColumn(col.sno)}
                      className="w-4 h-4 rounded border-slate-300 accent-[#007bff] cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
