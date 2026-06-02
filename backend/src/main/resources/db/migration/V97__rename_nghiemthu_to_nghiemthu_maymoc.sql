-- =====================================================
-- Migration V97: Đổi tên bảng nghiệm thu → nghiệm thu máy móc
-- Mục đích: Tách biệt nghiệm thu theo loại thiết bị
-- =====================================================

-- 1. Đổi tên bảng con nghiemthu_vattu trước (phụ thuộc vào nghiemthu_taisan)
RENAME TABLE nghiemthu_vattu TO nghiemthu_maymoc_vattu;

-- 2. Đổi tên bảng nghiemthu_taisan (phụ thuộc vào nghiemthu)
RENAME TABLE nghiemthu_taisan TO nghiemthu_maymoc_taisan;

-- 3. Đổi tên bảng cha
RENAME TABLE nghiemthu TO nghiemthu_maymoc;

-- 4. Đổi tên Sequence để tạo ID mới theo tên bảng mới
UPDATE Sequence SET SeqName = 'NGHIEMTHU_MAYMOC' WHERE SeqName = 'NGHIEMTHU';
