-- =====================================================
-- Migration: Bổ sung cột YeuCau vào bienphap_phuongtien
-- Version: 104
-- =====================================================

ALTER TABLE bienphap_phuongtien
ADD COLUMN YeuCau TEXT NULL;
