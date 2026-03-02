-- Bảng: KeHoachSuaChua (Kế hoạch sửa chữa)
CREATE TABLE KeHoachSuaChua (
                                Id VARCHAR(50) PRIMARY KEY,
                                IdCongTy VARCHAR(50) NOT NULL,
                                TenKeHoach VARCHAR(255) NOT NULL,
                                LoaiKeHoach ENUM('THIET_BI','CHU_KY','GIO_MAY') NOT NULL,
                                ChuKyNgay INT NULL COMMENT 'Số ngày giữa các lần bảo trì (dùng cho loại CHU_KY)',
                                MocGioMay INT NULL COMMENT 'Số giờ vận hành giữa các lần bảo trì (dùng cho loại GIO_MAY)',
                                IdDonViThucHien VARCHAR(50) NOT NULL,
                                IdNguoiPhuTrach VARCHAR(50) NOT NULL,
                                NgayBatDau DATE NOT NULL,
                                NgayKetThuc DATE NOT NULL,
                                LoaiDoiTuong ENUM('TAI_SAN','CCDC') NOT NULL COMMENT 'Loại đối tượng được bảo trì: Tài sản hoặc CCDC',
                                NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                GhiChu TEXT,
                                CONSTRAINT FK_KeHoachSuaChua_CongTy FOREIGN KEY (IdCongTy) REFERENCES CongTy(Id),
                                CONSTRAINT FK_KeHoachSuaChua_DonViThucHien FOREIGN KEY (IdDonViThucHien) REFERENCES PhongBan(Id),
                                CONSTRAINT FK_KeHoachSuaChua_NguoiPhuTrach FOREIGN KEY (IdNguoiPhuTrach) REFERENCES NhanVien(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Index cho KeHoachSuaChua
CREATE INDEX idx_kehoach_loaikehoach ON KeHoachSuaChua(LoaiKeHoach);
CREATE INDEX idx_kehoach_loaidoituong ON KeHoachSuaChua(LoaiDoiTuong);
CREATE INDEX idx_kehoach_ngaybatdau ON KeHoachSuaChua(NgayBatDau);
CREATE INDEX idx_kehoach_ngayketthuc ON KeHoachSuaChua(NgayKetThuc);
CREATE INDEX idx_kehoach_donvithuchien ON KeHoachSuaChua(IdDonViThucHien);
CREATE INDEX idx_kehoach_nguoiphutrach ON KeHoachSuaChua(IdNguoiPhuTrach);

-- Bảng: KeHoachCongViecSuaChua (Chi tiết công việc bảo trì trong kế hoạch)
CREATE TABLE KeHoachCongViecSuaChua (
                                        Id VARCHAR(50) PRIMARY KEY,
                                        IdKeHoach VARCHAR(50) NOT NULL,
                                        TenCongViec VARCHAR(255) NOT NULL,
                                        MoTa TEXT,
                                        ThoiGianDuKien INT COMMENT 'Thời gian dự kiến thực hiện (phút)',
                                        NgayThucHien DATE,
                                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        TrangThai TINYINT DEFAULT 0 COMMENT '0: Chưa thực hiện, 1: Đang thực hiện, 2: Hoàn thành, 3: Hủy, ...',
                                        CONSTRAINT FK_CongViec_KeHoach FOREIGN KEY (IdKeHoach) REFERENCES KeHoachSuaChua(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Index cho KeHoachCongViecSuaChua
CREATE INDEX idx_congviec_kehoach ON KeHoachCongViecSuaChua(IdKeHoach);
CREATE INDEX idx_congviec_trangthai ON KeHoachCongViecSuaChua(TrangThai);
CREATE INDEX idx_congviec_ngaythuchien ON KeHoachCongViecSuaChua(NgayThucHien);

-- Bảng: KeHoachChiTietSuaChua (Chi tiết các đối tượng trong kế hoạch)
CREATE TABLE KeHoachChiTietSuaChua (
                                       Id VARCHAR(50) PRIMARY KEY,
                                       IdKeHoach VARCHAR(50) NOT NULL,
                                       IdTaiSan VARCHAR(50) NULL COMMENT 'ID tài sản nếu loại đối tượng là TAI_SAN',
                                       IdCCDC VARCHAR(50) NULL COMMENT 'ID CCDC/vật tư nếu loại đối tượng là CCDC',
                                       GhiChu TEXT,
                                       NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       CONSTRAINT FK_ChiTiet_KeHoach FOREIGN KEY (IdKeHoach) REFERENCES KeHoachSuaChua(Id) ON DELETE CASCADE,
                                       CONSTRAINT FK_ChiTiet_TaiSan FOREIGN KEY (IdTaiSan) REFERENCES TaiSan(Id) ON DELETE RESTRICT,
                                       CONSTRAINT FK_ChiTiet_CCDC FOREIGN KEY (IdCCDC) REFERENCES ccdcvattu(Id) ON DELETE RESTRICT,
                                       CONSTRAINT CK_ChiTiet_Loai CHECK (
                                           (IdTaiSan IS NOT NULL AND IdCCDC IS NULL) OR
                                           (IdTaiSan IS NULL AND IdCCDC IS NOT NULL)
                                           )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Index cho KeHoachChiTietSuaChua
CREATE INDEX idx_chitiet_kehoach ON KeHoachChiTietSuaChua(IdKeHoach);
CREATE INDEX idx_chitiet_taisan ON KeHoachChiTietSuaChua(IdTaiSan);
CREATE INDEX idx_chitiet_ccdc ON KeHoachChiTietSuaChua(IdCCDC);