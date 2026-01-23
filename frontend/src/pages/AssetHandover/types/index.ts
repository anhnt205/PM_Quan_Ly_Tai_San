export interface AssetHandoverDetail {
  id: string;
  idBanGiaoTaiSan: string;
  idTaiSan: string;
  soLuong: number;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  hienTrang: string;
  moTa: string;
  ghiChu: string;
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
export interface AssetHandoverData {
  id: string;
  idCongTy: string;
  banGiaoTaiSan: string;
  quyetDinhDieuDongSo: string;
  lenhDieuDong: string;
  idDonViGiao: string;
  tenDonViGiao: string;
  idDonViNhan: string;
  tenDonViNhan: string;
  ngayBanGiao: string;
  idLanhDao: string;
  tenLanhDao: string;
  idDaiDiendonviBanHanhQD: string;
  tenDaiDienBanHanhQD: string;
  daXacNhan: boolean;
  idDaiDienBenGiao: string;
  tenDaiDienBenGiao: string;
  daiDienBenGiaoXacNhan: boolean;
  idDaiDienBenNhan: string;
  tenDaiDienBenNhan: string;
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
  trangThaiPhieu: number;
  idGiamDoc: string;
  giamDocKy: boolean;
  tenGiamDoc: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  diaDiemQuyetDinh: string;
  chiTietBanGiaoTaiSan: AssetHandoverDetail[];
  chuKyList: SignaturesData[];
  nguoiKyList: Signer[];
  isNew?: boolean;
}

export interface AssetHandoverFormValues {
  id: string;
  idCongTy: string;
  banGiaoTaiSan: string;
  quyetDinhDieuDongSo: string;
  lenhDieuDong: string;
  idDonViGiao: string;
  idDonViNhan: string;
  ngayBanGiao: string;
  idLanhDao: string;
  idDaiDiendonviBanHanhQD: string;
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
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  diaDiemQuyetDinh: string;
  chiTietBanGiaoTaiSan: AssetHandoverDetail[];
  nguoiKyList: Signer[];
  initialChiTiet: string[];
  isNew: boolean;
}

export interface AssetTransferDetail {
  id: string;
  idBanGiaoTaiSan: string;
  idTaiSan: string;
  soLuong: number;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  hienTrang: string;
  moTa: string;
  ghiChu: string;
}

export interface AssetTransferData {
  id: string;
  soQuyetDinh: string;
  tenPhieu: string;
  idDonViGiao: string;
  idDonViNhan: string;
  idNguoiKyNhay: string;
  trangThaiKyNhay: boolean;
  nguoiLapPhieuKyNhay: boolean;
  idDonViDeNghi: string;
  tgGnTuNgay: string;
  tgGnDenNgay: string;
  idTrinhDuyetCapPhong: string;
  trinhDuyetCapPhongXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  trinhDuyetGiamDocXacNhan: boolean;
  diaDiemGiaoNhan: string;
  idPhongBanXemPhieu: string;
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
  chiTietDieuDongTaiSanDTOS?: AssetTransferDetail[];
  nguoiKyList?: Signer[];
  chuKyList?: SignaturesData[];
}

export type UnionAssetData = AssetHandoverData & Partial<AssetTransferData>;
