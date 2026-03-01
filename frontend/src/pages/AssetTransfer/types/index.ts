export interface AssetTransferDetail {
  id: string;
  idDieuDongTaiSan: string;
  idTaiSan: string;
  soLuong: number;
  ghiChu: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  hienTrang: string;
  moTa: string;
  daBanGiao: boolean;
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

export interface AssetTransferData {
  id: string;
  soQuyetDinh: string;
  tenPhieu: string;
  idDonViGiao: string;
  tenDonViGiao: string;
  idDonViNhan: string;
  tenDonViNhan: string;
  idNguoiKyNhay: string;
  trangThaiKyNhay: boolean;
  nguoiLapPhieuKyNhay: boolean;
  tenNguoiKyNhay: string;
  idDonViDeNghi: string;
  tenDonViDeNghi: string;
  tgGnTuNgay: string;
  tgGnDenNgay: string;
  idTrinhDuyetCapPhong: string;
  tenTrinhDuyetCapPhong: string;
  trinhDuyetCapPhongXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  trinhDuyetGiamDocXacNhan: boolean;
  tenTrinhDuyetGiamDoc: string;
  idPhongBanXemPhieu: string;
  tenPhongBanXemPhieu: string;
  diaDiemGiaoNhan: string;
  noiNhan: string;
  trangThai: number;
  idCongTy: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  coHieuLuc: number;
  loai: number;
  share: boolean;
  trichYeu: string;
  duongDanFile: string;
  tenFile: string;
  ngayKy: string;
  daBanGiao: boolean;
  byStep: boolean;
  coPhieuBanGiao: boolean;
  trangThaiPhieu: number;
  trangThaiPhieuDieuDong?: number;
  taiLieuCuoi?: string;

  chiTietDieuDongTaiSanDTOS?: AssetTransferDetail[];
  nguoiKyList?: Signer[];
  initialChiTiet?: string[];
}
