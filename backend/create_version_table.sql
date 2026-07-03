-- Tạo bảng Version để quản lý phiên bản
CREATE TABLE Version (
    Id VARCHAR(50) PRIMARY KEY,
    VersionName TEXT NOT NULL,
    VersionCode TEXT NOT NULL,
    Description TEXT,
    ReleaseDate DATETIME,
    IsActive BOOLEAN DEFAULT TRUE,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50)
);

-- Tạo index cho VersionCode để tìm kiếm nhanh
CREATE INDEX idx_version_code ON Version(VersionCode);

-- Tạo index cho IsActive để lọc version đang hoạt động
CREATE INDEX idx_version_active ON Version(IsActive);

-- Insert dữ liệu mẫu
INSERT INTO Version (Id, VersionName, VersionCode, Description, ReleaseDate, IsActive, NguoiTao, NguoiCapNhat) VALUES
('v1.0.0', 'Version 1.0.0', '1.0.0', 'Phiên bản đầu tiên của hệ thống quản lý tài sản', '2024-01-01 00:00:00', TRUE, 'system', 'system'),
('v1.1.0', 'Version 1.1.0', '1.1.0', 'Cập nhật tính năng báo cáo và thống kê', '2024-02-01 00:00:00', TRUE, 'system', 'system'),
('v1.2.0', 'Version 1.2.0', '1.2.0', 'Thêm tính năng phân trang và tối ưu hiệu suất', '2024-03-01 00:00:00', TRUE, 'system', 'system');
