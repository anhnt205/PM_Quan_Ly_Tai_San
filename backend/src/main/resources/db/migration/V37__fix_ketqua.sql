SET FOREIGN_KEY_CHECKS = 0;



DROP TABLE IF EXISTS chitietketquasuachua;
DROP TABLE IF EXISTS ketquasuachua_chitiet;
DROP TABLE IF EXISTS ketquasuachua_chitiet_vattu;
DROP TABLE IF EXISTS ketquasuachua;

-- 5. Tạo bảng mới (Luôn dùng IF NOT EXISTS)

CREATE TABLE KetQuaSuaChua (
    Id VARCHAR(50) NOT NULL PRIMARY KEY,
    IdCongTy VARCHAR(50) NOT NULL,
    TenPhieu VARCHAR(255) NOT NULL,
    IdSuaChua VARCHAR(50) NOT NULL,
    IdLoaiSuaChua VARCHAR(50),
    NgayBatDauThucTe VARCHAR(50),
    NgayKetThucThucTe VARCHAR(50),
    IdDonViGiao VARCHAR(50),
    IdDonViNhan VARCHAR(50),
    IdNguoiKyNhay VARCHAR(100),
    TrangThaiKyNhay TINYINT(1) DEFAULT 0,
    NguoiLapPhieuKyNhay TINYINT(1) DEFAULT 0,
    IdTrinhDuyetCapPhong VARCHAR(100),
    TrinhDuyetCapPhongXacNhan TINYINT(1) DEFAULT 0,
    IdTrinhDuyetGiamDoc VARCHAR(100),
    TrinhDuyetGiamDocXacNhan TINYINT(1) DEFAULT 0,
    IdDonViDeNghi VARCHAR(100),
    DuongDanFile TEXT,
    TenFile TEXT,
    TaiLieuBanGhi TEXT,
    ByStep TINYINT(1) DEFAULT 0,
    SoQuyetDinh VARCHAR(100),
    NguoiTao TEXT,
    Share TINYINT(1) DEFAULT 0,
    NgayTao VARCHAR(50),
    CoPhieuBanGiao TINYINT(1) DEFAULT 0,
    TaiLieuCuoi TEXT,
    TrangThai INT DEFAULT 0,
    FOREIGN KEY (IdSuaChua) REFERENCES suachua(Id),
    FOREIGN KEY (IdCongTy) REFERENCES conty(Id),
    FOREIGN KEY (IdLoaiSuaChua) REFERENCES loaiscbd(Id),
    FOREIGN KEY (IdDonViGiao) REFERENCES phongban(Id),
    FOREIGN KEY (IdDonViNhan) REFERENCES phongban(Id),
    FOREIGN KEY (IdNguoiKyNhay) REFERENCES nhanvien(Id),
    FOREIGN KEY (IdTrinhDuyetCapPhong) REFERENCES nhanvien(Id),
    FOREIGN KEY (IdTrinhDuyetGiamDoc) REFERENCES nhanvien(Id),
    FOREIGN KEY (IdDonViDeNghi) REFERENCES phongban(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS ketquasuachua_chitiet (
    Id VARCHAR(50) PRIMARY KEY,
    IdKetQuaSuaChua VARCHAR(50) NOT NULL,
    IdSuaChuaChiTietTaiSan VARCHAR(50) NOT NULL,
    IdTaiSan VARCHAR(50) NOT NULL,
    SoLuong INT,
    GhiChu TEXT,
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50),
    IsActive TINYINT(1) DEFAULT 1,
    FOREIGN KEY (IdKetQuaSuaChua) REFERENCES ketquasuachua(Id),
    FOREIGN KEY (IdTaiSan) REFERENCES taisan(Id),
    FOREIGN KEY (IdSuaChuaChiTietTaiSan) REFERENCES suachua_chitiet_taisan(Id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ketquasuachua_chitiet_vattu (
    Id VARCHAR(50) PRIMARY KEY,
    IdKetQuaSuaChua VARCHAR(50) NOT NULL,
    IdSuaChuaChiTietTaiSan VARCHAR(50) NOT NULL,
    IdCCDC VARCHAR(50) NOT NULL,
    IdChiTietCCDC VARCHAR(50) NOT NULL,
    SoLuong INT,
    DonGia FLOAT,
    ThanhTien FLOAT,
    GhiChu TEXT,
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50),
    IsActive TINYINT(1) DEFAULT 1,
    FOREIGN KEY (IdKetQuaSuaChua) REFERENCES ketquasuachua(Id),
    FOREIGN KEY (IdCCDC) REFERENCES ccdcvattu(Id),
    FOREIGN KEY (IdChiTietCCDC) REFERENCES chitiettaisan(Id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;