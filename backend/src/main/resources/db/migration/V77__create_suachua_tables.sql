-- ============================================================
--  V77: Tạo bảng Sửa Chữa và Sửa Chữa Chi Tiết
--  TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
-- ============================================================

CREATE TABLE IF NOT EXISTS suachua (
    Id                      VARCHAR(50)     NOT NULL                            COMMENT 'Khóa chính, tự sinh pattern SC-YYYY-NNNN',
    IdCongTy                VARCHAR(50)     NOT NULL                            COMMENT 'ID công ty',
    SoPhieu                 VARCHAR(100)    NULL                                COMMENT 'Số phiếu sửa chữa',
    IdKeHoach               VARCHAR(50)     NULL                                COMMENT 'ID kế hoạch sửa chữa',
    GhiChu                  TEXT            NULL                                COMMENT 'Ghi chú',

    IdNguoiLap              VARCHAR(50)     NULL                                COMMENT 'ID nhân viên lập',
    NguoiLapXacNhan         TINYINT(1)      NOT NULL DEFAULT 0                  COMMENT 'Người lập đã xác nhận: 0=Chưa | 1=Đã xác nhận',

    IdGiamDoc               VARCHAR(50)     NULL                                COMMENT 'ID nhân viên giám đốc duyệt',
    GiamDocXacNhan          TINYINT(1)      NOT NULL DEFAULT 0                  COMMENT 'Giám đốc đã duyệt: 0=Chưa | 1=Đã duyệt',

    Share                   TINYINT(1)      NOT NULL DEFAULT 0                  COMMENT 'Chia sẻ phiếu: 0=Không | 1=Có',
    TrangThai               TINYINT         NOT NULL DEFAULT 0                  COMMENT 'Trạng thái: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành',

    NgayTao                 DATETIME        NULL                                COMMENT 'Ngày tạo',
    NgayCapNhat             DATETIME        NULL                                COMMENT 'Ngày cập nhật',
    NguoiTao                VARCHAR(50)     NULL                                COMMENT 'Người tạo',
    NguoiCapNhat            VARCHAR(50)     NULL                                COMMENT 'Người cập nhật',

    PRIMARY KEY (Id),
    INDEX idx_suachua_idcongty (IdCongTy),
    INDEX idx_suachua_trangthai (TrangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phiếu sửa chữa';


CREATE TABLE IF NOT EXISTS suachua_chitiet (
    Id                      VARCHAR(50)     NOT NULL                            COMMENT 'Khóa chính UUID',
    IdSuaChua               VARCHAR(50)     NOT NULL                            COMMENT 'ID phiếu sửa chữa (FK)',
    IdKeHoach               VARCHAR(50)     NULL                                COMMENT 'ID kế hoạch sửa chữa',
    IdKeHoachChiTiet        VARCHAR(50)     NULL                                COMMENT 'ID kế hoạch sửa chữa chi tiết tài sản',

    NgayTao                 VARCHAR(30)     NULL                                COMMENT 'Ngày tạo',
    NgayCapNhat             VARCHAR(30)     NULL                                COMMENT 'Ngày cập nhật',
    NguoiTao                VARCHAR(50)     NULL                                COMMENT 'Người tạo',
    NguoiCapNhat            VARCHAR(50)     NULL                                COMMENT 'Người cập nhật',

    PRIMARY KEY (Id),
    INDEX idx_scct_idsuachua (IdSuaChua),
    CONSTRAINT fk_scct_suachua FOREIGN KEY (IdSuaChua) REFERENCES suachua(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết phiếu sửa chữa';


INSERT IGNORE INTO Sequence (SeqName, SeqYear, SeqValue) VALUES ('SUACHUA', YEAR(NOW()), 0);
