-- =====================================================
-- Migration V98: Tạo bảng nghiệm thu phương tiện
-- Mục đích: Quản lý biên bản nghiệm thu phương tiện sau sửa chữa
-- =====================================================

-- Bảng cha: Nghiệm thu phương tiện
CREATE TABLE nghiemthu_phuongtien (
    Id                  VARCHAR(50)  PRIMARY KEY,
    IdCongTy            VARCHAR(50),
    IdGiamDinhPhuongTien VARCHAR(50),   -- FK tham chiếu biên bản giám định PT
    SoPhieu             VARCHAR(100),
    NoiDung             TEXT,           -- Nội dung nghiệm thu
    TinhTrang           TEXT,           -- Tình trạng phương tiện sau nghiệm thu
    CongViecPhatSinh    TEXT,           -- Công việc phát sinh thêm
    ChiPhiNhanCong      DECIMAL(18,2),  -- Chi phí nhân công
    KetLuan             TEXT,           -- Kết luận nghiệm thu

    -- Người lập phiếu
    IdNguoiLap          VARCHAR(50),
    NguoiLapXacNhan     TINYINT(1) DEFAULT 0,

    -- Giám đốc duyệt
    IdGiamDoc           VARCHAR(50),
    GiamDocXacNhan      TINYINT(1) DEFAULT 0,

    -- Workflow & trạng thái
    Share               TINYINT(1) DEFAULT 0,
    TrangThai           INT DEFAULT 0,  -- 0:nháp, 1:đang duyệt, 2:hủy, 3:hoàn thành

    -- Audit
    NgayTao             VARCHAR(50),
    NgayCapNhat         VARCHAR(50),
    NguoiTao            VARCHAR(50),
    NguoiCapNhat        VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng chi tiết: Danh sách vật tư trong nghiệm thu phương tiện
CREATE TABLE nghiemthu_phuongtien_chitiet (
    Id                  VARCHAR(50)  PRIMARY KEY,
    IdNghiemThuPhuongTien VARCHAR(50),  -- FK -> nghiemthu_phuongtien.Id
    IdChiTietVatTu      VARCHAR(50),    -- FK -> giamdinh_phuongtien_chitiet.Id
    IdVatTu             VARCHAR(50),    -- FK -> CCDCVatTu.Id
    SoLuongThayThe      INT DEFAULT 0,  -- Số lượng thay thế
    SoLuongThuHoi       INT DEFAULT 0,  -- Số lượng thu hồi
    PhanTramConLai      DECIMAL(5,2),   -- Phần trăm còn lại (%)
    BienPhapXuLy        TEXT,           -- Biện pháp xử lý
    GhiChu              TEXT,           -- Ghi chú
    CONSTRAINT fk_ntpt_chitiet_parent FOREIGN KEY (IdNghiemThuPhuongTien)
        REFERENCES nghiemthu_phuongtien(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo sequence cho module nghiệm thu phương tiện
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
VALUES ('NGHIEMTHU_PHUONGTIEN', YEAR(CURDATE()), 0)
ON DUPLICATE KEY UPDATE SeqValue = SeqValue;
