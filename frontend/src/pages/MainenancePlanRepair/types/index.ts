import { ActionType } from "../../../utils/const";

export interface PlanSigner {
  id: string;
  idTaiLieu: string;
  idNguoiKy: string;
  tenNguoiKy: string;
  idPhongBan: string;
  trangThai: number;
}
export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  soKeHoach: string;
  tenKeHoach: string;
  soQuyetDinh?: string;
  idLoaiKeHoach: string;
  idLoaiSuaChua: string;
  nam: number;
  idDonViGiao: string;
  idDonViNhan: string;
  tenDonViGiao?: string;
  tenDonViNhan?: string;
  idNguoiLapBieu: string;
  nguoiLapBieuXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  trinhDuyetGiamDocXacNhan: boolean;
  trangThai: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  ghiChu?: string;
  duongDanFile?: string;
  tenFile?: string;
  ngayKy?: string;
  duongDanTaiLieuBangKe?: string;
  share: boolean;
  byStep: boolean;
  danhSachTaiSan?: MaintenancePlanAssetItem[];
  nguoiKyList?: any[];
  soLuongSuCo?: number;
}

// Bảng Tài Sản mới
export interface MaintenancePlanAssetItem {
  id?: string;
  idKeHoachSuaChua: string;
  idTaiSan: string;
  idNhomTaiSan?: string;
  idLoaiTaiSan?: string;
  soLuong?: number;
  tenTaiSan?: string;
  tenNhom?: string;
  donViTinh?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  isActive?: boolean;
  capSuaChuaThang1?: string;
  capSuaChuaThang2?: string;
  capSuaChuaThang3?: string;
  capSuaChuaThang4?: string;
  capSuaChuaThang5?: string;
  capSuaChuaThang6?: string;
  capSuaChuaThang7?: string;
  capSuaChuaThang8?: string;
  capSuaChuaThang9?: string;
  capSuaChuaThang10?: string;
  capSuaChuaThang11?: string;
  capSuaChuaThang12?: string;

  capSuaChua?: string;
  daCoLenhSuaChua?: boolean;

  action?: ActionType;
}

export interface InspectionRecordData {
  id?: string;
  idCongTy?: string;
  idSuaChua?: string;
  soPhieu?: string;
  ngayGiamDinh?: string;
  viTri?: string;
  soDeLaiPhucHoi?: number;
  soDeLamPheLieu?: number;
  soLuongHuy?: number;
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

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  soPhieuSuaChua?: string;

  danhSachChiTiet?: InspectionRecordDetailData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface InspectionRecordDetailData {
  id?: string;
  idGiamDinh?: string;
  tinhTrang?: string;
  suaChua?: boolean;
  thayMoi?: boolean;
  ghiChu?: string;
  idTaiSan?: string;
  idSuaChuaChiTiet?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
}
