// devices import no longer needed here after norms extraction

export type TicketStatus = 'hoan-thanh' | 'cho-duyet' | 'cho-ky' | 'cho-nghiem-thu' | 'dang-thuc-hien';

export interface AnnualPlan {
  id: string;
  year: number;
  deviceIds: string[];
  status: 'draft' | 'cho-duyet' | 'da-duyet' | 'tu-choi';
  createdDate: string;
  approvedDate?: string;
  description: string;
  sourceDepartmentId?: string;
  executionDepartmentId?: string;
  monthlySchedule?: Record<string, string[]>;
  signers?: import('../mockdata/mockPlans').PlanSigner[];
}

export interface WorkOrder {
  id: string;
  planId: string;
  deviceId: string;
  deviceName: string;
  type: string;
  status: TicketStatus;
  createdDate: string;
  assignedTo: string;
  description: string;
}

export interface InspectionReport {
  id: string;
  workOrderId: string;
  deviceId: string;
  deviceName: string;
  status: TicketStatus;
  createdDate: string;
  inspector: string;
  findings: string;
}

export interface MaterialRequest {
  id: string;
  workOrderId: string;
  deviceId: string;
  deviceName: string;
  status: TicketStatus;
  createdDate: string;
  items: { name: string; quantity: number; unit: string }[];
}

export interface AcceptanceRecord {
  id: string;
  workOrderId: string;
  deviceId: string;
  deviceName: string;
  status: TicketStatus;
  createdDate: string;
  acceptedBy: string;
  notes: string;
}

export interface DeviceWorkflowRow {
  id: string;
  stt: number;
  deviceId: string;
  deviceName: string;
  workOrderId: string;
  inspectionId: string;
  materialRequestId: string;
  acceptanceId: string;
  status: TicketStatus;
}

export function getStatusLabel(status: TicketStatus): string {
  switch (status) {
    case 'hoan-thanh': return 'Hoàn thành';
    case 'cho-duyet': return 'Chờ duyệt';
    case 'cho-ky': return 'Chờ ký';
    case 'cho-nghiem-thu': return 'Chờ nghiệm thu';
    case 'dang-thuc-hien': return 'Đang thực hiện';
  }
}

export function getStatusColor(status: TicketStatus): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'hoan-thanh': return 'success';
    case 'cho-duyet': return 'warning';
    case 'cho-ky': return 'info';
    case 'cho-nghiem-thu': return 'error';
    case 'dang-thuc-hien': return 'default';
  }
}

// Mock Annual Plans
export const initialAnnualPlans: AnnualPlan[] = [
  {
    id: 'KH-2024-001',
    year: 2024,
    deviceIds: ['TB-001', 'TB-002', 'TB-003', 'TB-004'],
    status: 'da-duyet',
    createdDate: '2024-01-05',
    approvedDate: '2024-01-10',
    description: 'Kế hoạch sửa chữa thường xuyên Quý 1/2024',
    sourceDepartmentId: 'PB-01',
    executionDepartmentId: 'PB-04',
    monthlySchedule: {
      'TB-001': ['CST', '', 'SCN', '', 'CST', '', 'SCC', '', 'CST', '', 'SCN', ''],
      'TB-002': ['', 'CST', '', 'SCN', '', 'CST', '', 'SCC', '', 'CST', '', 'SCN'],
      'TB-003': ['SCN', '', 'CST', '', 'SCN', '', 'CST', '', 'SCC', '', 'CST', ''],
      'TB-004': ['CST', 'CST', '', '', 'SCN', '', '', 'CST', '', 'SCC', '', 'CST'],
    },
    signers: [
      { userId: 'NV-01', userName: 'Nguyễn Văn An', departmentId: 'PB-01', departmentName: 'Phân xưởng khai thác 1', order: 1, signed: true, signedAt: '2024-01-05' },
      { userId: 'NV-14', userName: 'Dương Văn Phong', departmentId: 'PB-10', departmentName: 'Ban Giám đốc', order: 2, signed: true, signedAt: '2024-01-10' },
    ],
  },
  {
    id: 'KH-2024-002',
    year: 2024,
    deviceIds: ['TB-005', 'TB-006', 'TB-007'],
    status: 'cho-duyet',
    createdDate: '2024-03-20',
    description: 'Kế hoạch sửa chữa thường xuyên Quý 2/2024',
  },
  {
    id: 'KH-2024-003',
    year: 2024,
    deviceIds: ['TB-008', 'TB-009', 'TB-010', 'TB-011', 'TB-012'],
    status: 'draft',
    createdDate: '2024-04-01',
    description: 'Kế hoạch đại tu thiết bị điện năm 2024',
  },
];

