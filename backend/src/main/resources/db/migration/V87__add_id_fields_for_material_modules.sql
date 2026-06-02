-- Migration: Thêm các cột IdVatTu và IdChiTietVatTu để quản lý đồng bộ mã vật tư và mã chi tiết
-- Version: 87

-- 1. Bảng Đánh giá vật tư chi tiết
ALTER TABLE danhgia_vattu_chitiet ADD COLUMN IdVatTu VARCHAR(50) AFTER IdChiTietVatTu;

-- 2. Bảng Nghiệm thu vật tư
ALTER TABLE nghiemthu_vattu ADD COLUMN IdVatTu VARCHAR(50) AFTER IdChiTietVatTu;

-- 3. Bảng Định mức vật tư
ALTER TABLE DinhMucVatTu ADD COLUMN IdChiTietVatTu VARCHAR(50) AFTER IdCCDCVT;
