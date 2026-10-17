'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Size Section State
  const [sizeSettings, setSizeSettings] = useState({
    height: '25',
    width: '25',
    radius: '15',
    refreshRate: '500',
    refreshData: '1111',
  });

  // 2. Sensor Shape Section State
  const [sensorShape, setSensorShape] = useState({
    shape: 'Circle',
    label: '',
  });

  // 3. Available Colors State
  const [colorSettings, setColorSettings] = useState({
    currentVehicleType: 'General',
    general: '#00e676',
    handicap: '#2b4695',
    womens: '#f8bbd0',
    ev: '#c6ff00',
    vip: '#d50000',
    occupied: '#ff0000',
    error: '#795548',
    longStay: '#ffff00',
    longStayDuration: '1440',
    fontSize: '12',
    fontColor: '#000000',
    fontFamily: 'Agency FB',
    fontStyle: 'bold',
  });

  // 4. Display Section State
  const [displaySettings, setDisplaySettings] = useState({
    height: '100',
    width: '50',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Display and Hardware Parameters saved successfully');
  };

  // Download handlers
  const handleDownload = (type: 'Binary' | 'TLS Key' | 'Manual') => {
    let filename = 'Binary_package.zip';
    let content = 'PGS System Binary Package v2.4.0\r\nPlace Server.cfg inside this binary folder.';

    if (type === 'Binary') {
      filename = 'server.txt';
      content = 'SERVER_IP=192.168.1.200\r\nPORT=8080\r\nTLS_ENABLED=true\r\nVERSION=2.4.0';
    } else if (type === 'TLS Key') {
      filename = 'server_tls_key.pem';
      content = '-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCAQEA3...[PGS TLS ENCRYPTION KEY]...==\r\n-----END RSA PRIVATE KEY-----';
    } else if (type === 'Manual') {
      filename = 'PGS_System_Operator_Manual.txt';
      content = 'Parking Guidance System (PGS) - Hardware & Software Configuration Manual\r\n\r\n1. Note on Configuration:\r\nWhen server.txt gets downloaded, change the file name to Server.cfg.\r\nPaste the Server.cfg file inside the binary.';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename} successfully`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Main Settings Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-6">
        {/* Centered Title */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            Setting
          </h1>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Section 1: Size */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Size
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                HEIGHT
              </label>
              <input
                type="text"
                value={sizeSettings.height}
                onChange={(e) => setSizeSettings({ ...sizeSettings, height: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                WIDTH
              </label>
              <input
                type="text"
                value={sizeSettings.width}
                onChange={(e) => setSizeSettings({ ...sizeSettings, width: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                RADIUS
              </label>
              <input
                type="text"
                value={sizeSettings.radius}
                onChange={(e) => setSizeSettings({ ...sizeSettings, radius: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                REFRESH RATE
              </label>
              <input
                type="text"
                value={sizeSettings.refreshRate}
                onChange={(e) => setSizeSettings({ ...sizeSettings, refreshRate: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                REFRESH DATA
              </label>
              <input
                type="text"
                value={sizeSettings.refreshData}
                onChange={(e) => setSizeSettings({ ...sizeSettings, refreshData: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Sensor Shape */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Sensor Shape
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-48 sm:w-56">
              <select
                value={sensorShape.shape}
                onChange={(e) => setSensorShape({ ...sensorShape, shape: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Circle">Circle</option>
                <option value="Square">Square</option>
                <option value="Rounded">Rounded</option>
                <option value="Hexagon">Hexagon</option>
              </select>
            </div>

            <div className="w-48 sm:w-56">
              <input
                type="text"
                placeholder="Sensor Shape"
                value={sensorShape.label}
                onChange={(e) => setSensorShape({ ...sensorShape, label: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400"
              />
            </div>

            {/* Centered Preview Badge */}
            <div className="flex items-center justify-center pl-6">
              <div 
                className={`w-5 h-5 bg-[#00e676] border border-black shadow-sm transition-all duration-200 ${
                  sensorShape.shape === 'Circle' ? 'rounded-full' :
                  sensorShape.shape === 'Square' ? 'rounded-none' :
                  sensorShape.shape === 'Rounded' ? 'rounded-md' : 'rounded-full'
                }`}
                title={`Shape Preview: ${sensorShape.shape}`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Available Colors */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Available Colors
          </h2>

          {/* Row 1: Vehicle Types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                CURRENT VEHICLE TYPE
              </label>
              <select
                value={colorSettings.currentVehicleType}
                onChange={(e) => setColorSettings({ ...colorSettings, currentVehicleType: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="General">General</option>
                <option value="Handicap">Handicap</option>
                <option value="Women's">Women's</option>
                <option value="EV">EV</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                GENERAL
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.general}
                  onChange={(e) => setColorSettings({ ...colorSettings, general: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.general }}
                  title="Click to customize General color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                HANDICAP
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.handicap}
                  onChange={(e) => setColorSettings({ ...colorSettings, handicap: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.handicap }}
                  title="Click to customize Handicap color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                WOMEN'S
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.womens}
                  onChange={(e) => setColorSettings({ ...colorSettings, womens: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.womens }}
                  title="Click to customize Women's color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                EV
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.ev}
                  onChange={(e) => setColorSettings({ ...colorSettings, ev: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.ev }}
                  title="Click to customize EV color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                VIP
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.vip}
                  onChange={(e) => setColorSettings({ ...colorSettings, vip: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.vip }}
                  title="Click to customize VIP color"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Occupied, Error, Long Stay, Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                OCCUPIED
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.occupied}
                  onChange={(e) => setColorSettings({ ...colorSettings, occupied: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.occupied }}
                  title="Click to customize Occupied color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                ERROR
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.error}
                  onChange={(e) => setColorSettings({ ...colorSettings, error: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.error }}
                  title="Click to customize Error color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                LONG STAY
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.longStay}
                  onChange={(e) => setColorSettings({ ...colorSettings, longStay: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.longStay }}
                  title="Click to customize Long Stay color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                LONG STAY DURATION(MIN)
              </label>
              <input
                type="text"
                value={colorSettings.longStayDuration}
                onChange={(e) => setColorSettings({ ...colorSettings, longStayDuration: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Font Size, Font Color, Font Family, Font Style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                FONT SIZE
              </label>
              <input
                type="text"
                value={colorSettings.fontSize}
                onChange={(e) => setColorSettings({ ...colorSettings, fontSize: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                FONT COLOR
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={colorSettings.fontColor}
                  onChange={(e) => setColorSettings({ ...colorSettings, fontColor: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-5 rounded-sm border border-slate-300 dark:border-slate-600 shadow-inner cursor-pointer"
                  style={{ backgroundColor: colorSettings.fontColor }}
                  title="Click to customize Font Color"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                FONT FAMILY
              </label>
              <input
                type="text"
                value={colorSettings.fontFamily}
                onChange={(e) => setColorSettings({ ...colorSettings, fontFamily: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                FONT STYLE
              </label>
              <input
                type="text"
                value={colorSettings.fontStyle}
                onChange={(e) => setColorSettings({ ...colorSettings, fontStyle: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Display */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Display
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-36 sm:w-44">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                HEIGHT
              </label>
              <input
                type="text"
                value={displaySettings.height}
                onChange={(e) => setDisplaySettings({ ...displaySettings, height: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-36 sm:w-44">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                WIDTH
              </label>
              <input
                type="text"
                value={displaySettings.width}
                onChange={(e) => setDisplaySettings({ ...displaySettings, width: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveDisplay}
              className="bg-[#2b4695] hover:bg-[#243b7d] text-white font-semibold text-xs px-6 py-1.5 rounded shadow-sm transition active:scale-95"
            >
              Save
            </button>
          </div>
        </div>

        {/* Section 5: Downloads */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Downloads
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                BINARY
              </label>
              <button
                type="button"
                onClick={() => handleDownload('Binary')}
                className="bg-[#2b4695] hover:bg-[#243b7d] text-white font-medium text-xs px-4 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Binary
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                TLS KEY
              </label>
              <button
                type="button"
                onClick={() => handleDownload('TLS Key')}
                className="bg-[#2b4695] hover:bg-[#243b7d] text-white font-medium text-xs px-4 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                TLS Key
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                MANUAL
              </label>
              <button
                type="button"
                onClick={() => handleDownload('Manual')}
                className="bg-[#2b4695] hover:bg-[#243b7d] text-white font-medium text-xs px-4 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Manual
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: Note */}
        <div className="space-y-1 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <h3 className="font-bold text-slate-900 dark:text-white">Note:</h3>
          <p className="opacity-90">When server.txt gets downloaded, change the file name to Server.cfg.</p>
          <p className="opacity-90">Paste the Server.cfg file inside the binary.</p>
        </div>
      </div>
    </div>
  );
}
