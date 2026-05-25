-- Rename column IdGiamDinh to IdGiamDinhMayMoc in table nghiemthu
ALTER TABLE nghiemthu CHANGE COLUMN IdGiamDinh IdGiamDinhMayMoc VARCHAR(50);

-- Rename column IdChiTietGiamDinh to IdChiTietGiamDinhMayMoc in table nghiemthu_taisan
ALTER TABLE nghiemthu_taisan CHANGE COLUMN IdChiTietGiamDinh IdChiTietGiamDinhMayMoc VARCHAR(50);

-- Rename tables of GiamDinh
RENAME TABLE giamdinh TO giamdinh_maymoc;

RENAME TABLE giamdinh_chitiet TO giamdinh_maymoc_chitiet;
ALTER TABLE giamdinh_maymoc_chitiet CHANGE COLUMN IdGiamDinh IdGiamDinhMayMoc VARCHAR(50);

RENAME TABLE giamdinh_vattu TO giamdinh_maymoc_vattu;
ALTER TABLE giamdinh_maymoc_vattu CHANGE COLUMN IdChiTietGiamDinh IdChiTietGiamDinhMayMoc VARCHAR(50);
