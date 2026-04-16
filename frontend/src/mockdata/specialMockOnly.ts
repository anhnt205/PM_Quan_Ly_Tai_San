// ── MOCK DATA ────────────────────────────────────────────

export const donViList = ['Xí Nghiệp A', 'Xí Nghiệp B', 'Xí Nghiệp C'];

export const thietBiByDonVi: Record<string, { id: string; name: string; ma: string; vitri: string; nhom: string }[]> = {
  'Xí Nghiệp A': [
    { id: 'BOM-001', name: 'Máy bơm 01 - P01', ma: 'BOM-001', vitri: 'Trạm bơm số 1', nhom: 'Bơm nước' },
    { id: 'BOM-002', name: 'Máy bơm 02 - P02', ma: 'BOM-002', vitri: 'Trạm bơm số 2', nhom: 'Bơm nước' },
    { id: 'QG-001', name: 'Quạt gió lò 1', ma: 'QG-001', vitri: 'Lò chợ 1', nhom: 'Quạt gió' },
  ],
  'Xí Nghiệp B': [
    { id: 'MC-001', name: 'Máng cào 01', ma: 'MC-001', vitri: 'Lò chợ 2', nhom: 'Máng cào' },
    { id: 'TD-001', name: 'Tời điện 01', ma: 'TD-001', vitri: 'Giếng chính', nhom: 'Tời điện' },
  ],
  'Xí Nghiệp C': [
    { id: 'BT-001', name: 'Băng tải B800-01', ma: 'BT-001', vitri: 'Sân công nghiệp', nhom: 'Băng tải' },
    { id: 'MNK-001', name: 'Máy nén khí 01', ma: 'MNK-001', vitri: 'Trạm khí nén', nhom: 'Máy nén khí' },
  ],
};

export const namList = ['2022', '2023', '2024', '2025'];

export interface ThietBiDetail {
  tinhTrang: string;
  tinhTrangColor: string;
  tongGioChay: number;
  tongGioChayDate: string;
  lanSCTiepTheo: string;
  lanSCTiepTheoDate: string;
  ghiChu: string;
}

export const thietBiDetails: Record<string, ThietBiDetail> = {
  'BOM-001': {
    tinhTrang: 'Đang vận hành',
    tinhTrangColor: '#22c55e',
    tongGioChay: 1250,
    tongGioChayDate: '15/03/2024',
    lanSCTiepTheo: 'SCN',
    lanSCTiepTheoDate: '15/05/2024',
    ghiChu: 'Máy hoạt động ổn định, cần kiểm tra phớt bơm ở kỳ bảo dưỡng kế.',
  },
  'BOM-002': {
    tinhTrang: 'Đang sửa chữa',
    tinhTrangColor: '#f59e0b',
    tongGioChay: 980,
    tongGioChayDate: '10/03/2024',
    lanSCTiepTheo: 'SCC',
    lanSCTiepTheoDate: '01/06/2024',
    ghiChu: 'Đang thay vòng bi trục chính.',
  },
  'QG-001': {
    tinhTrang: 'Đang vận hành',
    tinhTrangColor: '#22c55e',
    tongGioChay: 2100,
    tongGioChayDate: '20/03/2024',
    lanSCTiepTheo: 'CST',
    lanSCTiepTheoDate: '20/04/2024',
    ghiChu: 'Hoạt động bình thường.',
  },
  'MC-001': {
    tinhTrang: 'Dừng máy',
    tinhTrangColor: '#ef4444',
    tongGioChay: 560,
    tongGioChayDate: '01/03/2024',
    lanSCTiepTheo: 'SCC',
    lanSCTiepTheoDate: '15/05/2024',
    ghiChu: 'Dừng máy chờ phụ tùng thay thế.',
  },
  'TD-001': {
    tinhTrang: 'Đang vận hành',
    tinhTrangColor: '#22c55e',
    tongGioChay: 3200,
    tongGioChayDate: '18/03/2024',
    lanSCTiepTheo: 'SCN',
    lanSCTiepTheoDate: '18/04/2024',
    ghiChu: 'Cáp tời cần kiểm tra định kỳ.',
  },
  'BT-001': {
    tinhTrang: 'Đang vận hành',
    tinhTrangColor: '#22c55e',
    tongGioChay: 4100,
    tongGioChayDate: '22/03/2024',
    lanSCTiepTheo: 'CST',
    lanSCTiepTheoDate: '29/03/2024',
    ghiChu: 'Băng tải hoạt động tốt.',
  },
  'MNK-001': {
    tinhTrang: 'Bảo dưỡng',
    tinhTrangColor: '#3b82f6',
    tongGioChay: 1800,
    tongGioChayDate: '12/03/2024',
    lanSCTiepTheo: 'SCN',
    lanSCTiepTheoDate: '12/05/2024',
    ghiChu: 'Đang thực hiện bảo dưỡng định kỳ quý.',
  },
};

