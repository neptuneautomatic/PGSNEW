'use client';

import React, { useState } from 'react';
import {
  X,
  Ban,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Car,
  Bell,
  Lock,
} from 'lucide-react';

interface BlocklistItem {
  id: string;
  plateNumber: string;
  vehicleModel: string;
  reason: string;
  actionOnTrigger: 'DENY_ENTRY' | 'ALERT_SECURITY' | 'LOCK_GATE';
  dateAdded: string;
  addedBy: string;
  status: 'Active' | 'Under Review';
}

const initialBlocklist: BlocklistItem[] = [
  {
    id: 'bl-1',
    plateNumber: 'DL-08-CC-9999',
    vehicleModel: 'Toyota Fortuner (Black)',
    reason: 'Repeated long-stay overstay (>8h) & non-payment',
    actionOnTrigger: 'DENY_ENTRY',
    dateAdded: '2026-09-15',
    addedBy: 'Security Admin',
    status: 'Active',
  },
  {
    id: 'bl-2',
    plateNumber: 'MH-01-XX-1111',
    vehicleModel: 'Mercedes Benz E-Class (Silver)',
    reason: 'Unauthorized parking in reserved Executive CEO bay',
    actionOnTrigger: 'ALERT_SECURITY',
    dateAdded: '2026-09-18',
    addedBy: 'Admin',
    status: 'Active',
  },
  {
    id: 'bl-3',
    plateNumber: 'HR-26-ZZ-4321',
    vehicleModel: 'Hyundai Creta (White)',
    reason: 'Security incident flag / unauthorized ingress attempt',
    actionOnTrigger: 'LOCK_GATE',
    dateAdded: '2026-09-20',
    addedBy: 'Control Room Officer',
    status: 'Active',
  },
];

interface BlocklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlocklistModal({ isOpen, onClose }: BlocklistModalProps) {
  const [list, setList] = useState<BlocklistItem[]>(initialBlocklist);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newAction, setNewAction] = useState<'DENY_ENTRY' | 'ALERT_SECURITY' | 'LOCK_GATE'>('DENY_ENTRY');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredList = list.filter(
    (item) =>
      item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.vehicleModel.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newReason.trim()) return;

    const newItem: BlocklistItem = {
      id: `bl-${Date.now()}`,
      plateNumber: newPlate.toUpperCase().trim(),
      vehicleModel: newModel.trim() || 'Unspecified Vehicle',
      reason: newReason.trim(),
      actionOnTrigger: newAction,
      dateAdded: new Date().toISOString().split('T')[0],
      addedBy: 'Admin',
      status: 'Active',
    };

    setList([newItem, ...list]);
    setNewPlate('');
    setNewModel('');
    setNewReason('');
    setShowAddForm(false);
    setFormSuccess(`Vehicle ${newItem.plateNumber} added to blocklist.`);
    setTimeout(() => setFormSuccess(null), 3000);
  };

  const handleRemove = (id: string) => {
    setList(list.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    let csv = `VEHICLE SECURITY BLOCKLIST\r\n`;
    csv += `Export Date: ${new Date().toLocaleString()}\r\n\r\n`;
    csv += `Plate Number,Vehicle Model,Reason,Action Trigger,Date Added,Added By,Status\r\n`;
    list.forEach((item) => {
      csv += `${item.plateNumber},"${item.vehicleModel}","${item.reason}",${item.actionOnTrigger},${item.dateAdded},${item.addedBy},${item.status}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PGS_Vehicle_Blocklist_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-xs my-auto"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-rose-600/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Vehicle Security Blocklist</span>
                <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {list.length} BLOCKED VEHICLES
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Restricted plate enforcement & automatic barrier intercept at ANPR cameras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1 font-semibold text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="shrink-0 px-5 py-2.5 bg-slate-100/70 dark:bg-black/30 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search Plate, Model, or Reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1 text-[11px] shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel New Plate' : 'Block New Vehicle'}</span>
          </button>
        </div>

        {/* Form Success Toast */}
        {formSuccess && (
          <div className="shrink-0 px-5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* Add New Plate Form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="shrink-0 p-4 bg-rose-500/5 border-b border-rose-500/20 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Add Vehicle to Security Blocklist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
                  * License Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DL-01-AB-1234"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-mono font-bold text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
                  Vehicle Model / Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Honda City (White)"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
                  * Action on Camera Detection
                </label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="DENY_ENTRY">Deny Entry (Barrier Stays Down)</option>
                  <option value="ALERT_SECURITY">Alert Security Console</option>
                  <option value="LOCK_GATE">Emergency Lock Ingate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
                * Reason for Restriction
              </label>
              <input
                type="text"
                placeholder="e.g. Unpaid parking dues, repeated overnight overstay, unauthorized VIP lane access"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Confirm & Add to Blocklist
              </button>
            </div>
          </form>
        )}

        {/* Blocklist Table */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10.5px] uppercase font-bold">
                <th className="py-2 px-2.5">License Plate</th>
                <th className="py-2 px-2.5">Vehicle Info</th>
                <th className="py-2 px-3">Violation Reason</th>
                <th className="py-2 px-2 text-center">Camera Action</th>
                <th className="py-2 px-2 text-center">Date Added</th>
                <th className="py-2 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-2.5 font-mono font-bold text-rose-600 dark:text-rose-400">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                      {item.plateNumber}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-slate-800 dark:text-slate-200 font-medium">
                    {item.vehicleModel}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {item.reason}
                  </td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[10px]">
                    {item.actionOnTrigger === 'DENY_ENTRY' && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        Deny Entry
                      </span>
                    )}
                    {item.actionOnTrigger === 'ALERT_SECURITY' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Alert Guard
                      </span>
                    )}
                    {item.actionOnTrigger === 'LOCK_GATE' && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        Lock Ingate
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-500 text-[10.5px]">
                    {item.dateAdded}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Unblock / Remove Plate"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No vehicles found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <span className="text-[11px] text-slate-400 font-mono">
            {list.length} active blocklist records monitored by ANPR cameras
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
