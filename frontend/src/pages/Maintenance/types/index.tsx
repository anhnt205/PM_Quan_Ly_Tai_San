import { ActionType } from "../../../utils/const";

// sự cố
export interface IncidenData {
  id: string;
  idCongTy: string;
  idKeHoach: string;
  soPhieu: string;
  idDonViBaoCao: string;
  tenDonViBaoCao?: string;
  ngayPhatHien: string;
  tenHeThongThietBi: string;
  phanHeViTri: string;
  mucDo: number;
  moTa: string;
  idNguoiLap: string;
  nguoiLapXacNhan: boolean;
  idGiamDoc: string;
  giamDocXacNhan: boolean;
  share: boolean;
  trangThai: number;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  danhSachTaiSan?: IncidenDetailData[];
  nguoiKyList?: any[];
}

export interface IncidenDetailData {
  id?: string;
  idSuCo?: string;
  idTaiSan: string;
  thuocHeThong: string;
  tinhTrang: string;
  idDonViQuanLyKyThuat: string;
  viTri?: string;
  soLuong?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  tenTaiSan?: string;
  donViTinh?: string;
  tenNhomTaiSan?: string;
  tenDonViQuanLyKyThuat?: string;
  action?: ActionType;
}

// sửa chữa

export interface MaintenanceRepairData {
  id?: string;
  idCongTy?: string;
  soPhieu?: string;
  idKeHoach?: string;
  thang?: number;
  nam?: number;
  ghiChu?: string;
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;
  daCoGiamDinh?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  danhSachTaiSan?: MaintenanceRepairDetailData[];
  nguoiKyList?: any[];
}

export interface MaintenanceRepairDetailData {
  id?: string;
  idSuaChua?: string;
  idTaiSan?: string;
  tenTaiSan?: string;
  nhomTaiSan?: string;
  donViTinh?: string;
  capSuaChua?: string;
  soLuong?: number;
  donViQuanLy?: string;
  donVibaoTri?: string;
  idKeHoachChiTiet: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  action?: ActionType;
}

// Đánh giá vật tư thu hồi
export interface DanhGiaVatTuData {
  id?: string;
  idCongTy?: string;
  soPhieu?: string;
  ngayDanhGia?: string;
  viTri?: string;
  capSuaChua?: string;
  tenThietBi?: string;
  kieu?: string;
  soDangKi?: string;
  idDonViQuanLy?: string;
  tenDonViQuanLy?: string;
  idNghiemThu?: string;
  
  soLuongPhucHoi?: number;
  soLuongPheLieu?: number;
  soLuongHuy?: number;

  // Ký duyệt
  idNguoiLap?: string;
  tenNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  tenGiamDoc?: string;
  giamDocXacNhan?: boolean;
  
  share?: boolean;
  trangThai?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  
  danhSachChiTiet?: ChiTietVatTuThuHoiData[];
  nguoiKyList?: any[];
}

export interface ChiTietVatTuThuHoiData {
  id?: string;
  idDanhGiaVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  bienPhapXuLy?: string;
  ghiChu?: string;
  
  // Join fields
  tenVatTu?: string;
  donViTinh?: string;
}
