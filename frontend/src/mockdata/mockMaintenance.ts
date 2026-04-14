import { devices } from './mockDevices';

export type MaintenanceType = 'daily' | 'monthly' | 'hour-based';
export type MaintenancePlanStatus = 'upcoming' | 'due' | 'overdue';
export type MaintenanceExecutionStatus = 'pending' | 'in-progress' | 'completed' | 'interrupted';

export interface MaintenancePlan {
  id: string;
  deviceId: string;
  deviceName: string;
  maintenanceType: MaintenanceType;
  threshold: number;
  currentHours: number;
  nextDueDate: string;
  status: MaintenancePlanStatus;
  executionStatus: MaintenanceExecutionStatus;
}

export function getMaintenanceTypeLabel(type: MaintenanceType): string {
  switch (type) {
    case 'daily': return 'Hàng ngày';
    case 'monthly': return 'Hàng tháng';
    case 'hour-based': return 'Theo giờ vận hành';
  }
}

export function getPlanStatusLabel(status: MaintenancePlanStatus): string {
  switch (status) {
    case 'upcoming': return 'Sắp đến hạn';
    case 'due': return 'Đến hạn';
    case 'overdue': return 'Quá hạn';
  }
}

function calculateStatus(device: typeof devices[0]): MaintenancePlanStatus {
  const ratio = device.operatingHours / device.maintenanceThreshold;
  if (ratio >= 1) return 'overdue';
  if (ratio >= 0.9) return 'due';
  return 'upcoming';
}

export const maintenancePlans: MaintenancePlan[] = devices.map((device, index) => ({
  id: `MP-${String(index + 1).padStart(3, '0')}`,
  deviceId: device.id,
  deviceName: device.name,
  maintenanceType: index % 3 === 0 ? 'daily' : index % 3 === 1 ? 'monthly' : 'hour-based',
  threshold: device.maintenanceThreshold,
  currentHours: device.operatingHours,
  nextDueDate: new Date(Date.now() + (device.maintenanceThreshold - device.operatingHours) * 3600000 / 24).toISOString().split('T')[0],
  status: calculateStatus(device),
  executionStatus: 'pending',
}));
