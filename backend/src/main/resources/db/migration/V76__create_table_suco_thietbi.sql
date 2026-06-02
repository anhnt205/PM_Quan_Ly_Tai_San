-- ============================================================
--  V76: Tạo bảng sự cố thiết bị và chi tiết tài sản sự cố
--
--  suco_thietbi         : Phiếu sự cố thiết bị
--  suco_thietbi_chitiet : Chi tiết tài sản trong phiếu sự cố
--
--  TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
--  MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
-- ============================================================

-- ============================================================
--  Bảng chính: suco_thietbi
-- ============================================================
CREATE TABLE IF NOT EXISTS suco_thietbi (
    Id                      VARCHAR(50)     NOT NULL                        COMMENT 'Khóa chính, tự sinh theo pattern SC-YYYY-NNNN',
    IdCongTy                VARCHAR(50)     NOT NULL                        COMMENT 'ID công ty sở hữu phiếu',
    IdKeHoach               VARCHAR(50)     NULL                            COMMENT 'ID kế hoạch sửa chữa liên quan (nếu có)',
    SoPhieu                 VARCHAR(100)    NULL                            COMMENT 'Số phiếu sự cố',
    IdDonViBaoCao           VARCHAR(50)     NULL                            COMMENT 'ID đơn vị / phòng ban báo cáo sự cố (FK → PhongBan.Id)',
    NgayPhatHien            VARCHAR(20)     NULL                            COMMENT 'Ngày phát hiện sự cố (yyyy-MM-dd)',
    TenHeThongThietBi       NVARCHAR(500)   NULL                            COMMENT 'Tên hệ thống / thiết bị gặp sự cố',
    PhanHeViTri             NVARCHAR(500)   NULL                            COMMENT 'Phân hệ hoặc vị trí xảy ra sự cố',
    MucDo                   TINYINT         NOT NULL DEFAULT 1              COMMENT 'Mức độ: 1=Nhẹ | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng',
    MoTa                    TEXT            NULL                            COMMENT 'Mô tả chi tiết sự cố',

    IdNguoiLap              VARCHAR(50)     NULL                            COMMENT 'ID nhân viên lập phiếu (FK → NhanVien.Id)',
    NguoiLapXacNhan         TINYINT(1)      NOT NULL DEFAULT 0              COMMENT 'Người lập đã xác nhận: 0=Chưa | 1=Đã xác nhận',

    IdGiamDoc               VARCHAR(50)     NULL                            COMMENT 'ID nhân viên giám đốc duyệt (FK → NhanVien.Id)',
    GiamDocXacNhan          TINYINT(1)      NOT NULL DEFAULT 0              COMMENT 'Giám đốc đã duyệt: 0=Chưa | 1=Đã duyệt',

    Share                   TINYINT(1)      NOT NULL DEFAULT 0              COMMENT 'Chia sẻ phiếu cho người ký thấy: 0=Không | 1=Có',
    TrangThai               TINYINT         NOT NULL DEFAULT 0              COMMENT 'Trạng thái: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành',

    NgayTao                 DATETIME        NULL                            COMMENT 'Ngày tạo bản ghi',
    NgayCapNhat             DATETIME        NULL                            COMMENT 'Ngày cập nhật lần cuối',
    NguoiTao                VARCHAR(50)     NULL                            COMMENT 'ID người tạo',
    NguoiCapNhat            VARCHAR(50)     NULL                            COMMENT 'ID người cập nhật lần cuối',

    PRIMARY KEY (Id),
    INDEX idx_suco_idcongty   (IdCongTy),
    INDEX idx_suco_trangthai  (TrangThai),
    INDEX idx_suco_mucdo      (MucDo),
    INDEX idx_suco_ngaytao    (NgayTao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Phiếu sự cố thiết bị';


-- ============================================================
--  Bảng chi tiết: suco_thietbi_chitiet
-- ============================================================
CREATE TABLE IF NOT EXISTS suco_thietbi_chitiet (
    Id                      VARCHAR(50)     NOT NULL                        COMMENT 'Khóa chính (UUID prefix SCCT_)',
    IdSuCo                  VARCHAR(50)     NOT NULL                        COMMENT 'ID phiếu sự cố cha (FK → suco_thietbi.Id)',
    IdTaiSan                VARCHAR(50)     NULL                            COMMENT 'ID tài sản liên quan (FK → TaiSan.Id)',
    ThuocHeThong            NVARCHAR(500)   NULL                            COMMENT 'Thuộc hệ thống – nhập tay (vd: Hệ thống điện, PCCC, …)',
    TinhTrang               NVARCHAR(500)   NULL                            COMMENT 'Tình trạng tài sản tại thời điểm sự cố – nhập tay',
    IdDonViQuanLyKyThuat    VARCHAR(50)     NULL                            COMMENT 'ID đơn vị quản lý kỹ thuật phụ trách (FK → PhongBan.Id)',

    NgayTao                 VARCHAR(30)     NULL                            COMMENT 'Ngày tạo dòng chi tiết (yyyy-MM-dd HH:mm:ss)',
    NgayCapNhat             VARCHAR(30)     NULL                            COMMENT 'Ngày cập nhật lần cuối',
    NguoiTao                VARCHAR(50)     NULL                            COMMENT 'ID người tạo',
    NguoiCapNhat            VARCHAR(50)     NULL                            COMMENT 'ID người cập nhật lần cuối',

    PRIMARY KEY (Id),
    INDEX idx_scct_idsuco    (IdSuCo),
    INDEX idx_scct_idtaisan  (IdTaiSan),
    CONSTRAINT fk_scct_suco  FOREIGN KEY (IdSuCo) REFERENCES suco_thietbi(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Chi tiết tài sản trong phiếu sự cố thiết bị';


-- ============================================================
--  Sequence entry cho việc tự sinh ID sự cố (SC-YYYY-NNNN)
-- ============================================================
INSERT IGNORE INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('SUCO', YEAR(NOW()), 0);
