-- =====================================================
-- Migration: Tạo các bảng cho module đánh giá chất lượng vật tư thu hồi
-- Version: 84
-- =====================================================

-- Bảng 1: Đánh giá vật tư (biên bản chính)
CREATE TABLE danhgia_vattu (
    Id                  VARCHAR(50)  PRIMARY KEY,
    IdCongTy            VARCHAR(50),
    SoPhieu             VARCHAR(100),
    NgayDanhGia         VARCHAR(50),
    ViTri               VARCHAR(255),
    CapSuaChua          VARCHAR(100),
    TenThietBi          VARCHAR(255),
    Kieu                VARCHAR(100),
    SoDangKi            VARCHAR(100),
    IdDonViQuanLy       VARCHAR(50),
    IdNghiemThu         VARCHAR(50),
    
    SoLuongPhucHoi      INT DEFAULT 0,
    SoLuongPheLieu      INT DEFAULT 0,
    SoLuongHuy          INT DEFAULT 0,
    
    -- Các trường hệ thống tương tự Nghiệm thu để ký duyệt
    IdNguoiLap          VARCHAR(50),
    NguoiLapXacNhan     TINYINT(1) DEFAULT 0,
    IdGiamDoc           VARCHAR(50),
    GiamDocXacNhan      TINYINT(1) DEFAULT 0,
    Share               TINYINT(1) DEFAULT 0,
    TrangThai           INT DEFAULT 0,
    NgayTao             VARCHAR(50),
    NgayCapNhat         VARCHAR(50),
    NguoiTao            VARCHAR(50),
    NguoiCapNhat        VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 2: Chi tiết vật tư đánh giá
CREATE TABLE danhgia_vattu_chitiet (
    Id                  VARCHAR(50) PRIMARY KEY,
    IdDanhGiaVatTu      VARCHAR(50),
    IdChiTietVatTu      VARCHAR(50), -- Liên kết danh mục vật tư
    SoLuong             INT,
    TinhTrang           TEXT,
    BienPhapXuLy        TEXT,
    GhiChu              TEXT,
    CONSTRAINT fk_dgvtct_dgvt FOREIGN KEY (IdDanhGiaVatTu) REFERENCES danhgia_vattu(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo sequence
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('DANHGIA_VATTU', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
