-- =====================================================
-- Migration: Add TenMauBienBanSuaChua to kehoachsuachua and LaHeThong to DonViTinh
-- =====================================================

ALTER TABLE `kehoachsuachua`
ADD COLUMN `TenMauBienBanSuaChua` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;

ALTER TABLE `DonViTinh`
ADD COLUMN `LaHeThong` bit(1) DEFAULT b'0';
