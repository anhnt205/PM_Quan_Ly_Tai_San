-- Thêm cột IdChiTietTaiSan
ALTER TABLE kehoachchitietsuachua
    ADD IdChiTietTaiSan VARCHAR(50);

-- Thêm khóa ngoại liên kết tới chitiettaisan(id)
ALTER TABLE kehoachchitietsuachua
    ADD CONSTRAINT fk_kehoachchitietsuachua_chitiettaisan
        FOREIGN KEY (IdChiTietTaiSan)
            REFERENCES chitiettaisan(id);