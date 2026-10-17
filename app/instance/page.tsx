'use client';

import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';

interface SystemInstance {
  sno: number;
  id: string;
  name: string;
  role: string;
  ipAddress: string;
  port: number;
  status: string;
  uptime: string;
}

export default function InstancePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [instances, setInstances] = useState<SystemInstance[]>([
    {
      sno: 1,
      id: 'inst-1',
      name: 'PGS-SRV-MASTER-01',
      role: 'Primary Master',
      ipAddress: '192.168.1.100',
      port: 8080,
      status: 'Active / Online',
      uptime: '28d 14h',
    },
    {
      sno: 2,
      id: 'inst-2',
      name: 'PGS-SRV-STANDBY-02',
      role: 'Hot Standby Failover',
      ipAddress: '192.168.1.101',
      port: 8080,
      status: 'Standby',
      uptime: '28d 14h',
    },
    {
      sno: 3,
      id: 'inst-3',
      name: 'PGS-EDGE-GATEWAY-B1',
      role: 'Edge Sub-Broker',
      ipAddress: '192.168.1.102',
      port: 5005,
      status: 'Active / Online',
      uptime: '14d 08h',
    },
  ]);

  const [newInst, setNewInst] = useState({
    name: '',
    role: 'Edge Sub-Broker',
    ipAddress: '192.168.1.',
    port: 8080,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    showToast('System instance configurations saved successfully');
  };

  const handleAddInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.name.trim()) return;
    const nextSno = instances.length + 1;
    const created: SystemInstance = {
      sno: nextSno,
      id: `inst-${Date.now()}`,
      name: newInst.name,
      role: newInst.role,
      ipAddress: newInst.ipAddress,
      port: Number(newInst.port) || 8080,
      status: 'Active / Online',
      uptime: 'Just now',
    };
    setInstances([...instances, created]);
    setIsAddModalOpen(false);
    setNewInst({ name: '', role: 'Edge Sub-Broker', ipAddress: '192.168.1.', port: 8080 });
    showToast(`Instance "${created.name}" registered`);
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
            Instance
          </h1>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Action Header */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Register Instance
          </button>
        </div>

        {/* Instance Table */}
        <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm bg-white dark:bg-slate-900 min-h-[300px] flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#2b4695] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-center w-14 border-r border-white/40">SNO</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">INSTANCE NAME</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">ROLE</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">IP ADDRESS</th>
                  <th className="py-2.5 px-3 font-semibold text-center border-r border-white/40 w-24">PORT</th>
                  <th className="py-2.5 px-4 font-semibold text-center border-r border-white/40 w-36">STATUS</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-28">UPTIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {instances.map((inst) => (
                  <tr
                    key={inst.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {inst.sno}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200">
                      {inst.name}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      {inst.role}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {inst.ipAddress}
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                      {inst.port}
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        inst.status.includes('Active')
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {inst.uptime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty Space matching screenshot */}
          <div className="flex-1 min-h-[120px]" />
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

      {/* Modal: Add Instance */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Register Instance Node</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInstance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instance Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PGS-NODE-04"
                  value={newInst.name}
                  onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Role
                </label>
                <select
                  value={newInst.role}
                  onChange={(e) => setNewInst({ ...newInst, role: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Primary Master">Primary Master</option>
                  <option value="Hot Standby Failover">Hot Standby Failover</option>
                  <option value="Edge Sub-Broker">Edge Sub-Broker</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  IP Address
                </label>
                <input
                  type="text"
                  required
                  value={newInst.ipAddress}
                  onChange={(e) => setNewInst({ ...newInst, ipAddress: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Port
                </label>
                <input
                  type="number"
                  required
                  value={newInst.port}
                  onChange={(e) => setNewInst({ ...newInst, port: parseInt(e.target.value) || 8080 })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  Save Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
