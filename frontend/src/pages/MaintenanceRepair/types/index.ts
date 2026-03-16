import { ActionType } from "../../../utils/const";

export interface MaintenanceAssetItem {
  id: string;
  idKeHoachSuaChua: string;
  idTaiSan: string;
  tenTaiSan?: string;
  ghiChu?: string;
  soLuong?: number;
  donViTinh?: string;
  daSuaChua?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  action?: ActionType;
}

// Bảng CCDC (Vật tư tiêu hao) mới
export interface MaintenanceCCDCItem {
  id: string;
  idKeHoachSuaChua: string;
  idCCDC: string;
  idChiTietCCDC: string;
  idNhomCCDC: string;
  tenNhomCCDC?: string;
  tenVatTu?: string;
  soLuong?: number;
  donViTinh?: string;
  soKyHieu?: string;
  nuocSanXuat?: string;
  namSanXuat?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  action?: ActionType;
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
  coPhieuSuaChua: boolean;
  taiLieuCuoi: string;
  loai: number;
  tenDonViGiao: string;
  tenDonViNhan: string;
  tenDonViDeNghi: string;
  tenNguoiKyNhay: string;
  tenTrinhDuyetCapPhong: string;
  tenTrinhDuyetGiamDoc: string;
  trangThai: number;
  ngayCapNhat: string;
  nguoiKyList?: Signer[];
  initialTaiSan: [];
  initialVatTu: [];
  danhSachTaiSan?: MaintenanceAssetItem[];
  danhSachVatTu?: MaintenanceCCDCItem[];
}

export interface MaintenanceRepairResultData {
  id: string;
  idCongTy: string;
  tenPhieu: string;
  ngayBatDauThucte: string;
  ngayKetThucThucte: string;
  idDonViGiao: string;
  idDonViNhan: string;
  idNguoiKyNhay: string;
  trangThaiKyNhay: false;
  nguoiLapPhieuKyNhay: false;
  ngayKetThucDuKien: string;
  idTrinhDuyetCapPhong: string;
  trinhDuyetCapPhongXacNhan: false;
  idTrinhDuyetGiamDoc: string;
  trinhDuyetGiamDocXacNhan: false;
  idDonViDeNghi: string;
  duongDanFile: string;
  tenFile: string;
  taiLieuBanGhi: string;
  byStep: false;
  soQuyetDinh: string;
  nguoiTao: string;
  share: false;
  ngayTao: string;
  taiLieuCuoi: string;
  trangThai: number;
  ngayCapNhat: string;
  idLoaiSuaChua: string;
  ghiChu: string;
  idSuaChua: string;
  chiPhiPhanCong: number;
  chiPhiThueNgoai: number;
  taisan: [];
}
