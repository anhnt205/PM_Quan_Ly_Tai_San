-- Thêm trường GhiChuBienBan vào các bảng (nếu chưa có)
-- V113__add_ghi_chu_bien_ban.sql

-- 1. Kế hoạch sửa chữa
ALTER TABLE kehoachsuachua ADD COLUMN GhiChuBienBan TEXT;

-- 2. Sửa chữa
ALTER TABLE suachua ADD COLUMN GhiChuBienBan TEXT;

-- 3. Sự cố thiết bị
ALTER TABLE suco_thietbi ADD COLUMN GhiChuBienBan TEXT;

-- 4. Kiểm tra sự cố
ALTER TABLE kiemtra_suco ADD COLUMN GhiChuBienBan TEXT;

-- 5. Giám định máy móc
ALTER TABLE giamdinh_maymoc ADD COLUMN GhiChuBienBan TEXT;

-- 6. Giám định phương tiện
ALTER TABLE giamdinh_phuongtien ADD COLUMN GhiChuBienBan TEXT;

-- 7. Biện pháp máy móc
ALTER TABLE bienphap_maymoc ADD COLUMN GhiChuBienBan TEXT;

-- 8. Biện pháp phương tiện
ALTER TABLE bienphap_phuongtien ADD COLUMN GhiChuBienBan TEXT;

-- 9. Nghiệm thu máy móc
ALTER TABLE nghiemthu_maymoc ADD COLUMN GhiChuBienBan TEXT;

-- 10. Nghiệm thu phương tiện
ALTER TABLE nghiemthu_phuongtien ADD COLUMN GhiChuBienBan TEXT;

-- 11. Đánh giá vật tư
ALTER TABLE danhgia_vattu ADD COLUMN GhiChuBienBan TEXT;
