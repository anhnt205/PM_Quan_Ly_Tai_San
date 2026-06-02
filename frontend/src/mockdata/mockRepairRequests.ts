import type { PlanSigner } from './mockPlans';

export interface RepairRequest {
  id: string;
  planId: string;
  number: string;
  month: number;
  year: number;
  deviceIds: string[];
  sourceDepartmentId: string;
  executionDepartmentId: string;
  signers: PlanSigner[];
  status: 'draft' | 'cho-duyet' | 'da-duyet' | 'tu-choi';
  createdDate: string;
  createdBy: string;
  note: string;
}

export const initialRepairRequests: RepairRequest[] = [
  {
    id: 'GDN-2024-001',
    planId: 'KH-2024-001',
    number: 'PX-KT1-001',
    month: 1,
    year: 2024,
    deviceIds: ['TB-001', 'TB-004'],
    sourceDepartmentId: 'PB-01',
    executionDepartmentId: 'PB-04',
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '05/01/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: true, signedAt: '06/01/2024' },
      { userId: 'NV-14', userName: 'Dương Văn Phong', departmentId: 'PB-10', departmentName: 'Ban Giám đốc', order: 3, signed: true, signedAt: '07/01/2024' },
    ],
    status: 'da-duyet',
    createdDate: '05/01/2024',
    createdBy: 'NV-01',
    note: 'Chăm sóc thường xuyên tháng 1 - Máy xúc + Băng tải',
  },
  {
    id: 'GDN-2024-002',
    planId: 'KH-2024-001',
    number: 'PX-KT1-002',
    month: 3,
    year: 2024,
    deviceIds: ['TB-001', 'TB-003'],
    sourceDepartmentId: 'PB-01',
    executionDepartmentId: 'PB-04',
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '05/03/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: true, signedAt: '06/03/2024' },
      { userId: 'NV-14', userName: 'Dương Văn Phong', departmentId: 'PB-10', departmentName: 'Ban Giám đốc', order: 3, signed: true, signedAt: '07/03/2024' },
    ],
    status: 'da-duyet',
    createdDate: '05/03/2024',
    createdBy: 'NV-01',
    note: 'SC nhỏ tháng 3 - Máy xúc CAT + Xe tải Belaz',
  },
  {
    id: 'GDN-2024-003',
    planId: 'KH-2024-001',
    number: 'PX-KT1-003',
    month: 5,
    year: 2024,
    deviceIds: ['TB-001', 'TB-002'],
    sourceDepartmentId: 'PB-01',
    executionDepartmentId: 'PB-04',
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '03/05/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: false },
      { userId: 'NV-14', userName: 'Dương Văn Phong', departmentId: 'PB-10', departmentName: 'Ban Giám đốc', order: 3, signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '03/05/2024',
    createdBy: 'NV-01',
    note: 'Chăm sóc thường xuyên tháng 5',
  },
  {
    id: 'GDN-2024-004',
    planId: 'KH-2024-001',
    number: 'PX-KT1-004',
    month: 7,
    year: 2024,
    deviceIds: ['TB-001', 'TB-003', 'TB-004'],
    sourceDepartmentId: 'PB-01',
    executionDepartmentId: 'PB-04',
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '02/07/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: true, signedAt: '03/07/2024' },
      { userId: 'NV-14', userName: 'Dương Văn Phong', departmentId: 'PB-10', departmentName: 'Ban Giám đốc', order: 3, signed: true, signedAt: '04/07/2024' },
    ],
    status: 'da-duyet',
    createdDate: '02/07/2024',
    createdBy: 'NV-01',
    note: 'SC lớn tháng 7 - Đại tu hệ thống',
  },
  {
    id: 'GDN-2024-005',
    planId: 'KH-2024-001',
    number: 'PX-KT1-005',
    month: 8,
    year: 2024,
    deviceIds: ['TB-007'],
    sourceDepartmentId: 'PB-04',
    executionDepartmentId: 'PB-04',
    signers: [
      { userId: 'NV-06', userName: 'Ngô Văn Phúc', departmentId: 'PB-04', departmentName: 'Phân xưởng cơ khí', order: 1, signed: true, signedAt: '01/08/2024' },
      { userId: 'NV-12', userName: 'Lý Văn Nam', departmentId: 'PB-09', departmentName: 'Phòng Kỹ thuật', order: 2, signed: true, signedAt: '02/08/2024' },
    ],
    status: 'da-duyet',
    createdDate: '01/08/2024',
    createdBy: 'NV-06',
    note: 'Yêu cầu sửa thử nghiệm — đã được duyệt, chờ lập biên bản giám định',
  },
];
