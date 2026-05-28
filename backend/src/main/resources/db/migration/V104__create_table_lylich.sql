-- =====================================================
-- Migration: Tao bang Ly Lich, Ly Lich Nhom Tai San
-- Version: 104
-- =====================================================

DROP TABLE IF EXISTS `lylich_nhomtaisan`;
DROP TABLE IF EXISTS `lylich`;

 CREATE TABLE `lylich` (
    `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `MaLyLich` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `TenLyLich` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `MoTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `HieuLuc` bit(1) DEFAULT b'1',
    `IdCongTy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NgayTao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NgayCapNhat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NguoiTao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NguoiCapNhat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `lylich_nhomtaisan` (
     `lylich_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
     `nhomtaisan_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
     PRIMARY KEY (`lylich_id`,`nhomtaisan_id`),
     UNIQUE KEY `uk_nhomtaisan` (`nhomtaisan_id`),
     CONSTRAINT `FK6hx27fid8idcrahw9exfe3bpo` FOREIGN KEY (`nhomtaisan_id`) REFERENCES `nhomtaisan` (`id`),
     CONSTRAINT `FKs23vr2iqtc6fupvos7endpyxi` FOREIGN KEY (`lylich_id`) REFERENCES `lylich` (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  ALTER table `role` ADD COLUMN `CreatedAt` date DEFAULT NULL;
