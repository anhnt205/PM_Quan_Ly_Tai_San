CREATE TABLE DinhMucSuaChua
(
    Id             VARCHAR(50) PRIMARY KEY,
    IdLoaiTaiSan   VARCHAR(50),
    IdCapSuaChua   VARCHAR(50),
    GhiChu         TEXT,
    NgayTao        TEXT,
    NgayCapNhat    TEXT,
    NguoiTao       TEXT,
    NguoiCapNhat   TEXT,
    IsActive       TINYINT(1) DEFAULT 1
);

CREATE TABLE DinhMucVatTu
(
    Id             VARCHAR(50) PRIMARY KEY,
    IdDinhMuc      VARCHAR(50),
    IdCCDCVT       VARCHAR(50),
    GhiChu         TEXT,
    SoLuong        INT,
    NgayTao        TEXT,
    NgayCapNhat    TEXT,
    NguoiTao       TEXT,
    NguoiCapNhat   TEXT,
    IsActive       TINYINT(1) DEFAULT 1,
    FOREIGN KEY (IdDinhMuc) REFERENCES DinhMucSuaChua(Id) ON DELETE CASCADE
);