// Mock Work Orders (auto-generated from approved plans)
export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'SC-20240101', planId: 'KH-2024-001', deviceId: 'TB-001',
    deviceName: 'Máy xúc lật CAT 994K', type: 'Sửa chữa thường xuyên',
    status: 'cho-duyet',   // ← đổi thành cho-duyet để hiện trên approval
    createdDate: '2024-01-11', assignedTo: 'Nguyễn Văn A',
    description: 'Thay dầu, kiểm tra hệ thống thủy lực',
  },
  {
    id: 'SC-20240102', planId: 'KH-2024-001', deviceId: 'TB-002',
    deviceName: 'Máy khoan Sandvik DR461i', type: 'Sửa chữa thường xuyên',
    status: 'cho-duyet',
    createdDate: '2024-01-11', assignedTo: 'Trần Văn B',
    description: 'Kiểm tra mũi khoan, thay lọc gió',
  },
  { id: 'SC-20240101', planId: 'KH-2024-001', deviceId: 'TB-001', deviceName: 'Máy xúc lật CAT 994K', type: 'Sửa chữa thường xuyên', status: 'hoan-thanh', createdDate: '2024-01-11', assignedTo: 'Nguyễn Văn A', description: 'Thay dầu, kiểm tra hệ thống thủy lực' },
  { id: 'SC-20240102', planId: 'KH-2024-001', deviceId: 'TB-002', deviceName: 'Máy khoan Sandvik DR461i', type: 'Sửa chữa thường xuyên', status: 'cho-nghiem-thu', createdDate: '2024-01-11', assignedTo: 'Trần Văn B', description: 'Kiểm tra mũi khoan, thay lọc gió' },
  { id: 'SC-20240103', planId: 'KH-2024-001', deviceId: 'TB-003', deviceName: 'Xe tải Belaz 75710', type: 'Sửa chữa thường xuyên', status: 'dang-thuc-hien', createdDate: '2024-01-11', assignedTo: 'Lê Văn C', description: 'Đại tu động cơ diesel' },
  { id: 'SC-20240104', planId: 'KH-2024-001', deviceId: 'TB-004', deviceName: 'Băng tải than BC-200', type: 'Sửa chữa thường xuyên', status: 'cho-duyet', createdDate: '2024-01-11', assignedTo: 'Phạm Văn D', description: 'Kiểm tra độ căng băng, bôi trơn con lăn' },
];

// Mock Inspection Reports
export const initialInspections: InspectionReport[] = [
  { id: 'GD-20240101', workOrderId: 'SC-20240101', deviceId: 'TB-001', deviceName: 'Máy xúc lật CAT 994K', status: 'hoan-thanh', createdDate: '2024-01-12', inspector: 'Nguyễn Văn A', findings: 'Hệ thống thủy lực hoạt động bình thường' },
  { id: 'GD-20240102', workOrderId: 'SC-20240102', deviceId: 'TB-002', deviceName: 'Máy khoan Sandvik DR461i', status: 'cho-ky', createdDate: '2024-01-13', inspector: 'Trần Văn B', findings: 'Mũi khoan mòn 30%, cần thay trong 2 tuần' },
  { id: 'GD-20240103', workOrderId: 'SC-20240103', deviceId: 'TB-003', deviceName: 'Xe tải Belaz 75710', status: 'cho-duyet', createdDate: '2024-01-14', inspector: 'Lê Văn C', findings: 'Động cơ cần đại tu toàn bộ' },
];

// Mock Material Requests
export const initialMaterialRequests: MaterialRequest[] = [
  { id: 'VT-20240101', workOrderId: 'SC-20240101', deviceId: 'TB-001', deviceName: 'Máy xúc lật CAT 994K', status: 'hoan-thanh', createdDate: '2024-01-13', items: [{ name: 'Dầu thủy lực', quantity: 200, unit: 'lít' }, { name: 'Lọc dầu', quantity: 4, unit: 'cái' }] },
  { id: 'VT-20240102', workOrderId: 'SC-20240102', deviceId: 'TB-002', deviceName: 'Máy khoan Sandvik DR461i', status: 'cho-duyet', createdDate: '2024-01-14', items: [{ name: 'Mũi khoan', quantity: 2, unit: 'cái' }, { name: 'Lọc gió', quantity: 3, unit: 'cái' }] },
];

// Mock Acceptance Records
export const initialAcceptances: AcceptanceRecord[] = [
  { id: 'NT-20240101', workOrderId: 'SC-20240101', deviceId: 'TB-001', deviceName: 'Máy xúc lật CAT 994K', status: 'hoan-thanh', createdDate: '2024-01-15', acceptedBy: 'Giám đốc kỹ thuật', notes: 'Đạt yêu cầu kỹ thuật' },
];

// Technical norms moved to src/data/mockNorms.ts

// Build workflow rows for dashboard table
export function buildWorkflowRows(): DeviceWorkflowRow[] {
  return initialWorkOrders.map((wo, index) => ({
    id: wo.id,
    stt: index + 1,
    deviceId: wo.deviceId,
    deviceName: wo.deviceName,
    workOrderId: wo.id,
    inspectionId: initialInspections.find(i => i.workOrderId === wo.id)?.id || '—',
    materialRequestId: initialMaterialRequests.find(m => m.workOrderId === wo.id)?.id || '—',
    acceptanceId: initialAcceptances.find(a => a.workOrderId === wo.id)?.id || '—',
    status: wo.status,
  }));
}
