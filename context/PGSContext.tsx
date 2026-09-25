'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Screen,
  Sensor,
  Connection,
  Display,
  DisplayModel,
  LEDDevice,
  CameraSlot,
  OccupancyLog,
  User,
  PageRight,
  SystemSettings,
  AppTheme,
  SlotStatus,
  CameraDevice,
} from '@/types';
import {
  initialScreens,
  initialSensors,
  initialConnections,
  initialDisplays,
  initialDisplayModels,
  initialLEDDevices,
  initialCameraSlots,
  initialUsers,
  initialPageRights,
  initialSettings,
  sampleLogs,
  initialCameraDevices,
} from '@/lib/mockData';

interface PGSContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;

  screens: Screen[];
  activeScreenId: string;
  setActiveScreenId: (id: string) => void;
  activeScreen: Screen | undefined;
  addScreen: (screen: Omit<Screen, 'id'>) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;

  sensors: Sensor[];
  activeScreenSensors: Sensor[];
  selectedSensor: Sensor | null;
  setSelectedSensor: (sensor: Sensor | null) => void;
  updateSensor: (id: string, updates: Partial<Sensor>) => void;
  addSensor: (sensor: Omit<Sensor, 'id'>) => void;
  deleteSensor: (id: string) => void;
  bulkUpdateSensorPositions: (positions: { id: string; x: number; y: number }[]) => void;

  connections: Connection[];
  addConnection: (con: Omit<Connection, 'id'>) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;

  displays: Display[];
  addDisplay: (disp: Omit<Display, 'id'>) => void;
  updateDisplay: (id: string, updates: Partial<Display>) => void;
  deleteDisplay: (id: string) => void;

  displayModels: DisplayModel[];
  addDisplayModel: (model: Omit<DisplayModel, 'id'>) => void;
  deleteDisplayModel: (id: string) => void;

  ledDevices: LEDDevice[];
  addLEDDevice: (led: Omit<LEDDevice, 'id'>) => void;
  updateLEDDevice: (id: string, updates: Partial<LEDDevice>) => void;
  deleteLEDDevice: (id: string) => void;

  cameraSlots: CameraSlot[];
  addCameraSlot: (slot: Omit<CameraSlot, 'id'>) => void;
  updateCameraSlot: (id: string, updates: Partial<CameraSlot>) => void;
  deleteCameraSlot: (id: string) => void;

  logs: OccupancyLog[];
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  pageRights: PageRight[];
  updatePageRight: (pageName: string, updates: Partial<PageRight>) => void;

  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isSimulationRunning: boolean;
  setIsSimulationRunning: (val: boolean | ((prev: boolean) => boolean)) => void;

  officeName: string;
  setOfficeName: (name: string) => void;
  availableOffices: string[];

  cameraDevices: CameraDevice[];
  updateCameraDevice: (id: string, updates: Partial<CameraDevice>) => void;

  // Computed stats for active screen & entire facility
  stats: {
    total: number;
    occupied: number;
    free: number;
    reserved: number;
    occupancyPercent: number;
    longStay: number;
    facilityTotal: number;
    facilityOccupied: number;
    facilityFree: number;
    facilityLongStay: number;
  };
}

const PGSContext = createContext<PGSContextType | undefined>(undefined);

