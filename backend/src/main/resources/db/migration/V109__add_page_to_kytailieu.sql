-- =====================================================
-- Migration: Add Page column to KyTaiLieu
-- =====================================================

ALTER TABLE KyTaiLieu ADD COLUMN Page INT DEFAULT 1;
