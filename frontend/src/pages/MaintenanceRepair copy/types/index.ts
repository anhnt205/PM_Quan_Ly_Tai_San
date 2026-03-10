export interface MaintenanceRepairDetailItem {
  id?: string;
  idSuaChua?: string;
  tentaiSan?: string;
  idTaiSan?: string;
  soLuong?: number;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  isActive?: boolean;
  hienTrang?: string;
  moTa?: string;
}

export interface MaintenanceRepairSigner {
  id?: string;
  idTaiLieu?: string;
  idNguoiKy?: string;
  trangThai?: number;
  ngayKy?: string;
  hoTen?: string;
}

export interface MaintenanceRepairData {
  id?: string;
  idKeHoach?: string; // Liên kết với kế hoạch bảo trì
  soQuyetDinh?: string;
  tenPhieu?: string;
  idLoaiSuaChua?: string;
  loai?: number; // type=1, type=2
  idPhanXuong?: string;
  ngayYeuCauHoanThanh?: string;
  idDonViTiepNhanTaiSan?: string;
  idDonViGiao?: string;
  idDonViNhan?: string;
  tenDonViGiao?: string;
  tenDonViNhan?: string;
  idNguoiKyNhay?: string;
  trangThaiKyNhay?: boolean;
  nguoiLapPhieuKyNhay?: boolean;
  idDonViDeNghi?: string;
  idTrinhDuyetCapPhong?: string;
  trinhDuyetCapPhongXacNhan?: boolean;
  idTrinhDuyetGiamDoc?: string;
  tenTrinhDuyetGiamDoc?: string;
  trinhDuyetGiamDocXacNhan?: boolean;
  diaDiemGiaoNhan?: string;
  idPhongBanXemPhieu?: string;
  noiNhan?: string;
  trangThai?: number; // 0-4
  idCongTy?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  coHieuLuc?: number;
  share?: boolean;
  daBanGiao?: boolean;
  byStep?: boolean;
  coPhieuBanGiao?: boolean;
  tenFile?: string;
  duongDanFile?: string;
  nguoiKyList?: MaintenanceRepairSigner[];
  chiTietSuaChuaBaoDuongDTOS?: MaintenanceRepairDetailItem[];
}
