START TRANSACTION;

ALTER TABLE KetQuaSuaChua
DROP FOREIGN KEY KetQuaSuaChua_ibfk_2;

ALTER TABLE KetQuaSuaChua
    ADD CONSTRAINT fk_ketquasuachua_congty
        FOREIGN KEY (IdCongTy)
            REFERENCES congty(Id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;

COMMIT;