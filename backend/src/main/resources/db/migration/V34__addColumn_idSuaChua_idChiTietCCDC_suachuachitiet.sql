ALTER TABLE suachua_chitiet_taisan
    ADD COLUMN IdSuaChua VARCHAR(50);
ALTER TABLE suachua_vattu_tieuhao
    ADD COLUMN IdSuaChua VARCHAR(50);

ALTER TABLE suachua_vattu_tieuhao
    ADD COLUMN IdChiTietCCDC VARCHAR(50);

-- Thêm lại constraint với tên mới
ALTER TABLE suachua_chitiet_taisan
    ADD CONSTRAINT suachua_suachua_chitiet_taisan_IdSuaChua
        FOREIGN KEY (IdSuaChua)
            REFERENCES suachua(id);

ALTER TABLE suachua_vattu_tieuhao
    ADD CONSTRAINT suachua_suachua_vattu_tieuhao_IdSuaChua
        FOREIGN KEY (IdSuaChua)
            REFERENCES suachua(id);

ALTER TABLE kehoachsuachua_vattu_tieuhao
    ADD CONSTRAINT suachua_vattu_tieuhao_chitiettaisan_IdChiTietCCDC
        FOREIGN KEY (IdChiTietCCDC)
            REFERENCES chitiettaisan(id);