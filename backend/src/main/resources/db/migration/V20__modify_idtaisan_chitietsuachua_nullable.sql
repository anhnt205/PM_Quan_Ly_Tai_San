-- Remove NOT NULL constraint from IdTaiSan column in ChiTietSuaChua table
ALTER TABLE chitietsuachua
    MODIFY IdTaiSan VARCHAR(50) NULL;