export interface SummaryStats {
  keHoach: { daTao: number; choDuyet: number };
  lenhSuaChua: { daHoanThanh: number; dangXuLy: number; dotXuat: number };
  bienBanGiamDinh: { daTao: number; choDuyet: number };
  phieuLinhVatTu: { daDuyet: number; doDuyet: number };
  nghiemThu: { hoanThanh: number; cho: number };
}

export const summaryByThietBi: Record<string, SummaryStats> = {
  'BOM-001': {
    keHoach: { daTao: 18, choDuyet: 3 },
    lenhSuaChua: { daHoanThanh: 42, dangXuLy: 5, dotXuat: 1 },
    bienBanGiamDinh: { daTao: 42, choDuyet: 2 },
    phieuLinhVatTu: { daDuyet: 126, doDuyet: 8 },
    nghiemThu: { hoanThanh: 38, cho: 4 },
  },
  'BOM-002': {
    keHoach: { daTao: 10, choDuyet: 1 },
    lenhSuaChua: { daHoanThanh: 20, dangXuLy: 2, dotXuat: 0 },
    bienBanGiamDinh: { daTao: 20, choDuyet: 1 },
    phieuLinhVatTu: { daDuyet: 60, doDuyet: 3 },
    nghiemThu: { hoanThanh: 18, cho: 2 },
  },
  'QG-001': {
    keHoach: { daTao: 12, choDuyet: 2 },
    lenhSuaChua: { daHoanThanh: 30, dangXuLy: 3, dotXuat: 2 },
    bienBanGiamDinh: { daTao: 28, choDuyet: 0 },
    phieuLinhVatTu: { daDuyet: 88, doDuyet: 5 },
    nghiemThu: { hoanThanh: 25, cho: 1 },
  },
  'MC-001': {
    keHoach: { daTao: 8, choDuyet: 0 },
    lenhSuaChua: { daHoanThanh: 15, dangXuLy: 1, dotXuat: 0 },
    bienBanGiamDinh: { daTao: 14, choDuyet: 1 },
    phieuLinhVatTu: { daDuyet: 40, doDuyet: 2 },
    nghiemThu: { hoanThanh: 12, cho: 0 },
  },
  'TD-001': {
    keHoach: { daTao: 22, choDuyet: 4 },
    lenhSuaChua: { daHoanThanh: 50, dangXuLy: 6, dotXuat: 3 },
    bienBanGiamDinh: { daTao: 48, choDuyet: 3 },
    phieuLinhVatTu: { daDuyet: 140, doDuyet: 10 },
    nghiemThu: { hoanThanh: 44, cho: 5 },
  },
  'BT-001': {
    keHoach: { daTao: 15, choDuyet: 2 },
    lenhSuaChua: { daHoanThanh: 35, dangXuLy: 4, dotXuat: 1 },
    bienBanGiamDinh: { daTao: 33, choDuyet: 1 },
    phieuLinhVatTu: { daDuyet: 100, doDuyet: 6 },
    nghiemThu: { hoanThanh: 30, cho: 3 },
  },
  'MNK-001': {
    keHoach: { daTao: 9, choDuyet: 1 },
    lenhSuaChua: { daHoanThanh: 18, dangXuLy: 2, dotXuat: 0 },
    bienBanGiamDinh: { daTao: 16, choDuyet: 0 },
    phieuLinhVatTu: { daDuyet: 55, doDuyet: 4 },
    nghiemThu: { hoanThanh: 15, cho: 1 },
  },
};

