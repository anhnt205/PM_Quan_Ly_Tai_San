ALTER TABLE kehoachsuachua_vattu_tieuhao
    ADD COLUMN IdNhomCCDC VARCHAR(50);

ALTER TABLE suachua_vattu_tieuhao
    ADD COLUMN IdNhomCCDC VARCHAR(50);

ALTER TABLE ketquasuachua_chitiet_vattu
    ADD COLUMN IdNhomCCDC VARCHAR(50);

ALTER TABLE kehoachsuachua_vattu_tieuhao
    ADD CONSTRAINT fk_khscvt_nhomccdc
        FOREIGN KEY (IdNhomCCDC)
            REFERENCES nhomccdc(id);
ALTER TABLE suachua_vattu_tieuhao
    ADD CONSTRAINT fk_scvt_nhomccdc
        FOREIGN KEY (IdNhomCCDC)
            REFERENCES nhomccdc(id);

ALTER TABLE ketquasuachua_chitiet_vattu
    ADD CONSTRAINT fk_kqscvt_nhomccdc
        FOREIGN KEY (IdNhomCCDC)
            REFERENCES nhomccdc(id);