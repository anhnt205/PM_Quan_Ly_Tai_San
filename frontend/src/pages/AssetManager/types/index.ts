export interface AssetType {
  id: string;
  idLoaiTaiSan: string;
  tenTaiSan: string;
  nguyenGia: number;
  giaTriKhauHaoBanDau: number;
  kyKhauHaoBanDau: number;
  giaTriThanhLy: number;
  idMoHinhTaiSan: string;
  phuongPhapKhauHao: number;
  soKyKhauHao: number;
  taiKhoanTaiSan: number;
  taiKhoanKhauHao: number;
  taiKhoanChiPhi: number;
  idNhomTaiSan: string;
  ngayVaoSo: string;
  ngaySuDung: string;
  idDuDan: string;
  idNguonVon: string;
  kyHieu: string;
  soKyHieu: string;
  congSuat: string;
  nuocSanXuat: string;
  namSanXuat: number;
  lyDoTang: string;
  hienTrang: number;
  soLuong: number;
  donViTinh: string;
  ghiChu: string;
  idDonViBanDau: string;
  idDonViHienThoi: string;
  moTa: string;
  idCongTy: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  isTaiSanCon: boolean;
  idLoaiTaiSanCon: string;
  soThe: string;
  nvNS: number;
  vonVay: number;
  vonKhac: number;
}

export interface AssetChildType {
  id: string;
  idTaiSanCon: string;
  idTaiSanCha: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: string;
}
