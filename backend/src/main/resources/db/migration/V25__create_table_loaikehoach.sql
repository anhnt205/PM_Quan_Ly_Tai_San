CREATE TABLE LoaiKeHoachSucChua(
    Id VARCHAR(50) PRIMARY KEY,
    Ten VARCHAR(50),
    NgayTao VARCHAR(50),
    NgayCapNhat VARCHAR(50),
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50),
    IsActive TINYINT(1) DEFAULT 1
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
