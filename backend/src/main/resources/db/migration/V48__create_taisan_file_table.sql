-- Migration: create_taisan_file_table
-- Description: Tạo bảng lưu trữ file đính kèm cho tài sản
-- Thời gian: 2026-03-20

CREATE TABLE IF NOT EXISTS taisan_file (
                                           Id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID tự tăng',
                                           IdTaiSan VARCHAR(50) NOT NULL COMMENT 'ID tài sản (khóa ngoại tham chiếu taisan.Id)',
    FilePath VARCHAR(500) NOT NULL COMMENT 'Đường dẫn lưu file',
    Loai INT DEFAULT NULL COMMENT 'Loại file: 1-ảnh, 2-tài liệu, ...',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo bản ghi',
    GhiChu TEXT DEFAULT NULL COMMENT 'Ghi chú thêm',
    FOREIGN KEY (IdTaiSan) REFERENCES taisan(Id) ON DELETE CASCADE,
    INDEX idx_taisan_file_idtaisan (IdTaiSan) COMMENT 'Index cho truy vấn theo tài sản'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng file đính kèm của tài sản';