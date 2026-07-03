
-- Bảng chi tiết tài sản sửa chữa
CREATE TABLE suachua_chitiet_taisan (
                                               Id VARCHAR(50) PRIMARY KEY,
                                               IdKeHoachSuaChua VARCHAR(50) NOT NULL,
                                               IdTaiSan VARCHAR(50) NOT NULL,
                                               GhiChu TEXT,
                                               NgayTao VARCHAR(50),
                                               NgayCapNhat VARCHAR(50),
                                               NguoiTao VARCHAR(50),
                                               NguoiCapNhat VARCHAR(50),
                                               IsActive TINYINT(1) DEFAULT 1,
                                               FOREIGN KEY (IdKeHoachSuaChua) REFERENCES kehoachsuachua(Id),
                                               FOREIGN KEY (IdTaiSan) REFERENCES TaiSan(Id)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;

-- Bảng vật tư tiêu hao
CREATE TABLE suachua_vattu_tieuhao (
                                              Id VARCHAR(50) PRIMARY KEY,
                                              IdKeHoachSuaChua VARCHAR(50) NOT NULL,
                                              IdCCDC VARCHAR(50),                     -- Khóa ngoại đến bảng CCDC (nếu có)
                                              TenVatTu VARCHAR(255),                   -- Tên vật tư (có thể lấy từ CCDC hoặc nhập tay)
                                              SoLuong INT,
                                              GhiChu TEXT,
                                              NgayTao VARCHAR(50),
                                              NgayCapNhat VARCHAR(50),
                                              NguoiTao VARCHAR(50),
                                              NguoiCapNhat VARCHAR(50),
                                              IsActive TINYINT(1) DEFAULT 1,
                                              FOREIGN KEY (IdKeHoachSuaChua) REFERENCES kehoachsuachua(Id),

                                              FOREIGN KEY (IdCCDC) REFERENCES ccdcvattu(Id)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;