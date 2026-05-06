export interface DeviceInspectionEntry {
  idSuaChuaChiTiet?: string;
  deviceId: string;
  deviceName: string;
  unit: string;
  quantity: number;
  technicalCondition: string;
  actionRepair: boolean;
  actionReplace: boolean;
  note: string;
}

export interface InspectionSigner {
  order: number;
  name: string;
  title: string;
  departmentName: string;
  signed: boolean;
  signedAt?: string;
}

export interface TechnicalInspectionRecord {
  id: string;
  repairRequestId: string;
  // Field mới: liên kết từ BB Kiểm tra sự cố (khi không qua GĐ sửa chữa)
  incidentInspectionRecordId?: string;
  planId: string;
  number: string;
  inspectionDate: string;
  location: string;
  deviceEntries: DeviceInspectionEntry[];
  recoveryCount: number;
  scrapCount: number;
  destroyCount: number;
  signers: InspectionSigner[];
  status: 'cho-duyet' | 'dang-ky' | 'da-duyet';
  createdDate: string;
}

export interface MaterialItem {
  groupLabel: string;
  groupDevice: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  note: string;
}

export interface AcceptanceTestRecord {
  id: string;
  inspectionRecordId: string;
  repairRequestId: string;
  planId: string;
  number: string;
  date: string;
  location: string;
  deviceName: string;
  registrationNumber: string;
  repairLevel: string;
  materialItems: MaterialItem[];
  testResult: string;
  acceptanceContent: string;
  signers: InspectionSigner[];
  status: 'cho-duyet' | 'dang-ky' | 'da-duyet';
  createdDate: string;
}

export interface MaterialRecoveryItem {
  name: string;
  unit: string;
  quantity: number;
  condition: string;
  treatment: string;
  note: string;
}

export interface MaterialQualityRecord {
  id: string;
  acceptanceRecordId: string;
  repairRequestId: string;
  planId: string;
  number: string;
  date: string;
  location: string;
  repairLevel: string;
  deviceName: string;
  deviceType: string;
  deviceSerial: string;
  managementUnit: string;
  items: MaterialRecoveryItem[];
  recoveryCount: number;
  scrapCount: number;
  destroyCount: number;
  signers: InspectionSigner[];
  status: 'cho-duyet' | 'dang-ky' | 'da-duyet';
  createdDate: string;
}

// ===== MOCK DATA =====

