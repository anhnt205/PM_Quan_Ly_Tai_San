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

