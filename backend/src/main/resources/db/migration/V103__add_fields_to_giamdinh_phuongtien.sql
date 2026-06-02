-- =====================================================
-- Migration: Bổ sung IdTaiSan, CapBaoDuong, DonViSuaChua vào giamdinh_phuongtien
-- Version: 103
-- =====================================================

ALTER TABLE giamdinh_phuongtien
ADD COLUMN IdTaiSan VARCHAR(50) NULL,
ADD COLUMN CapBaoDuong VARCHAR(100) NULL,
ADD COLUMN DonViSuaChua VARCHAR(255) NULL;
