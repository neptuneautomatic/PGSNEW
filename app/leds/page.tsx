'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Plus, X, CheckCircle2, Save, Lightbulb } from 'lucide-react';

interface LEDEntry {
  id: string;
  ipPort: string;
  ledId: number;
}

export default function LEDsPage() {
  const [leds, setLeds] = useState<LEDEntry[]>([
    { id: 'led-1', ipPort: '192.168.1.58:502', ledId: 1 },
    { id: 'led-2', ipPort: '192.168.1.58:502', ledId: 2 },
  ]);

  const [selectedLedId, setSelectedLedId] = useState<string>(leds[0]?.id || 'led-1');

  // Top Form inline state
  const [formData, setFormData] = useState({
    ipPort: '192.168.1.58:502',
    startId: '1',
    endId: '2',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLedForm, setNewLedForm] = useState({
    ipPort: '192.168.1.58:502',
    startId: '3',
    endId: '4',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectLed = (entry: LEDEntry) => {
    setSelectedLedId(entry.id);
    setFormData({
      ipPort: entry.ipPort,
      startId: String(entry.ledId),
      endId: String(entry.ledId),
    });
  };

  // Handle Save in Top Form
  const handleSaveTopForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.ipPort.trim()) {
      showToast('Please enter LED IP Port');
      return;
    }

    const start = parseInt(formData.startId, 10) || 1;
    const end = parseInt(formData.endId, 10) || start;

    if (start > end) {
      showToast('Start ID cannot be greater than End ID');
      return;
    }

    // Add or update range
    const newItems: LEDEntry[] = [];
    for (let id = start; id <= end; id++) {
      newItems.push({
        id: `led-${Date.now()}-${id}`,
        ipPort: formData.ipPort,
        ledId: id,
      });
    }

    setLeds(prev => {
      // Filter out existing matching IDs for that IP
      const filtered = prev.filter(l => !(l.ipPort === formData.ipPort && l.ledId >= start && l.ledId <= end));
      return [...filtered, ...newItems].sort((a, b) => a.ledId - b.ledId);
    });

    if (newItems.length > 0) {
      setSelectedLedId(newItems[0].id);
    }
    showToast(`Saved ${newItems.length} LED node(s)`);
  };

  // Handle Delete
  const handleDeleteLed = () => {
    const target = leds.find(l => l.id === selectedLedId);
    if (!target) return;
    if (confirm(`Delete LED ID ${target.ledId} on ${target.ipPort}?`)) {
      const remaining = leds.filter(l => l.id !== selectedLedId);
      setLeds(remaining);
      if (remaining.length > 0) {
        handleSelectLed(remaining[0]);
      } else {
        setSelectedLedId('');
      }
      showToast(`LED ID ${target.ledId} deleted`);
    }
  };

  // Handle Modal Add
  const handleCreateLedRange = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseInt(newLedForm.startId, 10) || 1;
    const end = parseInt(newLedForm.endId, 10) || start;

    const newItems: LEDEntry[] = [];
    for (let id = start; id <= end; id++) {
      newItems.push({
        id: `led-${Date.now()}-${id}`,
        ipPort: newLedForm.ipPort,
        ledId: id,
      });
    }

    setLeds(prev => [...prev, ...newItems].sort((a, b) => a.ledId - b.ledId));
    setIsAddModalOpen(false);
    showToast(`Added ${newItems.length} LED nodes`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded shadow-lg text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Title Header with Green Underline */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            LED Details
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleSaveTopForm} className="space-y-3 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* LED IP PORT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>LED IP PORT
              </label>
              <input
                type="text"
                placeholder="192.168.1.58:502"
                value={formData.ipPort}
                onChange={(e) => setFormData({ ...formData, ipPort: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm font-mono"
              />
            </div>

            {/* LED START ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>LED START ID
              </label>
              <input
                type="text"
                placeholder="1"
                value={formData.startId}
                onChange={(e) => setFormData({ ...formData, startId: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm font-mono"
              />
            </div>

            {/* LED END ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>LED END ID
              </label>
              <input
                type="text"
                placeholder="2"
                value={formData.endId}
                onChange={(e) => setFormData({ ...formData, endId: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm font-mono"
              />
            </div>

            {/* Save Button */}
            <div>
              <button
                type="submit"
                className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {/* LED List Table Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              LED List
            </h2>
            <div className="flex items-center gap-1.5">
              {/* Plus button (Blue Circle) */}
              <button
                type="button"
                title="Add LED"
                onClick={() => setIsAddModalOpen(true)}
                className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              {/* Cancel/Delete button (Red Circle with X) */}
              <button
                type="button"
                title="Delete Selected LED"
                onClick={handleDeleteLed}
                className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm min-h-[300px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#4a72b8] text-white font-semibold">
                  <th className="py-2.5 px-6 border-r border-white/40 w-1/2">LED IP PORT</th>
                  <th className="py-2.5 px-6">LED ID</th>
                </tr>
              </thead>
              <tbody>
                {leds.map((entry) => {
                  const isSelected = entry.id === selectedLedId;
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => handleSelectLed(entry)}
                      className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                        isSelected
                          ? 'bg-[#cde4fd] text-slate-900 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-6 font-mono text-[11px]">
                        {entry.ipPort}
                      </td>
                      <td className="py-2.5 px-6 font-mono">
                        {entry.ledId}
                      </td>
                    </tr>
                  );
                })}

                {leds.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-24 text-center text-slate-400 text-xs">
                      No Rows To Show
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total Configured: {leds.length} LED nodes</span>
            <span>Selected Node ID: {leds.find(l => l.id === selectedLedId)?.ledId ?? '--'}</span>
          </div>
        </div>
      </div>

      {/* Modal: Add LED Range */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add LED Range
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLedRange} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* LED IP PORT</label>
                <input
                  type="text"
                  required
                  value={newLedForm.ipPort}
                  onChange={(e) => setNewLedForm({ ...newLedForm, ipPort: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* START ID</label>
                  <input
                    type="number"
                    required
                    value={newLedForm.startId}
                    onChange={(e) => setNewLedForm({ ...newLedForm, startId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* END ID</label>
                  <input
                    type="number"
                    required
                    value={newLedForm.endId}
                    onChange={(e) => setNewLedForm({ ...newLedForm, endId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#418be8] hover:bg-[#3476cb] text-white rounded font-medium shadow-sm"
                >
                  Save LEDs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
