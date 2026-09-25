'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Plus, X, CheckCircle2, Save, Search, MonitorSmartphone } from 'lucide-react';

interface MainDisplayItem {
  id: string;
  name: string;
  displayModel: string;
  ipPort: string;
  assignedDisplayIds: string[]; // ids of bound sub-displays / screens
}

export default function MainDisplayPage() {
  const { screens, sensors, displays, displayModels } = usePGS();

  // Main Displays state
  const [mainDisplays, setMainDisplays] = useState<MainDisplayItem[]>([
    {
      id: 'main-disp-1',
      name: 'Main Dis',
      displayModel: 'PP3216R_COLOR',
      ipPort: '192.168.1.199:5005',
      assignedDisplayIds: ['disp-zone-1', 'disp-1', 'disp-2'],
    },
  ]);

  const [selectedMainDispId, setSelectedMainDispId] = useState<string>(
    mainDisplays[0]?.id || 'main-disp-1'
  );

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Top Form inline state
  const [formData, setFormData] = useState({
    name: 'Main Dis',
    displayModel: 'PP3216R_COLOR',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddMainModalOpen, setIsAddMainModalOpen] = useState(false);
  const [isBindDisplayModalOpen, setIsBindDisplayModalOpen] = useState(false);

  const [newMainForm, setNewMainForm] = useState({
    name: '',
    displayModel: '',
    ipPort: '192.168.1.200:5005',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentMainDisp = mainDisplays.find(m => m.id === selectedMainDispId) || mainDisplays[0];

  const handleSelectMainDisp = (m: MainDisplayItem) => {
    setSelectedMainDispId(m.id);
    setFormData({
      name: m.name,
      displayModel: m.displayModel,
    });
    setSelectedRowId(null);
  };

  const handleSaveTopForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter Name');
      return;
    }

    if (currentMainDisp) {
      setMainDisplays(prev => prev.map(m => m.id === currentMainDisp.id ? {
        ...m,
        name: formData.name,
        displayModel: formData.displayModel,
      } : m));
      showToast(`Main Display "${formData.name}" saved successfully`);
    } else {
      const created: MainDisplayItem = {
        id: `main-disp-${Date.now()}`,
        name: formData.name,
        displayModel: formData.displayModel || 'PP3216R_COLOR',
        ipPort: '192.168.1.200:5005',
        assignedDisplayIds: [],
      };
      setMainDisplays([...mainDisplays, created]);
      setSelectedMainDispId(created.id);
      showToast(`Main Display "${created.name}" created`);
    }
  };

  const handleDeleteMainDisp = () => {
    if (!currentMainDisp) return;
    if (confirm(`Delete Main Display "${currentMainDisp.name}"?`)) {
      const name = currentMainDisp.name;
      const remaining = mainDisplays.filter(m => m.id !== currentMainDisp.id);
      setMainDisplays(remaining);
      if (remaining.length > 0) {
        handleSelectMainDisp(remaining[0]);
      } else {
        setFormData({ name: '', displayModel: '' });
      }
      showToast(`Main Display "${name}" deleted`);
    }
  };

  const handleCreateMainDisp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMainForm.name.trim()) return;

    const created: MainDisplayItem = {
      id: `main-disp-${Date.now()}`,
      name: newMainForm.name,
      displayModel: newMainForm.displayModel || 'PP3216R_COLOR',
      ipPort: newMainForm.ipPort,
      assignedDisplayIds: [],
    };

    setMainDisplays([...mainDisplays, created]);
    handleSelectMainDisp(created);
    setIsAddMainModalOpen(false);
    showToast(`Main Display "${created.name}" created`);
  };

  // Sub displays assigned to this Main Display
  const assignedDisplays = displays.filter(d => 
    currentMainDisp?.assignedDisplayIds?.includes(d.id)
  );

  const handleRemoveSubDisplay = () => {
    if (!currentMainDisp || !selectedRowId) {
      showToast('Select a display in the right table to remove');
      return;
    }
    setMainDisplays(prev => prev.map(m => m.id === currentMainDisp.id ? {
      ...m,
      assignedDisplayIds: m.assignedDisplayIds.filter(id => id !== selectedRowId)
    } : m));
    setSelectedRowId(null);
    showToast('Display removed from Main Display totem');
  };

  const handleAddSubDisplay = (dispId: string) => {
    if (!currentMainDisp) return;
    if (currentMainDisp.assignedDisplayIds.includes(dispId)) {
      showToast('Already added to this Main Display');
      return;
    }
    setMainDisplays(prev => prev.map(m => m.id === currentMainDisp.id ? {
      ...m,
      assignedDisplayIds: [...m.assignedDisplayIds, dispId]
    } : m));
    setIsBindDisplayModalOpen(false);
    showToast('Display assigned to Main Display totem');
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

      {/* Main Panel Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Title Header with Green Underline */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Main Display & Sensor List
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleSaveTopForm} className="space-y-3 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* NAME */}
            <div className="md:col-span-4">
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

            {/* DISPLAY MODEL */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY MODEL
              </label>
              <select
                value={formData.displayModel}
                onChange={(e) => setFormData({ ...formData, displayModel: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="">PLEASE SELECT</option>
                {displayModels.map(dm => (
                  <option key={dm.id} value={dm.displayModel}>{dm.displayModel}</option>
                ))}
                <option value="PP3216R_COLOR">PP3216R_COLOR</option>
                <option value="Direction Display">Direction Display</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {/* Lower Section: Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-slate-200 dark:border-slate-800 pt-2">
          
          {/* Left Column: Main Display List (~28% / 3.5 of 12 cols) */}
          <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Main Display List
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Add Main Display"
                    onClick={() => {
                      setNewMainForm({
                        name: `Main_Display_${mainDisplays.length + 1}`,
                        displayModel: 'PP3216R_COLOR',
                        ipPort: `192.168.1.${200 + mainDisplays.length}:5005`,
                      });
                      setIsAddMainModalOpen(true);
                    }}
                    className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    type="button"
                    title="Delete Main Display"
                    onClick={handleDeleteMainDisp}
                    className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm min-h-[320px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#4a72b8] text-white font-semibold">
                      <th className="py-2.5 px-3 border-r border-white/40">Display Name</th>
                      <th className="py-2.5 px-3">IP Port</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainDisplays.map((m) => {
                      const isSelected = m.id === selectedMainDispId;
                      return (
                        <tr
                          key={m.id}
                          onClick={() => handleSelectMainDisp(m)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3 font-medium">{m.name}</td>
                          <td className="py-2 px-3 font-mono text-[11px] truncate max-w-[110px]" title={m.ipPort}>
                            {m.ipPort}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Units: {mainDisplays.length}</span>
              {currentMainDisp && <span className="font-bold">{currentMainDisp.name}</span>}
            </div>
          </div>

          {/* Right Column: Display & Sensor List (~72% / 8.5 of 12 cols) */}
          <div className="lg:col-span-9 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Display & Sensor List
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Bind Display to Main Totem"
                    onClick={() => setIsBindDisplayModalOpen(true)}
                    className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    type="button"
                    title="Remove Sub-Display"
                    onClick={handleRemoveSubDisplay}
                    className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm min-h-[320px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#4a72b8] text-white font-semibold">
                      <th className="py-2.5 px-4 border-r border-white/40">DISPLAY NAME</th>
                      <th className="py-2.5 px-4 border-r border-white/40">CAPACITY</th>
                      <th className="py-2.5 px-4 border-r border-white/40">OCCUPIED</th>
                      <th className="py-2.5 px-4">FREE SPACE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedDisplays.map((disp) => {
                      const isSelected = selectedRowId === disp.id;
                      const dispSensors = sensors.filter(s => disp.assignedSensors?.includes(s.id));
                      const cap = dispSensors.length || 4;
                      const occ = dispSensors.filter(s => s.status === 1).length;
                      const free = Math.max(0, cap - occ);

                      return (
                        <tr
                          key={disp.id}
                          onClick={() => setSelectedRowId(disp.id)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-4 font-medium">{disp.displayName}</td>
                          <td className="py-2.5 px-4 font-mono">{cap}</td>
                          <td className="py-2.5 px-4 font-mono text-rose-600 font-bold">{occ}</td>
                          <td className="py-2.5 px-4 font-mono text-emerald-600 font-bold">{free}</td>
                        </tr>
                      );
                    })}

                    {assignedDisplays.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-28 text-center text-slate-400 text-xs">
                          No Displays Assigned to {currentMainDisp?.name || 'this totem'}.
                          <br />
                          Click the blue <span className="font-bold text-blue-600">(+)</span> button to bind displays.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{selectedRowId ? 'Row selected. Click red (X) to remove.' : 'Master Entrance Wayfinding Aggregation'}</span>
              <span>Total Displays: {assignedDisplays.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Main Display */}
      {isAddMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Main Display Totem
              </h3>
              <button onClick={() => setIsAddMainModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMainDisp} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* NAME</label>
                <input
                  type="text"
                  required
                  value={newMainForm.name}
                  onChange={(e) => setNewMainForm({ ...newMainForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* DISPLAY MODEL</label>
                <select
                  value={newMainForm.displayModel}
                  onChange={(e) => setNewMainForm({ ...newMainForm, displayModel: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                >
                  <option value="PP3216R_COLOR">PP3216R_COLOR</option>
                  <option value="Direction Display">Direction Display</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">* IP PORT</label>
                <input
                  type="text"
                  value={newMainForm.ipPort}
                  onChange={(e) => setNewMainForm({ ...newMainForm, ipPort: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddMainModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#418be8] hover:bg-[#3476cb] text-white rounded font-medium shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bind Sub Display */}
      {isBindDisplayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Assign Display to {currentMainDisp?.name}
              </h3>
              <button onClick={() => setIsBindDisplayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto text-xs">
              {displays.map((d) => {
                const isAssigned = currentMainDisp?.assignedDisplayIds?.includes(d.id);
                return (
                  <div
                    key={d.id}
                    onClick={() => handleAddSubDisplay(d.id)}
                    className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition ${
                      isAssigned
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 font-bold text-blue-700 dark:text-blue-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{d.displayName} ({d.screenName})</span>
                    <span className="text-[10.5px] text-slate-400">
                      {isAssigned ? '✓ Assigned' : 'Click to bind'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end p-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsBindDisplayModalOpen(false)}
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
