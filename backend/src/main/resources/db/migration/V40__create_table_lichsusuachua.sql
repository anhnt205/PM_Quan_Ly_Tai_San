-- Bảng: lichsu_suachua
CREATE TABLE lichsu_suachua (
                                Id VARCHAR(50) PRIMARY KEY,
                                IdTaiSan VARCHAR(50) NOT NULL,
                                NgayBatDau VARCHAR(50),
                                NgayKetThuc VARCHAR(50),
                                IdKetQuaSuaChua VARCHAR(50),
    -- Có thể thêm các trường khác nếu cần, ví dụ:
    -- GhiChu TEXT,
    -- TrangThai INT,
    -- NguoiTao VARCHAR(50),
                                NgayTao VARCHAR(50),
                                NgayCapNhat VARCHAR(50),
    -- ...
                                FOREIGN KEY (IdTaiSan) REFERENCES TaiSan(Id) ON DELETE CASCADE,
                                FOREIGN KEY (IdKetQuaSuaChua) REFERENCES ketquasuachua(Id) ON DELETE SET NULL
);

-- Bảng: chitiet_lichsu_suachua
CREATE TABLE chitiet_lichsu_suachua (
                                        Id VARCHAR(50) PRIMARY KEY,
                                        IdLichSuSuaChua VARCHAR(50) NOT NULL,
                                        IdCCDC VARCHAR(50),
                                        IdChiTietCCDC VARCHAR(50),
                                        DonGia DECIMAL(18,2),
                                        SoLuong INT,
    -- Có thể thêm các trường khác: ThanhTien, GhiChu,...
                                        FOREIGN KEY (IdLichSuSuaChua) REFERENCES lichsu_suachua(Id) ON DELETE CASCADE,
                                        FOREIGN KEY (IdCCDC) REFERENCES ccdcvattu(Id) ON DELETE SET NULL,
                                        FOREIGN KEY (IdChiTietCCDC) REFERENCES chitiettaisan(Id) ON DELETE SET NULL
);