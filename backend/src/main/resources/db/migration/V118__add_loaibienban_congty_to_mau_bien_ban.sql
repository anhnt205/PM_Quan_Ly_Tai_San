-- V100: Thêm cột LoaiBienBan và CongTy vào bảng mau_bien_ban_sua_chua
ALTER TABLE mau_bien_ban_sua_chua
    ADD COLUMN LoaiBienBan VARCHAR(100) NULL,
    ADD COLUMN CongTy      VARCHAR(255) NULL;

-- Đảm bảo mỗi loại biên bản chỉ có duy nhất 1 bản ghi mặc định:
-- Với mỗi (LoaiBienBan) chỉ có thể 1 dòng có MacDinh = true
-- (Ràng buộc được xử lý ở tầng service, không dùng UNIQUE vì NULL cần được cho phép)
