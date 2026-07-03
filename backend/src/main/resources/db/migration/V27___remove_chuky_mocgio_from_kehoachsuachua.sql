-- ======================================================
-- Migration: Xóa 2 trường chuKyNgay và mocGioMay khỏi bảng kehoachsuachua
-- ======================================================

ALTER TABLE kehoachsuachua
DROP COLUMN ChuKyNgay,
DROP COLUMN MocGioMay;

Drop table LoaiKeHoachSucChua;