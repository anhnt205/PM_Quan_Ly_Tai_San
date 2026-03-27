-- 1. Xóa các trường thừa
ALTER TABLE giohoatdong
DROP COLUMN  GioSauSCL,
DROP COLUMN  GioSauBcc,
DROP COLUMN  NgaySCT_Vao,
DROP COLUMN  NgaySCT_Ra,
DROP COLUMN  NgayBcc_Vao,
DROP COLUMN  NgayBcc_Ra,
DROP COLUMN  SoLanBaoDuongCapI,
DROP COLUMN  SoLanBaoDuongCapII;

-- 2. Thêm các trường mới
ALTER TABLE giohoatdong
    ADD COLUMN KetQuaHoatDong VARCHAR(255) NULL COMMENT 'Kết quả hoạt động của thiết bị',
ADD COLUMN GioNgungMay_HongMay FLOAT NULL DEFAULT 0 COMMENT 'Giờ ngừng máy do hỏng máy',
ADD COLUMN GioNgungMay_ChoDoi FLOAT NULL DEFAULT 0 COMMENT 'Giờ ngừng máy do chờ đợi',
ADD COLUMN GioNgungMay_MatDien FLOAT NULL DEFAULT 0 COMMENT 'Giờ ngừng máy do mất điện',
ADD COLUMN GioNgungMay_ThieuNguyenLieu FLOAT NULL DEFAULT 0 COMMENT 'Giờ ngừng máy do thiếu nguyên liệu',
ADD COLUMN GioNgungMay_LyDoKhac FLOAT NULL DEFAULT 0 COMMENT 'Giờ ngừng máy do lý do khác';