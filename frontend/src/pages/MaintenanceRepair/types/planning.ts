export interface MaintenancePlanData {
  id?: string;
  tenKeHoach?: string;
  loaiKeHoach?: "thiet_bi" | "chu_ky_thoi_gian" | "gio_may"; // thiết bị, chu kỳ thời gian, giờ máy
  chu_ky?: "thang" | "quy" | "nam"; // tháng/quý/năm
  idThietBi?: string;
  tenThietBi?: string;
  chu_ky_thoi_gian?: number; // số ngày/tháng
  gio_may_bao_duong?: number; // giờ máy
  ngayBatDau?: string;
  ngayKetThuc?: string;
  ghiChu?: string;
  trangThai?: number; // 0: chưa thực hiện, 1: đang thực hiện, 2: đã hoàn thành
  idNguoiPhuTrach?: string;
  tenNguoiPhuTrach?: string;
  idDonVi?: string;
  tenDonVi?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  coHieuLuc?: number;
  idCongTy?: string;
  chiTietCongViec?: MaintenancePlanDetailItem[];
  danhSachThietBi?: MaintenancePlanAssetItem[];
}

export interface MaintenancePlanDetailItem {
  id?: string;
  idKeHoach?: string;
  tenCongViec?: string;
  moTa?: string;
  thoiGianDuKien?: number; // phút
  ngayThucHien?: string;
  trangThai?: number; // 0: chưa làm, 1: đang làm, 2: hoàn thành
  ghiChu?: string;
  nguoiThucHien?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface MaintenancePlanAssetItem {
  id?: string;
  idKeHoach?: string;
  idThietBi?: string;
  tenThietBi?: string;
  loaiThietBi?: "tai_san" | "ccdc"; // tài sản hoặc CCDC
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
}
