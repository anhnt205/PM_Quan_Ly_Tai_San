-- =====================================================
-- Migration: Tạo các bảng cho module nghiệm thu
-- Version: 83
-- =====================================================

-- Bảng 1: Nghiệm thu (biên bản chính)
CREATE TABLE nghiemthu (
    Id              VARCHAR(50)  PRIMARY KEY,
    IdCongTy        VARCHAR(50),
    IdGiamDinh      VARCHAR(50),
    SoPhieu         VARCHAR(100),
    NgayNghiemThu   VARCHAR(50),
    ViTri           VARCHAR(255),
    TenThietBi      VARCHAR(255),
    SoDangKi        VARCHAR(100),
    CapSuaChua      VARCHAR(100),
    KetQua          VARCHAR(255),
    NoiDung         TEXT,
    IdNguoiLap      VARCHAR(50),
    NguoiLapXacNhan TINYINT(1) DEFAULT 0,
    IdGiamDoc       VARCHAR(50),
    GiamDocXacNhan  TINYINT(1) DEFAULT 0,
    Share           TINYINT(1) DEFAULT 0,
    TrangThai       INT DEFAULT 0,
    NgayTao         VARCHAR(50),
    NgayCapNhat     VARCHAR(50),
    NguoiTao        VARCHAR(50),
    NguoiCapNhat    VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 2: Nghiệm thu tài sản (danh sách tài sản trong biên bản)
CREATE TABLE nghiemthu_taisan (
    Id                VARCHAR(50) PRIMARY KEY,
    IdBienBan         VARCHAR(50),
    IdTaiSan          VARCHAR(50),
    IdChiTietGiamDinh VARCHAR(50),
    CONSTRAINT fk_ntts_bienban FOREIGN KEY (IdBienBan) REFERENCES nghiemthu(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 3: Nghiệm thu vật tư (vật tư thuộc từng tài sản trong biên bản)
CREATE TABLE nghiemthu_vattu (
    Id                VARCHAR(50) PRIMARY KEY,
    IdBienBanTaiSan   VARCHAR(50),
    IdChiTietVatTu    VARCHAR(50),
    SoLuong           INT,
    GhiChu            TEXT,
    CONSTRAINT fk_ntvt_taisan FOREIGN KEY (IdBienBanTaiSan) REFERENCES nghiemthu_taisan(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo sequence cho module nghiệm thu
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('NGHIEMTHU', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
