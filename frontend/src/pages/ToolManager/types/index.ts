export interface ToolType {
  id: string;
  idCongTy: string;
  maCCDC: string;
  tenCCDC: string;
  idNhomCCDC: string;
  tenNhomCCDC?: string;
  donViTinh: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  ngayNhap: string;
  kyHieu: string;
  ghiChu: string;
  trangThai: number;
  nguoiTao: string;
  ngayTao: string;
  nguoiCapNhat: string;
  ngayCapNhat: string;
  isActive: boolean;
}

export interface OwnerUnitType {
  id: string;
  idCCDCVT: string;
  idDonViSoHuu: string;
  soLuong: number;
  thoiGianBanGiao: string;
  soChungTu?: string;
  ngayTao: string;
  nguoiTao: string;
  idTsCon: string;
  soLuongDaBanGiao?: number;
}

export interface AssetDetailType {
  id: string;
  idTaiSan: string;
  idDonVi: string;
  ngayVaoSo: string;
  ngaySuDung: string;
  soKyHieu: string;
  congSuat: string;
  nuocSanXuat: string;
  namSanXuat: number;
  soLuong: number;
}

export interface HistoryToolType {
  id: string;
  idBanGiaoCCDCVatTu?: string;
  idCCDCVatTu: string;
  idChiTietCCDCVatTu: string;
  idDonViGiao: string;
  idDonViNhan: string;
  soLuong: number;
  thoiGianBanGiao: string;
}
