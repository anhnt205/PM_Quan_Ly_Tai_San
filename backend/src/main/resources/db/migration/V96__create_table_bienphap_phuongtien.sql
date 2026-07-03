-- =====================================================
-- Migration: Tạo bảng biện pháp sửa chữa phương tiện
-- Version: 96
-- =====================================================

CREATE TABLE bienphap_phuongtien (
    Id                 VARCHAR(50)  PRIMARY KEY,
    IdCongTy           VARCHAR(50),
    SoBienBan          VARCHAR(100),               -- VD: 401/BP-CV
    IdTaiSan           VARCHAR(50),
    MucDich            TEXT,
    TinhTrangHienTai   TEXT,
    NoiDungThucHien    TEXT,
    TienDoTuNgay       VARCHAR(50),
    TienDoDenNgay      VARCHAR(50),
    BienPhapAnToan     TEXT,
    IdKiemTraSuCo      VARCHAR(50),                -- FK tùy chọn -> kiemtra_suco.Id

    -- Luồng ký / trạng thái
    IdNguoiLap         VARCHAR(50),
    NguoiLapXacNhan    TINYINT(1)  DEFAULT 0,
    IdGiamDoc          VARCHAR(50),
    GiamDocXacNhan     TINYINT(1)  DEFAULT 0,
    Share              TINYINT(1)  DEFAULT 0,
    TrangThai          INT         DEFAULT 0,      -- 0:nháp 1:duyệt 2:hủy 3:hoàn thành

    -- Audit
    NgayTao            VARCHAR(50),
    NgayCapNhat        VARCHAR(50),
    NguoiTao           VARCHAR(50),
    NguoiCapNhat       VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bienphap_phuongtien_chitiet (
    Id                 VARCHAR(50)  PRIMARY KEY,
    IdBienPhap         VARCHAR(50)  NOT NULL,
    IdVatTu            VARCHAR(50),
    IdChiTietVatTu     VARCHAR(50),
    SoLuongCap         INT          DEFAULT 0,
    SoLuongThuHoi      INT          DEFAULT 0,
    GhiChu             TEXT,
    CONSTRAINT fk_bppt_parent FOREIGN KEY (IdBienPhap) REFERENCES bienphap_phuongtien(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sequence tự tăng số biên bản
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('BIENPHAP_PHUONGTIEN', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