export function PGSProvider({ children }: { children: React.ReactNode }) {
  // Theme state: 'light' | 'dark' | 'blue' | 'glass' - starts with server-safe 'dark'
  const [theme, setThemeState] = useState<AppTheme>('dark');
  const isInitializedRef = useRef(false);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pgs_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      // Synchronize dark class for Tailwind
      if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  }, [theme]);

  // Current logged in user (default to Admin)
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [screens, setScreens] = useState<Screen[]>(initialScreens);
  const [activeScreenId, setActiveScreenId] = useState<string>('scr-1');
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [displays, setDisplays] = useState<Display[]>(initialDisplays);
  const [displayModels, setDisplayModels] = useState<DisplayModel[]>(initialDisplayModels);
  const [ledDevices, setLedDevices] = useState<LEDDevice[]>(initialLEDDevices);
  const [cameraSlots, setCameraSlots] = useState<CameraSlot[]>(initialCameraSlots);
  const [logs, setLogs] = useState<OccupancyLog[]>(sampleLogs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pageRights, setPageRights] = useState<PageRight[]>(initialPageRights);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);

  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  // Load saved state from localStorage only after client-side mount (avoids hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTheme = localStorage.getItem('pgs_theme') as AppTheme;
      if (savedTheme && ['light', 'dark', 'blue', 'glass'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      const savedUser = localStorage.getItem('pgs_user');
      if (savedUser) {
        try { setCurrentUser(JSON.parse(savedUser)); } catch {}
      }
      const savedScreens = localStorage.getItem('pgs_screens');
      if (savedScreens) {
        try {
          const parsed = JSON.parse(savedScreens);
          if (Array.isArray(parsed) && parsed.length > 0) setScreens(parsed);
        } catch {}
      }
      const savedSensors = localStorage.getItem('pgs_sensors');
      if (savedSensors) {
        try {
          const parsed = JSON.parse(savedSensors);
          if (Array.isArray(parsed) && parsed.length > 0) setSensors(parsed);
        } catch {}
      }
      const savedConns = localStorage.getItem('pgs_connections');
      if (savedConns) {
        try {
          const parsed = JSON.parse(savedConns);
          if (Array.isArray(parsed) && parsed.length > 0) setConnections(parsed);
        } catch {}
      }
      const savedDisplays = localStorage.getItem('pgs_displays');
      if (savedDisplays) {
        try {
          const parsed = JSON.parse(savedDisplays);
          if (Array.isArray(parsed) && parsed.length > 0) setDisplays(parsed);
        } catch {}
      }
    } catch {} finally {
      isInitializedRef.current = true;
    }
  }, []);

  // Sync to local storage only AFTER initial client hydration has loaded
  useEffect(() => {
    if (!isInitializedRef.current || typeof window === 'undefined') return;
    try {
      localStorage.setItem('pgs_user', JSON.stringify(currentUser));
      localStorage.setItem('pgs_screens', JSON.stringify(screens));
      localStorage.setItem('pgs_sensors', JSON.stringify(sensors));
      localStorage.setItem('pgs_connections', JSON.stringify(connections));
      localStorage.setItem('pgs_displays', JSON.stringify(displays));
    } catch {}
  }, [currentUser, screens, sensors, connections, displays]);

  // Simulation engine: gently toggles random sensor states every 6-10 seconds
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setSensors((prev) => {
        if (prev.length === 0) return prev;
        const randomIndex = Math.floor(Math.random() * prev.length);
        const current = prev[randomIndex];
        // If free, 40% chance to occupy
        // If occupied, 40% chance to free
        let nextStatus: SlotStatus = current.status;
        let vehicleNo = current.vehicleNo;
        let occupiedSince = current.occupiedSince;

        if (current.status === 0 && Math.random() < 0.45) {
          nextStatus = 1;
          vehicleNo = `KA-05-PG-${Math.floor(1000 + Math.random() * 9000)}`;
          occupiedSince = new Date().toISOString();
        } else if (current.status === 1 && Math.random() < 0.35) {
          nextStatus = 0;
          vehicleNo = undefined;
          occupiedSince = undefined;
        }

        if (nextStatus === current.status) return prev;

        const updated = [...prev];
        updated[randomIndex] = {
          ...current,
          status: nextStatus,
          vehicleNo,
          occupiedSince,
          ledColor: nextStatus === 1 ? 'RED' : 'GREEN',
        };
        return updated;
      });
    }, (settings.refreshInterval || 8) * 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, settings.refreshInterval]);

  // Login handler
  const login = (username: string, password?: string) => {
    const matched = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    // Fallback: create dynamic operator session
    const guestUser: User = {
      id: `u-${Date.now()}`,
      username: username.trim() || 'Admin',
      userType: 'Admin',
      allowedScreens: ['all'],
    };
    setCurrentUser(guestUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pgs_user');
    }
  };

  // Screen CRUD
  const activeScreen = screens.find((s) => s.id === activeScreenId) || screens[0];
  const activeScreenSensors = sensors.filter((s) => s.screenId === activeScreen?.id);

  const addScreen = (data: Omit<Screen, 'id'>) => {
    const newScreen: Screen = { ...data, id: `scr-${Date.now()}` };
    setScreens((prev) => [...prev, newScreen]);
    setActiveScreenId(newScreen.id);
  };

  const updateScreen = (id: string, updates: Partial<Screen>) => {
    setScreens((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteScreen = (id: string) => {
    setScreens((prev) => prev.filter((s) => s.id !== id));
    setSensors((prev) => prev.filter((s) => s.screenId !== id));
    if (activeScreenId === id) {
      const remaining = screens.filter((s) => s.id !== id);
      if (remaining.length > 0) setActiveScreenId(remaining[0].id);
    }
  };

  // Sensor CRUD
  const updateSensor = (id: string, updates: Partial<Sensor>) => {
    setSensors((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (selectedSensor?.id === id) {
      setSelectedSensor((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addSensor = (data: Omit<Sensor, 'id'>) => {
    const newSensor: Sensor = { ...data, id: `s-${Date.now()}` };
    setSensors((prev) => [...prev, newSensor]);
  };

  const deleteSensor = (id: string) => {
    setSensors((prev) => prev.filter((s) => s.id !== id));
    if (selectedSensor?.id === id) setSelectedSensor(null);
  };

  const bulkUpdateSensorPositions = (positions: { id: string; x: number; y: number }[]) => {
    const map = new Map(positions.map((p) => [p.id, p]));
    setSensors((prev) =>
      prev.map((s) => {
        const match = map.get(s.id);
        if (match) {
          return { ...s, x: Math.round(match.x), y: Math.round(match.y) };
        }
        return s;
      })
    );
  };

  // Connection CRUD
  const addConnection = (con: Omit<Connection, 'id'>) => {
    const newCon: Connection = { ...con, id: `con-${Date.now()}` };
    setConnections((prev) => [...prev, newCon]);
  };

  const updateConnection = (id: string, updates: Partial<Connection>) => {
    setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  // Display CRUD
  const addDisplay = (disp: Omit<Display, 'id'>) => {
    const newDisp: Display = { ...disp, id: `disp-${Date.now()}` };
    setDisplays((prev) => [...prev, newDisp]);
  };

  const updateDisplay = (id: string, updates: Partial<Display>) => {
    setDisplays((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDisplay = (id: string) => {
    setDisplays((prev) => prev.filter((d) => d.id !== id));
  };

  const addDisplayModel = (m: Omit<DisplayModel, 'id'>) => {
    setDisplayModels((prev) => [...prev, { ...m, id: `dm-${Date.now()}` }]);
  };

  const deleteDisplayModel = (id: string) => {
    setDisplayModels((prev) => prev.filter((m) => m.id !== id));
  };

  // LED Device
  const addLEDDevice = (led: Omit<LEDDevice, 'id'>) => {
    setLedDevices((prev) => [...prev, { ...led, id: `led-${Date.now()}` }]);
  };

  const updateLEDDevice = (id: string, updates: Partial<LEDDevice>) => {
    setLedDevices((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLEDDevice = (id: string) => {
    setLedDevices((prev) => prev.filter((l) => l.id !== id));
  };

  // Camera Slot
  const addCameraSlot = (cs: Omit<CameraSlot, 'id'>) => {
    setCameraSlots((prev) => [...prev, { ...cs, id: `cam-${Date.now()}` }]);
  };

  const updateCameraSlot = (id: string, updates: Partial<CameraSlot>) => {
    setCameraSlots((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCameraSlot = (id: string) => {
    setCameraSlots((prev) => prev.filter((c) => c.id !== id));
  };

  // User
  const addUser = (u: Omit<User, 'id'>) => {
    setUsers((prev) => [...prev, { ...u, id: `u-${Date.now()}` }]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // PageRight
  const updatePageRight = (pageName: string, updates: Partial<PageRight>) => {
    setPageRights((prev) => prev.map((p) => (p.pageName === pageName ? { ...p, ...updates } : p)));
  };

  // Settings
  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Office & Facility state
  const [officeName, setOfficeName] = useState<string>('Neptune Corporate Towers - HQ Campus');
  const availableOffices = [
    'Neptune Corporate Towers - HQ Campus',
    'Neptune Tech Park - Tower B',
    'Neptune World City - North Gate',
  ];

  // Camera Devices state
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pgs_camera_devices');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return initialCameraDevices;
  });

  const updateCameraDevice = (id: string, updates: Partial<CameraDevice>) => {
    setCameraDevices((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('pgs_camera_devices', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Overstay / Long stay calculation threshold (hours): 4 hours
  const overstayMs = (settings.overstayHoursThreshold || 4) * 3600 * 1000;
  const nowMs = Date.now();

  // Active Screen stats computation
  const total = activeScreenSensors.length;
  const occupied = activeScreenSensors.filter((s) => s.status === 1).length;
  const reserved = activeScreenSensors.filter((s) => s.status === 2).length;
  const free = activeScreenSensors.filter((s) => s.status === 0).length;
  const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const longStay = activeScreenSensors.filter(
    (s) => s.status === 1 && s.occupiedSince && nowMs - new Date(s.occupiedSince).getTime() >= overstayMs
  ).length;

  // Facility-wide (Office level) stats
  const facilityTotal = sensors.length;
  const facilityOccupied = sensors.filter((s) => s.status === 1).length;
  const facilityFree = sensors.filter((s) => s.status === 0).length;
  const facilityLongStay = sensors.filter(
    (s) => s.status === 1 && s.occupiedSince && nowMs - new Date(s.occupiedSince).getTime() >= overstayMs
  ).length;

  return (
    <PGSContext.Provider
      value={{
        theme,
        setTheme,
        currentUser,
        login,
        logout,
        screens,
        activeScreenId,
        setActiveScreenId,
        activeScreen,
        addScreen,
        updateScreen,
        deleteScreen,
        sensors,
        activeScreenSensors,
        selectedSensor,
        setSelectedSensor,
        updateSensor,
        addSensor,
        deleteSensor,
        bulkUpdateSensorPositions,
        connections,
        addConnection,
        updateConnection,
        deleteConnection,
        displays,
        addDisplay,
        updateDisplay,
        deleteDisplay,
        displayModels,
        addDisplayModel,
        deleteDisplayModel,
        ledDevices,
        addLEDDevice,
        updateLEDDevice,
        deleteLEDDevice,
        cameraSlots,
        addCameraSlot,
        updateCameraSlot,
        deleteCameraSlot,
        logs,
        users,
        addUser,
        updateUser,
        deleteUser,
        pageRights,
        updatePageRight,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        isSimulationRunning,
        setIsSimulationRunning,
        officeName,
        setOfficeName,
        availableOffices,
        cameraDevices,
        updateCameraDevice,
        stats: {
          total,
          occupied,
          free,
          reserved,
          occupancyPercent,
          longStay,
          facilityTotal,
          facilityOccupied,
          facilityFree,
          facilityLongStay,
        },
      }}
    >
      {children}
    </PGSContext.Provider>
  );
}

export function usePGS() {
  const context = useContext(PGSContext);
  if (!context) {
    throw new Error('usePGS must be used within a PGSProvider');
  }
  return context;
}
