export interface AssetTransferData {
  Id: string;
  SoQuyetDinh: string;
  TenPhieu: string;
  IdDonViGiao: string;
  IdDonViNhan: string;
  IdNguoiKyNhay: string;
  TrangThaiKyNhay: boolean | number; // SQL tinyint(1) nên dùng boolean trong React sẽ tiện hơn
  NguoiLapPhieuKyNhay: boolean | number;
  IdDonViDeNghi: string;
  TGGNTuNgay: string | null; // Để null nếu chưa chọn ngày
  TGGNDenNgay: string | null;
  IdTrinhDuyetCapPhong: string;
  TrinhDuyetCapPhongXacNhan: boolean | number;
  IdTrinhDuyetGiamDoc: string;
  TrinhDuyetGiamDocXacNhan: boolean | number;
  DiaDiemGiaoNhan: string;
  IdPhongBanXemPhieu: string;
  NoiNhan: string;
  TrangThai: number;
  IdCongTy: string;
  NgayTao: string;
  NgayCapNhat: string;
  NguoiTao: string;
  NguoiCapNhat: string;
  CoHieuLuc: boolean | number;
  Loai: number;
  Share: boolean | number;
  TrichYeu: string;
  DuongDanFile: string;
  TenFile: string;
  NgayKy: string | null;
  DaBanGiao: boolean | number;
  ByStep: boolean | number;

  // Quan trọng: Phải có assets để Formik render table con
  assets: AssetTransferDetail[];
}

export interface AssetTransferDetail {
  assetId: string;
  uom: string;
  quantity: number;
  status: string;
  note: string;
}
