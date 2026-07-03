-- Thêm cột CongTy vào bảng kehoach_suachua (TenMauBienBanSuaChua đã có sẵn)
ALTER TABLE kehoachsuachua ADD COLUMN CongTy VARCHAR(255) NULL;

-- Thêm cột CongTy và TenMauBienBan vào các bảng liên quan đến biên bản/phiếu
ALTER TABLE suachua ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE suachua ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE suco_thietbi ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE suco_thietbi ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE kiemtra_suco ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE kiemtra_suco ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE giamdinh_maymoc ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE giamdinh_maymoc ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE giamdinh_phuongtien ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE giamdinh_phuongtien ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE bienphap_maymoc ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE bienphap_maymoc ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE bienphap_phuongtien ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE bienphap_phuongtien ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE danhgia_vattu ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE danhgia_vattu ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE nghiemthu_maymoc ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE nghiemthu_maymoc ADD COLUMN TenMauBienBan VARCHAR(255) NULL;

ALTER TABLE nghiemthu_phuongtien ADD COLUMN CongTy VARCHAR(255) NULL;
ALTER TABLE nghiemthu_phuongtien ADD COLUMN TenMauBienBan VARCHAR(255) NULL;
