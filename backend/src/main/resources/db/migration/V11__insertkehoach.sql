-- =====================================================
-- Dữ liệu mẫu cho bảng KeHoachSuaChua
-- =====================================================
INSERT INTO KeHoachSuaChua (
    Id, IdCongTy, TenKeHoach, LoaiKeHoach, ChuKyNgay, MocGioMay,
    IdDonViThucHien, IdNguoiPhuTrach, NgayBatDau, NgayKetThuc,
    LoaiDoiTuong, NgayTao, NgayCapNhat, GhiChu
) VALUES
      ('KH001', 'CT001', 'Kế hoạch bảo trì máy phát điện', 'THIET_BI', NULL, NULL,
       'K30', '1029', '2025-06-01', '2025-06-30', 'TAI_SAN', NOW(), NOW(),
       'Bảo trì các máy phát điện trong kho'),

      ('KH002', 'CT001', 'Kế hoạch kiểm tra thiết bị điện', 'CHU_KY', 90, NULL,
       'CD1', '1007', '2025-07-01', '2025-07-31', 'TAI_SAN', NOW(), NOW(),
       'Kiểm tra trạm biến áp'),

      ('KH003', 'CT001', 'Kế hoạch bảo dưỡng CCDC phòng cháy', 'CHU_KY', 180, NULL,
       'CD1', '1018', '2025-08-01', '2025-08-31', 'CCDC', NOW(), NOW(),
       'Bảo dưỡng găng tay, ủng cách điện'),

      ('KH004', 'CT001', 'Kế hoạch kiểm tra định kỳ dụng cụ', 'GIO_MAY', NULL, 200,
       'DS2', '1023', '2025-09-01', '2025-09-30', 'CCDC', NOW(), NOW(),
       'Kiểm tra móc treo, tủ chữa cháy');

-- =====================================================
-- Dữ liệu mẫu cho bảng KeHoachChiTietSuaChua (chi tiết tài sản/CCDC)
-- =====================================================
INSERT INTO KeHoachChiTietSuaChua (
    Id, IdKeHoach, IdTaiSan, IdCCDC, GhiChu, NgayTao, NgayCapNhat
) VALUES
      ('KHCT001', 'KH001', '1.333', NULL, 'Máy phát điện công suất 12kW', NOW(), NOW()),
      ('KHCT002', 'KH001', '1.467', NULL, 'Máy phát điện 03', NOW(), NOW()),
      ('KHCT003', 'KH001', 'A.1234', NULL, 'Máy phát điện 200W', NOW(), NOW()),
      ('KHCT004', 'KH002', 'A1', NULL, 'Trạm BA 560 KVA', NOW(), NOW()),
      ('KHCT005', 'KH002', 'A10', NULL, 'Trạm BA 400KVA', NOW(), NOW()),
      ('KHCT006', 'KH003', NULL, '6502BHLD010', 'Găng tay cách điện 22Kv', NOW(), NOW()),
      ('KHCT007', 'KH003', NULL, '6502BHLD012', 'Găng tay cách điện 6KV', NOW(), NOW()),
      ('KHCT008', 'KH003', NULL, '6502BHLD013', 'Ủng cách điện 6Kv', NOW(), NOW()),
      ('KHCT009', 'KH004', NULL, '2500VLXD345', 'Tủ chữa cháy vách tường', NOW(), NOW()),
      ('KHCT010', 'KH004', NULL, '2500VLXD648', 'Móc treo quần áo', NOW(), NOW());

-- =====================================================
-- Dữ liệu mẫu cho bảng KeHoachCongViecSuaChua (công việc)
-- =====================================================
INSERT INTO KeHoachCongViecSuaChua (
    Id, IdKeHoach, TenCongViec, MoTa, ThoiGianDuKien, NgayThucHien,
    NgayTao, NgayCapNhat, TrangThai
) VALUES
      ('KHCV001', 'KH001', 'Vệ sinh máy phát', 'Vệ sinh bên ngoài và kiểm tra dầu', 120, '2025-06-10', NOW(), NOW(), 0),
      ('KHCV002', 'KH001', 'Kiểm tra ắc quy', 'Kiểm tra tình trạng ắc quy khởi động', 60, '2025-06-15', NOW(), NOW(), 0),
      ('KHCV003', 'KH001', 'Đo điện áp đầu ra', 'Kiểm tra điện áp các pha', 45, '2025-06-20', NOW(), NOW(), 0),
      ('KHCV004', 'KH002', 'Đo cách điện', 'Đo điện trở cách điện trạm biến áp', 180, '2025-07-10', NOW(), NOW(), 0),
      ('KHCV005', 'KH002', 'Kiểm tra dầu biến áp', 'Lấy mẫu và phân tích dầu', 90, '2025-07-15', NOW(), NOW(), 1),
      ('KHCV006', 'KH003', 'Kiểm tra găng tay', 'Kiểm tra thủng, rách', 30, '2025-08-05', NOW(), NOW(), 2),
      ('KHCV007', 'KH003', 'Thử nghiệm cách điện', 'Thử nghiệm điện áp cao', 60, '2025-08-12', NOW(), NOW(), 0),
      ('KHCV008', 'KH004', 'Kiểm tra tủ chữa cháy', 'Kiểm tra bình bột, van', 45, '2025-09-05', NOW(), NOW(), 0),
      ('KHCV009', 'KH004', 'Kiểm tra móc treo', 'Kiểm tra độ bền, móc treo', 30, '2025-09-10', NOW(), NOW(), 0);