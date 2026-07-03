-- Xóa constraint cũ
ALTER TABLE kehoachchitietsuachua
DROP FOREIGN KEY fk_kehoachchitietsuachua_chitiettaisan;

-- Đổi tên cột
ALTER TABLE kehoachchitietsuachua
    CHANGE IdChiTietTaiSan IdChiTietCCDC VARCHAR(50);

-- Thêm lại constraint với tên mới
ALTER TABLE kehoachchitietsuachua
    ADD CONSTRAINT fk_kehoachchitietsuachua_chitiettaisan_ccdc
        FOREIGN KEY (IdChiTietCCDC)
            REFERENCES chitiettaisan(id);