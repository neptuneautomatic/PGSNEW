'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Plus, X, CheckCircle2, Save, Search, Tv } from 'lucide-react';

interface VirtualDisplayItem {
  id: string;
  name: string;
  screen: string;
  displayId: string;
  leftPos: string;
  rightPos: string;
  assignedSensors: string[]; // sensor ids
}

export default function VirtualDisplayPage() {
  const { screens, sensors } = usePGS();

  // State for Virtual Displays
  const [virtualDisplays, setVirtualDisplays] = useState<VirtualDisplayItem[]>([
    {
      id: 'vdisp-1',
      name: 'Virtual_Display_B1',
      screen: screens[0]?.name || 'Lane1',
      displayId: '1',
      leftPos: '400',
      rightPos: '600',
      assignedSensors: ['s-lane1-1', 's-lane1-2'],
    },
  ]);

  const [selectedVDispId, setSelectedVDispId] = useState<string | null>(
    virtualDisplays[0]?.id || null
  );

  const [selectedSensorRowId, setSelectedSensorRowId] = useState<string | null>(null);

  // Top Form inline state
  const [formData, setFormData] = useState({
    name: virtualDisplays[0]?.name || '',
    screen: virtualDisplays[0]?.screen || '',
    displayId: virtualDisplays[0]?.displayId || '',
    leftPos: virtualDisplays[0]?.leftPos || '',
    rightPos: virtualDisplays[0]?.rightPos || '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignSensorModalOpen, setIsAssignSensorModalOpen] = useState(false);

  const [newVDisp, setNewVDisp] = useState({
    name: '',
    screen: screens[0]?.name || '',
    displayId: String(virtualDisplays.length + 1),
    leftPos: '0',
    rightPos: '0',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentVDisp = virtualDisplays.find(v => v.id === selectedVDispId);

  // Handle Select Virtual Display
  const handleSelectVDisp = (v: VirtualDisplayItem) => {
    setSelectedVDispId(v.id);
    setFormData({
      name: v.name,
      screen: v.screen,
      displayId: v.displayId,
      leftPos: v.leftPos,
      rightPos: v.rightPos,
    });
    setSelectedSensorRowId(null);
  };

  // Handle Save in Top Form
  const handleSaveTopForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter Name');
      return;
    }

    if (currentVDisp) {
      setVirtualDisplays(prev => prev.map(v => v.id === currentVDisp.id ? {
        ...v,
        name: formData.name,
        screen: formData.screen,
        displayId: formData.displayId,
        leftPos: formData.leftPos,
        rightPos: formData.rightPos,
      } : v));
      showToast(`Virtual Display "${formData.name}" updated`);
    } else {
      const created: VirtualDisplayItem = {
        id: `vdisp-${Date.now()}`,
        name: formData.name,
        screen: formData.screen || screens[0]?.name || 'Lane1',
        displayId: formData.displayId || '1',
        leftPos: formData.leftPos || '0',
        rightPos: formData.rightPos || '0',
        assignedSensors: [],
      };
      setVirtualDisplays([...virtualDisplays, created]);
      setSelectedVDispId(created.id);
      showToast(`Virtual Display "${created.name}" created`);
    }
  };

  // Handle Delete Virtual Display
  const handleDeleteVDisp = () => {
    if (!currentVDisp) return;
    if (confirm(`Delete virtual display "${currentVDisp.name}"?`)) {
      const name = currentVDisp.name;
      const remaining = virtualDisplays.filter(v => v.id !== currentVDisp.id);
      setVirtualDisplays(remaining);
      if (remaining.length > 0) {
        handleSelectVDisp(remaining[0]);
      } else {
        setSelectedVDispId(null);
        setFormData({ name: '', screen: '', displayId: '', leftPos: '', rightPos: '' });
      }
      showToast(`Virtual Display "${name}" deleted`);
    }
  };

  // Handle Add New Modal
  const handleCreateVDisp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVDisp.name.trim()) return;

    const created: VirtualDisplayItem = {
      id: `vdisp-${Date.now()}`,
      name: newVDisp.name,
      screen: newVDisp.screen,
      displayId: newVDisp.displayId,
      leftPos: newVDisp.leftPos,
      rightPos: newVDisp.rightPos,
      assignedSensors: [],
    };

    setVirtualDisplays([...virtualDisplays, created]);
    handleSelectVDisp(created);
    setIsAddModalOpen(false);
    showToast(`Virtual Display "${created.name}" created`);
  };

  // Handle Assign Sensor
  const handleAssignSensor = (sId: string) => {
    if (!currentVDisp) return;
    if (currentVDisp.assignedSensors.includes(sId)) {
      showToast('Sensor already assigned');
      return;
    }
    setVirtualDisplays(prev => prev.map(v => v.id === currentVDisp.id ? {
      ...v,
      assignedSensors: [...v.assignedSensors, sId]
    } : v));
    setIsAssignSensorModalOpen(false);
    showToast('Sensor assigned to virtual display');
  };

  // Handle Remove Sensor
  const handleRemoveSensor = () => {
    if (!currentVDisp || !selectedSensorRowId) {
      showToast('Select a sensor in the table to remove');
      return;
    }
    setVirtualDisplays(prev => prev.map(v => v.id === currentVDisp.id ? {
      ...v,
      assignedSensors: v.assignedSensors.filter(id => id !== selectedSensorRowId)
    } : v));
    setSelectedSensorRowId(null);
    showToast('Sensor removed from virtual display');
  };

  const assignedSensorsList = (currentVDisp?.assignedSensors || [])
    .map(sId => sensors.find(s => s.id === sId))
    .filter(Boolean) as typeof sensors;

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
            Virtual Display & Sensor List
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleSaveTopForm} className="space-y-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>NAME
              </label>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* SCREEN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>SCREEN
              </label>
              <select
                value={formData.screen}
                onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm uppercase"
              >
                <option value="">PLEASE SELECT</option>
                {screens.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* DISPLAY ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY ID
              </label>
              <input
                type="text"
                placeholder=""
                value={formData.displayId}
                onChange={(e) => setFormData({ ...formData, displayId: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* LEFT POS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>LEFT POS
              </label>
              <input
                type="text"
                placeholder=""
                value={formData.leftPos}
                onChange={(e) => setFormData({ ...formData, leftPos: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* RIGHT POS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>RIGHT POS
              </label>
              <input
                type="text"
                placeholder=""
                value={formData.rightPos}
                onChange={(e) => setFormData({ ...formData, rightPos: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* Save Button Row */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
            >
              Save
            </button>
          </div>
        </form>

        {/* Lower Section: Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-slate-200 dark:border-slate-800 pt-2">
          
          {/* Left Column: Virtual Display List (~28% / 3.5 of 12 cols) */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Virtual Display List
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Add Virtual Display"
                    onClick={() => {
                      setNewVDisp({
                        name: `Virtual_Display_${virtualDisplays.length + 1}`,
                        screen: screens[0]?.name || 'Lane1',
                        displayId: String(virtualDisplays.length + 1),
                        leftPos: '400',
                        rightPos: '600',
                      });
                      setIsAddModalOpen(true);
                    }}
                    className="w-6 h-6 bg-[#2b4695] hover:bg-[#243b7d] text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    type="button"
                    title="Delete Virtual Display"
                    onClick={handleDeleteVDisp}
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
                    <tr className="bg-[#2b4695] text-white font-semibold">
                      <th className="py-2.5 px-3 border-r border-white/40">Display Name</th>
                      <th className="py-2.5 px-3 border-r border-white/40">Screen</th>
                      <th className="py-2.5 px-3">Display Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {virtualDisplays.map((v) => {
                      const isSelected = v.id === selectedVDispId;
                      return (
                        <tr
                          key={v.id}
                          onClick={() => handleSelectVDisp(v)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-blue-100 text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-medium">{v.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{v.screen}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{v.displayId}</td>
                        </tr>
                      );
                    })}

                    {virtualDisplays.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-28 text-center text-slate-400 text-xs">
                          No Rows To Show
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Total: {virtualDisplays.length} Virtual Units</span>
              {currentVDisp && <span className="font-bold">{currentVDisp.name}</span>}
            </div>
          </div>

          {/* Right Column: Virtual Display & Sensor List (~72% / 8.5 of 12 cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Virtual Display & Sensor List
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Assign Sensor"
                    onClick={() => {
                      if (!currentVDisp) {
                        showToast('Select a virtual display first');
                        return;
                      }
                      setIsAssignSensorModalOpen(true);
                    }}
                    className="w-6 h-6 bg-[#2b4695] hover:bg-[#243b7d] text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    type="button"
                    title="Remove Sensor"
                    onClick={handleRemoveSensor}
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
                    <tr className="bg-[#2b4695] text-white font-semibold">
                      <th className="py-2.5 px-4 border-r border-white/40">NAME</th>
                      <th className="py-2.5 px-4 border-r border-white/40">SENSOR NAME</th>
                      <th className="py-2.5 px-4 border-r border-white/40">SENSOR ID</th>
                      <th className="py-2.5 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedSensorsList.map((sensor) => {
                      const isSelected = selectedSensorRowId === sensor.id;
                      return (
                        <tr
                          key={sensor.id}
                          onClick={() => setSelectedSensorRowId(sensor.id)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-4 font-medium">{currentVDisp?.name}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">{sensor.sensorName}</td>
                          <td className="py-2.5 px-4 font-mono">{sensor.sensorNum}</td>
                          <td className="py-2.5 px-4 font-mono">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                sensor.status === 1
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              }`}
                            >
                              {sensor.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {assignedSensorsList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-28 text-center text-slate-400 text-xs">
                          No Rows To Show
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{selectedSensorRowId ? 'Sensor selected. Click red (X) to unbind.' : 'Virtual Display Emulation Active'}</span>
              <span>Capacity: {assignedSensorsList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Virtual Display
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVDisp} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* NAME</label>
                <input
                  type="text"
                  required
                  value={newVDisp.name}
                  onChange={(e) => setNewVDisp({ ...newVDisp, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* SCREEN</label>
                <select
                  value={newVDisp.screen}
                  onChange={(e) => setNewVDisp({ ...newVDisp, screen: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                >
                  {screens.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* ID</label>
                  <input
                    type="text"
                    value={newVDisp.displayId}
                    onChange={(e) => setNewVDisp({ ...newVDisp, displayId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* LEFT POS</label>
                  <input
                    type="text"
                    value={newVDisp.leftPos}
                    onChange={(e) => setNewVDisp({ ...newVDisp, leftPos: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* RIGHT POS</label>
                  <input
                    type="text"
                    value={newVDisp.rightPos}
                    onChange={(e) => setNewVDisp({ ...newVDisp, rightPos: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
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
                  className="px-5 py-1.5 bg-[#2b4695] hover:bg-[#23397d] text-white rounded font-medium shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Sensor Modal */}
      {isAssignSensorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Assign Sensor to {currentVDisp?.name}
              </h3>
              <button onClick={() => setIsAssignSensorModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto text-xs">
              {sensors.map((s) => {
                const isAssigned = currentVDisp?.assignedSensors.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => handleAssignSensor(s.id)}
                    className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition ${
                      isAssigned
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 font-bold text-blue-700 dark:text-blue-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{s.sensorName} ({s.screenPosition || 'Bay'})</span>
                    <span className="text-[10.5px] text-slate-400">
                      {isAssigned ? '✓ Assigned' : 'Click to assign'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end p-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAssignSensorModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-medium text-xs text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
