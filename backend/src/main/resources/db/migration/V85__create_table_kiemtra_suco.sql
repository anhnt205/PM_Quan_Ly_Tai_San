-- Create table kiemtra_suco
CREATE TABLE kiemtra_suco (
    Id VARCHAR(50) PRIMARY KEY,
    IdCongTy VARCHAR(50),
    IdSuCo VARCHAR(50),
    SoPhieu VARCHAR(50),
    NgayKiemTra VARCHAR(20),
    ViTri VARCHAR(255),
    NhanXetKetLuan TEXT,
    BienPhapXuLy TEXT,
    IdNguoiLap VARCHAR(50),
    NguoiLapXacNhan TINYINT(1) DEFAULT 0,
    IdGiamDoc VARCHAR(50),
    GiamDocXacNhan TINYINT(1) DEFAULT 0,
    Share TINYINT(1) DEFAULT 0,
    TrangThai INT DEFAULT 0,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50),
    INDEX idx_kts_idsuco (IdSuCo),
    CONSTRAINT fk_kts_suco FOREIGN KEY (IdSuCo) REFERENCES suco_thietbi(Id) ON DELETE CASCADE
);

-- Create table kiemtra_suco_chitiet
CREATE TABLE kiemtra_suco_chitiet (
    Id VARCHAR(50) PRIMARY KEY,
    IdKiemTraSuCo VARCHAR(50),
    IdTaiSan VARCHAR(50),
    IdSuCoChiTiet VARCHAR(50),
    CapBaoDuong VARCHAR(100),
    TinhTrang VARCHAR(255),
    SuaChua TINYINT(1) DEFAULT 0,
    ThayMoi TINYINT(1) DEFAULT 0,
    GhiChu TEXT,
    SoLuong INT DEFAULT 1,
    INDEX idx_ksct_idparent (IdKiemTraSuCo),
    CONSTRAINT fk_ksct_parent FOREIGN KEY (IdKiemTraSuCo) REFERENCES kiemtra_suco(Id) ON DELETE CASCADE
);

-- Insert into Sequence
INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES ('KIEMTRA_SUCO', YEAR(NOW()), 0)
ON DUPLICATE KEY UPDATE SeqName = SeqName;