export const initialInspectionRecords: TechnicalInspectionRecord[] = [
  // ── Luồng GĐ sửa chữa thông thường (giữ nguyên) ──
  {
    id: 'BBGD-2024-001',
    repairRequestId: 'GDN-2024-001',
    planId: 'KH-2024-001',
    number: 'BBGD/PX-KT1/001/2024',
    inspectionDate: '10/01/2024',
    location: 'Phân xưởng khai thác 1',
    deviceEntries: [
      {
        deviceId: 'TB-001',
        deviceName: 'Máy xúc lật CAT 994K',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Hệ thống thủy lực rò rỉ nhẹ tại joint xi lanh nâng, cần thay seal và bổ sung dầu',
        actionRepair: true,
        actionReplace: false,
        note: 'Ưu tiên xử lý',
      },
      {
        deviceId: 'TB-004',
        deviceName: 'Băng tải than BC-200',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Độ căng băng giảm 15%, con lăn #3 và #7 mòn cần thay',
        actionRepair: true,
        actionReplace: true,
        note: 'Thay 2 con lăn',
      },
    ],
    recoveryCount: 2,
    scrapCount: 0,
    destroyCount: 0,
    signers: [
      { order: 1, name: 'Lý Văn Nam',    title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '10/01/2024' },
      { order: 2, name: 'Phan Văn Oanh', title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '11/01/2024' },
      { order: 3, name: 'Nguyễn Văn An', title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: true, signedAt: '11/01/2024' },
      { order: 4, name: 'Ngô Văn Phúc', title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: true, signedAt: '12/01/2024' },
    ],
    status: 'da-duyet',
    createdDate: '10/01/2024',
  },
  {
    id: 'BBGD-2024-002',
    repairRequestId: 'GDN-2024-002',
    planId: 'KH-2024-001',
    number: 'BBGD/PX-KT1/002/2024',
    inspectionDate: '10/03/2024',
    location: 'Phân xưởng khai thác 1',
    deviceEntries: [
      {
        deviceId: 'TB-001',
        deviceName: 'Máy xúc lật CAT 994K',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Lọc dầu thủy lực bị tắc, áp suất giảm 20%. Cần thay lọc và kiểm tra bơm',
        actionRepair: true,
        actionReplace: true,
        note: 'Thay lọc dầu',
      },
      {
        deviceId: 'TB-003',
        deviceName: 'Xe tải Belaz 75710',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Má phanh mòn 60%, đĩa phanh có vết xước. Hệ thống lái cần căn chỉnh',
        actionRepair: true,
        actionReplace: true,
        note: 'Thay má phanh + đĩa phanh',
      },
    ],
    recoveryCount: 1,
    scrapCount: 1,
    destroyCount: 0,
    signers: [
      { order: 1, name: 'Lý Văn Nam',    title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '10/03/2024' },
      { order: 2, name: 'Phan Văn Oanh', title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '11/03/2024' },
      { order: 3, name: 'Nguyễn Văn An', title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: true, signedAt: '11/03/2024' },
      { order: 4, name: 'Ngô Văn Phúc', title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: true, signedAt: '12/03/2024' },
    ],
    status: 'da-duyet',
    createdDate: '10/03/2024',
  },
  {
    id: 'BBGD-2024-003',
    repairRequestId: 'GDN-2024-004',
    planId: 'KH-2024-001',
    number: 'BBGD/PX-KT1/003/2024',
    inspectionDate: '08/07/2024',
    location: 'Phân xưởng khai thác 1',
    deviceEntries: [
      {
        deviceId: 'TB-001',
        deviceName: 'Máy xúc lật CAT 994K',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Đại tu hệ thống thủy lực. Thay toàn bộ seal, ống dẫn dầu, bơm thủy lực',
        actionRepair: true,
        actionReplace: true,
        note: 'SC lớn',
      },
      {
        deviceId: 'TB-003',
        deviceName: 'Xe tải Belaz 75710',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Đại tu động cơ diesel. Cần thay piston, ring, gioăng nắp máy',
        actionRepair: true,
        actionReplace: true,
        note: 'SC lớn',
      },
      {
        deviceId: 'TB-004',
        deviceName: 'Băng tải than BC-200',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Thay băng tải mới, kiểm tra toàn bộ hệ thống con lăn và motor kéo',
        actionRepair: false,
        actionReplace: true,
        note: 'Thay mới băng tải',
      },
    ],
    recoveryCount: 3,
    scrapCount: 2,
    destroyCount: 1,
    signers: [
      { order: 1, name: 'Lý Văn Nam',    title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true,  signedAt: '08/07/2024' },
      { order: 2, name: 'Phan Văn Oanh', title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: false },
      { order: 3, name: 'Nguyễn Văn An', title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: false },
      { order: 4, name: 'Ngô Văn Phúc', title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '08/07/2024',
  },
  {
    id: 'BBGD-2024-004',
    repairRequestId: 'GDN-2024-005',
    planId: 'KH-2024-001',
    number: 'BBGD/PX-COK/004/2024',
    inspectionDate: '01/08/2024',
    location: 'Phân xưởng cơ khí',
    deviceEntries: [
      {
        deviceId: 'TB-007',
        deviceName: 'Cẩu trục CT-50T',
        unit: 'Cái',
        quantity: 1,
        technicalCondition: 'Cáp nâng mòn, cần kiểm tra và thay cáp nếu vượt giới hạn an toàn',
        actionRepair: true,
        actionReplace: false,
        note: 'Kiểm tra an toàn trước khi sửa',
      },
    ],
    recoveryCount: 0,
    scrapCount: 0,
    destroyCount: 0,
    signers: [
      { order: 1, name: 'Ngô Văn Phúc', title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí', signed: true, signedAt: '01/08/2024' },
      { order: 2, name: 'Lý Văn Nam',   title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',    signed: true, signedAt: '02/08/2024' },
    ],
    status: 'da-duyet',
    createdDate: '01/08/2024',
  },

  // ── Luồng sự cố VTL2-SC002: BB Giám định từ BBKTKSC-2024-002 — MỚI ──
  {
    id: 'BBGD-2024-SC002',
    repairRequestId: '',                              // không có GĐ sửa chữa
    incidentInspectionRecordId: 'BBKTKSC-2024-002',  // ← đến từ BB Kiểm tra sự cố
    planId: 'KH-2024-001',
    number: 'BBGD/PX-VT/SC002/2024',
    inspectionDate: '11/03/2024',
    location: 'Đầu băng — Phân xưởng vận tải',
    deviceEntries: [
      {
        deviceId: 'TB-002',
        deviceName: 'Máy khoan Sandvik DR461i',
        unit: 'Cái',
        quantity: 1,
        technicalCondition:
          'Motor kéo DL01 cháy hoàn toàn cuộn stato tầng 2–3, không thể rewinding. ' +
          'Relay nhiệt LS MT-63 ngưỡng lệch +12% so cài đặt gốc. ' +
          'Cáp 3×16 mm² đoạn ~10 m xém vỏ, cách điện đo được 1,8 MΩ còn đạt tối thiểu.',
        actionRepair: true,
        actionReplace: true,
        note: 'Thay motor + relay; bọc lại cáp',
      },
    ],
    recoveryCount: 0,
    scrapCount: 1,
    destroyCount: 0,
    signers: [
      { order: 1, name: 'Hoàng Văn Em',  title: 'Quản đốc',        departmentName: 'Phân xưởng vận tải', signed: true, signedAt: '11/03/2024' },
      { order: 2, name: 'Lý Văn Nam',    title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '12/03/2024' },
      { order: 3, name: 'Phan Văn Oanh', title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '12/03/2024' },
    ],
    status: 'da-duyet',
    createdDate: '11/03/2024',
  },
];

export const initialAcceptanceTestRecords: AcceptanceTestRecord[] = [
  // ── Luồng GĐ sửa chữa thông thường (giữ nguyên) ──
  {
    id: 'NT-2024-001',
    inspectionRecordId: 'BBGD-2024-001',
    repairRequestId: 'GDN-2024-001',
    planId: 'KH-2024-001',
    number: 'BB-NT/PX-KT1/001/2024',
    date: '2024-01-20',
    location: 'Phân xưởng khai thác 1',
    deviceName: 'Máy xúc lật CAT 994K, Băng tải than BC-200',
    registrationNumber: 'DK-001/2024',
    repairLevel: 'Chăm sóc thường xuyên',
    materialItems: [
      { groupLabel: 'I/', groupDevice: 'Máy xúc lật CAT 994K',  code: 'VT-001', name: 'Seal xi lanh thủy lực',          unit: 'Bộ',  quantity: 2,  note: '' },
      { groupLabel: 'I/', groupDevice: 'Máy xúc lật CAT 994K',  code: 'VT-002', name: 'Dầu thủy lực Shell Tellus S2 M46', unit: 'Lít', quantity: 80, note: '' },
      { groupLabel: 'II/', groupDevice: 'Băng tải than BC-200', code: 'VT-003', name: 'Con lăn băng tải Ø108',            unit: 'Cái', quantity: 2,  note: 'Thay #3 và #7' },
      { groupLabel: 'II/', groupDevice: 'Băng tải than BC-200', code: 'VT-004', name: 'Mỡ bò SKF LGMT 2',                unit: 'Kg',  quantity: 5,  note: '' },
    ],
    testResult: 'Thiết bị chạy thử đảm bảo yêu cầu kỹ thuật, hệ thống hoạt động ổn định',
    acceptanceContent: 'Đã sửa chữa seal xi lanh, bổ sung dầu thủy lực máy xúc. Thay 2 con lăn băng tải, bôi trơn toàn bộ hệ thống.',
    signers: [
      { order: 1, name: 'Lý Văn Nam',       title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '20/01/2024' },
      { order: 2, name: 'Phan Văn Oanh',    title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '20/01/2024' },
      { order: 3, name: 'Nguyễn Văn An',    title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: true, signedAt: '21/01/2024' },
      { order: 4, name: 'Ngô Văn Phúc',    title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: true, signedAt: '21/01/2024' },
      { order: 5, name: 'Dương Văn Phong', title: 'Phó Giám đốc',    departmentName: 'Ban Giám đốc',            signed: true, signedAt: '22/01/2024' },
    ],
    status: 'da-duyet',
    createdDate: '20/01/2024',
  },
  {
    id: 'NT-2024-002',
    inspectionRecordId: 'BBGD-2024-002',
    repairRequestId: 'GDN-2024-002',
    planId: 'KH-2024-001',
    number: 'BB-NT/PX-KT1/002/2024',
    date: '2024-03-18',
    location: 'Phân xưởng khai thác 1',
    deviceName: 'Máy xúc lật CAT 994K, Xe tải Belaz 75710',
    registrationNumber: 'DK-002/2024',
    repairLevel: 'Sửa chữa nhỏ',
    materialItems: [
      { groupLabel: 'I/',  groupDevice: 'Máy xúc lật CAT 994K', code: 'VT-010', name: 'Lọc dầu thủy lực CAT 1R-0739',    unit: 'Cái', quantity: 2,  note: '' },
      { groupLabel: 'I/',  groupDevice: 'Máy xúc lật CAT 994K', code: 'VT-011', name: 'Dầu thủy lực Shell Tellus S2 M46', unit: 'Lít', quantity: 50, note: '' },
      { groupLabel: 'II/', groupDevice: 'Xe tải Belaz 75710',   code: 'VT-012', name: 'Má phanh Belaz 75710',             unit: 'Bộ',  quantity: 1,  note: '' },
      { groupLabel: 'II/', groupDevice: 'Xe tải Belaz 75710',   code: 'VT-013', name: 'Đĩa phanh Belaz 75710',            unit: 'Cái', quantity: 2,  note: '' },
    ],
    testResult: 'Hệ thống phanh và lái đảm bảo yêu cầu an toàn, thủy lực máy xúc hoạt động bình thường',
    acceptanceContent: 'Thay lọc dầu thủy lực, bổ sung dầu máy xúc. Thay má phanh + đĩa phanh xe tải, căn chỉnh hệ thống lái.',
    signers: [
      { order: 1, name: 'Lý Văn Nam',       title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true,  signedAt: '18/03/2024' },
      { order: 2, name: 'Phan Văn Oanh',    title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: true,  signedAt: '18/03/2024' },
      { order: 3, name: 'Nguyễn Văn An',    title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: false },
      { order: 4, name: 'Ngô Văn Phúc',    title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: false },
      { order: 5, name: 'Dương Văn Phong', title: 'Phó Giám đốc',    departmentName: 'Ban Giám đốc',            signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '18/03/2024',
  },
  {
    id: 'NT-2024-003',
    inspectionRecordId: 'BBGD-2024-004',
    repairRequestId: 'GDN-2024-005',
    planId: 'KH-2024-001',
    number: 'BB-NT/PX-COK/003/2024',
    date: '2024-08-05',
    location: 'Phân xưởng cơ khí',
    deviceName: 'Cẩu trục CT-50T',
    registrationNumber: 'DK-003/2024',
    repairLevel: 'Sửa chữa thử nghiệm',
    materialItems: [
      { groupLabel: 'I/', groupDevice: 'Cẩu trục CT-50T', code: 'VT-100', name: 'Cáp thép 12mm', unit: 'm',   quantity: 20, note: 'Dự phòng thay thế' },
      { groupLabel: 'I/', groupDevice: 'Cẩu trục CT-50T', code: 'VT-101', name: 'Buli dẫn cáp',  unit: 'Cái', quantity: 2,  note: '' },
    ],
    testResult: 'Thiết bị chạy thử ổn định, đáp ứng yêu cầu an toàn',
    acceptanceContent: 'Kiểm tra tải thử, thay cáp hỏng và bôi mỡ các chi tiết mòn. Thiết bị hoạt động bình thường.',
    signers: [
      { order: 1, name: 'Ngô Văn Phúc',    title: 'Quản đốc',     departmentName: 'Phân xưởng cơ khí', signed: true, signedAt: '01/08/2024' },
      { order: 2, name: 'Lý Văn Nam',      title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật', signed: true, signedAt: '02/08/2024' },
      { order: 3, name: 'Dương Văn Phong', title: 'Phó Giám đốc', departmentName: 'Ban Giám đốc',      signed: true, signedAt: '03/08/2024' },
    ],
    status: 'da-duyet',
    createdDate: '05/08/2024',
  },

  // ── Luồng sự cố VTL2-SC002: BB Nghiệm thu từ BBGD-2024-SC002 — MỚI ──
  {
    id: 'NT-2024-SC002',
    inspectionRecordId: 'BBGD-2024-SC002',
    repairRequestId: '',
    planId: 'KH-2024-001',
    number: 'BB-NT/PX-VT/SC002/2024',
    date: '2024-03-18',
    location: 'Đầu băng — Phân xưởng vận tải',
    deviceName: 'Máy khoan Sandvik DR461i (Motor kéo DL01)',
    registrationNumber: 'DK-SC002/2024',
    repairLevel: 'Sửa chữa thử nghiệm',
    materialItems: [
      { groupLabel: 'I/', groupDevice: 'Motor kéo DL01',   code: 'VT-SC001', name: 'Motor 55 kW/380 V/1450 rpm (mới)',   unit: 'Bộ',  quantity: 1,  note: 'Kèm tài liệu xuất xứ' },
      { groupLabel: 'I/', groupDevice: 'Relay nhiệt',       code: 'VT-SC002', name: 'Relay nhiệt LS MT-63 (mới)',         unit: 'Cái', quantity: 1,  note: '' },
      { groupLabel: 'I/', groupDevice: 'Cáp động lực',      code: 'VT-SC003', name: 'Băng keo cách điện tự dính 3M 130C', unit: 'Cuộn', quantity: 2, note: 'Bọc lại cáp 3×16 mm²' },
    ],
    testResult:
      'Motor mới: cách điện 4,2 MΩ — Đạt; dòng không tải 35,5 A — Đạt. ' +
      'Relay nhiệt tác động tại 47 A — Đạt. ' +
      'Cáp sau bọc lại: cách điện pha–vỏ 1,8 MΩ — Đạt. ' +
      'Chạy thử không tải 30 phút: nhiệt độ motor 62 °C — Đạt.',
    acceptanceContent:
      'Thay motor kéo DL01 mới 55 kW. Thay relay nhiệt LS MT-63. ' +
      'Bọc lại ~10 m cáp 3×16 mm². Chạy thử không tải 30 phút đạt yêu cầu. ' +
      'Đồng ý đưa thiết bị vào vận hành.',
    signers: [
      { order: 1, name: 'Hoàng Văn Em',   title: 'Quản đốc',        departmentName: 'Phân xưởng vận tải', signed: true, signedAt: '18/03/2024' },
      { order: 2, name: 'Lý Văn Nam',     title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '18/03/2024' },
      { order: 3, name: 'Phan Văn Oanh',  title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '19/03/2024' },
      { order: 4, name: 'Tô Văn Quân',   title: 'Phó Giám đốc',    departmentName: 'Ban Giám đốc',        signed: true, signedAt: '19/03/2024' },
    ],
    status: 'da-duyet',
    createdDate: '18/03/2024',
  },
];

export const initialMaterialQualityRecords: MaterialQualityRecord[] = [
  // ── Luồng GĐ sửa chữa thông thường (giữ nguyên) ──
  {
    id: 'DG-2024-001',
    acceptanceRecordId: 'NT-2024-001',
    repairRequestId: 'GDN-2024-001',
    planId: 'KH-2024-001',
    number: 'BB-DG/PX-KT1/001/2024',
    date: '2024-01-25',
    location: 'Phân xưởng khai thác 1',
    repairLevel: 'Chăm sóc thường xuyên',
    deviceName: 'Máy xúc lật CAT 994K, Băng tải than BC-200',
    deviceType: 'Máy xúc / Băng tải',
    deviceSerial: 'DK-001/2024',
    managementUnit: 'Phân xưởng khai thác 1',
    items: [
      { name: 'Seal xi lanh cũ (bộ)',          unit: 'Bộ',  quantity: 2,  condition: 'Rách, biến dạng',           treatment: 'Phế liệu',               note: '' },
      { name: 'Con lăn băng tải cũ Ø108',       unit: 'Cái', quantity: 2,  condition: 'Mòn trục, ổ bi kẹt',        treatment: 'Phục hồi 1, phế liệu 1',  note: '' },
      { name: 'Dầu thủy lực cũ',               unit: 'Lít', quantity: 30, condition: 'Nhiễm bẩn, mất tính năng',  treatment: 'Hủy theo quy trình',      note: '' },
    ],
    recoveryCount: 1,
    scrapCount: 3,
    destroyCount: 1,
    signers: [
      { order: 1, name: 'Lý Văn Nam',       title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true,  signedAt: '25/01/2024' },
      { order: 2, name: 'Phan Văn Oanh',    title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',         signed: true,  signedAt: '25/01/2024' },
      { order: 3, name: 'Nguyễn Văn An',    title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: false },
      { order: 4, name: 'Ngô Văn Phúc',    title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: false },
      { order: 5, name: 'Dương Văn Phong', title: 'Phó Giám đốc',    departmentName: 'Ban Giám đốc',            signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '25/01/2024',
  },

  // ── Luồng sự cố VTL2-SC002: BB Đánh giá vật tư từ NT-2024-SC002 — MỚI ──
  {
    id: 'DG-2024-SC002',
    acceptanceRecordId: 'NT-2024-SC002',
    repairRequestId: '',
    planId: 'KH-2024-001',
    number: 'BB-DG/PX-VT/SC002/2024',
    date: '2024-03-20',
    location: 'Đầu băng — Phân xưởng vận tải',
    repairLevel: 'Sửa chữa thử nghiệm',
    deviceName: 'Máy khoan Sandvik DR461i (Motor kéo DL01)',
    deviceType: 'Motor điện / Thiết bị điện',
    deviceSerial: 'DK-SC002/2024',
    managementUnit: 'Phân xưởng vận tải',
    items: [
      {
        name: 'Motor kéo DL01 55 kW cũ (cháy)',
        unit: 'Bộ',
        quantity: 1,
        condition: 'Cháy hoàn toàn cuộn stato, vỏ xém',
        treatment: 'Thanh lý theo quy trình nội bộ',
        note: 'Lập biên bản thanh lý riêng',
      },
      {
        name: 'Relay nhiệt LS MT-63 cũ',
        unit: 'Cái',
        quantity: 1,
        condition: 'Ngưỡng lệch +12%, không còn đáng tin cậy',
        treatment: 'Phế liệu',
        note: '',
      },
      {
        name: 'Cáp động lực 3×16 mm² đoạn cắt bỏ',
        unit: 'Mét',
        quantity: 2,
        condition: 'Cháy xém vỏ hoàn toàn, cách điện 0 MΩ',
        treatment: 'Phế liệu đồng',
        note: 'Đoạn ~2 m không thể bọc lại',
      },
    ],
    recoveryCount: 0,
    scrapCount: 2,
    destroyCount: 1,
    signers: [
      { order: 1, name: 'Hoàng Văn Em',   title: 'Quản đốc',        departmentName: 'Phân xưởng vận tải', signed: true,  signedAt: '20/03/2024' },
      { order: 2, name: 'Lý Văn Nam',     title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',     signed: true,  signedAt: '20/03/2024' },
      { order: 3, name: 'Phan Văn Oanh',  title: 'Phó phòng KT',    departmentName: 'Phòng Kỹ thuật',     signed: false },
    ],
    status: 'cho-duyet',
    createdDate: '20/03/2024',
  },
];