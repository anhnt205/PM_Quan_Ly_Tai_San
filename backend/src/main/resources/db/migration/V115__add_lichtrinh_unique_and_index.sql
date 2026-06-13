-- Thêm UNIQUE constraint: mỗi tài sản chỉ có 1 lịch trình cho cùng năm+tháng
ALTER TABLE LichTrinh
    ADD CONSTRAINT uq_lichtrinh_taisan_nam_thang UNIQUE (IdTaiSan, Nam, Thang);

-- Index tìm kiếm theo tài sản
CREATE INDEX idx_lichtrinh_idtaisan
    ON LichTrinh (IdTaiSan);