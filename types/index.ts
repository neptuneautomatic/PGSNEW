export type AppTheme = 'light' | 'dark' | 'blue' | 'glass';

export type UserRole = 'Admin' | 'Operator' | 'Viewer';

export interface User {
  id: string;
  username: string;
  userType: UserRole;
  password?: string;
  allowedScreens: string[]; // Screen IDs or ['all']
}

export type SlotStatus = 0 | 1 | 2 | 3; // 0: Free, 1: Occupied, 2: Reserved, 3: Offline/Maintenance
export type ReservedCategory = 'General' | 'Handicap' | 'Ladies' | 'EV' | 'VIP';

export interface Sensor {
  id: string;
  screenId: string;
  sensorNum: number;
  sensorName: string;
  x: number;
  y: number;
  status: SlotStatus;
  controllerId: string;
  controllerType?: string;
  ipPort?: string;
  vehicleNo?: string;
  occupiedSince?: string;
  reservedType: ReservedCategory;
  ledColor?: string;
  cameraIpPort?: string;
  cameraSnapshot?: string;
  connectionName?: string;
  controllerName?: string;
  lotName?: string;
  gap?: number;
  screenPosition?: string;
  freeze?: string;
  freezeValue?: string;
}

export interface Screen {
  id: string;
  name: string;
  capacity: number;
  imagePath?: string;
  dimensions: { width: number; height: number };
  controllerName?: string;
  description?: string;
}

export interface Connection {
  id: string;
  name: string;
  ipPort: string;
  controllerType: string;
  controllerId: string;
  preamble: string;
  startId: number;
  noOfSensors: number;
  remark?: string;
  status: 'Online' | 'Offline';
  cameraIpPort?: string;
}

export type ArrowDirection = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'NONE';

export interface Display {
  id: string;
  displayName: string;
  displayModel: string;
  ipPort: string;
  displayId: string;
  lineNo: number;
  screenName: string;
  assignedSensors: string[]; // sensor ids
  arrowDirection: ArrowDirection;
  status: 'Online' | 'Offline';
  currentCount?: number;
  leftPos?: string | number;
  rightPos?: string | number;
}

export interface DisplayModel {
  id: string;
  displayModel: string;
  displayProgram: string;
  color: string;
  remarks: string;
}

export interface LEDDevice {
  id: string;
  name: string;
  ipPort: string;
  ledId: string;
  color: string;
  status: 'Active' | 'Inactive';
}

export interface CameraSlot {
  id: string;
  camIpPort: string;
  slotName: string;
  slotId: string;
  vehicleNo?: string;
  confidence?: number;
  status: SlotStatus;
  imagePath?: string;
  lastDetected?: string;
}

export interface OccupancyLog {
  id: string;
  timestamp: string;
  screenName: string;
  slotName: string;
  vehicleNo?: string;
  status: 'Occupied' | 'Vacated';
  durationMinutes?: number;
  groupType: 'Hour' | 'Day' | 'Week' | 'Month';
}

export interface PageRight {
  pageName: string;
  pagePath: string;
  viewRights: boolean;
  addRights: boolean;
  editRights: boolean;
  deleteRights: boolean;
  exportRights: boolean;
}

export interface SystemSettings {
  refreshInterval: number; // in seconds
  highOccupancyThreshold: number; // percentage (e.g. 85%)
  overstayHoursThreshold: number;
  apiUrl: string;
  autoKioskRotate: boolean;
  kioskRotationSeconds: number;
}

export interface ParkingLane {
  id: string;
  laneName: string;
  screenId: string;
  bayIds: string[];
  capacity: number;
  occupied: number;
  free: number;
  longStay: number;
}

export interface CameraDevice {
  id: string;
  name: string; // Connection (Camera name)
  ipAddress: string; // IP Address of each Camera
  location: string;
  laneName?: string;
  status: 'Online' | 'Offline' | 'Degraded';
  resolution: string;
  fps: number;
  latencyMs: number;
  lastDetectedPlate?: string;
  lastDetectedTime?: string;
  streamUrl?: string;
}