export interface QuyTrinhItem {
  ma: string;
  trang: 'da-duyet' | 'cho-duyet' | 'cho-ky' | 'dot-xuat';
}

export interface QuyTrinhStep {
  keHoach: QuyTrinhItem[];
  lenhSuaChua: QuyTrinhItem[];
  bienBanGiamDinh: QuyTrinhItem[];
  phieuLinhVatTu: QuyTrinhItem[];
  nghiemThu: QuyTrinhItem[];
  lenhDotXuat?: { hoaThanhCount: number; dangXuLyCount: number };
}

export const quyTrinhByThietBi: Record<string, QuyTrinhStep> = {
  'BOM-001': {
    lenhDotXuat: { hoaThanhCount: 1, dangXuLyCount: 1 },
    keHoach: [
      { ma: 'KH-2024-P01-001', trang: 'da-duyet' },
    ],
    lenhSuaChua: [
      { ma: 'SC-20240301', trang: 'da-duyet' },
      { ma: 'SC-20240315', trang: 'cho-ky' },
      { ma: 'SC-20240402', trang: 'dot-xuat' },
    ],
    bienBanGiamDinh: [
      { ma: 'GD-20240301', trang: 'da-duyet' },
      { ma: 'GD-20240402', trang: 'cho-duyet' },
    ],
    phieuLinhVatTu: [
      { ma: 'VT-20240301-01', trang: 'da-duyet' },
      { ma: 'VT-20240301-02', trang: 'da-duyet' },
      { ma: 'VT-20240402-01', trang: 'cho-duyet' },
    ],
    nghiemThu: [
      { ma: 'NT-20240301', trang: 'da-duyet' },
      { ma: 'NT-20240402', trang: 'cho-duyet' },
    ],
  },
  'BOM-002': {
    keHoach: [{ ma: 'KH-2024-P02-001', trang: 'da-duyet' }],
    lenhSuaChua: [{ ma: 'SC-20240210', trang: 'da-duyet' }],
    bienBanGiamDinh: [{ ma: 'GD-20240210', trang: 'da-duyet' }],
    phieuLinhVatTu: [{ ma: 'VT-20240210-01', trang: 'da-duyet' }],
    nghiemThu: [{ ma: 'NT-20240210', trang: 'da-duyet' }],
  },
  'QG-001': {
    lenhDotXuat: { hoaThanhCount: 2, dangXuLyCount: 0 },
    keHoach: [{ ma: 'KH-2024-QG-001', trang: 'da-duyet' }],
    lenhSuaChua: [
      { ma: 'SC-20240115', trang: 'da-duyet' },
      { ma: 'SC-20240301', trang: 'cho-ky' },
    ],
    bienBanGiamDinh: [{ ma: 'GD-20240301', trang: 'cho-duyet' }],
    phieuLinhVatTu: [
      { ma: 'VT-20240115-01', trang: 'da-duyet' },
      { ma: 'VT-20240301-01', trang: 'cho-duyet' },
    ],
    nghiemThu: [{ ma: 'NT-20240115', trang: 'da-duyet' }],
  },
  'MC-001': {
    keHoach: [{ ma: 'KH-2024-MC-001', trang: 'da-duyet' }],
    lenhSuaChua: [{ ma: 'SC-20240120', trang: 'da-duyet' }],
    bienBanGiamDinh: [{ ma: 'GD-20240120', trang: 'da-duyet' }],
    phieuLinhVatTu: [{ ma: 'VT-20240120-01', trang: 'da-duyet' }],
    nghiemThu: [{ ma: 'NT-20240120', trang: 'da-duyet' }],
  },
  'TD-001': {
    lenhDotXuat: { hoaThanhCount: 3, dangXuLyCount: 0 },
    keHoach: [{ ma: 'KH-2024-TD-001', trang: 'da-duyet' }],
    lenhSuaChua: [
      { ma: 'SC-20240201', trang: 'da-duyet' },
      { ma: 'SC-20240315', trang: 'cho-ky' },
      { ma: 'SC-20240402', trang: 'cho-duyet' },
    ],
    bienBanGiamDinh: [
      { ma: 'GD-20240201', trang: 'da-duyet' },
      { ma: 'GD-20240402', trang: 'cho-duyet' },
    ],
    phieuLinhVatTu: [
      { ma: 'VT-20240201-01', trang: 'da-duyet' },
      { ma: 'VT-20240315-01', trang: 'cho-duyet' },
    ],
    nghiemThu: [
      { ma: 'NT-20240201', trang: 'da-duyet' },
      { ma: 'NT-20240402', trang: 'cho-duyet' },
    ],
  },
  'BT-001': {
    keHoach: [{ ma: 'KH-2024-BT-001', trang: 'da-duyet' }],
    lenhSuaChua: [
      { ma: 'SC-20240205', trang: 'da-duyet' },
      { ma: 'SC-20240320', trang: 'cho-ky' },
    ],
    bienBanGiamDinh: [{ ma: 'GD-20240205', trang: 'da-duyet' }],
    phieuLinhVatTu: [{ ma: 'VT-20240205-01', trang: 'da-duyet' }],
    nghiemThu: [{ ma: 'NT-20240205', trang: 'da-duyet' }],
  },
  'MNK-001': {
    keHoach: [{ ma: 'KH-2024-MNK-001', trang: 'da-duyet' }],
    lenhSuaChua: [{ ma: 'SC-20240310', trang: 'da-duyet' }],
    bienBanGiamDinh: [{ ma: 'GD-20240310', trang: 'da-duyet' }],
    phieuLinhVatTu: [{ ma: 'VT-20240310-01', trang: 'da-duyet' }],
    nghiemThu: [{ ma: 'NT-20240310', trang: 'da-duyet' }],
  },
};

