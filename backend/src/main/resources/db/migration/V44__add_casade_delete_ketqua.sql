-- 1. XỬ LÝ BẢNG: ketquasuachua_chitiet
-- Xóa khóa ngoại cũ trỏ tới bảng ketquasuachua
-- (LƯU Ý: Thay 'ketquasuachua_chitiet_ibfk_1' bằng tên khóa ngoại thực tế trong DB của bạn)
ALTER TABLE ketquasuachua_chitiet DROP FOREIGN KEY ketquasuachua_chitiet_ibfk_1;

-- Thêm lại khóa ngoại mới có ON DELETE CASCADE
ALTER TABLE ketquasuachua_chitiet 
ADD CONSTRAINT fk_kqscct_kqsc 
FOREIGN KEY (IdKetQuaSuaChua) REFERENCES ketquasuachua(Id) ON DELETE CASCADE;


-- 2. XỬ LÝ BẢNG: ketquasuachua_chitiet_vattu
-- Xóa khóa ngoại cũ trỏ tới bảng ketquasuachua_chitiet (Tên này lấy từ lỗi lúc nãy của bạn)
ALTER TABLE ketquasuachua_chitiet_vattu DROP FOREIGN KEY fk_kqscct_kqscctvt;

-- Xóa khóa ngoại cũ trỏ tới bảng ketquasuachua (nếu có)
-- (LƯU Ý: Thay 'ketquasuachua_chitiet_vattu_ibfk_1' bằng tên khóa ngoại thực tế)
ALTER TABLE ketquasuachua_chitiet_vattu DROP FOREIGN KEY ketquasuachua_chitiet_vattu_ibfk_1;

-- Thêm lại các khóa ngoại mới có ON DELETE CASCADE
ALTER TABLE ketquasuachua_chitiet_vattu
ADD CONSTRAINT fk_kqscctvt_kqsc
FOREIGN KEY (IdKetQuaSuaChua) REFERENCES ketquasuachua(Id) ON DELETE CASCADE;

ALTER TABLE ketquasuachua_chitiet_vattu
ADD CONSTRAINT fk_kqscctvt_kqscct
FOREIGN KEY (IdKetQuaSuaChuaChiTiet) REFERENCES ketquasuachua_chitiet(Id) ON DELETE CASCADE;