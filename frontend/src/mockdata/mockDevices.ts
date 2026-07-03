export type DeviceStatus = 'active' | 'maintenance' | 'broken';

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  technician: string;
}

export interface RepairRecord {
  id: string;
  date: string;
  issue: string;
  description: string;
  technician: string;
  cost: number;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  group: string;        // thêm - Mã nhóm TB (QG, MC, KDT...)
  assetType: 'TSCĐ' | 'CCDC'; // thêm - Loại tài sản
  quantity: number;     // thêm - Số lượng
  maintenanceUnit: string; // thêm - Đơn vị bảo trì
  location: string;
  operatingHours: number;
  status: DeviceStatus;
  manufacturer: string;
  model: string;
  installDate: string;
  maintenanceThreshold: number;
  maintenanceHistory: MaintenanceRecord[];
  repairHistory: RepairRecord[];
}

export const devices: Device[] = [
  {
    id: 'TB-001',
    name: 'Máy xúc lật CAT 994K',
    type: 'Máy xúc',
    group: 'QG',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng khai thác 1',
    operatingHours: 4850,
    status: 'active',
    manufacturer: 'Caterpillar',
    model: '994K',
    installDate: '2021-03-15',
    maintenanceThreshold: 5000,
    maintenanceHistory: [
      { id: 'MH-001', date: '2024-01-10', type: 'Bảo dưỡng định kỳ', description: 'Thay dầu động cơ, lọc dầu', technician: 'Nguyễn Văn A' },
      { id: 'MH-002', date: '2024-03-15', type: 'Bảo dưỡng theo giờ', description: 'Kiểm tra hệ thống thủy lực', technician: 'Trần Văn B' },
    ],
    repairHistory: [
      { id: 'RH-001', date: '2023-11-20', issue: 'Rò rỉ dầu thủy lực', description: 'Thay seal xi lanh nâng', technician: 'Lê Văn C', cost: 15000000 },
    ],
  },
  {
    id: 'TB-002',
    name: 'Máy khoan Sandvik DR461i',
    type: 'Máy khoan',
    group: 'MK',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng khai thác 2',
    operatingHours: 3200,
    status: 'active',
    manufacturer: 'Sandvik',
    model: 'DR461i',
    installDate: '2022-06-01',
    maintenanceThreshold: 3500,
    maintenanceHistory: [
      { id: 'MH-003', date: '2024-02-20', type: 'Bảo dưỡng định kỳ', description: 'Kiểm tra mũi khoan, thay lọc gió', technician: 'Phạm Văn D' },
    ],
    repairHistory: [],
  },
  {
    id: 'TB-003',
    name: 'Xe tải Belaz 75710',
    type: 'Xe tải hạng nặng',
    group: 'TD-AQ',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng vận tải',
    operatingHours: 6200,
    status: 'maintenance',
    manufacturer: 'Belaz',
    model: '75710',
    installDate: '2020-09-10',
    maintenanceThreshold: 6000,
    maintenanceHistory: [
      { id: 'MH-004', date: '2024-04-01', type: 'Bảo dưỡng lớn', description: 'Đại tu động cơ diesel', technician: 'Nguyễn Văn A' },
    ],
    repairHistory: [
      { id: 'RH-002', date: '2024-01-05', issue: 'Hỏng hệ thống phanh', description: 'Thay má phanh và đĩa phanh', technician: 'Trần Văn B', cost: 45000000 },
    ],
  },
  {
    id: 'TB-004',
    name: 'Băng tải than BC-200',
    type: 'Băng tải',
    group: 'BT-B800',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng sàng tuyển',
    operatingHours: 8500,
    status: 'active',
    manufacturer: 'Thyssenkrupp',
    model: 'BC-200',
    installDate: '2019-01-20',
    maintenanceThreshold: 10000,
    maintenanceHistory: [
      { id: 'MH-005', date: '2024-03-10', type: 'Bảo dưỡng hàng ngày', description: 'Kiểm tra độ căng băng, bôi trơn con lăn', technician: 'Lê Văn C' },
    ],
    repairHistory: [],
  },
  {
    id: 'TB-005',
    name: 'Máy nghiền than MN-500',
    type: 'Máy nghiền',
    group: 'ML',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng chế biến',
    operatingHours: 4980,
    status: 'active',
    manufacturer: 'Metso',
    model: 'MN-500',
    installDate: '2021-07-15',
    maintenanceThreshold: 5000,
    maintenanceHistory: [
      { id: 'MH-006', date: '2024-02-28', type: 'Bảo dưỡng theo giờ', description: 'Kiểm tra búa nghiền, thay tấm lót', technician: 'Phạm Văn D' },
    ],
    repairHistory: [
      { id: 'RH-003', date: '2023-08-15', issue: 'Gãy búa nghiền', description: 'Thay 4 búa nghiền mới', technician: 'Nguyễn Văn A', cost: 25000000 },
    ],
  },
  {
    id: 'TB-006',
    name: 'Máy bơm nước MB-100',
    type: 'Máy bơm',
    group: 'BM-Đ',
    assetType: 'TSCĐ',
    quantity: 2,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng thoát nước',
    operatingHours: 7200,
    status: 'broken',
    manufacturer: 'Grundfos',
    model: 'MB-100',
    installDate: '2020-03-01',
    maintenanceThreshold: 7000,
    maintenanceHistory: [
      { id: 'MH-007', date: '2024-01-15', type: 'Bảo dưỡng định kỳ', description: 'Thay phớt bơm, kiểm tra cánh bơm', technician: 'Trần Văn B' },
    ],
    repairHistory: [
      { id: 'RH-004', date: '2024-04-10', issue: 'Cháy motor bơm', description: 'Đang chờ thay motor mới', technician: 'Lê Văn C', cost: 80000000 },
    ],
  },
  {
    id: 'TB-007',
    name: 'Cẩu trục CT-50T',
    type: 'Cẩu trục',
    group: 'TB-TL',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng cơ khí',
    operatingHours: 2100,
    status: 'active',
    manufacturer: 'Liebherr',
    model: 'CT-50T',
    installDate: '2023-01-10',
    maintenanceThreshold: 2500,
    maintenanceHistory: [],
    repairHistory: [],
  },
  {
    id: 'TB-008',
    name: 'Máy phát điện MFD-2000',
    type: 'Máy phát điện',
    group: 'KDT',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Trạm điện trung tâm',
    operatingHours: 5500,
    status: 'active',
    manufacturer: 'Cummins',
    model: 'MFD-2000',
    installDate: '2020-11-25',
    maintenanceThreshold: 6000,
    maintenanceHistory: [
      { id: 'MH-008', date: '2024-03-20', type: 'Bảo dưỡng định kỳ', description: 'Thay dầu, lọc nhiên liệu, kiểm tra ắc quy', technician: 'Phạm Văn D' },
    ],
    repairHistory: [],
  },
  {
    id: 'TB-009',
    name: 'Xe gạt đất Komatsu D375A',
    type: 'Xe gạt',
    group: 'XG',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng khai thác 1',
    operatingHours: 4400,
    status: 'maintenance',
    manufacturer: 'Komatsu',
    model: 'D375A',
    installDate: '2021-05-20',
    maintenanceThreshold: 4500,
    maintenanceHistory: [
      { id: 'MH-009', date: '2024-04-05', type: 'Bảo dưỡng theo giờ', description: 'Thay lưỡi gạt, kiểm tra xích', technician: 'Nguyễn Văn A' },
    ],
    repairHistory: [],
  },
  {
    id: 'TB-010',
    name: 'Quạt thông gió QTG-300',
    type: 'Quạt thông gió',
    group: 'TQ',
    assetType: 'TSCĐ',
    quantity: 1,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Hầm lò khu vực A',
    operatingHours: 9800,
    status: 'active',
    manufacturer: 'Howden',
    model: 'QTG-300',
    installDate: '2019-06-15',
    maintenanceThreshold: 10000,
    maintenanceHistory: [
      { id: 'MH-010', date: '2024-02-10', type: 'Bảo dưỡng hàng tháng', description: 'Kiểm tra cánh quạt, bôi trơn ổ bi', technician: 'Trần Văn B' },
    ],
    repairHistory: [],
  },
  {
    id: 'TB-011',
    name: 'Máy sàng rung MSR-400',
    type: 'Máy sàng',
    group: 'BT-B650',
    assetType: 'CCDC',
    quantity: 4,
    maintenanceUnit: 'PX Cơ điện',
    location: 'Phân xưởng sàng tuyển',
    operatingHours: 3800,
    status: 'broken',
    manufacturer: 'Metso',
    model: 'MSR-400',
    installDate: '2022-02-28',
    maintenanceThreshold: 4000,
    maintenanceHistory: [
      { id: 'MH-011', date: '2024-01-25', type: 'Bảo dưỡng định kỳ', description: 'Thay lưới sàng, kiểm tra lò xo giảm chấn', technician: 'Lê Văn C' },
    ],
    repairHistory: [
      { id: 'RH-005', date: '2024-04-08', issue: 'Nứt khung sàng', description: 'Cần hàn sửa khung chính', technician: 'Phạm Văn D', cost: 35000000 },
    ],
  },
  {
    id: 'TB-012',
    name: 'Trạm biến áp TBA-110kV',
    type: 'Trạm biến áp',
    group: 'KDT', 
    assetType: 'TSCĐ', 
    quantity: 1, 
    maintenanceUnit: 'PX Cơ điện',
    location: 'Trạm điện trung tâm',
    operatingHours: 12000,
    status: 'active',
    manufacturer: 'ABB',
    model: 'TBA-110kV',
    installDate: '2018-08-10',
    maintenanceThreshold: 15000,
    maintenanceHistory: [
      { id: 'MH-012', date: '2024-03-01', type: 'Bảo dưỡng định kỳ', description: 'Kiểm tra dầu cách điện, đo điện trở cách điện', technician: 'Nguyễn Văn A' },
    ],
    repairHistory: [],
  },
];
