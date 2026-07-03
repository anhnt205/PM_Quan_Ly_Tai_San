SET FOREIGN_KEY_CHECKS = 0;

-- 1. Xóa các Index đang tồn tại trên các cột ngày tháng
-- Bảng KeHoachSuaChua
DROP INDEX idx_kehoach_ngaybatdau ON KeHoachSuaChua;
DROP INDEX idx_kehoach_ngayketthuc ON KeHoachSuaChua;

-- Bảng KeHoachCongViecSuaChua
DROP INDEX idx_congviec_ngaythuchien ON KeHoachCongViecSuaChua;

-- Bảng SuaChua
DROP INDEX idx_suachua_ngayketthuc ON SuaChua;

-- 2. Đổi kiểu dữ liệu (Khuyên dùng VARCHAR(50) thay vì TEXT để tránh lỗi Index sau này)
ALTER TABLE KeHoachSuaChua 
    MODIFY NgayBatDau VARCHAR(50), 
    MODIFY NgayKetThuc VARCHAR(50), 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE KeHoachCongViecSuaChua 
    MODIFY NgayThucHien VARCHAR(50), 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE KeHoachChiTietSuaChua 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE SuaChua 
    MODIFY NgayKetThucDuKien VARCHAR(50), 
    MODIFY NgayTao VARCHAR(50),
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE ChiTietSuaChua 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE KetQuaSuaChua 
    MODIFY NgayBatDauThucTe VARCHAR(50), 
    MODIFY NgayKetThucThucTe VARCHAR(50), 
    MODIFY NgayDuyet VARCHAR(50), 
    MODIFY NgayQuyetDinh VARCHAR(50), 
    MODIFY NgayTaoChungTu VARCHAR(50), 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

ALTER TABLE ChiTietKetQuaSuaChua 
    MODIFY NgayTao VARCHAR(50), 
    MODIFY NgayCapNhat VARCHAR(50);

-- 3. Tạo lại các Index (Lúc này Index trên VARCHAR sẽ hoạt động bình thường)
CREATE INDEX idx_kehoach_ngaybatdau ON KeHoachSuaChua(NgayBatDau);
CREATE INDEX idx_kehoach_ngayketthuc ON KeHoachSuaChua(NgayKetThuc);
CREATE INDEX idx_congviec_ngaythuchien ON KeHoachCongViecSuaChua(NgayThucHien);
CREATE INDEX idx_suachua_ngayketthuc ON SuaChua(NgayKetThucDuKien);

SET FOREIGN_KEY_CHECKS = 1;