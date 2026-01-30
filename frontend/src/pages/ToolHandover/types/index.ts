export interface ToolHandoverDetail {
  id: string;
  idBanGiaoCCDCVatTu: string;
  tenPhieuBanGiao?: string;
  idCCDCVatTu: string;
  tenVatTu?: string;
  donViTinh?: string;
  kyHieu?: string;
  soKyHieu?: string;
  congSuat?: string;
  nuocSanXuat?: string;
  namSanXuat?: string;
  soLuong: number;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: true;
  idChiTietCCDCVatTu: string;
  idChiTietDieuDong: string;
  hienTrang: string;
  moTa: string;
  ghiChu: string;
  chiTietDieuDongCCDCVatTuDTO?: ToolTransferDetail;
}

export interface ToolTransferDetail {
  id: string;
  idDieuDongCCDCVatTu: string;
  tenPhieu: string;
  soQuyetDinh: string;
  idCCDCVatTu: string;
  tenCCDCVatTu: string;
  donViTinh: string;
  congSuat: string;
  nuocSanXuat: string;
  soKyHieu: string;
  kyHieu: string;
  namSanXuat: string;
  soLuong: number;
  soLuongXuat: number;
  ghiChu: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  idChiTietCCDCVatTu: string;
  isActive: boolean;
  soLuongDaBanGiao: number;
  soLuongConLai: number;
  hienTrang: string;
  moTa: string;
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

export interface ToolHandoverData {
  id: string;
  idCongTy: string;
  banGiaoCCDCVatTu: string;
  quyetDinhDieuDongSo: string;
  lenhDieuDong: string;
  idDonViGiao: string;
  tenDonViGiao?: string;
  idDonViNhan: string;
  tenDonViNhan?: string;
  ngayBanGiao: string;
  idLanhDao: string;
  tenLanhDao?: string;
  idDaiDiendonviBanHanhQD: string;
  tenDaiDienBanHanhQD?: string;
  daXacNhan: boolean;
  idDaiDienBenGiao: string;
  tenDaiDienBenGiao?: string;
  daiDienBenGiaoXacNhan: boolean;
  idDaiDienBenNhan: string;
  tenDaiDienBenNhan?: string;
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
  trangThaiPhieu?: number;
  chuKyList: SignaturesData[];
  chiTietBanGiaoCCDCVatTu: ToolHandoverDetail[];
  nguoiKyList: Signer[];
  idGiamDoc: string;
  giamDocKy: boolean;
  tenGiamDoc?: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  diaDiemQuyetDinh: string;
  isNew: boolean;
}

export interface ToolHandoverFormValues extends ToolHandoverData {
  initialChiTiet?: string[];
}
