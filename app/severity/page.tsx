'use client';

import React, { useState } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';

interface SeverityLevelItem {
  sno: number;
  id: string;
  severityCode: string;
  alertType: string;
  responseTimeMin: string;
  email: boolean;
  sms: boolean;
  whatsApp: boolean;
  status: boolean;
}

export default function SeverityPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exact data from screenshot: media_1790143792817.png
  const [levels, setLevels] = useState<SeverityLevelItem[]>([
    {
      sno: 1,
      id: 'sev-1',
      severityCode: 'CRITICAL',
      alertType: 'DEVICE_STATUS',
      responseTimeMin: '34',
      email: true,
      sms: true,
      whatsApp: true,
      status: true,
    },
    {
      sno: 2,
      id: 'sev-2',
      severityCode: 'LOW',
      alertType: 'WRONG PARKING',
      responseTimeMin: '10',
      email: true,
      sms: true,
      whatsApp: true,
      status: true,
    },
    {
      sno: 3,
      id: 'sev-3',
      severityCode: 'MEDIUM',
      alertType: 'BLACKLIST',
      responseTimeMin: '10',
      email: false, // Unchecked in screenshot
      sms: true,
      whatsApp: true,
      status: true,
    },
    {
      sno: 4,
      id: 'sev-4',
      severityCode: 'LOW',
      alertType: 'MAINTENANCE',
      responseTimeMin: '1',
      email: true,
      sms: true,
      whatsApp: true,
      status: true,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateCode = (id: string, val: string) => {
    setLevels(prev => prev.map(item => item.id === id ? { ...item, severityCode: val } : item));
  };

  const handleUpdateResponseTime = (id: string, val: string) => {
    setLevels(prev => prev.map(item => item.id === id ? { ...item, responseTimeMin: val } : item));
  };

  const handleToggleChannel = (id: string, channel: 'email' | 'sms' | 'whatsApp' | 'status') => {
    setLevels(prev => prev.map(item => item.id === id ? { ...item, [channel]: !item[channel] } : item));
  };

  const handleSave = () => {
    showToast('Severity levels saved successfully');
  };

  const handleAddRow = () => {
    const nextSno = levels.length + 1;
    const newRow: SeverityLevelItem = {
      sno: nextSno,
      id: `sev-${Date.now()}`,
      severityCode: 'MEDIUM',
      alertType: 'NEW_ALERT',
      responseTimeMin: '15',
      email: true,
      sms: true,
      whatsApp: true,
      status: true,
    };
    setLevels([...levels, newRow]);
    showToast(`Added row ${nextSno}`);
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
            Severity Level
          </h1>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Action Header bar */}
        <div className="flex justify-end mb-1">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>

        {/* Severity Level Table */}
        <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm flex flex-col justify-between min-h-[360px] bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#2b4695] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-center w-14 border-r border-white/40">SNO</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40 w-48">Severity Code</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40 w-48">Alert Type</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40 w-56">Response Time (Min)</th>
                  <th className="py-2.5 px-3 font-semibold text-center border-r border-white/40 w-24">Email</th>
                  <th className="py-2.5 px-3 font-semibold text-center border-r border-white/40 w-24">SMS</th>
                  <th className="py-2.5 px-3 font-semibold text-center border-r border-white/40 w-24">WhatsApp</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {levels.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* SNO */}
                    <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {item.sno}
                    </td>

                    {/* Severity Code (Input box in screenshot) */}
                    <td className="py-2 px-4 border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="text"
                        value={item.severityCode}
                        onChange={(e) => handleUpdateCode(item.id, e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                      />
                    </td>

                    {/* Alert Type (Text label in screenshot) */}
                    <td className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium tracking-wide">
                      {item.alertType}
                    </td>

                    {/* Response Time (Min) (Input box in screenshot) */}
                    <td className="py-2 px-4 border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="text"
                        value={item.responseTimeMin}
                        onChange={(e) => handleUpdateResponseTime(item.id, e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </td>

                    {/* Email Checkbox */}
                    <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        checked={item.email}
                        onChange={() => handleToggleChannel(item.id, 'email')}
                        className="w-4 h-4 rounded border-slate-300 accent-[#2b4695] cursor-pointer"
                      />
                    </td>

                    {/* SMS Checkbox */}
                    <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        checked={item.sms}
                        onChange={() => handleToggleChannel(item.id, 'sms')}
                        className="w-4 h-4 rounded border-slate-300 accent-[#2b4695] cursor-pointer"
                      />
                    </td>

                    {/* WhatsApp Checkbox */}
                    <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        checked={item.whatsApp}
                        onChange={() => handleToggleChannel(item.id, 'whatsApp')}
                        className="w-4 h-4 rounded border-slate-300 accent-[#2b4695] cursor-pointer"
                      />
                    </td>

                    {/* Status Checkbox */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() => handleToggleChannel(item.id, 'status')}
                        className="w-4 h-4 rounded border-slate-300 accent-[#2b4695] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty Space matching screenshot */}
          <div className="flex-1 min-h-[140px]" />
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
