ALTER TABLE suachua_chitiet_taisan
    ADD COLUMN DaSuaChua TINYINT(1) DEFAULT 0;

ALTER TABLE suachua
    CHANGE CoPhieuBanGiao CoPhieuSuaChua  TINYINT(1) DEFAULT 0;