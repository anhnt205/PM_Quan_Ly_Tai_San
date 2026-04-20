export interface IncidentDeviceEntry {
  deviceId: string;
  deviceName: string;
  position?: string;
  note?: string;
}

import type { PlanSigner } from './mockPlans';

export interface IncidentReport {
  id: string;
  planIds: string[]; // associated plan(s)
  number: string;
  detectedAt: string; // date/time
  reporter?: string;
  reporterDeptId?: string;
  systemName?: string;
  location?: string;
  description?: string;
  severity?: 'Nhẹ' | 'Trung bình' | 'Nặng' | 'Nghiêm trọng';
  deviceEntries: IncidentDeviceEntry[];
  signers?: PlanSigner[];
  status?: 'cho-duyet' | 'da-duyet' | 'dang-ky';
  createdDate?: string;
}

export const initialIncidentReports: IncidentReport[] = [
  {
    id: 'SC-INC-20240101',
    planIds: ['KH-2024-001'],
    number: 'VTL2-SC001',
    detectedAt: '2024-01-09 14:35',
    reporter: 'Công nhân Ca 1',
    systemName: 'Băng tải than BC-200',
    location: 'Lò 1',
    description: 'Lệch băng, gây vỡ thành dẫn tới dừng chuyền.',
    severity: 'Nghiêm trọng',
    deviceEntries: [
      { deviceId: 'TB-004', deviceName: 'Băng tải than BC-200', position: 'Lò 1', note: 'Lệch sang phải' },
    ],
    signers: [],
    status: 'cho-duyet',
    createdDate: '09/01/2024',
  },
  {
    id: 'SC-INC-20240102',
    planIds: ['KH-2024-001','KH-2024-002'],
    number: 'VTL2-SC002',
    detectedAt: '2024-03-05 09:12',
    reporter: 'Tổ trưởng',
    systemName: 'Motor kéo',
    location: 'Đầu băng',
    description: 'Motor có khói và có mùi cháy, dừng máy ngay.',
    severity: 'Nặng',
    deviceEntries: [
      { deviceId: 'TB-002', deviceName: 'Motor kéo DL01', position: 'Đầu băng', note: 'Có vệt cháy' },
    ],
    signers: [],
    status: 'da-duyet',
    createdDate: '05/03/2024',
  },
];
