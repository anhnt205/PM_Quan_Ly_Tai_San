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
  soLuongConLai?: number;
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

// kết quả sửa chữa

export interface MaintenanceResultCCDCItem {
  id: string;
  idKetQuaSuaChua: string;
  idKetQuaSuaChuaChiTiet: string;
  idCcdc?: string;
  idChiTietCcdc?: string;
  idNhomCCDC: string;
  soLuong?: number;
  donGia?: number;
  thanhTien?: number;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  isActive?: boolean;
  action?: ActionType;
}

export interface MaintenanceResultAssetItem {
  id: string;
  idKetQuaSuaChua: string;
  idTaiSan: string;
  hienTrang: string;
  soLuong: number;
  ghiChu: string;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat: string;
  isActive: boolean;
  action?: ActionType;
  vatTuList?: MaintenanceCCDCItem[];
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
  trangThaiKyNhay: boolean;
  nguoiLapPhieuKyNhay: boolean;
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
  taiLieuCuoi: string;
  trangThai: number;
  ngayCapNhat: string;
  idLoaiSuaChua: string;
  ghiChu: string;
  idSuaChua: string;
  chiPhiPhanCong: number;
  chiPhiThueNgoai: number;
  nguoiKyList?: Signer[];
  initialTaiSan: [];
  initialVatTu: [];
  chiTietTaiSanList: MaintenanceResultAssetItem[];
}
