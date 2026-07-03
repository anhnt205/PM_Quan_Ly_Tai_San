-- =====================================================
-- Migration V99: Tạo bảng biện pháp sửa chữa máy móc
-- Chỉ 1 bảng (không có bảng chi tiết)
-- =====================================================

CREATE TABLE bienphap_maymoc (
    Id                  VARCHAR(50)  PRIMARY KEY,
    IdCongTy            VARCHAR(50),
    IdGiamDinhMayMoc    VARCHAR(50),               -- FK -> giamdinh_maymoc.Id

    -- Thông tin chính
    SoPhieu             VARCHAR(100),               -- Số phiếu
    SoDeNghi            VARCHAR(100),               -- Số đề nghị
    DonViSuaChua        VARCHAR(255),               -- Đơn vị sửa chữa
    DonViPhoiHop        VARCHAR(255),               -- Đơn vị phối hợp
    HinhThuc            VARCHAR(255),               -- Hình thức sửa chữa
    ThoiGianBatDau      VARCHAR(50),                -- Thời gian bắt đầu
    ThoiGianKetThuc     VARCHAR(50),                -- Thời gian kết thúc
    ThoiGianNgay        INT          DEFAULT 0,     -- Thời gian (số ngày)
    GhiChu              TEXT,                       -- Ghi chú

    -- Luồng ký / trạng thái
    IdNguoiLap          VARCHAR(50),
    NguoiLapXacNhan     TINYINT(1)   DEFAULT 0,
    IdGiamDoc           VARCHAR(50),
    GiamDocXacNhan      TINYINT(1)   DEFAULT 0,
    Share               TINYINT(1)   DEFAULT 0,
    TrangThai           INT          DEFAULT 0,     -- 0:nháp 1:đang duyệt 2:hủy 3:hoàn thành

    -- Audit
    NgayTao             VARCHAR(50),
    NgayCapNhat         VARCHAR(50),
    NguoiTao            VARCHAR(50),
    NguoiCapNhat        VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sequence tự tăng số phiếu
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('BIENPHAP_MAYMOC', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
