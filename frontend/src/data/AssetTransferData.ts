import { AssetTransferData } from "../pages/AssetTransfer/types";

export const mockAssetTransfers: AssetTransferData[] = [
  {
    Id: "1",
    SoQuyetDinh: "CPTS-2025-004",
    TenPhieu: "Cấp phát tài sản 1912",
    TrichYeu: "TY-1912",
    NgayTao: "2025-12-19 09:29:00",
    NguoiTao: "Phạm Văn Bổn", // Người lập biểu
    NgayCapNhat: "",
    NguoiCapNhat: "",

    TrangThai: 1, // Đang duyệt

    // Đơn vị
    IdDonViGiao: "Kho công ty",
    IdDonViNhan: "Ban lãnh đạo",
    IdDonViDeNghi: "Phòng CV",

    // Ký nháy
    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 1,
    NguoiLapPhieuKyNhay: 1, // Checked

    // Duyệt
    IdTrinhDuyetCapPhong: "Nguyễn Văn Dương - 1468",
    TrinhDuyetCapPhongXacNhan: 1,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 0,

    // Thời gian/Địa điểm
    TGGNTuNgay: "2025-12-19T09:29",
    TGGNDenNgay: "2025-12-19T09:29",
    DiaDiemGiaoNhan: "",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    // Hệ thống
    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 1,
    Share: 0,

    // File
    TenFile: "QD vv dieu dong man hinh Tivi LG 86inch.pdf",
    DuongDanFile: "/files/qd-dieu-dong.pdf",
    NgayKy: null,

    // Trạng thái khác
    DaBanGiao: 0,
    ByStep: 0,
    CoPhieuBanGiao: 0, // <-- Mới thêm

    // Table con
    assets: [
      {
        assetId: "Trạm biến áp 400KVA-6/0,4KV MB +30 Tràng khê (Cung cấp điện)",
        uom: "TRAM",
        quantity: 1,
        status: "Đang sử dụng",
        note: "Sử dụng tạm",
      },
      {
        assetId: "Màn hình Tivi LG 86 inch",
        uom: "CAI",
        quantity: 1,
        status: "Mới 100%",
        note: "Cấp cho phòng họp",
      },
    ],
  },
  {
    Id: "2",
    SoQuyetDinh: "CPTS-2025-003",
    TenPhieu: "Cấp phát 2012",
    TrichYeu: "TY-2012",
    NgayTao: "2025-12-29 15:38:00",
    NguoiTao: "Hoàng Đức Duy",
    NgayCapNhat: "",
    NguoiCapNhat: "",

    TrangThai: 0, // Nháp

    IdDonViGiao: "Kho công ty",
    IdDonViNhan: "Phân xưởng Cơ điện lò 2",
    IdDonViDeNghi: "Ban lãnh đạo",

    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 0,
    NguoiLapPhieuKyNhay: 0,

    IdTrinhDuyetCapPhong: "Đỗ Ánh - 27",
    TrinhDuyetCapPhongXacNhan: 0,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 0,

    TGGNTuNgay: "2025-12-29T15:38",
    TGGNDenNgay: null,
    DiaDiemGiaoNhan: "",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 1,
    Share: 0,

    TenFile: "Giai tich 1-Cuoi ki_Minh hoa.pdf",
    DuongDanFile: "",
    NgayKy: null,

    DaBanGiao: 0,
    ByStep: 0,
    CoPhieuBanGiao: 0, // <-- Mới thêm

    assets: [
      {
        assetId: "Máy bơm nước",
        uom: "CAI",
        quantity: 2,
        status: "Đang sử dụng",
        note: "",
      },
    ],
  },
  // Thêm dữ liệu mẫu số 3 nếu cần...
];
