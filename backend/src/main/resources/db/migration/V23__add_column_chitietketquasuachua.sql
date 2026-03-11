ALTER TABLE chitietketquasuachua
    ADD COLUMN IdCCDC VARCHAR(50),
ADD COLUMN IdChiTietCCDC VARCHAR(50);

ALTER TABLE chitietketquasuachua
    ADD INDEX idx_ctkq_ccdc (IdCCDC),
ADD INDEX idx_ctkq_chitietccdc (IdChiTietCCDC);

ALTER TABLE chitietketquasuachua
    ADD CONSTRAINT fk_ctkq_ccdc
        FOREIGN KEY (IdCCDC) REFERENCES ccdcvattu(Id);

ALTER TABLE chitietketquasuachua
    ADD CONSTRAINT fk_ctkq_chitietccdc
        FOREIGN KEY (IdChiTietCCDC) REFERENCES chitiettaisan(Id);