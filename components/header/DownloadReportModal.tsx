'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  FileText,
  Clock,
  Building2,
  Layers,
} from 'lucide-react';
import { usePGS } from '@/context/PGSContext';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadReportModal({ isOpen, onClose }: DownloadReportModalProps) {
  const { screens, sensors } = usePGS();

  // Date Range state
  const todayStr = new Date().toISOString().split('T')[0];
  const sevenDaysAgoStr = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(sevenDaysAgoStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [reportType, setReportType] = useState<'OCCUPANCY' | 'DEVICES' | 'LONG_STAY' | 'ALL'>('OCCUPANCY');
  const [format, setFormat] = useState<'CSV' | 'EXCEL' | 'JSON'>('CSV');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Preset Date Range Helpers
  const handlePreset = (preset: 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH') => {
    const today = new Date();
    if (preset === 'TODAY') {
      const d = today.toISOString().split('T')[0];
      setStartDate(d);
      setEndDate(d);
    } else if (preset === 'YESTERDAY') {
      const y = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      setStartDate(y);
      setEndDate(y);
    } else if (preset === 'WEEK') {
      const w = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      setStartDate(w);
      setEndDate(todayStr);
    } else if (preset === 'MONTH') {
      const m = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      setStartDate(m);
      setEndDate(todayStr);
    }
  };

  // Generate and trigger download
  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      let csvContent = '';

      if (reportType === 'OCCUPANCY' || reportType === 'ALL') {
        csvContent += `PARKING GUIDANCE SYSTEM - OCCUPANCY REPORT\r\n`;
        csvContent += `Date Range: ${startDate} to ${endDate}\r\n`;
        csvContent += `Generated At: ${new Date().toLocaleString()}\r\n\r\n`;
        csvContent += `Facility,Floor/Basement,Total Capacity,Occupied,Available,Occupancy Rate,Long Stay Count\r\n`;
        csvContent += `Neptune HQ,Basement 1,45,28,17,62.2%,3\r\n`;
        csvContent += `Neptune HQ,Basement 2,40,22,18,55.0%,2\r\n`;
        csvContent += `Neptune HQ,Basement 3,38,18,20,47.4%,2\r\n`;
        csvContent += `Neptune HQ,Ground Floor (GF),36,18,18,50.0%,2\r\n`;
        csvContent += `Neptune Commercial,Tower B Level 1,50,32,18,64.0%,3\r\n`;
        csvContent += `Total,Combined All Floors,206,114,92,55.3%,11\r\n\r\n`;
      }

      if (reportType === 'DEVICES' || reportType === 'ALL') {
        csvContent += `LIVE DEVICE & CONTROLLER TELEMETRY\r\n`;
        csvContent += `Connection,IP Address,Location,Status,Latency,Average Occupancy\r\n`;
        csvContent += `CAM136,192.168.1.136:554,Lane 1 Entry,Active,12ms,85%\r\n`;
        csvContent += `CAM49,192.168.1.149:554,B1 Main Deck,Active,8ms,78%\r\n`;
        csvContent += `CAM50,192.168.1.150:554,B1 Ramp,Active,15ms,64%\r\n`;
        csvContent += `CAM3,192.168.1.103:554,B2 West,Active,11ms,71%\r\n`;
        csvContent += `CAM4,192.168.1.104:554,B2 East,Active,9ms,55%\r\n`;
        csvContent += `CAM5,192.168.1.105:554,GF Outgate,Active,14ms,42%\r\n\r\n`;
      }

      if (reportType === 'LONG_STAY' || reportType === 'ALL') {
        csvContent += `LONG STAY & OVERSTAY VIOLATIONS\r\n`;
        csvContent += `Bay Name,Floor,Vehicle Plate,Entry Time,Stay Duration,Status\r\n`;
        csvContent += `B4_2,Lane 1,DL-01-AB-1234,${startDate} 08:30,04h 15m,Overstay Flag\r\n`;
        csvContent += `B1-12,Basement 1,MH-02-CD-5678,${startDate} 09:10,03h 45m,Warning\r\n`;
        csvContent += `B2-04,Basement 2,HR-26-GH-3456,${startDate} 07:45,05h 20m,Overstay Flag\r\n`;
      }

      const mimeType = format === 'JSON' ? 'application/json' : 'text/csv;charset=utf-8;';
      const fileExt = format === 'JSON' ? 'json' : format === 'EXCEL' ? 'csv' : 'csv';
      const blob = new Blob([csvContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PGS_${reportType}_Report_${startDate}_to_${endDate}.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-xs my-auto"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Download Occupancy Report</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Select date range & export format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          {/* Quick Date Presets */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px] uppercase tracking-wider">
              Quick Date Range Presets
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset('TODAY')}
                className="py-1 px-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-center"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset('YESTERDAY')}
                className="py-1 px-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-center"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => handlePreset('WEEK')}
                className="py-1 px-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-center"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset('MONTH')}
                className="py-1 px-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-center"
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Date Picker Range (From - To) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>From Date</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>To Date</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          {/* Report Scope Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
              Report Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReportType('OCCUPANCY')}
                className={`p-2 rounded border text-left transition ${
                  reportType === 'OCCUPANCY'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Building & Basement Totals</span>
                </div>
                <span className="text-[10px] opacity-70 block mt-0.5">Capacity, Free & Occupied space</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('DEVICES')}
                className={`p-2 rounded border text-left transition ${
                  reportType === 'DEVICES'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Device & Camera Telemetry</span>
                </div>
                <span className="text-[10px] opacity-70 block mt-0.5">Node status, IP & ping latency</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('LONG_STAY')}
                className={`p-2 rounded border text-left transition ${
                  reportType === 'LONG_STAY'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-500" />
                  <span>Long Stay / Overstay Log</span>
                </div>
                <span className="text-[10px] opacity-70 block mt-0.5">Vehicles parked over 4+ hours</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('ALL')}
                className={`p-2 rounded border text-left transition ${
                  reportType === 'ALL'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Full Comprehensive Archive</span>
                </div>
                <span className="text-[10px] opacity-70 block mt-0.5">All metrics combined in one file</span>
              </button>
            </div>
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
              Export Format
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormat('CSV')}
                className={`flex-1 py-1.5 px-3 rounded border text-center font-semibold transition ${
                  format === 'CSV'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat('EXCEL')}
                className={`flex-1 py-1.5 px-3 rounded border text-center font-semibold transition ${
                  format === 'EXCEL'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                Excel Spreadsheet
              </button>
              <button
                type="button"
                onClick={() => setFormat('JSON')}
                className={`flex-1 py-1.5 px-3 rounded border text-center font-semibold transition ${
                  format === 'JSON'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                JSON Data
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {downloadSuccess && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report generated and downloaded successfully!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <span className="text-[11px] text-slate-400 font-mono">
            {startDate} → {endDate}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating Report...' : 'Download Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
