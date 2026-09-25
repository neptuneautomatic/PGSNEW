'use client';

import React, { useState, useEffect } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Screen, Sensor } from '@/types';
import {
  Layers,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function ScreensPage() {
  const {
    screens,
    sensors,
    activeScreenId,
    setActiveScreenId,
    activeScreen,
    addScreen,
    updateScreen,
    deleteScreen,
    addSensor,
    deleteSensor,
    connections,
    cameraDevices,
  } = usePGS();

  const [notification, setNotification] = useState<string | null>(null);

  const currentScreen = screens.find((s) => s.id === activeScreenId) || activeScreen || screens[0];
  const screenSensors = sensors.filter((s) => s.screenId === currentScreen?.id);

  // Selected sensor in the table for row highlighting & deletion
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  // Top Form State (from Screenshot 1: Screen & Sensor Details)
  const [topScreenName, setTopScreenName] = useState<string>('');
  const [picFileName, setPicFileName] = useState<string>('No file chosen');

  useEffect(() => {
    if (currentScreen) {
      setTopScreenName(currentScreen.name);
    }
  }, [currentScreen]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTopSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topScreenName.trim()) {
      showToast('Please enter a screen name.');
      return;
    }
    if (currentScreen) {
      updateScreen(currentScreen.id, { name: topScreenName });
      showToast(`Screen "${topScreenName}" saved successfully.`);
    }
  };

  // Add Screen Modal State
  const [isAddScreenModalOpen, setIsAddScreenModalOpen] = useState(false);
  const [newScreenNameInput, setNewScreenNameInput] = useState('');
  const [newScreenCapacityInput, setNewScreenCapacityInput] = useState(14);
  const [newScreenControllerInput, setNewScreenControllerInput] = useState('CAM136');

  const handleCreateScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenNameInput.trim()) return;
    addScreen({
      name: newScreenNameInput.trim(),
      capacity: Number(newScreenCapacityInput) || 14,
      dimensions: { width: 1400, height: 750 },
      controllerName: newScreenControllerInput || 'CAM136',
      description: `Zone configured for ${newScreenNameInput}`,
    });
    setIsAddScreenModalOpen(false);
    setNewScreenNameInput('');
    showToast(`New screen "${newScreenNameInput}" added.`);
  };

  const handleDeleteCurrentScreen = () => {
    if (!currentScreen) return;
    if (screens.length <= 1) {
      alert('Cannot delete the last remaining screen.');
      return;
    }
    if (confirm(`Are you sure you want to delete screen "${currentScreen.name}"? All associated sensors will be removed.`)) {
      deleteScreen(currentScreen.id);
      showToast(`Screen "${currentScreen.name}" deleted.`);
    }
  };

  // SCREEN DETAILS Modal Popup State (Screenshot 2)
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    screenName: '',
    connectionName: 'PLEASE SELECT',
    controllerId: '1',
    screenPosition: 'PLEASE SELECT',
    freeze: 'PLEASE SELECT',
    freezeValue: '',
    left: '600',
    gap: '15',
    sensorTop: '200',
    customSensorName: '',
  });

  const handleOpenSensorModal = () => {
    setModalForm({
      screenName: currentScreen?.name || 'Lane1',
      connectionName: 'CAM136',
      controllerId: '1',
      screenPosition: 'Lane 1',
      freeze: 'NO',
      freezeValue: '',
      left: '600',
      gap: '15',
      sensorTop: '200',
      customSensorName: '',
    });
    setIsSensorModalOpen(true);
  };

  const handleSaveSensorFromModal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentScreen) {
      alert('Please select or create a screen first.');
      return;
    }

    const nextNumber = screenSensors.length + 1;
    const generatedName = modalForm.customSensorName.trim()
      ? modalForm.customSensorName.trim()
      : `B${modalForm.controllerId || '1'}_${nextNumber}`;

    const xVal = Number(modalForm.left) || 600;
    const yVal = Number(modalForm.sensorTop) || 200;
    const gapVal = Number(modalForm.gap) || 15;

    addSensor({
      screenId: currentScreen.id,
      sensorNum: nextNumber,
      sensorName: generatedName,
      x: xVal,
      y: yVal,
      gap: gapVal,
      status: 0,
      controllerId: modalForm.controllerId || '1',
      controllerType: 'PP3216R_TCP',
      ipPort: '192.168.1.210:4001',
      connectionName: modalForm.connectionName === 'PLEASE SELECT' ? 'CAM136' : modalForm.connectionName,
      screenPosition: modalForm.screenPosition === 'PLEASE SELECT' ? 'Lane 1' : modalForm.screenPosition,
      freeze: modalForm.freeze === 'PLEASE SELECT' ? 'NO' : modalForm.freeze,
      freezeValue: modalForm.freezeValue,
      reservedType: 'General',
      ledColor: 'GREEN',
    });

    setIsSensorModalOpen(false);
    showToast(`Sensor "${generatedName}" added to ${currentScreen.name}.`);
  };

  const handleDeleteSelectedSensor = () => {
    if (!selectedSensorId) {
      alert('Please click on a sensor row in the table first to select it for deletion.');
      return;
    }
    const target = sensors.find((s) => s.id === selectedSensorId);
    if (target && confirm(`Delete sensor "${target.sensorName}" from ${currentScreen?.name}?`)) {
      deleteSensor(selectedSensorId);
      setSelectedSensorId(null);
      showToast(`Sensor "${target.sensorName}" deleted.`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded shadow-lg bg-emerald-600 text-white text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Title Header with Green Underline */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Screen & Sensor Details
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form */}
        <form onSubmit={handleTopSave} className="flex flex-wrap items-center gap-4 sm:gap-6 pb-2">
          {/* SCREEN NAME */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <span className="text-red-500 font-bold mr-1">*</span>SCREEN NAME
            </label>
            <input
              type="text"
              value={topScreenName}
              onChange={(e) => setTopScreenName(e.target.value)}
              placeholder="Lane1"
              className="px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 w-44 sm:w-56 shadow-sm font-medium"
            />
          </div>

          {/* PIC UPLOAD */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <span className="text-red-500 font-bold mr-1">*</span>PIC UPLOAD
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPicFileName(e.target.files[0].name);
                      showToast(`Image selected: ${e.target.files[0].name}`);
                    }
                  }}
                />
              </label>
              <span className="text-xs text-slate-500 truncate max-w-[160px]">{picFileName}</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
          >
            Save
          </button>
        </form>

        {/* Side-by-Side Tables: Screen List & Screen & Sensor List Count */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
          {/* Left Column: Screen List (4 cols) */}
          <div className="md:col-span-4 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
            {/* Header with Circular (+) and (X) Action Buttons */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Screen List
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAddScreenModalOpen(true)}
                  title="Add New Screen"
                  className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={handleDeleteCurrentScreen}
                  title="Delete Current Screen"
                  className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Screen List Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#4a72b8] text-white font-semibold">
                    <th className="py-2.5 px-4">SCREEN NAME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {screens.map((screen) => {
                    const isSelected = currentScreen?.id === screen.id;
                    return (
                      <tr
                        key={screen.id}
                        onClick={() => {
                          setActiveScreenId(screen.id);
                          setSelectedSensorId(null);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#cde4fd] text-slate-900 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-4 flex items-center justify-between">
                          <span>{screen.name}</span>
                          {isSelected && (
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Screen & Sensor List Count (8 cols) */}
          <div className="md:col-span-8 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
            {/* Header with dynamic sensor count and Circular (+) and (X) Buttons */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Screen & Sensor List Count: <span className="text-blue-500 font-mono font-bold">{screenSensors.length}</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenSensorModal}
                  title="Add Sensor (Opens SCREEN DETAILS Popup)"
                  className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={handleDeleteSelectedSensor}
                  title="Delete Selected Sensor"
                  className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Sensor Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[550px] text-xs">
                <thead>
                  <tr className="bg-[#4a72b8] text-white font-semibold">
                    <th className="py-2.5 px-3 border-r border-white/40">SCREEN NAME</th>
                    <th className="py-2.5 px-3 border-r border-white/40">CTRL ID</th>
                    <th className="py-2.5 px-3 border-r border-white/40">SENSOR NAME</th>
                    <th className="py-2.5 px-3 border-r border-white/40">SENSOR LEFT</th>
                    <th className="py-2.5 px-3 border-r border-white/40">SENSOR TOP</th>
                    <th className="py-2.5 px-3">CONNECTION NAME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {screenSensors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No sensors mapped to {currentScreen?.name}. Click the blue (+) button above to add one.
                      </td>
                    </tr>
                  ) : (
                    screenSensors.map((sensor) => {
                      const isSelected = selectedSensorId === sensor.id;
                      return (
                        <tr
                          key={sensor.id}
                          onClick={() => setSelectedSensorId(sensor.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800 font-medium">
                            {currentScreen?.name}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800 font-mono">
                            {sensor.controllerId || '1'}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800 font-semibold text-blue-600 dark:text-blue-400">
                            {sensor.sensorName}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800 font-mono">
                            {Math.round(sensor.x)}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800 font-mono">
                            {Math.round(sensor.y)}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {sensor.connectionName || sensor.controllerName || 'CAM136'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>
                {selectedSensorId
                  ? `Selected: ${sensors.find((s) => s.id === selectedSensorId)?.sensorName}`
                  : 'Click a row to select for deletion'}
              </span>
              <span>Active Screen: <strong>{currentScreen?.name}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL POPUP: SCREEN DETAILS (MATCHING SCREENSHOT 2)                  */}
      {/* ===================================================================== */}
      {isSensorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl rounded-sm w-full max-w-2xl overflow-hidden">
            {/* Modal Header: Solid Blue Bar with square red close button */}
            <div className="bg-blue-600 px-5 py-3 flex items-center justify-between text-white">
              <h3 className="font-bold text-base tracking-wide uppercase">SCREEN DETAILS</h3>
              <button
                type="button"
                onClick={() => setIsSensorModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 text-sm transition-colors rounded-none"
              >
                X
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveSensorFromModal} className="p-6 space-y-4">
              {/* Row 1: SCREEN NAME | CONNECTION NAME | CONTROLLER ID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    SCREEN NAME
                  </label>
                  <input
                    type="text"
                    value={modalForm.screenName}
                    onChange={(e) => setModalForm({ ...modalForm, screenName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    CONNECTION NAME
                  </label>
                  <select
                    value={modalForm.connectionName}
                    onChange={(e) => setModalForm({ ...modalForm, connectionName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PLEASE SELECT">PLEASE SELECT</option>
                    <option value="CAM136">CAM136</option>
                    <option value="CAM137">CAM137</option>
                    {connections.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    {cameraDevices.map((cam) => (
                      <option key={cam.id} value={cam.name}>
                        {cam.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    CONTROLLER ID
                  </label>
                  <input
                    type="text"
                    value={modalForm.controllerId}
                    onChange={(e) => setModalForm({ ...modalForm, controllerId: e.target.value })}
                    placeholder="1"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: SCREEN POSITION | FREEZE | FREEZE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    SCREEN POSITION
                  </label>
                  <select
                    value={modalForm.screenPosition}
                    onChange={(e) => setModalForm({ ...modalForm, screenPosition: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PLEASE SELECT">PLEASE SELECT</option>
                    <option value="Lane 1">Lane 1</option>
                    <option value="Lane 2">Lane 2</option>
                    <option value="Lane 3">Lane 3</option>
                    <option value="Lane 4">Lane 4</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    FREEZE
                  </label>
                  <select
                    value={modalForm.freeze}
                    onChange={(e) => setModalForm({ ...modalForm, freeze: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PLEASE SELECT">PLEASE SELECT</option>
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                    <option value="ENABLE">ENABLE</option>
                    <option value="DISABLE">DISABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    FREEZE
                  </label>
                  <input
                    type="text"
                    value={modalForm.freezeValue}
                    onChange={(e) => setModalForm({ ...modalForm, freezeValue: e.target.value })}
                    placeholder=""
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: LEFT | GAP | SAVE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    LEFT
                  </label>
                  <input
                    type="number"
                    value={modalForm.left}
                    onChange={(e) => setModalForm({ ...modalForm, left: e.target.value })}
                    placeholder="613"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    GAP
                  </label>
                  <input
                    type="number"
                    value={modalForm.gap}
                    onChange={(e) => setModalForm({ ...modalForm, gap: e.target.value })}
                    placeholder="15"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleSaveSensorFromModal()}
                    className="w-full sm:w-auto px-6 py-2 text-xs font-semibold rounded-sm bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* Coordinate helpers */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <label className="block text-[11px] font-medium opacity-70 mb-1">
                    SENSOR TOP (Y coordinate)
                  </label>
                  <input
                    type="number"
                    value={modalForm.sensorTop}
                    onChange={(e) => setModalForm({ ...modalForm, sensorTop: e.target.value })}
                    placeholder="214"
                    className="w-full px-3 py-1 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium opacity-70 mb-1">
                    CUSTOM SENSOR NAME (Optional)
                  </label>
                  <input
                    type="text"
                    value={modalForm.customSensorName}
                    onChange={(e) => setModalForm({ ...modalForm, customSensorName: e.target.value })}
                    placeholder="e.g. B4_2"
                    className="w-full px-3 py-1 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Modal Footer with Close & SAVE buttons matching Screenshot 2 */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSensorModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold rounded-sm bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-950/40 dark:text-red-300 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold rounded-sm bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD NEW SCREEN                                                 */}
      {/* ===================================================================== */}
      {isAddScreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl rounded-sm w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-5 py-3 flex items-center justify-between text-white">
              <h3 className="font-bold text-base uppercase">ADD NEW SCREEN</h3>
              <button
                type="button"
                onClick={() => setIsAddScreenModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 text-sm transition-colors rounded-none"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreateScreen} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Screen Name *
                </label>
                <input
                  type="text"
                  required
                  value={newScreenNameInput}
                  onChange={(e) => setNewScreenNameInput(e.target.value)}
                  placeholder="e.g. Lane 2"
                  className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Slot Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newScreenCapacityInput}
                    onChange={(e) => setNewScreenCapacityInput(Number(e.target.value) || 14)}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Controller Name
                  </label>
                  <input
                    type="text"
                    value={newScreenControllerInput}
                    onChange={(e) => setNewScreenControllerInput(e.target.value)}
                    placeholder="CAM137"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddScreenModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-semibold rounded-sm bg-blue-600 hover:bg-blue-700 text-white shadow"
                >
                  Save Screen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
