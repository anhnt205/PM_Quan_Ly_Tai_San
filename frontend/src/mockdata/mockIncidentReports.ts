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
  subsystem?: string;
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


export const extendedIncidentReports: IncidentReport[] = [
  {
    id: 'SC-INC-20240105',
    planIds: ['KH-2024-001'],
    number: 'VTL2-SC-001',
    detectedAt: '2024-01-09 14:35',
    reporter: 'Công nhân Ca 1',
    reporterDeptId: 'PB-01',
    systemName: 'Băng tải than BC-200',
    subsystem: 'Lò 1',
    location: 'Phân xưởng sàng tuyển',
    description: 'Lệch băng, gây vỡ thành dẫn tới dừng chuyền. Cần điều chỉnh lại căn chỉnh bánh dẫn.',
    severity: 'Nghiêm trọng',
    deviceEntries: [
      { 
        deviceId: 'TB-004', 
        deviceName: 'Băng tải than BC-200', 
        position: 'Lò 1', 
        note: 'Lệch sang phải ~5cm' 
      },
    ],
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '09/01/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: true, signedAt: '10/01/2024' },
    ],
    status: 'da-duyet',
    createdDate: '09/01/2024',
  },
  {
    id: 'SC-INC-20240222',
    planIds: ['KH-2024-001'],
    number: 'VTL2-SC-002',
    detectedAt: '2024-02-15 10:20',
    reporter: 'Tổ trưởng Ca 2',
    reporterDeptId: 'PB-01',
    systemName: 'Máy xúc lật CAT 994K',
    subsystem: 'Hệ thống thủy lực',
    location: 'Khu vực khai thác phía Tây',
    description: 'Rò rỉ dầu thủy lực tại joint xi lanh nâng, áp suất giảm 15%. Cần thay seal ngay.',
    severity: 'Nặng',
    deviceEntries: [
      { 
        deviceId: 'TB-001', 
        deviceName: 'Máy xúc lật CAT 994K', 
        position: 'Khu vực khai thác phía Tây', 
        note: 'Joint bên trái' 
      },
    ],
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '15/02/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '15/02/2024',
  },
  {
    id: 'SC-INC-20240410',
    planIds: ['KH-2024-001'],
    number: 'VTL2-SC-003',
    detectedAt: '2024-04-10 16:45',
    reporter: 'Công nhân Ca 3',
    reporterDeptId: 'PB-01',
    systemName: 'Xe tải Belaz 75710',
    subsystem: 'Hệ thống phanh',
    location: 'Bãi chứa than phía Nam',
    description: 'Phanh không hoạt động bình thường khi xe đang chạy tải. Cảm biến hoặc má phanh hỏng.',
    severity: 'Nghiêm trọng',
    deviceEntries: [
      { 
        deviceId: 'TB-003', 
        deviceName: 'Xe tải Belaz 75710', 
        position: 'Bãi chứa than phía Nam', 
        note: 'Phanh sau không ăn' 
      },
    ],
    signers: [],
    status: 'cho-duyet',
    createdDate: '10/04/2024',
  },
];