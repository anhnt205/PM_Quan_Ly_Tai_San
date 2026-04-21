export interface IncidentInspectionItem {
  stt: number;
  itemName: string;
  repairLevel: string;
  quantity: number;
  condition: string;
  actionRepair: boolean;
  actionReplace: boolean;
  note: string;
}

export interface IncidentInspectionSigner {
  order: number;
  name: string;
  title: string;
  departmentName: string;
  signed: boolean;
  signedAt?: string;
}

export interface IncidentInspectionRecord {
  id: string;
  incidentReportId: string;
  planId: string;
  number: string;
  inspectionDate: string;
  location: string;
  items: IncidentInspectionItem[];
  findings: string;
  recommendation: string;
  signers: IncidentInspectionSigner[];
  status: 'cho-duyet' | 'da-duyet';
  createdDate: string;
}

export const initialIncidentInspectionRecords: IncidentInspectionRecord[] = [
  // ── Thuộc SC-INC-20240105 (VTL2-SC-001) — giữ nguyên ──
  {
    id: 'BBKTKSC-2024-001',
    incidentReportId: 'SC-INC-20240105',
    planId: 'KH-2024-001',
    number: 'BBKTKSC/PX-ST/001/2024',
    inspectionDate: '10/01/2024',
    location: 'Phân xưởng sàng tuyển',
    items: [
      {
        stt: 1,
        itemName: 'Sửa chữa báo dương thiết bị',
        repairLevel: 'Chăm sóc thường xuyên',
        quantity: 1,
        condition: 'Lệch băng ~5cm, cần điều chỉnh căn chỉnh bánh dẫn',
        actionRepair: true,
        actionReplace: false,
        note: 'Ưu tiên xử lý',
      },
      {
        stt: 2,
        itemName: 'Sửa chữa báo dương thiết bị bổ sung',
        repairLevel: 'Sửa chữa định kỳ',
        quantity: 1,
        condition: 'Kiểm tra độ căng băng, con lăn mòn',
        actionRepair: true,
        actionReplace: true,
        note: 'Thay con lăn nếu cần',
      },
    ],
    findings: 'Báng tải BC-200 bị lệch do lỏng ốc bánh dẫn, con lăn #3 và #7 mòn 40%.',
    recommendation: 'Cần điều chỉnh lại căn chỉnh bánh dẫn, thay thế con lăn, kiểm tra hệ thống căng',
    signers: [
      { order: 1, name: 'Nguyễn Văn An', title: 'Quản đốc',        departmentName: 'Phân xưởng khai thác 1', signed: true, signedAt: '10/01/2024' },
      { order: 2, name: 'Lý Văn Nam',    title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',         signed: true, signedAt: '11/01/2024' },
      { order: 3, name: 'Ngô Văn Phúc', title: 'Quản đốc',        departmentName: 'Phân xưởng cơ khí',      signed: true, signedAt: '12/01/2024' },
    ],
    status: 'da-duyet',
    createdDate: '10/01/2024',
  },

  // ── Thuộc SC-INC-20240102 (VTL2-SC002) — MỚI, da-duyet ──
  {
    id: 'BBKTKSC-2024-002',
    incidentReportId: 'SC-INC-20240102',
    planId: 'KH-2024-001',
    number: 'BBKTKSC/PX-VT/002/2024',
    inspectionDate: '07/03/2024',
    location: 'Đầu băng — Phân xưởng vận tải',
    items: [
      {
        stt: 1,
        itemName: 'Motor kéo DL01 55 kW/380 V',
        repairLevel: 'Sửa chữa thử nghiệm',
        quantity: 1,
        condition: 'Cháy cuộn dây stato tầng 2–3, không thể phục hồi',
        actionRepair: false,
        actionReplace: true,
        note: '55 kW / 380 V / 1450 rpm',
      },
      {
        stt: 2,
        itemName: 'Relay nhiệt LS MT-63',
        repairLevel: 'Sửa chữa định kỳ',
        quantity: 1,
        condition: 'Ngưỡng tác động lệch +12%, không bảo vệ đúng',
        actionRepair: false,
        actionReplace: true,
        note: 'Kiểm tra lại tủ điện',
      },
      {
        stt: 3,
        itemName: 'Cáp động lực 3×16 mm²',
        repairLevel: 'Chăm sóc thường xuyên',
        quantity: 10,
        condition: 'Vỏ cách điện xém nhẹ đoạn tủ → motor, đo cách điện còn đạt',
        actionRepair: true,
        actionReplace: false,
        note: 'Bọc lại ~10 m',
      },
    ],
    findings:
      'Motor kéo DL01 cháy hoàn toàn cuộn stato do quá tải kéo dài. Relay nhiệt bảo vệ không tác động đúng ngưỡng. Cáp động lực xém vỏ nhẹ nhưng cách điện còn đạt yêu cầu.',
    recommendation:
      'Thay motor mới 55 kW/380 V/1450 rpm. Thay relay nhiệt LS MT-63 mới. Bọc lại cáp động lực đoạn bị xém. Kiểm tra tải thực tế sau khi lắp đặt.',
    signers: [
      { order: 1, name: 'Hoàng Văn Em', title: 'Quản đốc',        departmentName: 'Phân xưởng vận tải', signed: true, signedAt: '07/03/2024' },
      { order: 2, name: 'Lý Văn Nam',   title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '08/03/2024' },
      { order: 3, name: 'Phan Văn Oanh', title: 'Phó phòng KT',   departmentName: 'Phòng Kỹ thuật',     signed: true, signedAt: '09/03/2024' },
    ],
    status: 'da-duyet',
    createdDate: '07/03/2024',
  },
];