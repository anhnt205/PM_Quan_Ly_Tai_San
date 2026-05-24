-- Migration: Tái cấu trúc Biên bản Giám định sang 2 cấp (Chi tiết Tài sản & Chi tiết Vật tư)
-- Version: 92

-- 1. Xóa các cột chi tiết cũ không dùng đến khỏi bảng giamdinh_chitiet
ALTER TABLE giamdinh_chitiet 
  DROP COLUMN TinhTrang,
  DROP COLUMN SuaChua,
  DROP COLUMN ThayMoi,
  DROP COLUMN GhiChu;

-- 2. Tạo bảng giamdinh_vattu để lưu chi tiết linh kiện/vật tư theo tài sản giám định
CREATE TABLE giamdinh_vattu (
    Id                VARCHAR(50) PRIMARY KEY,
    IdChiTietGiamDinh VARCHAR(50),
    IdVatTu           VARCHAR(50),
    IdChiTietVatTu    VARCHAR(50),
    SoLuong           INT,
    TinhTrang         TEXT,
    SoLuongSuaChua    INT DEFAULT 0,
    SoLuongThayMoi    INT DEFAULT 0,
    GhiChu            TEXT,
    CONSTRAINT fk_gdvt_giamdinh_chitiet FOREIGN KEY (IdChiTietGiamDinh) REFERENCES giamdinh_chitiet(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
