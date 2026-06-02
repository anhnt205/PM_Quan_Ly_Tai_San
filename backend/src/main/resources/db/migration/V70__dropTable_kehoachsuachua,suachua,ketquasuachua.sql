-- 1. Tắt kiểm tra khóa ngoại để xóa bất chấp thứ tự
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Liệt kê tất cả các bảng bạn muốn xóa (Sử dụng IF EXISTS để không bị lỗi nếu bảng đã mất)
-- Nhóm bảng con/bảng chi tiết trước
DROP TABLE IF EXISTS kehoachsuachua_chitiet_taisan;
DROP TABLE IF EXISTS kehoachsuachua_chitiet;
DROP TABLE IF EXISTS kehoachsuachua_vat_tu_tieu_hao;
DROP TABLE IF EXISTS kehoachsuachua_vattu_tieuhhao;
DROP TABLE IF EXISTS KeHoachCongViecSuaChua;
DROP TABLE IF EXISTS kehoachcongviecsuachua;
DROP TABLE IF EXISTS KeHoachChiTietSuaChua;
DROP TABLE IF EXISTS kehoachchitietsuachua;
DROP TABLE IF EXISTS ChiTietSuaChua;
DROP TABLE IF EXISTS chitietsuachua;
DROP TABLE IF EXISTS suachua_chitiet_taisan;
DROP TABLE IF EXISTS suachua_vat_tu_tieu_hao;
DROP TABLE IF EXISTS ChiTietKetQuaSuaChua;
DROP TABLE IF EXISTS chitietketquasuachua;
DROP TABLE IF EXISTS KetQuaSuaChua;
DROP TABLE IF EXISTS ketquasuachua;

-- Nhóm bảng chính
DROP TABLE IF EXISTS SuaChua;
DROP TABLE IF EXISTS suachua;
DROP TABLE IF EXISTS KeHoachSuaChua;
DROP TABLE IF EXISTS kehoachsuachua;

-- 3. Bật lại kiểm tra khóa ngoại để bảo vệ dữ liệu các bảng khác
SET FOREIGN_KEY_CHECKS = 1;