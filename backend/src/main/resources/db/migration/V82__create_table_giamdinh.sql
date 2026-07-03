-- =====================================================
-- Migration: Tạo các bảng cho module giám định kỹ thuật
-- Version: 82
-- =====================================================

CREATE TABLE giamdinh (
    Id VARCHAR(50) PRIMARY KEY,
    IdCongTy VARCHAR(50),
    IdSuaChua VARCHAR(50),
    SoPhieu VARCHAR(100),
    NgayGiamDinh VARCHAR(50),
    ViTri VARCHAR(255),
    SoDeLaiPhucHoi INT,
    SoDeLamPheLieu INT,
    SoLuongHuy INT,
    IdNguoiLap VARCHAR(50),
    NguoiLapXacNhan TINYINT(1) DEFAULT 0,
    IdGiamDoc VARCHAR(50),
    GiamDocXacNhan TINYINT(1) DEFAULT 0,
    Share TINYINT(1) DEFAULT 0,
    TrangThai INT DEFAULT 0,
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE giamdinh_chitiet (
    Id VARCHAR(50) PRIMARY KEY,
    IdGiamDinh VARCHAR(50),
    TinhTrang TEXT,
    SuaChua TINYINT(1) DEFAULT 0,
    ThayMoi TINYINT(1) DEFAULT 0,
    GhiChu TEXT,
    IdTaiSan VARCHAR(50),
    IdSuaChuaChiTiet VARCHAR(50),
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50),
    CONSTRAINT fk_giamdinh_chitiet_parent FOREIGN KEY (IdGiamDinh) REFERENCES giamdinh(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo sequence cho module giám định
INSERT INTO Sequence (SeqName, SeqYear, SeqValue) 
VALUES ('GIAMDINH', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
