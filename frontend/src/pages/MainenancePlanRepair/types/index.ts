import { ActionType, StatusPlanType } from "../../../utils/const";
export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  tenKeHoach: string;
  loaiKeHoach: "THIET_BI" | "CHU_KY" | "GIO_MAY";
  chuKyNgay?: number;
  mocGioMay?: number;
  idDonViGiao?:string;
  tenDonViGiao?:string;
  idDonViThucHien: string;
  tenDonViThucHien?: string;
  idNguoiPhuTrach: string;
  tenNguoiPhuTrach?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  loaiDoiTuong: "TAI_SAN" | "CCDC";
  ngayTao?: string;
  ngayCapNhat?: string;
  ghiChu?: string;
  trangThai?: StatusPlanType;
  congViecs?: MaintenancePlanWorkItem[];
  chiTiets?: MaintenancePlanAssetItem[];
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

export interface MaintenancePlanAssetItem {
  id: string;
  idKeHoach: string;
  idTaiSan: string | null;
  tenTaiSan?: string;
  idCCDC: string | null;
  idChiTietCCDC: string | null;
  tenCCDC?: string;
  soKyHieu?: string;
  namSanXuat?: string;
  nuocSanXuat?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  action?: ActionType;
}
