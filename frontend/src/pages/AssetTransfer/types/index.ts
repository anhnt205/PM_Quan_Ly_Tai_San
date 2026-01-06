export interface AssetTransferDetail {
  assetId: string;
  uom: string;
  quantity: number;
  status: string;
  note: string;
}

export interface AssetTransferData {
  [x: string]: any;
  Id: string;
  SoQuyetDinh: string;
  TenPhieu: string;
  IdDonViGiao: string;
  IdDonViNhan: string;

  IdNguoiKyNhay: string;
  TrangThaiKyNhay: number; // TINYINT(1)
  NguoiLapPhieuKyNhay: number; // TINYINT(1)

  IdDonViDeNghi: string;
  TGGNTuNgay: string | null;
  TGGNDenNgay: string | null;

  IdTrinhDuyetCapPhong: string;
  TrinhDuyetCapPhongXacNhan: number; // TINYINT(1)

  IdTrinhDuyetGiamDoc: string;
  TrinhDuyetGiamDocXacNhan: number; // TINYINT(1)

  DiaDiemGiaoNhan: string;
  IdPhongBanXemPhieu: string;
  NoiNhan: string;

  TrangThai: number; // INT
  IdCongTy: string;

  NgayTao: string;
  NgayCapNhat: string;
  NguoiTao: string;
  NguoiCapNhat: string;

  CoHieuLuc: number; // TINYINT(1)
  Loai: number; // INT
  Share: number; // TINYINT(1)

  TrichYeu: string;
  DuongDanFile: string;
  TenFile: string;
  NgayKy: string | null;

  DaBanGiao: number; // TINYINT(1)
  ByStep: number; // TINYINT(1)
  CoPhieuBanGiao: number; // TINYINT(1)

  // Trường bổ trợ cho Frontend (Grid/Table con)
  TaiLieu?: string; // Dùng để hiển thị Chip "Tài liệu..." trên Grid
  assets: AssetTransferDetail[]; // Dữ liệu bảng chi tiết tài sản
}
