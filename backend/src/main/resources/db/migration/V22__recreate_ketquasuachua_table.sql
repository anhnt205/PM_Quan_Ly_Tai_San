ALTER TABLE chitietketquasuachua DROP FOREIGN KEY fk_ctkq_ketqua;

DROP TABLE ketquasuachua;

CREATE TABLE ketquasuachua LIKE suachua;

ALTER TABLE ketquasuachua
    ADD COLUMN IdSuaChua VARCHAR(50),
ADD COLUMN ChiPhiPhanCong DECIMAL(15,2),
ADD COLUMN ChiPhiThueNgoai DECIMAL(15,2);

ALTER TABLE chitietketquasuachua
    ADD CONSTRAINT fk_ctkq_ketqua
        FOREIGN KEY (IdKetQuaSuaChua)
            REFERENCES ketquasuachua(Id);