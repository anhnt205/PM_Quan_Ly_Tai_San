-- Sửa kiểu dữ liệu của Nam, Thang, Ngay từ VARCHAR sang INT
ALTER TABLE LichTrinh MODIFY COLUMN Nam INT NOT NULL;
ALTER TABLE LichTrinh MODIFY COLUMN Thang INT NOT NULL;
ALTER TABLE ChiTietLichTrinh MODIFY COLUMN Ngay INT NOT NULL;

-- Thêm UNIQUE constraint
ALTER TABLE ChiTietLichTrinh
    ADD CONSTRAINT uq_chitietlichtrinh_lichtrinh_ngay UNIQUE (IdLichTrinh, Ngay);