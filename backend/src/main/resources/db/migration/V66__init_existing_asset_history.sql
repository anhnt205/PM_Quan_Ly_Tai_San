-- Khởi tạo lịch sử khởi tạo cho các tài sản hiện có chưa có bản ghi lịch sử nào
INSERT INTO LichSuDieuChuyenTaiSan (Id, IdTaiSan, IdDonViGiao, IdDonViNhan, ThoiGianBanGiao)
SELECT 
    UUID(), 
    ts.Id, 
    ts.IdDonViBanDau, 
    ts.IdDonViBanDau,
    COALESCE(ts.NgayTao, NOW())
FROM TaiSan ts
LEFT JOIN LichSuDieuChuyenTaiSan ls ON ts.Id = ls.IdTaiSan
WHERE ls.IdTaiSan IS NULL;
