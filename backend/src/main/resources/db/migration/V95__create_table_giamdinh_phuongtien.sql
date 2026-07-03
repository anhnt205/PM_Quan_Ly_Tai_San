-- =====================================================
-- Migration: Tạo các bảng cho module giám định phương tiện
-- Version: 95
-- =====================================================

CREATE TABLE giamdinh_phuongtien (
    Id VARCHAR(50) PRIMARY KEY,
    IdCongTy VARCHAR(50),
    IdBienBan VARCHAR(50),
    LoaiBienBan VARCHAR(50), -- 'sua_chua' / 'su_co'
    SoPhieu VARCHAR(100),
    NgayGiamDinh VARCHAR(50),
    ViTri VARCHAR(255),
    TinhTrang TEXT,
    NoiDungKhac TEXT,
    IdNguoiLap VARCHAR(50),
    NguoiLapXacNhan TINYINT(1) DEFAULT 0,
    IdGiamDoc VARCHAR(50),
    GiamDocXacNhan TINYINT(1) DEFAULT 0,
    Share TINYINT(1) DEFAULT 0,
    TrangThai INT DEFAULT 0,
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE giamdinh_phuongtien_chitiet (
    Id VARCHAR(50) PRIMARY KEY,
    IdGiamDinhPhuongTien VARCHAR(50),
    IdVatTu VARCHAR(50),
    IdChiTietVatTu VARCHAR(50),
    SoLuong INT DEFAULT 0,
    TinhTrang TEXT,
    SoLuongSuaChua INT DEFAULT 0,
    SoLuongThayMoi INT DEFAULT 0,
    GhiChu TEXT,
    CONSTRAINT fk_gdpt_parent FOREIGN KEY (IdGiamDinhPhuongTien) REFERENCES giamdinh_phuongtien(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo sequence cho module giám định phương tiện
INSERT INTO Sequence (SeqName, SeqYear, SeqValue) 
VALUES ('GIAMDINH_PHUONGTIEN', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
