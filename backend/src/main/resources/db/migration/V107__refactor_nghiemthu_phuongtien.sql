-- =====================================================
-- Migration V107: Refactor nghiemthu_phuongtien columns
-- Mục đích: Đổi tên IdGiamDinhPhuongTien thành IdBienPhapPhuongTien và thêm cột IdTaiSan
-- =====================================================

ALTER TABLE nghiemthu_phuongtien CHANGE COLUMN IdGiamDinhPhuongTien IdBienPhapPhuongTien VARCHAR(50);
ALTER TABLE nghiemthu_phuongtien ADD COLUMN IdTaiSan VARCHAR(50);
