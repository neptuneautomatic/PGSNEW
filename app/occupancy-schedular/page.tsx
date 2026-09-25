'use client';

import React, { useState } from 'react';
import { Plus, X, CheckCircle2, Save, Calendar as CalendarIcon } from 'lucide-react';

interface SchedularItem {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive';
  time: string;
}

export default function OccupancySchedularPage() {
  const [schedulars, setSchedulars] = useState<SchedularItem[]>([
    {
      id: 'sch-1',
      name: 'Order',
      type: 'DAILY',
      status: 'Active',
      time: '2026-06-07 14:19:00',
    },
    {
      id: 'sch-2',
      name: 'Occupancy Monthly',
      type: 'MONTHLY',
      status: 'Active',
      time: '2026-06-08 14:09:00',
    },
  ]);

  const [selectedSchId, setSelectedSchId] = useState<string>(schedulars[0]?.id || 'sch-1');

  // Top Form inline state
  const [formData, setFormData] = useState({
    name: 'Order',
    reportType: 'DAILY',
    status: 'Active',
    time: '2026-06-07 14:19:00',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSchForm, setNewSchForm] = useState({
    name: '',
    reportType: 'DAILY',
    status: 'Active',
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentSch = schedulars.find(s => s.id === selectedSchId) || schedulars[0];

  const handleSelectSch = (item: SchedularItem) => {
    setSelectedSchId(item.id);
    setFormData({
      name: item.name,
      reportType: item.type,
      status: item.status,
      time: item.time,
    });
  };

  const handleSaveTopForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter Schedular Name');
      return;
    }

    if (currentSch) {
      setSchedulars(prev => prev.map(s => s.id === currentSch.id ? {
        ...s,
        name: formData.name,
        type: formData.reportType || 'DAILY',
        status: formData.status as any || 'Active',
        time: formData.time,
      } : s));
      showToast(`Schedular "${formData.name}" saved successfully`);
    } else {
      const created: SchedularItem = {
        id: `sch-${Date.now()}`,
        name: formData.name,
        type: formData.reportType || 'DAILY',
        status: formData.status as any || 'Active',
        time: formData.time || '2026-06-09 10:00:00',
      };
      setSchedulars([...schedulars, created]);
      setSelectedSchId(created.id);
      showToast(`Schedular "${created.name}" created`);
    }
  };

  const handleDeleteSch = () => {
    if (!currentSch) return;
    if (confirm(`Delete schedular "${currentSch.name}"?`)) {
      const name = currentSch.name;
      const remaining = schedulars.filter(s => s.id !== currentSch.id);
      setSchedulars(remaining);
      if (remaining.length > 0) {
        handleSelectSch(remaining[0]);
      } else {
        setFormData({ name: '', reportType: '', status: '', time: '' });
      }
      showToast(`Schedular "${name}" deleted`);
    }
  };

  const handleCreateSch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchForm.name.trim()) return;

    const created: SchedularItem = {
      id: `sch-${Date.now()}`,
      name: newSchForm.name,
      type: newSchForm.reportType,
      status: newSchForm.status as any,
      time: newSchForm.time,
    };

    setSchedulars([...schedulars, created]);
    handleSelectSch(created);
    setIsAddModalOpen(false);
    showToast(`Schedular "${created.name}" created`);
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
            Occupancy Schedular Report
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleSaveTopForm} className="space-y-3 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* SCHEDULAR NAME */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>SCHEDULAR NAME
              </label>
              <input
                type="text"
                placeholder="Enter Schedular Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* REPORT TYPE */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>REPORT TYPE
              </label>
              <select
                value={formData.reportType}
                onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="">PLEASE SELECT</option>
                <option value="DAILY">DAILY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="HOURLY">HOURLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>STATUS
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="">PLEASE SELECT</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* SCHEDULER TIME */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>SCHEDULER TIME
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd-mm-yyyy --:--"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-1.5 pr-8 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm font-mono"
                />
                <CalendarIcon className="w-3.5 h-3.5 absolute right-2.5 top-2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Save Button Row */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
            >
              Save
            </button>
          </div>
        </form>

        {/* Schedular List Table Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Schedular List
            </h2>
            <div className="flex items-center gap-1.5">
              {/* Plus button (Blue Circle) */}
              <button
                type="button"
                title="Add Schedular"
                onClick={() => setIsAddModalOpen(true)}
                className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              {/* Cancel/Delete button (Red Circle with X) */}
              <button
                type="button"
                title="Delete Selected Schedular"
                onClick={handleDeleteSch}
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
                  <th className="py-2.5 px-6 border-r border-white/40">SCHEDULAR NAME</th>
                  <th className="py-2.5 px-6 border-r border-white/40">TYPE</th>
                  <th className="py-2.5 px-6 border-r border-white/40">STATUS</th>
                  <th className="py-2.5 px-6">SCHEDULAR TIME</th>
                </tr>
              </thead>
              <tbody>
                {schedulars.map((item) => {
                  const isSelected = item.id === selectedSchId;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectSch(item)}
                      className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                        isSelected
                          ? 'bg-[#cde4fd] text-slate-900 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-6 font-medium">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-6 font-mono text-[11px]">
                        {item.type}
                      </td>
                      <td className="py-2.5 px-6">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-6 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {item.time}
                      </td>
                    </tr>
                  );
                })}

                {schedulars.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-24 text-center text-slate-400 text-xs">
                      No Rows To Show
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Configured Schedules: {schedulars.length}</span>
            {currentSch && <span className="font-bold">{currentSch.name} ({currentSch.type})</span>}
          </div>
        </div>
      </div>

      {/* Modal: Add Schedular */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Occupancy Schedular
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSch} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* SCHEDULAR NAME</label>
                <input
                  type="text"
                  required
                  value={newSchForm.name}
                  onChange={(e) => setNewSchForm({ ...newSchForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* REPORT TYPE</label>
                <select
                  value={newSchForm.reportType}
                  onChange={(e) => setNewSchForm({ ...newSchForm, reportType: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                >
                  <option value="DAILY">DAILY</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="WEEKLY">WEEKLY</option>
                  <option value="HOURLY">HOURLY</option>
                  <option value="YEARLY">YEARLY</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* STATUS</label>
                <select
                  value={newSchForm.status}
                  onChange={(e) => setNewSchForm({ ...newSchForm, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* SCHEDULER TIME</label>
                <input
                  type="text"
                  value={newSchForm.time}
                  onChange={(e) => setNewSchForm({ ...newSchForm, time: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                />
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
                  Save Schedular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
