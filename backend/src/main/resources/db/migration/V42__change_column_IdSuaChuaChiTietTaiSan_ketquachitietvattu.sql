ALTER TABLE ketquasuachua_chitiet_vattu
    CHANGE IdSuaChuaChiTietTaiSan IdKetQuaSuaChuaChiTiet VARCHAR(50);

ALTER TABLE ketquasuachua_chitiet_vattu
    ADD CONSTRAINT fk_kqscct_kqscctvt
        FOREIGN KEY (IdKetQuaSuaChuaChiTiet)
            REFERENCES ketquasuachua_chitiet(Id)