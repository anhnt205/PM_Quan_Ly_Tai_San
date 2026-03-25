CREATE TABLE suco_taisan (
                             Id VARCHAR(50) PRIMARY KEY COMMENT 'ID tự sinh (UUID)',
                             TuNgay VARCHAR(20) COMMENT 'Ngày bắt đầu sự cố (định dạng yyyy-MM-dd)',
                             DenNgay VARCHAR(20) COMMENT 'Ngày kết thúc sự cố',
                             NoiDung VARCHAR(1000) COMMENT 'Nội dung sự cố/hư hỏng',
                             NoiSuaChua VARCHAR(50) COMMENT 'ID nơi sửa chữa (FK tới PhongBan.Id)',
                             NguoiTao VARCHAR(100) COMMENT 'Người tạo',
                             NgayTao VARCHAR(30) COMMENT 'Ngày tạo (yyyy-MM-dd HH:mm:ss)',
                             NguoiCapNhat VARCHAR(100) COMMENT 'Người cập nhật',
                             NgayCapNhat VARCHAR(30) COMMENT 'Ngày cập nhật',
                             INDEX idx_suco_taisan_noisua (NoiSuaChua),
                             CONSTRAINT fk_suco_taisan_phongban FOREIGN KEY (NoiSuaChua)
                                 REFERENCES PhongBan(Id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lịch sử sự cố, tai nạn, sửa chữa';