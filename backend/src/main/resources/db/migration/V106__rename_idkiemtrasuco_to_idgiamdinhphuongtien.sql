-- =====================================================
-- Migration V106: Rename IdKiemTraSuCo to IdGiamDinhPhuongTien in table bienphap_phuongtien
-- =====================================================

ALTER TABLE bienphap_phuongtien CHANGE COLUMN IdKiemTraSuCo IdGiamDinhPhuongTien VARCHAR(50);
