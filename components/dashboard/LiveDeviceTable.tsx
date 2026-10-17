'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { CameraDevice } from '@/types';
import {
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RefreshCw,
  Maximize2,
  X,
  Eye,
  Activity,
  Cpu,
  Tv,
} from 'lucide-react';

export default function LiveDeviceTable() {
  const { cameraDevices, updateCameraDevice } = usePGS();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Online' | 'Offline' | 'Degraded'>('ALL');
  const [activePreviewCamera, setActivePreviewCamera] = useState<CameraDevice | null>(null);

  const filteredCameras = cameraDevices.filter((cam) => {
    const matchesSearch =
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cam.laneName && cam.laneName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePingCamera = (cam: CameraDevice) => {
    const randomLatency = Math.floor(12 + Math.random() * 20);
    updateCameraDevice(cam.id, {
      latencyMs: randomLatency,
      status: 'Online',
    });
  };

  return (
    <div className="glass-panel border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col h-full">
      {/* Table Header & Controls */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Live Device Status</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {filteredCameras.length} Cameras Active
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Live RTSP video streams, IP address resolution, and hardware telemetry
            </p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-0.5 glass-panel p-0.5 border border-slate-200 dark:border-white/10">
            {(['ALL', 'Online', 'Degraded', 'Offline'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2 py-0.5 text-[10px] font-semibold transition ${
                  statusFilter === filter
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search Camera or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs glass-panel border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Camera Devices Table */}
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/20 bg-[#2b4695] uppercase text-[10.5px] tracking-wider text-white font-bold sticky top-0 backdrop-blur-md z-10">
              <th className="py-2.5 px-3">3.1 Connection (Camera Name)</th>
              <th className="py-2.5 px-3">3.2 IP Address of Camera</th>
              <th className="py-2.5 px-3 text-center">3.3 Live View</th>
              <th className="py-2.5 px-3">3.4 Status</th>
              <th className="py-2.5 px-3 text-right">Hardware Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {filteredCameras.map((cam) => {
              const isOnline = cam.status === 'Online';
              const isDegraded = cam.status === 'Degraded';

              return (
                <tr
                  key={cam.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                >
                  {/* 3.1 Connection (Camera name) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 flex items-center justify-center shrink-0 border ${
                          isOnline
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : isDegraded
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {cam.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {cam.location} {cam.laneName ? `• ${cam.laneName}` : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 3.2 IP Address of each Camera */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <code className="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-semibold text-indigo-600 dark:text-indigo-400">
                        {cam.ipAddress}
                      </code>
                    </div>
                  </td>

                  {/* 3.3 Live View per camera */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setActivePreviewCamera(cam)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition hover:scale-[1.02]"
                      title="Open Live RTSP Stream"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live View</span>
                    </button>
                  </td>

                  {/* 3.4 Status per camera */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-bold border ${
                          isOnline
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : isDegraded
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline
                              ? 'bg-emerald-500 animate-pulse'
                              : isDegraded
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {cam.status}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {cam.latencyMs}ms
                      </span>
                    </div>
                  </td>

                  {/* Hardware Details & Ping */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-[10px] font-mono opacity-70">
                        <span>{cam.resolution}</span> &bull; <span>{cam.fps} FPS</span>
                      </div>
                      <button
                        onClick={() => handlePingCamera(cam)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                        title="Ping camera link"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live View Camera Modal Preview */}
      {activePreviewCamera && (
        <div
          onClick={() => setActivePreviewCamera(null)}
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel border border-slate-200 dark:border-white/15 w-full max-w-2xl shadow-2xl overflow-hidden relative my-auto rounded-lg"
          >
            {/* Modal Header */}
            <div className="p-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-xs font-mono">
                  LIVE RTSP FEED &bull; {activePreviewCamera.name}
                </span>
              </div>
              <button
                onClick={() => setActivePreviewCamera(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewport Frame */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              {/* Surveillance Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:30px_30px]" />

              {/* Crosshair Overlay */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Feed Content */}
              <div className="flex flex-col items-center justify-center text-center z-10">
                <Camera className="w-12 h-12 text-indigo-400 mb-2 animate-pulse" />
                <div className="bg-amber-300 border-2 border-black px-3 py-1 shadow flex items-center gap-1.5 mb-1.5">
                  <span className="text-[9px] bg-blue-900 text-white font-bold px-1 rounded-[2px]">IND</span>
                  <span className="font-mono font-black text-sm text-black tracking-widest">
                    {activePreviewCamera.lastDetectedPlate || 'DL-01-AB-1234'}
                  </span>
                </div>
                <p className="font-mono text-xs text-emerald-400">
                  AI OCR DETECTION: 99.4% CONFIDENCE &bull; {activePreviewCamera.resolution} &bull;{' '}
                  {activePreviewCamera.fps} FPS
                </p>
                <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                  IP: {activePreviewCamera.ipAddress} &bull; Latency: {activePreviewCamera.latencyMs}ms &bull;{' '}
                  {activePreviewCamera.location}
                </p>
              </div>

              {/* Camera HUD Footer */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-1 border border-white/10">
                <span>RTSP / H.265 HIGH PROFILE</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between">
              <div className="text-xs text-slate-300 font-mono">
                Location: {activePreviewCamera.location}
              </div>
              <button
                onClick={() => setActivePreviewCamera(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
