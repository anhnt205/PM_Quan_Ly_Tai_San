-- Migration: Re-architect Incident Inspection (Kiểm tra sự cố) into 2 tiers
-- Version: 93

-- 1. Drop flat columns from kiemtra_suco_chitiet
ALTER TABLE kiemtra_suco_chitiet 
  DROP COLUMN CapBaoDuong,
  DROP COLUMN TinhTrang,
  DROP COLUMN SuaChua,
  DROP COLUMN ThayMoi,
  DROP COLUMN GhiChu,
  DROP COLUMN SoLuong;

-- 2. Create kiemtra_suco_vattu table
CREATE TABLE kiemtra_suco_vattu (
    Id                    VARCHAR(50) PRIMARY KEY,
    IdChiTietKiemTraSuCo VARCHAR(50),
    IdVatTu               VARCHAR(50),
    IdChiTietVatTu        VARCHAR(50),
    SoLuong               INT,
    TinhTrang             TEXT,
    SoLuongSuaChua        INT DEFAULT 0,
    SoLuongThayMoi        INT DEFAULT 0,
    GhiChu                TEXT,
    CONSTRAINT fk_ksvt_kiemtra_suco_chitiet FOREIGN KEY (IdChiTietKiemTraSuCo) 
        REFERENCES kiemtra_suco_chitiet(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
