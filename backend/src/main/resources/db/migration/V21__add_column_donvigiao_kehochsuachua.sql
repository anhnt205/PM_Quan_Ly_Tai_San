ALTER TABLE KeHoachSuaChua 
ADD COLUMN idDonViGiao VARCHAR(50) NULL;

ALTER TABLE KeHoachSuaChua 
ADD CONSTRAINT fk_kehoach_phongban 
FOREIGN KEY (idDonViGiao) REFERENCES PhongBan(id);