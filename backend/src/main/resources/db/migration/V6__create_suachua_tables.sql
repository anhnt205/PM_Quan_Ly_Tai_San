-- =====================================================
-- Migration: Tạo các bảng cho module sửa chữa
-- Version: 6
-- =====================================================

-- Bảng SuaChua (Phiếu sửa chữa)
CREATE TABLE SuaChua (
                         Id VARCHAR(50) NOT NULL PRIMARY KEY,
                         IdCongTy VARCHAR(50) NOT NULL,
                         MaSuaChua VARCHAR(100),
                         TenSuaChua VARCHAR(255) NOT NULL,
                         MucDoSuCo VARCHAR(50),
                         MucDoUuTien VARCHAR(50),
                         IdDonViGiao VARCHAR(50),
                         IdDonViNhan VARCHAR(50),
                         IdNguoiKyNhay TEXT,
                         TrangThaiKyNhay TINYINT(1) DEFAULT 0,
                         NguoiLapPhieuKyNhay TINYINT(1) DEFAULT 0,
                         NgayKetThucDuKien DATE,
                         IdTrinhDuyetCapPhong VARCHAR(100),
                         TrinhDuyetCapPhongXacNhan TINYINT(1) DEFAULT 0,
                         IdTrinhDuyetGiamDoc VARCHAR(100),
                         TrinhDuyetGiamDocXacNhan TINYINT(1) DEFAULT 0,
                         IdDonViDeNghi TEXT,
                         DuongDanFile TEXT,
                         TenFile TEXT,
                         TaiLieuBanGhi TEXT,
                         ByStep TINYINT(1) DEFAULT 0,
                         SoQuyetDinh VARCHAR(100),
                         NguoiTao TEXT,
                         Share TINYINT(1) DEFAULT 0,
                         NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                         DaBanGiao TINYINT(1) DEFAULT 0,
                         CoPhieuBanGiao TINYINT(1) DEFAULT 0,
                         TaiLieuCuoi TEXT,
                         Loai INT,
                         TrangThai INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng ChiTietSuaChua (Chi tiết tài sản)
CREATE TABLE ChiTietSuaChua (
                                Id VARCHAR(50) NOT NULL PRIMARY KEY,
                                IdSuaChua VARCHAR(50) NOT NULL,
                                IdTaiSan VARCHAR(50) NOT NULL,
                                SoLuong INT DEFAULT 1,
                                HienTrang TEXT,
                                MoTa TEXT,
                                GhiChu TEXT,
                                NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                NguoiTao VARCHAR(100),
                                NguoiCapNhat VARCHAR(100),
                                IsActive TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng KetQuaSuaChua (Kết quả sửa chữa)
CREATE TABLE KetQuaSuaChua (
                               Id VARCHAR(50) NOT NULL PRIMARY KEY,
                               IdCongTy VARCHAR(50) NOT NULL,
                               IdSuaChua VARCHAR(50) NOT NULL,
                               MaKetQua VARCHAR(100),
                               TenKetQua VARCHAR(255) NOT NULL,
                               NgayBatDauThucTe DATETIME,
                               NgayKetThucThucTe DATETIME,
                               ThoiGianThucHienGio INT,
                               NoiDungCongViec TEXT NOT NULL,
                               KetQuaDatDuoc TEXT,
                               IdDonViThucHien VARCHAR(50),
                               NhanSuThucHien JSON,
                               IdTruongNhom VARCHAR(100),
                               DanhGiaTinhTrang TEXT,
                               TrangThaiHoatDong INT,
                               TongChiPhi DECIMAL(15,2),
                               VatTuTieuHao JSON,
                               DaXacNhan TINYINT(1) DEFAULT 0,
                               IdDaiDienBenGiao VARCHAR(100),
                               DaiDienBenGiaoXacNhan TINYINT(1) DEFAULT 0,
                               IdDaiDienBenNhan VARCHAR(100),
                               DaiDienBenNhanXacNhan TINYINT(1) DEFAULT 0,
                               TrangThai INT DEFAULT 0,
                               IdNguoiDuyet VARCHAR(100),
                               NgayDuyet DATETIME,
                               LyDoTuChoi TEXT,
                               Note TEXT,
                               GhiChu TEXT,
                               DuongDanFile TEXT,
                               TenFile TEXT,
                               TaiLieuBanGhi TEXT,
                               ByStep TINYINT(1) DEFAULT 0,
                               IdGiamDoc VARCHAR(100),
                               GiamDocKy TINYINT(1) DEFAULT 0,
                               SoQuyetDinh VARCHAR(100),
                               NgayQuyetDinh DATE,
                               DiaDiemQuyetDinh TEXT,
                               Share TINYINT(1) DEFAULT 0,
                               NgayTaoChungTu DATE,
                               NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                               NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               NguoiTao VARCHAR(100),
                               NguoiCapNhat VARCHAR(100),
                               IsActive TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng ChiTietKetQuaSuaChua (Chi tiết kết quả)
CREATE TABLE ChiTietKetQuaSuaChua (
                                      Id VARCHAR(50) NOT NULL PRIMARY KEY,
                                      IdKetQuaSuaChua VARCHAR(50) NOT NULL,
                                      IdTaiSan VARCHAR(50) NOT NULL,
                                      SoLuong INT DEFAULT 1,
                                      HienTrang TEXT,
                                      MoTa TEXT,
                                      DanhGia TEXT,
                                      VatTuSuDung JSON,
                                      GhiChu TEXT,
                                      NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                      NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      NguoiTao VARCHAR(100),
                                      NguoiCapNhat VARCHAR(100),
                                      IsActive TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tạo index
CREATE INDEX idx_suachua_congty ON SuaChua(IdCongTy);
CREATE INDEX idx_suachua_donvigiao ON SuaChua(IdDonViGiao);
CREATE INDEX idx_suachua_donvinhan ON SuaChua(IdDonViNhan);
CREATE INDEX idx_suachua_trangthai ON SuaChua(TrangThai);
CREATE INDEX idx_suachua_ngayketthuc ON SuaChua(NgayKetThucDuKien);

CREATE INDEX idx_ctsc_suachua ON ChiTietSuaChua(IdSuaChua);
CREATE INDEX idx_ctsc_taisan ON ChiTietSuaChua(IdTaiSan);

CREATE INDEX idx_kqsc_suachua ON KetQuaSuaChua(IdSuaChua);
CREATE INDEX idx_kqsc_congty ON KetQuaSuaChua(IdCongTy);
CREATE INDEX idx_kqsc_trangthai ON KetQuaSuaChua(TrangThai);

CREATE INDEX idx_ctkq_ketqua ON ChiTietKetQuaSuaChua(IdKetQuaSuaChua);
CREATE INDEX idx_ctkq_taisan ON ChiTietKetQuaSuaChua(IdTaiSan);

-- Thêm ràng buộc khóa ngoại
ALTER TABLE SuaChua ADD CONSTRAINT fk_suachua_congty FOREIGN KEY (IdCongTy) REFERENCES CongTy(Id);
ALTER TABLE SuaChua ADD CONSTRAINT fk_suachua_donvigiao FOREIGN KEY (IdDonViGiao) REFERENCES PhongBan(Id);
ALTER TABLE SuaChua ADD CONSTRAINT fk_suachua_donvinhan FOREIGN KEY (IdDonViNhan) REFERENCES PhongBan(Id);
ALTER TABLE SuaChua ADD CONSTRAINT fk_suachua_capphong FOREIGN KEY (IdTrinhDuyetCapPhong) REFERENCES NhanVien(Id);
ALTER TABLE SuaChua ADD CONSTRAINT fk_suachua_giamdoc FOREIGN KEY (IdTrinhDuyetGiamDoc) REFERENCES NhanVien(Id);

ALTER TABLE ChiTietSuaChua ADD CONSTRAINT fk_ctsc_suachua FOREIGN KEY (IdSuaChua) REFERENCES SuaChua(Id) ON DELETE CASCADE;
ALTER TABLE ChiTietSuaChua ADD CONSTRAINT fk_ctsc_taisan FOREIGN KEY (IdTaiSan) REFERENCES TaiSan(Id);

ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_suachua FOREIGN KEY (IdSuaChua) REFERENCES SuaChua(Id) ON DELETE CASCADE;
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_congty FOREIGN KEY (IdCongTy) REFERENCES CongTy(Id);
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_donvi FOREIGN KEY (IdDonViThucHien) REFERENCES PhongBan(Id);
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_truongnhom FOREIGN KEY (IdTruongNhom) REFERENCES NhanVien(Id);
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_nguoiduyet FOREIGN KEY (IdNguoiDuyet) REFERENCES NhanVien(Id);
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT fk_kqsc_giamdoc FOREIGN KEY (IdGiamDoc) REFERENCES NhanVien(Id);
ALTER TABLE KetQuaSuaChua ADD CONSTRAINT chk_kqsc_tongchiphi CHECK (TongChiPhi >= 0);

ALTER TABLE ChiTietKetQuaSuaChua ADD CONSTRAINT fk_ctkq_ketqua FOREIGN KEY (IdKetQuaSuaChua) REFERENCES KetQuaSuaChua(Id) ON DELETE CASCADE;
ALTER TABLE ChiTietKetQuaSuaChua ADD CONSTRAINT fk_ctkq_taisan FOREIGN KEY (IdTaiSan) REFERENCES TaiSan(Id);