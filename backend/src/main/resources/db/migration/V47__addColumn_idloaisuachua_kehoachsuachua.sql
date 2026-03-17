ALTER TABLE kehoachsuachua
    ADD COLUMN IdLoaiSuaChua VARCHAR(50);

ALTER TABLE kehoachsuachua
    ADD CONSTRAINT fk_khsc_loaisc
        FOREIGN KEY (IdLoaiSuaChua)
            REFERENCES loaiscbd(id);