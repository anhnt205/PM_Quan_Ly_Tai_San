ALTER TABLE taisan
    ADD COLUMN tgKiemDinh VARCHAR(50);

ALTER TABLE taisan
    ADD COLUMN chuKyKiemDinh INT;

ALTER TABLE taisan
    ADD COLUMN trangThaiKiemDinh TINYINT(1) DEFAULT 1;