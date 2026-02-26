CREATE TABLE LichSuDieuChuyenCCDCVatTu (
    Id VARCHAR(50) PRIMARY KEY,
    IdBanGiaoCCDCVatTu VARCHAR(50),
    IdCCDCVatTu VARCHAR(50),
    idChiTietCCDCVatTu VARCHAR(50),
    IdDonViGiao VARCHAR(50),
    IdDonViNhan VARCHAR(50),
    SoLuong INT,
    ThoiGianBanGiao DATETIME,
    INDEX idx_ccdcvattu (IdCCDCVatTu),
    INDEX idx_thoigian (ThoiGianBanGiao)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
