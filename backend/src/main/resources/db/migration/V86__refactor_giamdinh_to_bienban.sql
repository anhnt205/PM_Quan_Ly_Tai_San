-- =====================================================
-- Migration: Refactor GiamDinh to use generic IdBienBan and LoaiBienBan
-- Version: 86
-- =====================================================

-- 1. Đổi tên cột IdSuaChua thành IdBienBan trong bảng giamdinh
-- Lưu ý: MySQL 5.7 dùng CHANGE, MySQL 8.0 dùng RENAME COLUMN. Dùng CHANGE để tương thích tốt hơn.
ALTER TABLE giamdinh CHANGE COLUMN IdSuaChua IdBienBan VARCHAR(50);

-- 2. Thêm cột LoaiBienBan vào bảng giamdinh
ALTER TABLE giamdinh ADD COLUMN LoaiBienBan VARCHAR(50) AFTER IdBienBan;

-- 3. Cập nhật dữ liệu hiện có cho LoaiBienBan là 'sua_chua'
UPDATE giamdinh SET LoaiBienBan = 'sua_chua' WHERE IdBienBan IS NOT NULL;

-- 4. Đổi tên cột IdSuaChuaChiTiet thành IdBienBanChiTiet trong bảng giamdinh_chitiet
ALTER TABLE giamdinh_chitiet CHANGE COLUMN IdSuaChuaChiTiet IdBienBanChiTiet VARCHAR(50);
