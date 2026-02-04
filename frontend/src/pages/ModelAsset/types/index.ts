export interface ModelAssetType {
  id: string;
  tenMoHinh: string;
  phuongPhapKhauHao?: number;
  kyKhauHao?: number;
  loaiKyKhauHao?: string;
  taiKhoanTaiSan?: string;
  taiKhoanKhauHao?: string;
  taiKhoanChiPhi?: string;
  idCongTy?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  isActive?: boolean;
}
