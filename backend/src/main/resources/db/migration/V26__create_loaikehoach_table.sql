-- 1. Tạo bảng loaikehoach
CREATE TABLE loaikehoach (
                             Id VARCHAR(50) PRIMARY KEY,
                             TenLoai VARCHAR(100) NOT NULL,
                             MoTa TEXT NULL,
                             NgayTao VARCHAR(50) NULL,
                             NgayCapNhat VARCHAR(50) NULL,
                             NguoiTao VARCHAR(50) NULL,
                             NguoiCapNhat VARCHAR(50) NULL,
                             IsActive TINYINT(1) DEFAULT 1
);

-- 2. Chèn dữ liệu mẫu từ các giá trị enum hiện có
-- (ID được tạo theo format riêng, bạn có thể thay đổi cho phù hợp)
INSERT INTO loaikehoach (Id, TenLoai, NgayTao, IsActive) VALUES
                                                             ('LKH_001', 'THIET_BI', NOW(), 1),
                                                             ('LKH_002', 'CHU_KY', NOW(), 1),
                                                             ('LKH_003', 'GIO_MAY', NOW(), 1);

-- 3. Thêm cột IdLoaiKeHoach vào bảng kehoachsuachua
ALTER TABLE kehoachsuachua
    ADD COLUMN IdLoaiKeHoach VARCHAR(50) NULL AFTER LoaiKeHoach;

-- 4. Cập nhật giá trị cho cột IdLoaiKeHoach dựa trên LoaiKeHoach cũ
UPDATE kehoachsuachua
SET IdLoaiKeHoach = CASE LoaiKeHoach
                        WHEN 'THIET_BI' THEN 'LKH_001'
                        WHEN 'CHU_KY'   THEN 'LKH_002'
                        WHEN 'GIO_MAY'  THEN 'LKH_003'
    END;

-- 5. Xóa cột LoaiKeHoach cũ
ALTER TABLE kehoachsuachua DROP COLUMN LoaiKeHoach;

-- 6. Thêm khóa ngoại cho IdLoaiKeHoach
ALTER TABLE kehoachsuachua
    ADD CONSTRAINT fk_kehoachsuachua_loaikehoach
        FOREIGN KEY (IdLoaiKeHoach) REFERENCES loaikehoach(Id);

-- 7. (Tùy chọn) Đặt NOT NULL nếu tất cả dòng đều có giá trị
ALTER TABLE kehoachsuachua MODIFY IdLoaiKeHoach VARCHAR(50) NOT NULL;