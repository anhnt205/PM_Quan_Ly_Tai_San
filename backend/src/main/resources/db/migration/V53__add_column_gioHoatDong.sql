-- Thêm trường Ngay
ALTER TABLE giohoatdong
    ADD COLUMN Ngay VARCHAR(20) NULL COMMENT 'Ngày' AFTER Thang;

-- Sửa Nam và Thang thành String
ALTER TABLE giohoatdong
    MODIFY COLUMN Nam VARCHAR(10) NULL COMMENT 'Năm',
    MODIFY COLUMN Thang VARCHAR(10) NULL COMMENT 'Tháng';