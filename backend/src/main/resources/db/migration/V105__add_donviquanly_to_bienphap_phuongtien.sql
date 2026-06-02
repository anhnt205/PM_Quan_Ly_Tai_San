-- =====================================================
-- Migration: Bổ sung cột DonViQuanLy vào bienphap_phuongtien
-- Version: 105
-- =====================================================

ALTER TABLE bienphap_phuongtien
ADD COLUMN DonViQuanLy VARCHAR(255) NULL;
