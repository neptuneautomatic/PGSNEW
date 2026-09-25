'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { Plus, X, CheckCircle2 } from 'lucide-react';

export default function DisplayModelManager() {
  const { displayModels, addDisplayModel, deleteDisplayModel } = usePGS();
  const [notification, setNotification] = useState<string | null>(null);

  const colorOptions = [
    'Please Select',
    'Green',
    'Red',
    'Amber',
    'Yellow',
    'Blue',
    'White',
    'RGB Multi',
    'Cyan',
    'Purple',
  ];

  // Options matching exactly the second screenshot:
  const selectMacroOptions = [
    'Please Select',
    'Occupied',
    'Capacity',
    'Available',
    'Available_Total',
    'Capacity_Total',
    'Occupied_Total',
  ];

  // Top Form inline state for Display Model
  const [displayModelInput, setDisplayModelInput] = useState('Direction Display');
  const [colorInput, setColorInput] = useState('Green');
  const [remarksInput, setRemarksInput] = useState('Direction Display');
  const [displayProgramInput, setDisplayProgramInput] = useState('|UDB(ID}D9G0000{Left}{Available}~<CR><LF>');
  const [selectMacroInput, setSelectMacroInput] = useState('Please Select');

  // Selected Display Model row in table for deletion
  const [selectedDisplayModelId, setSelectedDisplayModelId] = useState<string | null>(null);

  // Modal State for DISPLAY & DISPLAY MODAL popup
  const [isDisplayModelModalOpen, setIsDisplayModelModalOpen] = useState(false);
  const [modalDisplayModelForm, setModalDisplayModelForm] = useState({
    displayModel: '',
    color: 'Please Select',
    remarks: '',
    displayProgram: '',
    selectMacro: 'Please Select',
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleMacroSelect = (macro: string, isModal = false) => {
    if (macro === 'Please Select') return;
    if (isModal) {
      setModalDisplayModelForm((prev) => ({
        ...prev,
        selectMacro: macro,
        displayProgram: prev.displayProgram
          ? `${prev.displayProgram}{${macro}}`
          : `|UDB(ID}D9G0000{Left}{${macro}}~<CR><LF>`,
      }));
    } else {
      setSelectMacroInput(macro);
      setDisplayProgramInput((prev) =>
        prev ? `${prev}{${macro}}` : `|UDB(ID}D9G0000{Left}{${macro}}~<CR><LF>`
      );
    }
  };

  const handleOpenDisplayModelModal = () => {
    setModalDisplayModelForm({
      displayModel: displayModelInput || 'Direction Display',
      color: colorInput || 'Green',
      remarks: remarksInput || 'Direction Display',
      displayProgram: displayProgramInput || '|UDB(ID}D9G0000{Left}{Available}~<CR><LF>',
      selectMacro: 'Please Select',
    });
    setIsDisplayModelModalOpen(true);
  };

  const handleSaveDisplayModel = (e?: React.FormEvent, fromModal = false) => {
    if (e) e.preventDefault();
    const modelName = fromModal ? modalDisplayModelForm.displayModel : displayModelInput;
    const color = fromModal ? modalDisplayModelForm.color : colorInput;
    const remarks = fromModal ? modalDisplayModelForm.remarks : remarksInput;
    const program = fromModal ? modalDisplayModelForm.displayProgram : displayProgramInput;

    if (!modelName.trim()) {
      showToast('Please enter Display Model.');
      return;
    }
    if (!color || color === 'Please Select') {
      showToast('Please select a Color.');
      return;
    }
    if (!remarks.trim()) {
      showToast('Please enter Remarks.');
      return;
    }
    if (!program.trim()) {
      showToast('Please enter Display Program.');
      return;
    }

    addDisplayModel({
      displayModel: modelName.trim(),
      color,
      remarks: remarks.trim(),
      displayProgram: program.trim(),
    });

    if (fromModal) {
      setIsDisplayModelModalOpen(false);
    } else {
      setDisplayModelInput('');
      setColorInput('Please Select');
      setRemarksInput('');
      setDisplayProgramInput('');
      setSelectMacroInput('Please Select');
    }

    showToast(`Display Model "${modelName}" saved successfully.`);
  };

  const handleDeleteDisplayModel = () => {
    if (!selectedDisplayModelId) {
      alert('Please click on a Display Model row in the table first to select it for deletion.');
      return;
    }
    const target = displayModels.find((d) => d.id === selectedDisplayModelId);
    if (target && confirm(`Are you sure you want to delete Display Model "${target.displayModel}"?`)) {
      deleteDisplayModel(selectedDisplayModelId);
      setSelectedDisplayModelId(null);
      showToast(`Display Model "${target.displayModel}" deleted.`);
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
        {/* Centered Header with Green Underline */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Display & Display Model
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Top Form Fields */}
        <form onSubmit={(e) => handleSaveDisplayModel(e, false)} className="space-y-3 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* 1. DISPLAY MODEL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 whitespace-nowrap">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY MODEL
              </label>
              <input
                type="text"
                required
                value={displayModelInput}
                onChange={(e) => setDisplayModelInput(e.target.value)}
                placeholder="Direction Display"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* 2. COLOR (Multiple Options) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 whitespace-nowrap">
                <span className="text-red-500 font-bold mr-1">*</span>COLOR
              </label>
              <select
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                {colorOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. REMARKS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 whitespace-nowrap">
                <span className="text-red-500 font-bold mr-1">*</span>REMARKS
              </label>
              <input
                type="text"
                required
                value={remarksInput}
                onChange={(e) => setRemarksInput(e.target.value)}
                placeholder="Direction Display"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* 4. DISPLAY PROGRAM */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 whitespace-nowrap">
                <span className="text-red-500 font-bold mr-1">*</span>DISPLAY PROGRAM
              </label>
              <input
                type="text"
                required
                value={displayProgramInput}
                onChange={(e) => setDisplayProgramInput(e.target.value)}
                placeholder="|UDB(ID}D9G0000{Left}{Available}~<CR><LF>"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono shadow-sm"
              />
            </div>

            {/* 5. SELECT (Options from Screenshot 2) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 whitespace-nowrap">
                SELECT
              </label>
              <select
                value={selectMacroInput}
                onChange={(e) => handleMacroSelect(e.target.value, false)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                {selectMacroOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Save Button */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-1.5 text-xs font-semibold rounded bg-[#00bcd4] hover:bg-[#00acc1] text-white shadow-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {/* Action Buttons above Table (on the right) */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Display Models List
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenDisplayModelModal}
              title="Add Display Model (Opens Modal Popup)"
              className="w-6 h-6 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <button
              onClick={handleDeleteDisplayModel}
              title="Delete Selected Display Model"
              className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-transform active:scale-90"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Display Model Table */}
        <div className="border border-slate-200 dark:border-slate-700 rounded overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs">
            <thead>
              <tr className="bg-[#4a72b8] text-white font-semibold">
                <th className="py-2.5 px-4 border-r border-white/40 w-1/4">Display Model</th>
                <th className="py-2.5 px-4 border-r border-white/40 w-1/3">DISPLAY PROGRAM</th>
                <th className="py-2.5 px-4 border-r border-white/40 w-1/6">COLOR</th>
                <th className="py-2.5 px-4 w-1/4">REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayModels.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No display models configured yet. Fill the form above or click (+) to add one.
                  </td>
                </tr>
              ) : (
                displayModels.map((dm) => {
                  const isSelected = selectedDisplayModelId === dm.id;
                  return (
                    <tr
                      key={dm.id}
                      onClick={() => setSelectedDisplayModelId(dm.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#cde4fd] text-slate-900 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-medium">
                      {dm.displayModel}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      {dm.displayProgram}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dm.color.toLowerCase().includes('green')
                              ? 'bg-emerald-500'
                              : dm.color.toLowerCase().includes('red')
                              ? 'bg-rose-500'
                              : dm.color.toLowerCase().includes('amber') || dm.color.toLowerCase().includes('yellow')
                              ? 'bg-amber-500'
                              : dm.color.toLowerCase().includes('blue')
                              ? 'bg-sky-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>{dm.color}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {dm.remarks}
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
          {selectedDisplayModelId
            ? `Selected: ${displayModels.find((d) => d.id === selectedDisplayModelId)?.displayModel}`
            : 'Click any row to select for deletion'}
        </span>
        <span>Total Configured: <strong>{displayModels.length}</strong></span>
      </div>
    </div>

      {/* MODAL POPUP: DISPLAY & DISPLAY MODAL */}
      {isDisplayModelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl rounded-sm w-full max-w-2xl overflow-hidden">
            {/* Modal Header: Solid Blue Bar with square red close button */}
            <div className="bg-blue-600 px-5 py-3 flex items-center justify-between text-white">
              <h3 className="font-bold text-base tracking-wide uppercase">DISPLAY & DISPLAY MODEL</h3>
              <button
                type="button"
                onClick={() => setIsDisplayModelModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 text-sm transition-colors rounded-none"
              >
                X
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={(e) => handleSaveDisplayModel(e, true)} className="p-6 space-y-4">
              {/* Row 1: DISPLAY MODEL | COLOR | REMARKS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="text-red-500 mr-1">*</span>DISPLAY MODEL
                  </label>
                  <input
                    type="text"
                    required
                    value={modalDisplayModelForm.displayModel}
                    onChange={(e) =>
                      setModalDisplayModelForm({ ...modalDisplayModelForm, displayModel: e.target.value })
                    }
                    placeholder="Direction Display"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="text-red-500 mr-1">*</span>COLOR
                  </label>
                  <select
                    value={modalDisplayModelForm.color}
                    onChange={(e) =>
                      setModalDisplayModelForm({ ...modalDisplayModelForm, color: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {colorOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="text-red-500 mr-1">*</span>REMARKS
                  </label>
                  <input
                    type="text"
                    required
                    value={modalDisplayModelForm.remarks}
                    onChange={(e) =>
                      setModalDisplayModelForm({ ...modalDisplayModelForm, remarks: e.target.value })
                    }
                    placeholder="Direction Display"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: DISPLAY PROGRAM & SELECT MACRO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="text-red-500 mr-1">*</span>DISPLAY PROGRAM
                  </label>
                  <input
                    type="text"
                    required
                    value={modalDisplayModelForm.displayProgram}
                    onChange={(e) =>
                      setModalDisplayModelForm({ ...modalDisplayModelForm, displayProgram: e.target.value })
                    }
                    placeholder="|UDB(ID}D9G0000{Left}{Available}~<CR><LF>"
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    SELECT MACRO
                  </label>
                  <select
                    value={modalDisplayModelForm.selectMacro}
                    onChange={(e) => handleMacroSelect(e.target.value, true)}
                    className="w-full px-3 py-1.5 text-xs rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {selectMacroOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer with Close & SAVE buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDisplayModelModalOpen(false)}
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
    </div>
  );
}
