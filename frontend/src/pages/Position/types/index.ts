export interface PositionType {
  id: string;
  tenChucVu: string;
  quanLyNhanVien: boolean;
  quanLyPhongBan: boolean;
  quanLyDuAn: boolean;
  quanLyNguonVon: boolean;
  quanLyMoHinhTaiSan: boolean;
  quanLyNhomTaiSan: boolean;
  quanLyTaiSan: boolean;
  quanLyCCDCVatTu: boolean;
  dieuDongTaiSan: boolean;
  dieuDongCCDCVatTu: boolean;
  banGiaoTaiSan: boolean;
  banGiaoCCDCVatTu: boolean;
  banHanhQuyetDinh: boolean;
  baoCao: boolean;
  idCongTy: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
}
