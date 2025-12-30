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
  {
    Id: "3",
    SoQuyetDinh: "CPTS-2025-005",
    TenPhieu: "Điều chuyển tài sản PX Cơ khí",
    TrichYeu: "TY-0501",
    NgayTao: "2025-01-05 08:10:00",
    NguoiTao: "Nguyễn Văn Hùng",
    NgayCapNhat: "",
    NguoiCapNhat: "",
    TrangThai: 1,

    IdDonViGiao: "Phòng Cơ điện",
    IdDonViNhan: "Phân xưởng Cơ khí",
    IdDonViDeNghi: "Phòng Kỹ thuật",

    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 1,
    NguoiLapPhieuKyNhay: 1,

    IdTrinhDuyetCapPhong: "Lê Quốc Tuấn - 1023",
    TrinhDuyetCapPhongXacNhan: 1,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 1,

    TGGNTuNgay: "2025-01-06T08:00",
    TGGNDenNgay: "2025-01-06T10:00",
    DiaDiemGiaoNhan: "PX Cơ khí",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 2,
    Share: 0,

    TenFile: "QD_dieu_chuyen_co_khi.pdf",
    DuongDanFile: "/files/qdcokhi.pdf",
    NgayKy: "2025-01-06",

    DaBanGiao: 1,
    ByStep: 1,
    CoPhieuBanGiao: 1,

    assets: [
      {
        assetId: "Máy tiện CNC",
        uom: "CAI",
        quantity: 1,
        status: "Đang sử dụng",
        note: "",
      },
    ],
  },
  {
    Id: "4",
    SoQuyetDinh: "CPTS-2025-006",
    TenPhieu: "Thu hồi thiết bị CNTT",
    TrichYeu: "TY-THCNTT",
    NgayTao: "2025-01-08 14:20:00",
    NguoiTao: "Trần Minh Quân",
    NgayCapNhat: "",
    NguoiCapNhat: "",
    TrangThai: 2,

    IdDonViGiao: "Phòng IT",
    IdDonViNhan: "Kho công ty",
    IdDonViDeNghi: "Phòng IT",

    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 1,
    NguoiLapPhieuKyNhay: 1,

    IdTrinhDuyetCapPhong: "Nguyễn Văn Dương - 1468",
    TrinhDuyetCapPhongXacNhan: 1,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 1,

    TGGNTuNgay: "2025-01-09T09:00",
    TGGNDenNgay: "2025-01-09T11:00",
    DiaDiemGiaoNhan: "Phòng IT",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 3,
    Share: 0,

    TenFile: "QD_thu_hoi_cntt.pdf",
    DuongDanFile: "/files/thcntt.pdf",
    NgayKy: "2025-01-09",

    DaBanGiao: 1,
    ByStep: 2,
    CoPhieuBanGiao: 1,

    assets: [
      {
        assetId: "Laptop Dell Latitude 7420",
        uom: "CAI",
        quantity: 5,
        status: "Hỏng nhẹ",
        note: "Thu hồi để bảo trì",
      },
    ],
  },
  {
    Id: "5",
    SoQuyetDinh: "CPTS-2025-007",
    TenPhieu: "Cấp phát thiết bị văn phòng",
    TrichYeu: "TY-VP",
    NgayTao: "2025-01-10 10:00:00",
    NguoiTao: "Phạm Văn Bổn",
    NgayCapNhat: "",
    NguoiCapNhat: "",
    TrangThai: 1,

    IdDonViGiao: "Kho công ty",
    IdDonViNhan: "Phòng Hành chính",
    IdDonViDeNghi: "Phòng Hành chính",

    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 1,
    NguoiLapPhieuKyNhay: 1,

    IdTrinhDuyetCapPhong: "Đỗ Ánh - 27",
    TrinhDuyetCapPhongXacNhan: 1,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 0,

    TGGNTuNgay: "2025-01-10T14:00",
    TGGNDenNgay: null,
    DiaDiemGiaoNhan: "Phòng HCNS",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 1,
    Share: 0,

    TenFile: "",
    DuongDanFile: "",
    NgayKy: null,

    DaBanGiao: 0,
    ByStep: 0,
    CoPhieuBanGiao: 0,

    assets: [
      {
        assetId: "Máy in HP LaserJet",
        uom: "CAI",
        quantity: 2,
        status: "Mới 100%",
        note: "",
      },
      {
        assetId: "Ghế xoay văn phòng",
        uom: "CAI",
        quantity: 10,
        status: "Mới",
        note: "",
      },
    ],
  },
  {
    Id: "6",
    SoQuyetDinh: "CPTS-2025-008",
    TenPhieu: "Điều chuyển xe nâng",
    TrichYeu: "TY-XN",
    NgayTao: "2025-01-12 16:45:00",
    NguoiTao: "Lê Hoàng Nam",
    NgayCapNhat: "",
    NguoiCapNhat: "",
    TrangThai: 1,

    IdDonViGiao: "Kho trung tâm",
    IdDonViNhan: "Phân xưởng Đóng gói",
    IdDonViDeNghi: "Kho trung tâm",

    IdNguoiKyNhay: "",
    TrangThaiKyNhay: 0,
    NguoiLapPhieuKyNhay: 0,

    IdTrinhDuyetCapPhong: "Nguyễn Văn Dương - 1468",
    TrinhDuyetCapPhongXacNhan: 0,

    IdTrinhDuyetGiamDoc: "Hoàng Đức Duy - 1629",
    TrinhDuyetGiamDocXacNhan: 0,

    TGGNTuNgay: "2025-01-13T08:00",
    TGGNDenNgay: null,
    DiaDiemGiaoNhan: "PX Đóng gói",
    IdPhongBanXemPhieu: "",
    NoiNhan: "",

    IdCongTy: "CTY-01",
    CoHieuLuc: 1,
    Loai: 2,
    Share: 0,

    TenFile: "",
    DuongDanFile: "",
    NgayKy: null,

    DaBanGiao: 0,
    ByStep: 0,
    CoPhieuBanGiao: 0,

    assets: [
      {
        assetId: "Xe nâng dầu 3 tấn",
        uom: "CAI",
        quantity: 1,
        status: "Đang sử dụng",
        note: "",
      },
    ],
  },
];