export interface PhieuRow {
  id: number;
  thietBi: string;
  thietBiId: string;
  lenhSuaChua: string;
  bienBanGiamDinh: string;
  bienBanGiamDinhOk: boolean;
  phieuLinhVT: string;
  phieuLinhVTOk: boolean;
  phieuLinhVatTu: string;
  phieuLinhVatTuOk: boolean;
  trangThai: string;
  trangThaiColor: string;
}

export const phieuByThietBi: Record<string, PhieuRow[]> = {
  'BOM-001': [
    { id: 1, thietBi: 'Máy bơm 01', thietBiId: 'P01', lenhSuaChua: 'SC-20240301', bienBanGiamDinh: 'SC-20240031', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240301-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240301-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
    { id: 2, thietBi: 'Máy bơm 01', thietBiId: 'P01', lenhSuaChua: 'SC-20240315', bienBanGiamDinh: 'GD-20240315', bienBanGiamDinhOk: false, phieuLinhVT: 'VT-20240314', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240315-01', phieuLinhVatTuOk: true, trangThai: 'Chờ duyệt', trangThaiColor: '#f59e0b' },
    { id: 3, thietBi: 'Máy bơm 01', thietBiId: 'P01', lenhSuaChua: 'SC-20240402', bienBanGiamDinh: 'SC-20240402', bienBanGiamDinhOk: false, phieuLinhVT: 'VT-20240302-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240052-01', phieuLinhVatTuOk: true, trangThai: 'Chờ ký', trangThaiColor: '#3b82f6' },
    { id: 4, thietBi: 'Máy bơm 01', thietBiId: 'P01', lenhSuaChua: 'SC-20240802', bienBanGiamDinh: 'DT-20240402', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240002', phieuLinhVTOk: true, phieuLinhVatTu: 'NT-20240002', phieuLinhVatTuOk: false, trangThai: 'Chờ nghiệm thu', trangThaiColor: '#a855f7' },
  ],
  'BOM-002': [
    { id: 1, thietBi: 'Máy bơm 02', thietBiId: 'P02', lenhSuaChua: 'SC-20240210', bienBanGiamDinh: 'GD-20240210', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240210-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240210-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
  ],
  'QG-001': [
    { id: 1, thietBi: 'Quạt gió lò 1', thietBiId: 'QG-001', lenhSuaChua: 'SC-20240115', bienBanGiamDinh: 'GD-20240115', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240115-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240115-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
    { id: 2, thietBi: 'Quạt gió lò 1', thietBiId: 'QG-001', lenhSuaChua: 'SC-20240301', bienBanGiamDinh: 'GD-20240301', bienBanGiamDinhOk: false, phieuLinhVT: 'VT-20240301-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240301-02', phieuLinhVatTuOk: false, trangThai: 'Chờ duyệt', trangThaiColor: '#f59e0b' },
  ],
  'MC-001': [
    { id: 1, thietBi: 'Máng cào 01', thietBiId: 'MC-001', lenhSuaChua: 'SC-20240120', bienBanGiamDinh: 'GD-20240120', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240120-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240120-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
  ],
  'TD-001': [
    { id: 1, thietBi: 'Tời điện 01', thietBiId: 'TD-001', lenhSuaChua: 'SC-20240201', bienBanGiamDinh: 'GD-20240201', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240201-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240201-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
    { id: 2, thietBi: 'Tời điện 01', thietBiId: 'TD-001', lenhSuaChua: 'SC-20240315', bienBanGiamDinh: 'GD-20240315', bienBanGiamDinhOk: false, phieuLinhVT: 'VT-20240315-01', phieuLinhVTOk: false, phieuLinhVatTu: 'VT-20240315-02', phieuLinhVatTuOk: false, trangThai: 'Chờ ký', trangThaiColor: '#3b82f6' },
  ],
  'BT-001': [
    { id: 1, thietBi: 'Băng tải B800-01', thietBiId: 'BT-001', lenhSuaChua: 'SC-20240205', bienBanGiamDinh: 'GD-20240205', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240205-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240205-02', phieuLinhVatTuOk: true, trangThai: 'Hoàn thành', trangThaiColor: '#22c55e' },
  ],
  'MNK-001': [
    { id: 1, thietBi: 'Máy nén khí 01', thietBiId: 'MNK-001', lenhSuaChua: 'SC-20240310', bienBanGiamDinh: 'GD-20240310', bienBanGiamDinhOk: true, phieuLinhVT: 'VT-20240310-01', phieuLinhVTOk: true, phieuLinhVatTu: 'VT-20240310-02', phieuLinhVatTuOk: true, trangThai: 'Đang bảo dưỡng', trangThaiColor: '#3b82f6' },
  ],
};

export const tienDoByThietBi: Record<string, { label: string; ma: string; trang: 'done' | 'pending' | 'wait' }[]> = {
  'BOM-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-P01-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240315 · Chờ Ký', trang: 'pending' },
    { label: 'Biên bản giám định', ma: 'GD-20240315 · Chờ duyệt', trang: 'wait' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240313 · Chờ duyệt', trang: 'wait' },
  ],
  'BOM-002': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-P02-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240210 · Hoàn thành', trang: 'done' },
    { label: 'Biên bản giám định', ma: 'GD-20240210 · Đã duyệt', trang: 'done' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240210 · Đã duyệt', trang: 'done' },
  ],
  'QG-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-QG-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240301 · Chờ Ký', trang: 'pending' },
    { label: 'Biên bản giám định', ma: 'GD-20240301 · Chờ duyệt', trang: 'wait' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240301 · Chờ duyệt', trang: 'wait' },
  ],
  'MC-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-MC-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240120 · Hoàn thành', trang: 'done' },
    { label: 'Biên bản giám định', ma: 'GD-20240120 · Đã duyệt', trang: 'done' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240120 · Đã duyệt', trang: 'done' },
  ],
  'TD-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-TD-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240315 · Chờ Ký', trang: 'pending' },
    { label: 'Biên bản giám định', ma: 'GD-20240402 · Chờ duyệt', trang: 'wait' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240315 · Chờ duyệt', trang: 'wait' },
  ],
  'BT-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-BT-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240205 · Hoàn thành', trang: 'done' },
    { label: 'Biên bản giám định', ma: 'GD-20240205 · Đã duyệt', trang: 'done' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240205 · Đã duyệt', trang: 'done' },
  ],
  'MNK-001': [
    { label: 'Kế hoạch năm', ma: 'KH-2024-MNK-001 · Đã duyệt', trang: 'done' },
    { label: 'Lệnh sửa chữa', ma: 'SC-20240310 · Hoàn thành', trang: 'done' },
    { label: 'Biên bản giám định', ma: 'GD-20240310 · Đã duyệt', trang: 'done' },
    { label: 'Phiếu linh vật tư', ma: 'VT-20240310 · Đang BT', trang: 'pending' },
  ],
};