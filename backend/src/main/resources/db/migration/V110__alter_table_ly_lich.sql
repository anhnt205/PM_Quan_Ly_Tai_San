 drop table if exists lylich_nhomtaisan;
 alter table nhomtaisan
 add column IdLyLich varchar(255),
 ADD CONSTRAINT fk_IdLyLich_constraint
 FOREIGN KEY (IdLyLich)
 REFERENCES lylich(id);

 CREATE TABLE `lylich_template` (
    `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `MaLyLich` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `TenLyLich` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `MoTa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `HieuLuc` bit(1) DEFAULT b'1',
    `IdCongTy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NgayTao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NgayCapNhat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NguoiTao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NguoiCapNhat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 alter table lylich
 add column IdLyLichTemplate varchar(255),
 ADD CONSTRAINT fk_IdLyLichTemplate_constraint
 FOREIGN KEY (IdLyLichTemplate)
 REFERENCES lylich_template(id);