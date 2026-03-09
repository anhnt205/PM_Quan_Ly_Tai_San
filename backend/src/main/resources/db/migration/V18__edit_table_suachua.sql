-- Thêm cột idLoaiSCBD
ALTER TABLE suachua
    ADD idLoaiSuaChua VARCHAR(50);
ALTER TABLE suachua
    ADD GhiChu VARCHAR(50);


-- Thêm khóa ngoại liên kết tới loaiscbd(id)
ALTER TABLE suachua
    ADD CONSTRAINT fk_suachua_loaiscbd
        FOREIGN KEY (idLoaiSuaChua)
            REFERENCES loaiscbd(id);
