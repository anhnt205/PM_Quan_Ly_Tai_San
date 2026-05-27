import { ActionType, TypeBienBanType } from "../../../utils/const";

export interface PlanSigner {
  id: string;
  idTaiLieu: string;
  idNguoiKy: string;
  tenNguoiKy: string;
  idPhongBan: string;
  trangThai: number;
}

// kế hoạch
export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  soKeHoach: string;
  tenKeHoach: string;
  soQuyetDinh?: string;
  idLoaiKeHoach: string;
  idLoaiSuaChua: string;
  nam: number;
  nhomTaiSan?: string;
  idDonViGiao: string;
  idDonViNhan: string;
  tenDonViGiao?: string;
  tenDonViNhan?: string;
  idNguoiLapBieu: string;
  tenNguoiLapBieu?: string;
  nguoiLapBieuXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  tenTrinhDuyetGiamDoc?: string;
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

export interface MaintenancePlanAssetItem {
  id?: string;
  idKeHoachSuaChua: string;
  idTaiSan: string;
  idNhomTaiSan?: string;
  idLoaiTaiSan?: string;
  idDonViBaoTri?:string;
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

//giám định
export interface InspectionRecordData {
  id?: string;
  idCongTy?: string;
  idBienBan?: string;
  loaiBienBan?: TypeBienBanType;
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
  daCoBienPhap?: number;

  danhSachChiTiet?: InspectionRecordDetailData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface InspectionRecordDetailData {
  id?: string;
  idGiamDinhMayMoc?: string;
  idTaiSan?: string;
  idBienBanChiTiet?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // View fields
  tenTaiSan?: string;
  donViTinh?: string;
  soLuong?: string | number;

  // Nested materials
  danhSachVatTu?: InspectionRecordVatTuData[];
  action?: ActionType;
}

export interface InspectionRecordVatTuData {
  id?: string;
  idChiTietGiamDinhMayMoc?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  soLuongSuaChua?: number;
  soLuongThayMoi?: number;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// nghiệm thu

export interface AcceptanceTestRecordData {
  id?: string;
  idCongTy?: string;
  idBienPhapMayMoc?: string;
  soPhieu?: string;
  ngayNghiemThu?: string;
  viTri?: string;
  tenThietBi?: string;
  soDangKi?: string;
  capSuaChua?: string;
  ketQua?: string;
  noiDung?: string;
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
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  soPhieuBienPhapMayMoc?: string;
  daCoDanhGiaVatTu?: number;
  danhSachTaiSan?: AcceptanceTestRecordAssetData[];
  chuKyList?: any[];
  nguoiKyList?: any[];
}

export interface AcceptanceTestRecordAssetData {
  id?: string;
  idBienBan?: string;
  idTaiSan?: string;
  idChiTietGiamDinhMayMoc?: string;
  tenTaiSan?: string;
  donViTinh?: string;
  danhSachVatTu?: AcceptanceTestRecordToolData[];
  action?: ActionType;
}
export interface AcceptanceTestRecordToolData {
  id?: string;
  idBienBanTaiSan?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  ghiChu?: string;
  idVatTu?: string;
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// giám định phương tiện
export interface VehicleInspectionRecordData {
  id?: string;
  idCongTy?: string;
  idBienBan?: string;
  loaiBienBan?: TypeBienBanType;
  soPhieu?: string;
  ngayGiamDinh?: string;
  viTri?: string;
  tinhTrang?: string;
  noiDungKhac?: string;
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
  soPhieuBienBan?: string;
  daCoNghiemThu?: number;

  danhSachChiTiet?: VehicleInspectionRecordDetailData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface VehicleInspectionRecordDetailData {
  id?: string;
  idGiamDinhPhuongTien?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  soLuongSuaChua?: number;
  soLuongThayMoi?: number;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

