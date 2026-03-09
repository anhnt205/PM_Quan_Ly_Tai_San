

ALTER TABLE chitietsuachua
    ADD IdCCDC VARCHAR(50);
ALTER TABLE chitietsuachua
    ADD IdChiTietCCDC VARCHAR(50);

-- Thêm lại constraint với tên mới
ALTER TABLE chitietsuachua
    ADD CONSTRAINT fk_chitietsuachua_chitiettaisan_ccdc
        FOREIGN KEY (IdChiTietCCDC)
            REFERENCES chitiettaisan(id);

ALTER TABLE chitietsuachua
    ADD CONSTRAINT fk_chitietsuachua_ccdcvattu_ccdc
        FOREIGN KEY (IdCCDC)
            REFERENCES ccdcvattu(id);