'use client';

import React, { useState, useRef } from 'react';
import { useBackground } from '@/context/BackgroundContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  RotateCw,
  Shuffle,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function BackgroundSettingsModal() {
  const {
    images,
    currentIndex,
    settings,
    isModalOpen,
    setImageIndex,
    uploadImages,
    removeImage,
    resetToDefaults,
    updateSettings,
    setIsModalOpen,
  } = useBackground();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isModalOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadStatus(null);
    const result = await uploadImages(files);
    setIsUploading(false);

    if (result.success) {
      setUploadStatus({
        msg: `Successfully uploaded ${result.count} background image${result.count > 1 ? 's' : ''}!`,
        type: 'success',
      });
    } else {
      setUploadStatus({
        msg: result.error || 'Failed to upload images.',
        type: 'error',
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden rounded-xl my-auto text-xs"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Dashboard Background Settings & Auto-Rotator
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload 4–5 custom background images, adjust auto-rotation timer & select sequential or shuffled mode
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin text-xs">
          {/* Status Message */}
          {uploadStatus && (
            <div
              className={`p-2.5 rounded text-xs flex items-center gap-2 border ${
                uploadStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{uploadStatus.msg}</span>
            </div>
          )}

          {/* Section 1: Upload 4-5 Images Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-500" />
                <span>Upload Custom Background Images (4–5 Recommended)</span>
              </label>
              <span className="text-[10.5px] text-slate-400">
                Current: {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-md p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-white/[0.01] hover:border-blue-400 hover:bg-blue-500/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFiles(e.target.files);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                {isUploading ? (
                  <RotateCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {isUploading ? 'Optimizing & Processing Images...' : 'Click to select or drag & drop 4–5 background images'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports JPG, PNG, WEBP • Automatically compressed for instant auto-rotation
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Current Background Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Active Rotating Slide Deck ({images.length})</span>
              </span>
              <button
                onClick={resetToDefaults}
                className="text-[10.5px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restore Default Smart Facility Wallpapers</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={idx}
                    className={`group relative rounded border overflow-hidden transition-all aspect-video cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-blue-500 border-blue-500 shadow-md shadow-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100 hover:border-slate-400'
                    }`}
                    onClick={() => setImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Active Slide Pill */}
                    {isActive && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Active
                      </div>
                    )}

                    {/* Slide Number Badge */}
                    <div className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-mono px-1 rounded">
                      #{idx + 1}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      title="Remove image"
                      className="absolute top-1 right-1 w-5 h-5 rounded bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-rose-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Rotation Timing & Mode Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.01]">
            {/* Mode: Sequence vs Shuffled */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                {settings.mode === 'sequence' ? (
                  <RotateCw className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <Shuffle className="w-3.5 h-3.5 text-purple-500" />
                )}
                <span>Rotation Manner</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ mode: 'sequence' })}
                  className={`p-2 rounded border flex flex-col items-start gap-1 transition ${
                    settings.mode === 'sequence'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px]">
                    <RotateCw className="w-3 h-3" />
                    <span>In Sequence</span>
                  </div>
                  <span className="text-[9.5px] opacity-70 font-normal">Order 1 → 2 → 3 → 4 → 5</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ mode: 'shuffled' })}
                  className={`p-2 rounded border flex flex-col items-start gap-1 transition ${
                    settings.mode === 'shuffled'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px]">
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffled</span>
                  </div>
                  <span className="text-[9.5px] opacity-70 font-normal">Randomized rotation</span>
                </button>
              </div>
            </div>

            {/* Interval: Specific Time */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Rotation Interval</span>
                </span>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {settings.intervalSeconds}s
                </span>
              </label>

              {/* Interval preset pills */}
              <div className="flex items-center gap-1 mb-2">
                {[5, 10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => updateSettings({ intervalSeconds: sec })}
                    className={`flex-1 py-1 rounded text-[10.5px] font-semibold transition ${
                      settings.intervalSeconds === sec
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {/* Custom Seconds Input */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="3"
                  max="120"
                  step="1"
                  value={settings.intervalSeconds}
                  onChange={(e) => updateSettings({ intervalSeconds: Number(e.target.value) })}
                  className="flex-1 accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="w-14 shrink-0 flex items-center">
                  <input
                    type="number"
                    min="2"
                    max="300"
                    value={settings.intervalSeconds}
                    onChange={(e) => updateSettings({ intervalSeconds: Math.max(2, Number(e.target.value)) })}
                    className="w-full text-center px-1.5 py-0.5 border rounded text-[11px] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Overlay & Readability Controls */}
          <div className="p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.01] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                <span>Overlay & Backdrop Blur (Card Readability)</span>
              </span>
              <button
                type="button"
                onClick={() => updateSettings({ isPaused: !settings.isPaused })}
                className={`px-2.5 py-1 rounded font-semibold text-[10.5px] flex items-center gap-1 transition ${
                  settings.isPaused
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {settings.isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{settings.isPaused ? 'Rotation Paused' : 'Auto-Rotate Running'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Overlay Dark Tint */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1 text-slate-600 dark:text-slate-400">
                  <span>Dark Tint Opacity</span>
                  <span className="font-mono font-bold">{Math.round(settings.overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.95"
                  step="0.05"
                  value={settings.overlayOpacity}
                  onChange={(e) => updateSettings({ overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Backdrop Blur */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1 text-slate-600 dark:text-slate-400">
                  <span>Backdrop Blur Filter</span>
                  <span className="font-mono font-bold">{settings.blurAmount}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={settings.blurAmount}
                  onChange={(e) => updateSettings({ blurAmount: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Changes persist automatically across sessions and views.</span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
}
