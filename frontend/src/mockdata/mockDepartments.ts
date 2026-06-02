export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  departmentId: string;
  title: string;
}

export const departments: Department[] = [
  { id: 'PB-01', name: 'Phân xưởng khai thác 1' },
  { id: 'PB-02', name: 'Phân xưởng khai thác 2' },
  { id: 'PB-03', name: 'Phân xưởng vận tải' },
  { id: 'PB-04', name: 'Phân xưởng cơ khí' },
  { id: 'PB-05', name: 'Phân xưởng sàng tuyển' },
  { id: 'PB-06', name: 'Phân xưởng thoát nước' },
  { id: 'PB-07', name: 'Phân xưởng chế biến' },
  { id: 'PB-08', name: 'Trạm điện trung tâm' },
  { id: 'PB-09', name: 'Phòng Kỹ thuật' },
  { id: 'PB-10', name: 'Ban Giám đốc' },
];

export const users: User[] = [
  { id: 'NV-01', name: 'Nguyễn Văn An', departmentId: 'PB-01', title: 'Quản đốc' },
  { id: 'NV-02', name: 'Trần Văn Bình', departmentId: 'PB-01', title: 'Kỹ sư cơ khí' },
  { id: 'NV-03', name: 'Lê Văn Cường', departmentId: 'PB-02', title: 'Quản đốc' },
  { id: 'NV-04', name: 'Phạm Văn Dũng', departmentId: 'PB-02', title: 'Thợ máy' },
  { id: 'NV-05', name: 'Hoàng Văn Em', departmentId: 'PB-03', title: 'Quản đốc' },
  { id: 'NV-06', name: 'Ngô Văn Phúc', departmentId: 'PB-04', title: 'Quản đốc' },
  { id: 'NV-07', name: 'Đỗ Văn Giang', departmentId: 'PB-04', title: 'Kỹ sư cơ khí' },
  { id: 'NV-08', name: 'Vũ Văn Hải', departmentId: 'PB-05', title: 'Quản đốc' },
  { id: 'NV-09', name: 'Bùi Văn Khang', departmentId: 'PB-06', title: 'Quản đốc' },
  { id: 'NV-10', name: 'Đinh Văn Long', departmentId: 'PB-07', title: 'Quản đốc' },
  { id: 'NV-11', name: 'Trịnh Văn Minh', departmentId: 'PB-08', title: 'Trưởng trạm' },
  { id: 'NV-12', name: 'Lý Văn Nam', departmentId: 'PB-09', title: 'Trưởng phòng KT' },
  { id: 'NV-13', name: 'Phan Văn Oanh', departmentId: 'PB-09', title: 'Phó phòng KT' },
  { id: 'NV-14', name: 'Dương Văn Phong', departmentId: 'PB-10', title: 'Giám đốc' },
  { id: 'NV-15', name: 'Tô Văn Quân', departmentId: 'PB-10', title: 'Phó Giám đốc' },
];

// Map devices to departments by their location
export const departmentDeviceMap: Record<string, string[]> = {
  'PB-01': ['TB-001', 'TB-009'],
  'PB-02': ['TB-002'],
  'PB-03': ['TB-003'],
  'PB-04': ['TB-007'],
  'PB-05': ['TB-004', 'TB-011'],
  'PB-06': ['TB-006'],
  'PB-07': ['TB-005'],
  'PB-08': ['TB-008', 'TB-012'],
};
