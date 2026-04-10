-- V72: Đồng bộ schema kehoachsuachua
-- Bỏ các cột không dùng, đổi tên cột, thêm cột mới

SET FOREIGN_KEY_CHECKS = 0;

-- Bỏ các cột đã xóa khỏi thiết kế
ALTER TABLE kehoachsuachua
    DROP COLUMN IdNguoiKyNhay,
    DROP COLUMN TrangThaiKyNhay,
    DROP COLUMN NguoiLapPhieuKyNhay,
    DROP COLUMN IdTrinhDuyetCapPhong,
    DROP COLUMN TrinhDuyetCapPhongXacNhan,
    DROP COLUMN IdPhongBanXemPhieu,
    DROP COLUMN NgayBatDau,
    DROP COLUMN NgayKetThuc,
    DROP COLUMN TrichYeu;

-- Đổi tên cột
ALTER TABLE kehoachsuachua
    RENAME COLUMN IdDonViLap       TO IdDonViGiao,
    RENAME COLUMN IdDonViThucHien  TO IdDonViNhan;

-- Thêm các cột mới
ALTER TABLE kehoachsuachua
    ADD COLUMN IdNguoiLapBieu        TEXT         AFTER IdDonViNhan,
    ADD COLUMN NguoiLapBieuXacNhan   TINYINT(1) DEFAULT 0 AFTER IdNguoiLapBieu,
    ADD COLUMN DuongDanTaiLieuBangKe TEXT         AFTER NgayKy;

SET FOREIGN_KEY_CHECKS = 1;
