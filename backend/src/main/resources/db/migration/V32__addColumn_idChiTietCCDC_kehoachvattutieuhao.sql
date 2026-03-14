ALTER TABLE kehoachsuachua_vattu_tieuhao
    ADD COLUMN IdChiTietCCDC VARCHAR(50);

-- Thêm lại constraint với tên mới
ALTER TABLE kehoachsuachua_vattu_tieuhao
    ADD CONSTRAINT suachua_vattu_tieuhao_chitiettaisan
        FOREIGN KEY (IdChiTietCCDC)
            REFERENCES chitiettaisan(id);