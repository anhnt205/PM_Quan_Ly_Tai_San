ALTER TABLE giohoatdong
    ADD COLUMN IdDonVi VARCHAR(20) NULL COMMENT 'IdĐơnVị';

ALTER TABLE giohoatdong
    ADD CONSTRAINT fk_giohoatdong_phongban
    FOREIGN KEY (IdDonVi) REFERENCES phongban(Id);
