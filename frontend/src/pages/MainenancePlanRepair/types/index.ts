export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  tenKeHoach: string;
  loaiKeHoach: "THIET_BI" | "CHU_KY" | "GIO_MAY";
  chuKyNgay?: number;
  mocGioMay?: number;
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
  trangThai?: number;
  congViecs?: MaintenancePlanDetailItem[];
  chiTiets?: MaintenancePlanAssetItem[];
}

export interface MaintenancePlanDetailItem {
  id: string;
  idKeHoach: string;
  tenCongViec: string;
  moTa?: string;
  nguoiThucHien?: string;
  thoiGianDuKien?: number;
  ngayThucHien?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface MaintenancePlanAssetItem {
  id: string;
  idKeHoach: string;
  idTaiSan: string | null;
  tenTaiSan?: string;
  idCCDC: string | null;
  tenCCDC?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
}
