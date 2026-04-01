import { SignaturesData as ToolSignature } from "../../../components/SignDocument/types";
export type { ToolSignature };

export interface ToolSigner {
  id: string;
  idTaiLieu: string;
  idNguoiKy: string;
  tenNguoiKy: string;
  idPhongBan: string;
  trangThai: number;
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

export interface ToolTransferData {
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
  taiLieuCuoi: string;
  ngayKy: string;
  daBanGiao: boolean;
  byStep: boolean;
  coPhieuBanGiao: boolean;
  trangThaiPhieu: number;
  trangThaiPhieuDieuDong: number;
  trangThaiBanGiao: number;
  trinhDuyet: boolean;

  chuKyList: ToolSignature[];
  chiTietDieuDongCCDCVatTuDTOS: ToolTransferDetail[];
  nguoiKyList: ToolSigner[];
  initialChiTiet: string[];
}
