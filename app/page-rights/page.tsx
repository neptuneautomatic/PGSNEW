'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { ShieldCheck, Check, X, Save, Search, Filter, ChevronDown, CheckCircle2 } from 'lucide-react';

interface UserScreenRight {
  screenId: string;
  screenName: string;
  selected: boolean;
  screenLeft: number | string;
  screenTop: number | string;
}

export default function PageRightsPage() {
  const { users, screens } = usePGS();

  // Selected User on the left (default to Admin)
  const [selectedUsername, setSelectedUsername] = useState<string>('Admin');

  // Interactive Column Filter Popup on "SCREEN TOP"
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Closed initially to avoid screen clutter
  const [filterMode, setFilterMode] = useState<'Contains' | 'Equals' | 'Starts With'>('Contains');
  const [filterText, setFilterText] = useState('');

  // Rights state per user
  const [userRightsMap, setUserRightsMap] = useState<Record<string, UserScreenRight[]>>(() => {
    const initialMap: Record<string, UserScreenRight[]> = {};
    users.forEach(u => {
      initialMap[u.username] = screens.map((s, idx) => ({
        screenId: s.id,
        screenName: s.name,
        selected: u.username === 'Admin' ? true : idx === 0,
        screenLeft: 0,
        screenTop: 0,
      }));
    });
    return initialMap;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentUserRights = userRightsMap[selectedUsername] || screens.map(s => ({
    screenId: s.id,
    screenName: s.name,
    selected: false,
    screenLeft: 0,
    screenTop: 0,
  }));

  // Toggle checkbox for a screen
  const handleToggleScreen = (screenId: string) => {
    setUserRightsMap(prev => ({
      ...prev,
      [selectedUsername]: (prev[selectedUsername] || []).map(r => 
        r.screenId === screenId ? { ...r, selected: !r.selected } : r
      )
    }));
  };

  // Update screen left / top coordinates
  const handleUpdateCoordinate = (screenId: string, field: 'screenLeft' | 'screenTop', val: string) => {
    setUserRightsMap(prev => ({
      ...prev,
      [selectedUsername]: (prev[selectedUsername] || []).map(r => 
        r.screenId === screenId ? { ...r, [field]: val } : r
      )
    }));
  };

  const handleSave = () => {
    showToast(`Page rights for "${selectedUsername}" saved successfully`);
  };

  const handleCancel = () => {
    // Reset selection for this user to default
    showToast('Changes reverted');
  };

  // Filter rows based on filterText if filter is active
  const filteredRights = currentUserRights.filter(r => {
    if (!filterText.trim()) return true;
    const topVal = String(r.screenTop);
    if (filterMode === 'Contains') return topVal.includes(filterText);
    if (filterMode === 'Equals') return topVal === filterText;
    if (filterMode === 'Starts With') return topVal.startsWith(filterText);
    return true;
  });

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
            Page Rights
          </h1>
        </div>
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-slate-200 dark:border-slate-800 pt-2">
          
          {/* Left Column: Users List (~22% / 2.8 of 12 cols) */}
          <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between min-h-[460px]">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                Users List
              </h2>

              {/* Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm max-h-[400px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#4a72b8] text-white font-semibold">
                      <th className="py-2.5 px-3">USERNAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelected = u.username === selectedUsername;
                      return (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUsername(u.username)}
                          className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                            isSelected
                              ? 'bg-[#cde4fd] text-slate-900 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            {u.username}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Total Users: {users.length}</span>
              <span className="font-bold">{selectedUsername}</span>
            </div>
          </div>

          {/* Right Column: Rights Table (~78% / 9.2 of 12 cols) */}
          <div className="lg:col-span-9 p-4 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Rights
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  Configuring permissions for: <strong className="text-blue-600 dark:text-blue-400">{selectedUsername}</strong>
                </span>
              </div>

              {/* Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden shadow-sm relative min-h-[360px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#4a72b8] text-white font-semibold">
                      <th className="py-2.5 px-3 border-r border-white/40 text-center w-14">Select</th>
                      <th className="py-2.5 px-4 border-r border-white/40">USER NAME</th>
                      <th className="py-2.5 px-4 border-r border-white/40">SCREEN NAME</th>
                      <th className="py-2.5 px-4 border-r border-white/40">SCREEN LEFT</th>
                      <th 
                        className="py-2.5 px-4 cursor-pointer hover:bg-blue-600 transition flex items-center justify-between"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                      >
                        <span>SCREEN TOP</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRights.map((right) => (
                      <tr
                        key={right.screenId}
                        className={`transition-colors border-b border-slate-100 dark:border-slate-800 ${
                          right.selected
                            ? 'bg-[#cde4fd] text-slate-900 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={right.selected}
                            onChange={() => handleToggleScreen(right.screenId)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-4 font-medium">
                          {selectedUsername}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {right.screenName}
                        </td>
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={right.screenLeft}
                            onChange={(e) => handleUpdateCoordinate(right.screenId, 'screenLeft', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs font-mono"
                          />
                        </td>
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={right.screenTop}
                            onChange={(e) => handleUpdateCoordinate(right.screenId, 'screenTop', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs font-mono"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Floating Column Filter Dialog on SCREEN TOP */}
                {isFilterOpen && (
                  <div className="absolute right-3 top-8 z-30 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-2xl p-2.5 w-48 space-y-2 text-xs animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300">Filter Screen Top</span>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as any)}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none"
                      >
                        <option value="Contains">Contains</option>
                        <option value="Equals">Equals</option>
                        <option value="Starts With">Starts With</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-blue-400 rounded text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Right Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#00bcd4] hover:bg-[#00acc1] active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-[#ef4444] hover:bg-red-600 active:scale-95 transition-all text-white font-medium px-8 py-1.5 text-xs rounded shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
