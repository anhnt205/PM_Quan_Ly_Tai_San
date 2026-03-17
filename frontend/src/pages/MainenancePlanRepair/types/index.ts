import { ActionType, StatusPlanType } from "../../../utils/const";

export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  tenKeHoach: string;
  idLoaiKeHoach: string; // Đã bỏ enum THIET_BI | CHU_KY | GIO_MAY
  idLoaiSuaChua: string;
  tenLoaiSuaChua?: string;
  tenLoaiKeHoach?: string;
  idDonViGiao?: string;
  tenDonViGiao?: string;
  idDonViThucHien: string;
  tenDonViThucHien?: string;
  idNguoiPhuTrach: string;
  tenNguoiPhuTrach?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  ghiChu?: string;
  trangThai?: StatusPlanType;
  congViecs?: MaintenancePlanWorkItem[];
  danhSachTaiSan?: MaintenancePlanAssetItem[];
  danhSachVatTu?: MaintenancePlanCCDCItem[];
  chiTiets?: any[]; // Dùng chung cho UI trước khi tách
}

export interface MaintenancePlanWorkItem {
  id: string;
  idKeHoach: string;
  tenCongViec: string;
  moTa?: string;
  nguoiThucHien?: string;
  thoiGianDuKien?: number;
  ngayThucHien?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  action: ActionType;
}

// Bảng Tài Sản mới
export interface MaintenancePlanAssetItem {
  id: string;
  idKeHoachSuaChua: string;
  idTaiSan: string;
  soLuong?: number;
  tenTaiSan?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  action?: ActionType;
}

// Bảng CCDC (Vật tư tiêu hao) mới
export interface MaintenancePlanCCDCItem {
  id: string;
  idKeHoachSuaChua: string;
  idCCDC: string;
  idChiTietCCDC: string;
  tenVatTu?: string;
  soLuong?: number;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  action?: ActionType;
}
