'use client';

import React, { useState, useEffect } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Display, Sensor, ArrowDirection } from '@/types';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  Trash2, 
  Tv, 
  Eye, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown, 
  ArrowLeft,
  Search,
  Check
} from 'lucide-react';

export default function DisplaysPage() {
  const { 
    displays, 
    screens, 
    sensors, 
    displayModels,
    addDisplay, 
    updateDisplay, 
    deleteDisplay 
  } = usePGS();

  // Selected Display for Master-Detail view
  const [selectedDisplayId, setSelectedDisplayId] = useState<string>(
    displays[0]?.id || 'disp-zone-1'
  );

  // Selected Sensor row in the right table (for removal)
  const [selectedSensorRowId, setSelectedSensorRowId] = useState<string | null>(null);

  // Top Form inline edit state
  const [formData, setFormData] = useState<{
    name: string;
    ipPort: string;
    screen: string;
    displayModel: string;
    displayId: string;
    leftPos: string;
    rightPos: string;
    arrowDirection: ArrowDirection;
  }>({
    name: 'Zone_Display',
    ipPort: '192.168.1.11',
    screen: 'Lane1',
    displayModel: 'Direction Display',
    displayId: '11',
    leftPos: '600',
    rightPos: '800',
    arrowDirection: 'BOTTOM',
  });

  // Modal States
  const [isAddDisplayModalOpen, setIsAddDisplayModalOpen] = useState(false);
  const [isAssignSensorModalOpen, setIsAssignSensorModalOpen] = useState(false);
  const [selectedSensorsToAssign, setSelectedSensorsToAssign] = useState<string[]>([]);
  const [sensorSearchQuery, setSensorSearchQuery] = useState('');
  const [showEmulation, setShowEmulation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal new display form
  const [newDisplayForm, setNewDisplayForm] = useState({
    name: '',
    ipPort: '192.168.1.',
    screen: screens[0]?.name || '',
    displayModel: displayModels[0]?.displayModel || 'Direction Display',
    displayId: String(displays.length + 1),
    leftPos: '0',
    rightPos: '0',
    arrowDirection: 'BOTTOM' as ArrowDirection,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find currently selected display
  const currentDisplay = displays.find(d => d.id === selectedDisplayId) || displays[0];

  // Sync form when selected display changes
  useEffect(() => {
    if (currentDisplay) {
      setFormData({
        name: currentDisplay.displayName,
        ipPort: currentDisplay.ipPort,
        screen: currentDisplay.screenName || '',
        displayModel: currentDisplay.displayModel || '',
        displayId: currentDisplay.displayId || '',
        leftPos: String(currentDisplay.leftPos ?? '600'),
        rightPos: String(currentDisplay.rightPos ?? '800'),
        arrowDirection: currentDisplay.arrowDirection || 'BOTTOM',
      });
      setSelectedSensorRowId(null);
    }
  }, [selectedDisplayId, currentDisplay]);

  // Retrieve sensors assigned to the selected display
  const assignedSensorsList: Sensor[] = (currentDisplay?.assignedSensors || [])
    .map(sId => sensors.find(s => s.id === sId))
    .filter((s): s is Sensor => Boolean(s));

  // Compute live telemetry for right table title
  const capacity = assignedSensorsList.length;
  const occupied = assignedSensorsList.filter(s => s.status === 1).length;
  const available = Math.max(0, capacity - occupied);

  // Handle row selection on left table
  const handleSelectDisplay = (disp: Display) => {
    setSelectedDisplayId(disp.id);
  };

  // Handle Top Form Save
  const handleSaveTopForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a display Name');
      return;
    }

    if (currentDisplay) {
      updateDisplay(currentDisplay.id, {
        displayName: formData.name,
        ipPort: formData.ipPort,
        screenName: formData.screen,
        displayModel: formData.displayModel,
        displayId: formData.displayId,
        leftPos: formData.leftPos,
        rightPos: formData.rightPos,
        arrowDirection: formData.arrowDirection,
      });
      showToast(`Display "${formData.name}" updated successfully`);
    } else {
      // If no display selected, add new
      addDisplay({
        displayName: formData.name,
        ipPort: formData.ipPort,
        screenName: formData.screen || screens[0]?.name || 'Lane1',
        displayModel: formData.displayModel || 'Direction Display',
        displayId: formData.displayId || '1',
        lineNo: 1,
        assignedSensors: [],
        arrowDirection: formData.arrowDirection,
        status: 'Online',
        leftPos: formData.leftPos,
        rightPos: formData.rightPos,
      });
      showToast(`New Display "${formData.name}" created`);
    }
  };

  // Handle Delete Display
  const handleDeleteDisplay = () => {
    if (!currentDisplay) return;
    if (confirm(`Are you sure you want to delete display "${currentDisplay.displayName}"?`)) {
      const deletedName = currentDisplay.displayName;
      deleteDisplay(currentDisplay.id);
      const remaining = displays.filter(d => d.id !== currentDisplay.id);
      if (remaining.length > 0) {
        setSelectedDisplayId(remaining[0].id);
      }
      showToast(`Display "${deletedName}" deleted`);
    }
  };

  // Handle Add Display Modal Submit
  const handleCreateNewDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayForm.name.trim()) return;

    addDisplay({
      displayName: newDisplayForm.name,
      ipPort: newDisplayForm.ipPort,
      screenName: newDisplayForm.screen || screens[0]?.name || 'Lane1',
      displayModel: newDisplayForm.displayModel || 'Direction Display',
      displayId: newDisplayForm.displayId || '1',
      lineNo: 1,
      assignedSensors: [],
      arrowDirection: newDisplayForm.arrowDirection,
      status: 'Online',
      leftPos: newDisplayForm.leftPos,
      rightPos: newDisplayForm.rightPos,
    });

    setIsAddDisplayModalOpen(false);
    showToast(`Display "${newDisplayForm.name}" created`);
  };

  // Handle Unbinding/Removing Sensor from current display
  const handleRemoveSensor = () => {
    if (!currentDisplay || !selectedSensorRowId) {
      showToast('Select a sensor row in the table to remove');
      return;
    }

    const updatedSensors = currentDisplay.assignedSensors.filter(id => id !== selectedSensorRowId);
    updateDisplay(currentDisplay.id, {
      assignedSensors: updatedSensors,
    });
    setSelectedSensorRowId(null);
    showToast('Sensor removed from display');
  };

  // Handle Assigning Sensors from Modal
  const handleAssignSensorsSubmit = () => {
    if (!currentDisplay) return;
    const currentSet = new Set(currentDisplay.assignedSensors || []);
    selectedSensorsToAssign.forEach(id => currentSet.add(id));

    updateDisplay(currentDisplay.id, {
      assignedSensors: Array.from(currentSet),
    });
    setIsAssignSensorModalOpen(false);
    setSelectedSensorsToAssign([]);
    showToast('Sensors assigned successfully');
  };

  // Toggle selection in assign modal
  const toggleSensorSelection = (sId: string) => {
    setSelectedSensorsToAssign(prev => 
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
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
            Display & Sensor List
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleSaveTopForm} className="space-y-4 pb-2">
          {/* Row 1: NAME, IP PORT, SCREEN, DISPLAY MODAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* IP PORT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>IP PORT
              </label>
              <input
                type="text"
                placeholder="192.168.1.11"
                value={formData.ipPort}
                onChange={(e) => setFormData({ ...formData, ipPort: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm font-mono"
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
                {screens.map((scr) => (
                  <option key={scr.id} value={scr.name}>
                    {scr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DISPLAY MODAL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY MODAL
              </label>
              <select
                value={formData.displayModel}
                onChange={(e) => setFormData({ ...formData, displayModel: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="">PLEASE SELECT</option>
                {displayModels.map((dm) => (
                  <option key={dm.id} value={dm.displayModel}>
                    {dm.displayModel}
                  </option>
                ))}
                {/* Fallback standard models */}
                <option value="Direction Display">Direction Display</option>
                <option value="PP3216R_COLOR">PP3216R_COLOR</option>
              </select>
            </div>
          </div>

          {/* Row 2: DISPLAY ID, LEFT POS, RIGHT POS, SELECT (Direction Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {/* DISPLAY ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY ID
              </label>
              <input
                type="text"
                placeholder="Display Id"
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
                placeholder="Left Pos"
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
                placeholder="Right Pos"
                value={formData.rightPos}
                onChange={(e) => setFormData({ ...formData, rightPos: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* SELECT (Arrow Direction Buttons) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                SELECT
              </label>
              <div className="flex items-center gap-1.5">
                {/* Right Arrow */}
                <button
                  type="button"
                  title="Arrow Right"
                  onClick={() => setFormData({ ...formData, arrowDirection: 'RIGHT' })}
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-black rounded flex items-center justify-center transition-all ${
                    formData.arrowDirection === 'RIGHT'
                      ? 'border-2 border-red-600 ring-1 ring-red-500'
                      : 'border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 text-[#00e676] stroke-[3.5]" />
                </button>

                {/* Left Arrow */}
                <button
                  type="button"
                  title="Arrow Left"
                  onClick={() => setFormData({ ...formData, arrowDirection: 'LEFT' })}
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-black rounded flex items-center justify-center transition-all ${
                    formData.arrowDirection === 'LEFT'
                      ? 'border-2 border-red-600 ring-1 ring-red-500'
                      : 'border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 text-[#00e676] stroke-[3.5]" />
                </button>

                {/* Down Arrow */}
                <button
                  type="button"
                  title="Arrow Down"
                  onClick={() => setFormData({ ...formData, arrowDirection: 'BOTTOM' })}
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-black rounded flex items-center justify-center transition-all ${
                    formData.arrowDirection === 'BOTTOM'
                      ? 'border-2 border-red-600 ring-1 ring-red-500'
                      : 'border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <ArrowDown className="w-5 h-5 text-[#00e676] stroke-[3.5]" />
                </button>

                {/* Up Arrow */}
                <button
                  type="button"
                  title="Arrow Up"
                  onClick={() => setFormData({ ...formData, arrowDirection: 'TOP' })}
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-black rounded flex items-center justify-center transition-all ${
                    formData.arrowDirection === 'TOP'
                      ? 'border-2 border-red-600 ring-1 ring-red-500'
                      : 'border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <ArrowUp className="w-5 h-5 text-[#00e676] stroke-[3.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Action Buttons (Save Button on the right) */}
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
          
          {/* Left Column: Display List (~30% / 4 of 12 cols) */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
            <div>
              {/* Header with Title and Add/Delete Icons */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Display List
                </h2>
                <div className="flex items-center gap-1.5">
                  {/* Plus button (Blue Circle) */}
                  <button
                    type="button"
                    title="Add Display"
                    onClick={() => {
                      setNewDisplayForm({
                        name: `Display_${displays.length + 1}`,
                        ipPort: `192.168.1.${12 + displays.length}`,
                        screen: screens[0]?.name || 'Lane1',
                        displayModel: 'Direction Display',
                        displayId: String(displays.length + 1),
                        leftPos: '600',
                        rightPos: '800',
                        arrowDirection: 'BOTTOM',
                      });
                      setIsAddDisplayModalOpen(true);
                    }}
                    className="w-6 h-6 bg-[#2b4695] hover:bg-[#243b7d] text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Cancel/Delete button (Red Circle with X) */}
                  <button
                    type="button"
                    title="Delete Selected Display"
                    onClick={handleDeleteDisplay}
                    className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Display List Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#2b4695] text-white font-semibold">
                      <th className="py-2.5 px-3 border-r border-white/40">Display Name</th>
                      <th className="py-2.5 px-3 border-r border-white/40">IP Port</th>
                      <th className="py-2.5 px-3">Display Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displays.map((disp) => {
                      const isSelected = disp.id === selectedDisplayId;
                      return (
                        <tr
                          key={disp.id}
                          onClick={() => handleSelectDisplay(disp)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3 truncate max-w-[120px]" title={disp.displayName}>
                            {disp.displayName}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] truncate max-w-[110px]" title={disp.ipPort}>
                            {disp.ipPort}
                          </td>
                          <td className="py-2 px-3 font-mono text-center">
                            {disp.displayId}
                          </td>
                        </tr>
                      );
                    })}
                    {displays.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-400 text-xs">
                          No displays available. Click (+) to add.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Status Footer */}
            <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Total Displays: {displays.length}</span>
              {currentDisplay && (
                <span className="truncate max-w-[160px]">Selected: <strong>{currentDisplay.displayName}</strong></span>
              )}
            </div>
          </div>

          {/* Right Column: Display & Sensor List (~70% / 8 of 12 cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between">
            <div>
              {/* Header with Dynamic Telemetry and Add/Remove Icons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  Display & Sensor List Capacity: {capacity} Occupied: {occupied} Available: {available}
                </h2>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Plus button (Blue Circle) */}
                  <button
                    type="button"
                    title="Assign Sensor to this Display"
                    onClick={() => {
                      if (!currentDisplay) {
                        showToast('Please select a display first');
                        return;
                      }
                      setSelectedSensorsToAssign([]);
                      setIsAssignSensorModalOpen(true);
                    }}
                    className="w-6 h-6 bg-[#2b4695] hover:bg-[#243b7d] text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Cancel/Remove button (Red Circle with X) */}
                  <button
                    type="button"
                    title="Remove Selected Sensor from Display"
                    onClick={handleRemoveSensor}
                    className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Display & Sensor List Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm">
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
                              ? 'bg-[#cde4fd] text-slate-900 font-medium'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-4 font-medium">
                            {currentDisplay?.displayName || 'Zone_Display'}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {sensor.sensorName}
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            {sensor.sensorNum}
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                sensor.status === 1
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
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
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                          No sensors mapped to {currentDisplay?.displayName || 'this display'}.
                          <br />
                          Click the blue <span className="font-bold text-blue-600">(+)</span> button above to assign sensors.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hint & Emulation Toggle */}
            <div className="pt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="text-[11px]">
                {selectedSensorRowId ? (
                  <span className="text-blue-600 dark:text-blue-400">
                    Selected sensor ready to remove. Click red (X) to unbind.
                  </span>
                ) : (
                  'Click on any sensor row to select it, or (+) to bind new sensors.'
                )}
              </span>

              <button
                type="button"
                onClick={() => setShowEmulation(!showEmulation)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showEmulation ? 'Hide LED Preview' : 'Show LED Preview'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Hardware LED Emulation Preview */}
      {showEmulation && currentDisplay && (
        <div className="bg-slate-950 text-white p-5 rounded-lg border border-slate-800 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-wide">
                Hardware LED Display Emulation: {currentDisplay.displayName}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Target Screen: {currentDisplay.screenName} | IP: {currentDisplay.ipPort}
            </span>
          </div>

          <div className="bg-black p-5 rounded-lg border-4 border-slate-800 flex items-center justify-between">
            {/* Direction Arrow Tile */}
            <div className="w-16 h-16 bg-slate-900 rounded border border-slate-800 flex items-center justify-center">
              {formData.arrowDirection === 'TOP' && <ArrowUp className="w-8 h-8 text-emerald-400 stroke-[3.5] animate-pulse" />}
              {formData.arrowDirection === 'BOTTOM' && <ArrowDown className="w-8 h-8 text-emerald-400 stroke-[3.5] animate-pulse" />}
              {formData.arrowDirection === 'LEFT' && <ArrowLeft className="w-8 h-8 text-emerald-400 stroke-[3.5] animate-pulse" />}
              {formData.arrowDirection === 'RIGHT' && <ArrowRight className="w-8 h-8 text-emerald-400 stroke-[3.5] animate-pulse" />}
            </div>

            {/* Dot-Matrix Space Counter */}
            <div className="text-right">
              {available <= 0 ? (
                <div className="font-mono text-3xl font-black text-rose-500 tracking-widest animate-pulse [text-shadow:0_0_12px_rgba(244,63,94,0.8)]">
                  FULL
                </div>
              ) : (
                <div className="font-mono text-4xl font-black text-emerald-400 tracking-wider [text-shadow:0_0_16px_rgba(16,185,129,0.8)]">
                  {available}
                </div>
              )}
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">
                AVAILABLE SPACES
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Display */}
      {isAddDisplayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add New Display
              </h3>
              <button
                onClick={() => setIsAddDisplayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDisplay} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  * NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zone_Display_North"
                  value={newDisplayForm.name}
                  onChange={(e) => setNewDisplayForm({ ...newDisplayForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * IP PORT
                  </label>
                  <input
                    type="text"
                    required
                    value={newDisplayForm.ipPort}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, ipPort: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * DISPLAY ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newDisplayForm.displayId}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, displayId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * SCREEN
                  </label>
                  <select
                    value={newDisplayForm.screen}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, screen: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  >
                    {screens.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * DISPLAY MODAL
                  </label>
                  <select
                    value={newDisplayForm.displayModel}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, displayModel: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  >
                    {displayModels.map(dm => (
                      <option key={dm.id} value={dm.displayModel}>{dm.displayModel}</option>
                    ))}
                    <option value="Direction Display">Direction Display</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * LEFT POS
                  </label>
                  <input
                    type="text"
                    value={newDisplayForm.leftPos}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, leftPos: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    * RIGHT POS
                  </label>
                  <input
                    type="text"
                    value={newDisplayForm.rightPos}
                    onChange={(e) => setNewDisplayForm({ ...newDisplayForm, rightPos: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ARROW DIRECTION
                </label>
                <div className="flex gap-2">
                  {(['RIGHT', 'LEFT', 'BOTTOM', 'TOP'] as ArrowDirection[]).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setNewDisplayForm({ ...newDisplayForm, arrowDirection: dir })}
                      className={`flex-1 py-1.5 px-2 bg-black rounded text-center flex items-center justify-center ${
                        newDisplayForm.arrowDirection === dir ? 'border-2 border-red-600 ring-1 ring-red-500' : 'border border-slate-800'
                      }`}
                    >
                      {dir === 'RIGHT' && <ArrowRight className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      {dir === 'LEFT' && <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      {dir === 'BOTTOM' && <ArrowDown className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      {dir === 'TOP' && <ArrowUp className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddDisplayModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#2b4695] hover:bg-[#23397d] text-white rounded font-medium shadow-sm"
                >
                  Create Display
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Sensors to Display */}
      {isAssignSensorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Assign Sensors to {currentDisplay?.displayName}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select available sensors to attach to this display board
                </p>
              </div>
              <button
                onClick={() => setIsAssignSensorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter inside modal */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter sensors by name, screen or slot..."
                  value={sensorSearchQuery}
                  onChange={(e) => setSensorSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sensors list */}
            <div className="p-4 overflow-y-auto space-y-1.5 flex-1 text-xs">
              {sensors
                .filter(s => {
                  const query = sensorSearchQuery.toLowerCase();
                  return (
                    s.sensorName.toLowerCase().includes(query) ||
                    String(s.sensorNum).includes(query) ||
                    s.screenId.toLowerCase().includes(query)
                  );
                })
                .map((sensor) => {
                  const isAlreadyAssigned = currentDisplay?.assignedSensors?.includes(sensor.id);
                  const isSelected = selectedSensorsToAssign.includes(sensor.id);

                  return (
                    <div
                      key={sensor.id}
                      onClick={() => {
                        if (!isAlreadyAssigned) toggleSensorSelection(sensor.id);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                        isAlreadyAssigned
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-950 dark:text-blue-200 cursor-pointer'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          disabled={isAlreadyAssigned}
                          checked={isAlreadyAssigned || isSelected}
                          onChange={() => {}}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {sensor.sensorName}
                          </span>
                          <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            (Sensor ID: {sensor.sensorNum})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sensor.status === 1
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}
                        >
                          Status {sensor.status} ({sensor.status === 1 ? 'Occupied' : 'Available'})
                        </span>
                        {isAlreadyAssigned && (
                          <span className="text-[10px] text-slate-400 italic">
                            Already assigned
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500">
                Selected: <strong>{selectedSensorsToAssign.length}</strong> new sensors
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignSensorModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedSensorsToAssign.length === 0}
                  onClick={handleAssignSensorsSubmit}
                  className="px-5 py-1.5 bg-[#2b4695] hover:bg-[#23397d] disabled:opacity-50 text-white rounded font-medium shadow-sm"
                >
                  Assign to Display
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
