-- =====================================================
-- Migration V100: Thêm cột file đính kèm cho biện pháp sửa chữa máy móc
-- =====================================================

ALTER TABLE bienphap_maymoc
ADD COLUMN TenFile VARCHAR(255) NULL AFTER GhiChu,
ADD COLUMN DuongDanFile VARCHAR(500) NULL AFTER TenFile;
