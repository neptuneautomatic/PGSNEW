'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CamRow {
  rowId: number;
  id: string;
  name: string;
  ipPort: string;
  macId: string;
  url: string;
  cameraId: string;
  password?: string;
  remark?: string;
  slots: {
    slotId: string;
    bayNo: string;
    vehicleType: string;
    status: string;
  }[];
}

export default function CamSlotsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cameras matching Screenshot 2 Connection List
  const [cameraList, setCameraList] = useState<CamRow[]>([
    {
      rowId: 1,
      id: 'cam-1',
      name: 'Cam-1',
      ipPort: '192.168.1.85',
      macId: '192.168.1.85',
      url: 'rtsp://192.168.1.85:554/live',
      cameraId: 'CAM01',
      password: '',
      remark: 'Main lane sensor 1',
      slots: [],
    },
    {
      rowId: 2,
      id: 'cam-49',
      name: 'cam49',
      ipPort: '192.168.1.49',
      macId: '192.168.1.49',
      url: 'rtsp://192.168.1.49:554/live',
      cameraId: 'CAM49',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 3,
      id: 'cam-50',
      name: 'cam50',
      ipPort: '192.168.1.50',
      macId: '192.168.1.50',
      url: 'rtsp://192.168.1.50:554/live',
      cameraId: 'CAM50',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 4,
      id: 'cam-3',
      name: 'cam3',
      ipPort: '192.168.1.3',
      macId: '192.168.1.3',
      url: 'rtsp://192.168.1.3:554/live',
      cameraId: 'CAM03',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 5,
      id: 'cam-4',
      name: 'cam4',
      ipPort: '192.168.1.4',
      macId: '192.168.1.4',
      url: 'rtsp://192.168.1.4:554/live',
      cameraId: 'CAM04',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 6,
      id: 'cam-5',
      name: 'cam5',
      ipPort: '192.168.1.5',
      macId: '192.168.1.5',
      url: 'rtsp://192.168.1.5:554/live',
      cameraId: 'CAM05',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 7,
      id: 'cam-99',
      name: 'cam99_205',
      ipPort: '192.168.1.99',
      macId: '192.168.1.99',
      url: 'rtsp://192.168.1.99:554/live',
      cameraId: 'CAM99',
      password: '',
      remark: '',
      slots: [],
    },
    {
      rowId: 8,
      id: 'cam-100',
      name: 'cam100_205',
      ipPort: '192.168.1.100',
      macId: '192.168.1.100',
      url: 'rtsp://192.168.1.100:554/live',
      cameraId: 'CAM100',
      password: '',
      remark: '',
      slots: [],
    },
  ]);

  // Selected camera id (defaults to first row: Cam-1)
  const [selectedCamId, setSelectedCamId] = useState<string>(cameraList[0]?.id || 'cam-1');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Top Form inputs
  const [formData, setFormData] = useState({
    name: '',
    ipPort: '',
    macId: '',
    url: '',
    cameraId: '',
    password: '',
    remark: '',
  });

  // Modal for adding connection
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCamData, setNewCamData] = useState({
    name: '',
    ipPort: '192.168.1.',
    macId: '192.168.1.',
    url: 'rtsp://192.168.1.',
    cameraId: '',
    password: '',
    remark: '',
  });

  // Modal for adding slot to selected camera
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    slotId: '',
    bayNo: '',
    vehicleType: 'General',
    status: 'Available',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedCam = cameraList.find(c => c.id === selectedCamId) || cameraList[0];

  // When a row is clicked
  const handleSelectCam = (cam: CamRow) => {
    setSelectedCamId(cam.id);
    setSelectedSlotIndex(null);
    setFormData({
      name: cam.name,
      ipPort: cam.ipPort,
      macId: cam.macId,
      url: cam.url || '',
      cameraId: cam.cameraId || '',
      password: cam.password || '',
      remark: cam.remark || '',
    });
  };

  // Top Form Save
  const handleSaveTopForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter Camera Name');
      return;
    }

    if (selectedCam) {
      setCameraList(prev => prev.map(c => c.id === selectedCam.id ? {
        ...c,
        name: formData.name,
        ipPort: formData.ipPort,
        macId: formData.macId,
        url: formData.url,
        cameraId: formData.cameraId,
        password: formData.password,
        remark: formData.remark,
      } : c));
      showToast(`Camera "${formData.name}" saved successfully`);
    } else {
      const newRow: CamRow = {
        rowId: cameraList.length + 1,
        id: `cam-${Date.now()}`,
        name: formData.name,
        ipPort: formData.ipPort || '192.168.1.1',
        macId: formData.macId || '192.168.1.1',
        url: formData.url,
        cameraId: formData.cameraId,
        password: formData.password,
        remark: formData.remark,
        slots: [],
      };
      setCameraList([...cameraList, newRow]);
      setSelectedCamId(newRow.id);
      showToast(`Camera "${formData.name}" created`);
    }
  };

  // Delete selected camera with red X button
  const handleDeleteSelectedCam = () => {
    if (!selectedCam) return;
    if (confirm(`Are you sure you want to delete camera "${selectedCam.name}"?`)) {
      const remaining = cameraList.filter(c => c.id !== selectedCam.id);
      setCameraList(remaining);
      if (remaining.length > 0) {
        handleSelectCam(remaining[0]);
      } else {
        setSelectedCamId('');
        setFormData({ name: '', ipPort: '', macId: '', url: '', cameraId: '', password: '', remark: '' });
      }
      showToast(`Deleted camera "${selectedCam.name}"`);
    }
  };

  // Add new camera modal save
  const handleCreateNewCam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamData.name.trim()) {
      showToast('Camera Name is required');
      return;
    }
    const newCam: CamRow = {
      rowId: cameraList.length + 1,
      id: `cam-${Date.now()}`,
      name: newCamData.name,
      ipPort: newCamData.ipPort,
      macId: newCamData.macId,
      url: newCamData.url,
      cameraId: newCamData.cameraId || `CAM${cameraList.length + 1}`,
      password: newCamData.password,
      remark: newCamData.remark,
      slots: [],
    };
    setCameraList([...cameraList, newCam]);
    handleSelectCam(newCam);
    setIsAddModalOpen(false);
    setNewCamData({ name: '', ipPort: '192.168.1.', macId: '192.168.1.', url: 'rtsp://192.168.1.', cameraId: '', password: '', remark: '' });
    showToast(`Added new camera "${newCam.name}"`);
  };

  // Add slot to current camera
  const handleAddSlotToCam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCam) {
      showToast('Please select a camera first');
      return;
    }
    if (!newSlotData.slotId.trim()) {
      showToast('Slot ID is required');
      return;
    }
    const updatedCam = {
      ...selectedCam,
      slots: [
        ...selectedCam.slots,
        {
          slotId: newSlotData.slotId,
          bayNo: newSlotData.bayNo || newSlotData.slotId,
          vehicleType: newSlotData.vehicleType,
          status: newSlotData.status,
        },
      ],
    };
    setCameraList(prev => prev.map(c => c.id === selectedCam.id ? updatedCam : c));
    setIsAddSlotModalOpen(false);
    setNewSlotData({ slotId: '', bayNo: '', vehicleType: 'General', status: 'Available' });
    showToast(`Slot ${newSlotData.slotId} assigned to ${selectedCam.name}`);
  };

  // Delete selected slot from current camera
  const handleDeleteSelectedSlot = () => {
    if (!selectedCam || selectedSlotIndex === null) {
      showToast('Please click a slot row to select it first');
      return;
    }
    const slotToDelete = selectedCam.slots[selectedSlotIndex];
    if (confirm(`Remove slot "${slotToDelete.slotId}" from camera "${selectedCam.name}"?`)) {
      const updatedSlots = selectedCam.slots.filter((_, idx) => idx !== selectedSlotIndex);
      setCameraList(prev => prev.map(c => c.id === selectedCam.id ? { ...c, slots: updatedSlots } : c));
      setSelectedSlotIndex(null);
      showToast(`Slot "${slotToDelete.slotId}" removed`);
    }
  };

  return (
    <div className="w-full space-y-3 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Main Screenshot 2 Replication: Camera & Slot Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Centered Title */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Camera &amp; Slot Details
          </h1>
        </div>

        {/* Green Horizontal Accent Line underneath title */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Form Fields */}
        <form onSubmit={handleSaveTopForm} className="space-y-3">
          {/* Row 1: *NAME, *IP PORT, MAC ID, *URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                <span className="text-red-500 mr-0.5">*</span>NAME
              </label>
              <input
                type="text"
                placeholder="Enter CameraName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                <span className="text-red-500 mr-0.5">*</span>IP PORT
              </label>
              <input
                type="text"
                placeholder="Enter Camera IP Port"
                value={formData.ipPort}
                onChange={(e) => setFormData({ ...formData, ipPort: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                MAC ID
              </label>
              <input
                type="text"
                placeholder="Enter Camera Mac ID"
                value={formData.macId}
                onChange={(e) => setFormData({ ...formData, macId: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                <span className="text-red-500 mr-0.5">*</span>URL
              </label>
              <input
                type="text"
                placeholder="Enter Camera URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: CAMERA ID, PASSWORD, REMARK, Save Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                CAMERA ID
              </label>
              <input
                type="text"
                placeholder="Enter Camera Id"
                value={formData.cameraId}
                onChange={(e) => setFormData({ ...formData, cameraId: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter Camera Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                REMARK
              </label>
              <textarea
                rows={2}
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 resize"
              />
            </div>

            <div className="flex items-end pb-1">
              <button
                type="submit"
                className="bg-[#2b4695] hover:bg-[#243b7d] text-white font-medium text-xs px-7 py-2 rounded shadow-sm transition active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {/* Dual Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
          {/* Left Column: Connection List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Connection List
              </h3>
              <div className="flex items-center gap-1.5">
                {/* Plus icon button */}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-5 h-5 rounded-full bg-[#2b4695] hover:bg-[#243b7d] text-white flex items-center justify-center font-bold text-xs shadow-sm transition active:scale-90"
                  title="Add Connection"
                >
                  +
                </button>
                {/* Cross icon button */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedCam}
                  className="w-5 h-5 rounded-full bg-[#ef4444] hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm transition active:scale-90"
                  title="Delete Selected Connection"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#2b4695] text-white">
                    <tr>
                      <th className="py-2 px-2.5 font-semibold text-center w-14 border-r border-white/40">ROWID</th>
                      <th className="py-2 px-3 font-semibold border-r border-white/40">NAME</th>
                      <th className="py-2 px-3 font-semibold border-r border-white/40">IP PORT</th>
                      <th className="py-2 px-3 font-semibold">MAC ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {cameraList.map((cam) => {
                      const isSelected = cam.id === selectedCamId;
                      return (
                        <tr
                          key={cam.id}
                          onClick={() => handleSelectCam(cam)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#cce5ff] dark:bg-blue-900/40 text-slate-900 dark:text-white font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-800">{cam.rowId}</td>
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800">{cam.name}</td>
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 font-mono text-[11px]">{cam.ipPort}</td>
                          <td className="py-1.5 px-3 font-mono text-[11px]">{cam.macId}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Slot List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Slot List
              </h3>
              <div className="flex items-center gap-1.5">
                {/* Plus icon button */}
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(true)}
                  className="w-5 h-5 rounded-full bg-[#2b4695] hover:bg-[#243b7d] text-white flex items-center justify-center font-bold text-xs shadow-sm transition active:scale-90"
                  title="Add Slot"
                >
                  +
                </button>
                {/* Cross icon button */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedSlot}
                  className="w-5 h-5 rounded-full bg-[#ef4444] hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm transition active:scale-90"
                  title="Delete Selected Slot"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Slot Table Container */}
            <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm flex flex-col min-h-[250px]">
              <div className="bg-[#2b4695] text-white py-2 px-3 font-semibold text-xs h-8 flex items-center">
                <div className="grid grid-cols-4 w-full">
                  <span className="border-r border-white/40 px-1">SLOT ID</span>
                  <span className="border-r border-white/40 px-1">BAY NO</span>
                  <span className="border-r border-white/40 px-1">TYPE</span>
                  <span className="px-1">STATUS</span>
                </div>
              </div>

              {/* Table Body */}
              {selectedCam && selectedCam.slots.length > 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 flex-1">
                  {selectedCam.slots.map((slot, idx) => {
                    const isSelected = selectedSlotIndex === idx;
                    return (
                      <div
                        key={slot.slotId || idx}
                        onClick={() => setSelectedSlotIndex(idx)}
                        className={`grid grid-cols-4 px-3 py-2 text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-[#cce5ff] dark:bg-blue-900/40 text-slate-900 dark:text-white font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="font-mono">{slot.slotId}</span>
                        <span>{slot.bayNo}</span>
                        <span>{slot.vehicleType}</span>
                        <span className="text-emerald-600 font-medium">{slot.status}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Matches screenshot exactly: "No Rows To Show" */
                <div className="flex-1 flex items-center justify-center text-xs text-slate-600 dark:text-slate-400 font-medium min-h-[210px] bg-white dark:bg-slate-900">
                  No Rows To Show
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Connection */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add New Camera Connection</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCam} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  <span className="text-red-500">*</span> Camera Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cam101"
                  value={newCamData.name}
                  onChange={(e) => setNewCamData({ ...newCamData, name: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  <span className="text-red-500">*</span> IP Port
                </label>
                <input
                  type="text"
                  required
                  placeholder="192.168.1.101"
                  value={newCamData.ipPort}
                  onChange={(e) => setNewCamData({ ...newCamData, ipPort: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  MAC ID
                </label>
                <input
                  type="text"
                  placeholder="192.168.1.101"
                  value={newCamData.macId}
                  onChange={(e) => setNewCamData({ ...newCamData, macId: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  <span className="text-red-500">*</span> RTSP URL
                </label>
                <input
                  type="text"
                  placeholder="rtsp://192.168.1.101:554/live"
                  value={newCamData.url}
                  onChange={(e) => setNewCamData({ ...newCamData, url: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Remark
                </label>
                <textarea
                  rows={2}
                  value={newCamData.remark}
                  onChange={(e) => setNewCamData({ ...newCamData, remark: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Slot */}
      {isAddSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Add Slot to {selectedCam ? selectedCam.name : 'Camera'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSlotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlotToCam} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  <span className="text-red-500">*</span> Slot ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B1-01"
                  value={newSlotData.slotId}
                  onChange={(e) => setNewSlotData({ ...newSlotData, slotId: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Bay Name / Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bay A-1"
                  value={newSlotData.bayNo}
                  onChange={(e) => setNewSlotData({ ...newSlotData, bayNo: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Vehicle Type
                </label>
                <select
                  value={newSlotData.vehicleType}
                  onChange={(e) => setNewSlotData({ ...newSlotData, vehicleType: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Handicap">Handicap</option>
                  <option value="Women's">Women's</option>
                  <option value="EV">EV</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={newSlotData.status}
                  onChange={(e) => setNewSlotData({ ...newSlotData, status: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  Assign Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
