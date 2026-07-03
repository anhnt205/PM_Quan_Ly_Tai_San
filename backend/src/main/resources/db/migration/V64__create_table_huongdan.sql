CREATE TABLE HuongDan (
    Id VARCHAR(50) PRIMARY KEY,
    TenHuongDan NVARCHAR(255) NOT NULL,
    TaiLieu TEXT, -- S3 Key
    NguoiTao VARCHAR(100),
    NgayTao TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
