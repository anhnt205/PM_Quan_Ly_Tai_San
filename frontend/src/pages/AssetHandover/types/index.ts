export interface AssetDetail {
  id: string;
  idBanGiaoTaiSan: string;
  idTaiSan: string;
  tenTaiSan: string;
  donViTinh: string;
  soLuong: number;
  hienTrang: string;
  ghiChu: string;
  moTa: string;
  isActive: boolean;
}

export interface AssetHandoverData {
  id: string;
  idCongTy: string;
  banGiaoTaiSan: string;
  quyetDinhDieuDongSo: string;
  lenhDieuDong: string;
  idDonViGiao: string;
  idDonViNhan: string;
  ngayBanGiao: string;
  idLanhDao: string | null;
  idDaiDiendonviBanHanhQD: string | null;
  daXacNhan: boolean;
  idDaiDienBenGiao: string;
  daiDienBenGiaoXacNhan: boolean;
  idDaiDienBenNhan: string;
  daiDienBenNhanXacNhan: boolean;
  trangThai: number;
  note: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  share: boolean;
  duongDanFile: string;
  tenFile: string;
  byStep: boolean;
  ngayTaoChungTu: string;
  idGiamDoc: string;
  giamDocKy: boolean;
  soQuyetDinh: string | null;
  ngayQuyetDinh: string | null;
  diaDiemQuyetDinh: string | null;
  chiTietBanGiaoTaiSan: AssetDetail[];
}

export interface AssetHandoverFormValues extends AssetHandoverData {
  nguoiKyList: { idPhongBan: string; idNguoiKy: string }[];
}
