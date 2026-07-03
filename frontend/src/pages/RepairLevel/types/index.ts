export interface RepairLevel {
  id: string;
  kyHieu: string;
  ten: string;
  chuKyThucHien: string;
  soLanTrongChuKy: number;
  thoiGianSuaChua: string;
  idLoaiTaiSan?: string;
  tenLoaiTaiSan?: string;
  mocGioDau?: number;
  mocGioCuoi?: number;
  ghiChu: string;
}
