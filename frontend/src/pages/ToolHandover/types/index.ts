export interface ToolDetail {
  id: string;
  idBanGiaoCCDC: string;
  idCCDC: string;
  tenCCDC: string;
  donViTinh: string;
  soLuong: number;
  hienTrang: string;
  ghiChu: string;
  moTa: string;
  isActive: boolean;
}

export interface ToolHandoverData {
  id: string;
  idCongTy: string;
  banGiaoCCDC: string;
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
  chiTietBanGiaoCCDC: ToolDetail[];
  chuKyList: {
    id: string;
    idTaiLieu: string;
    idNguoiKy: string;
    loaiKy: number;
  }[];
  tenDaiDienBenGiao?: string;
  tenDonViGiao?: string;
}

export interface ToolHandoverFormValues extends ToolHandoverData {
  nguoiKyList: { idPhongBan: string; idNguoiKy: string }[];
}

export interface ToolTransferDetail {
  id: string;
  idDieuDongCCDC: string;
  soQuyetDinh: string;
  tenPhieu: string;
  idCCDC: string;
  tenCCDC: string;
  donViTinh: string;
  hienTrang: string;
  moTa: string;
  soLuong: number;
  ghiChu: string;
  isActive: boolean;
  daBanGiao: boolean;
}

export interface ToolTransferData {
  id: string;
  soQuyetDinh: string;
  tenPhieu: string;
  idDonViGiao: string;
  tenDonViGiao: string;
  idDonViNhan: string;
  tenDonViNhan: string;
  trangThai: number;
  ngayKy: string;
  tggnTuNgay: string;
  tggnDenNgay: string;
  tenFile: string;
  duongDanFile: string;
  trangThaiPhieuDieuDong: number;
  chiTietDieuDongCCDC: ToolTransferDetail[];
}

export type UnionToolData = ToolHandoverData & Partial<ToolTransferData>;