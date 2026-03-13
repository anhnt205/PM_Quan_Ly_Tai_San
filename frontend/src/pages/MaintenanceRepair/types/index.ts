export interface MaintenanceRepairDetailItem {
  id: string;
  idSuaChua: string;
  tenTaiSan: string;
  idTaiSan: string | null;
  idChiTietCCDC: string | null;
  idCCDC: string | null;
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

export interface Signer {
  id: string;
  idTaiLieu: string;
  idNguoiKy: string;
  tenNguoiKy: string;
  idPhongBan: string;
  trangThai: number;
}

export interface SignaturesData {
  id: string;
  idTaiLieu: string;
  loaiKy: number;
  x: number;
  y: number;
  idNguoiKy: string;
  chuKySo: string;
  ngayKy: string;
  stt: number;
  chuKyNhay: string;
  chuKyThuong: string;
  scale: number;
  width: number;
  isLocked: boolean;
}

export interface MaintenanceRepairData {
  id: string;
  idCongTy: string;
  idLoaiSuaChua: string;
  maSuaChua: string;
  ghiChu: string;
  idKeHoach: string;
  tenSuaChua: string;
  idDonViGiao: string;
  idDonViNhan: string;
  idNguoiKyNhay: string;
  trangThaiKyNhay: boolean;
  nguoiLapPhieuKyNhay: boolean;
  ngayKetThucDuKien: string;
  idTrinhDuyetCapPhong: string;
  trinhDuyetCapPhongXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  trinhDuyetGiamDocXacNhan: boolean;
  idDonViDeNghi: string;
  duongDanFile: string;
  tenFile: string;
  taiLieuBanGhi: string;
  byStep: boolean;
  soQuyetDinh: string;
  nguoiTao: string;
  share: boolean;
  ngayTao: string;
  daBanGiao: boolean;
  coPhieuBanGiao: boolean;
  taiLieuCuoi: string;
  loai: 0;
  tenDonViGiao: string;
  tenDonViNhan: string;
  tenDonViDeNghi: string;
  tenNguoiKyNhay: string;
  tenTrinhDuyetCapPhong: string;
  tenTrinhDuyetGiamDoc: string;
  trangThai: 0;
  ngayCapNhat: string;
  nguoiKyList?: Signer[];
  initialChiTiet: [];
  chiTietSuaChuas?: MaintenanceRepairDetailItem[];
}
