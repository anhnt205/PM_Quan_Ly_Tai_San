-- =====================================================
-- Migration: Tao bang mau_bien_ban_sua_chua
-- =====================================================

CREATE TABLE `mau_bien_ban_sua_chua` (
    `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Ma` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `Ten` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `MacDinh` bit(1) DEFAULT b'0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_maubienban_ma` (`Ma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
