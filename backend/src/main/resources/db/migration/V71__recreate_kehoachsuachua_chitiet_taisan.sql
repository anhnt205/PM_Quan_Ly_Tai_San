-- Recreate kehoachsuachua với đầy đủ các trường tương tự DieuDongTaiSan
DROP TABLE IF EXISTS kehoachsuachua_chitiet_taisan;
DROP TABLE IF EXISTS kehoachsuachua;

CREATE TABLE kehoachsuachua
(
    Id                        VARCHAR(50) PRIMARY KEY,
    -- Thông tin cơ bản
    SoKeHoach                 TEXT,
    TenKeHoach                TEXT,
    IdLoaiKeHoach             TEXT,
    IdLoaiSuaChua             TEXT,
    Nam                       INT,

    -- Đơn vị lập kế hoạch (tương tự IdDonViGiao)
    IdDonViLap                TEXT,

    -- Đơn vị thực hiện (tương tự IdDonViNhan)
    IdDonViThucHien           TEXT,

    -- Người lập phiếu / ký nháy
    IdNguoiKyNhay             TEXT,
    TrangThaiKyNhay           TINYINT(1),
    NguoiLapPhieuKyNhay       TINYINT(1),

    -- Trình duyệt cấp phòng
    IdTrinhDuyetCapPhong      TEXT,
    TrinhDuyetCapPhongXacNhan TINYINT(1),

    -- Trình duyệt giám đốc
    IdTrinhDuyetGiamDoc       TEXT,
    TrinhDuyetGiamDocXacNhan  TINYINT(1),

    -- Phòng ban xem phiếu
    IdPhongBanXemPhieu        TEXT,

    -- Ngày kế hoạch
    NgayBatDau                DATE,
    NgayKetThuc               DATE,

    -- Thông tin chung
    TrangThai                 INT DEFAULT 0,
    IdCongTy                  TEXT,
    NgayTao                   TEXT,
    NgayCapNhat               TEXT,
    NguoiTao                  TEXT,
    NguoiCapNhat              TEXT,

    -- File đính kèm
    GhiChu                    TEXT,
    TrichYeu                  TEXT,
    DuongDanFile              TEXT,
    TenFile                   TEXT,
    NgayKy                    TEXT,

    -- Trạng thái workflow
    Share                     TINYINT(1) DEFAULT 0,
    ByStep                    TINYINT(1) DEFAULT 0

);

-- Bảng chi tiết kế hoạch sửa chữa tài sản với 12 trường cấp sửa chữa theo tháng
CREATE TABLE kehoachsuachua_chitiet_taisan
(
    Id                VARCHAR(100) PRIMARY KEY,
    IdKeHoachSuaChua  VARCHAR(50),
    IdTaiSan          VARCHAR(50),
    SoLuong           INT,
    GhiChu            TEXT,
    NgayTao           TEXT,
    NgayCapNhat       TEXT,
    NguoiTao          TEXT,
    NguoiCapNhat      TEXT,
    IsActive          TINYINT(1) DEFAULT 1,

    -- 12 trường cấp sửa chữa theo từng tháng (lưu ID của CapSuaChua)
    CapSuaChuaThang1  VARCHAR(50),
    CapSuaChuaThang2  VARCHAR(50),
    CapSuaChuaThang3  VARCHAR(50),
    CapSuaChuaThang4  VARCHAR(50),
    CapSuaChuaThang5  VARCHAR(50),
    CapSuaChuaThang6  VARCHAR(50),
    CapSuaChuaThang7  VARCHAR(50),
    CapSuaChuaThang8  VARCHAR(50),
    CapSuaChuaThang9  VARCHAR(50),
    CapSuaChuaThang10 VARCHAR(50),
    CapSuaChuaThang11 VARCHAR(50),
    CapSuaChuaThang12 VARCHAR(50)
);
