-- =====================================================
-- Migration V101: Rename IdGiamDinhMayMoc to IdBienPhapMayMoc in table nghiemthu_maymoc
-- =====================================================

ALTER TABLE nghiemthu_maymoc CHANGE COLUMN IdGiamDinhMayMoc IdBienPhapMayMoc VARCHAR(50);
