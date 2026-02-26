CREATE TABLE LichSuDieuChuyenTaiSan (
    Id VARCHAR(50) PRIMARY KEY,
    IdBanGiaoTaiSan VARCHAR(50),
    IdTaiSan VARCHAR(50),
    IdDonViGiao VARCHAR(50),
    IdDonViNhan VARCHAR(50),
    ThoiGianBanGiao DATETIME,
    INDEX idx_taisan (IdTaiSan),
    INDEX idx_thoigian (ThoiGianBanGiao)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
