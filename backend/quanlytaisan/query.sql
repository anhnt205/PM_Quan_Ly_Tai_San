-- select account with company  
SELECT tk.Id,
       TenDangNhap,
       MatKhau,
       HoTen,
       tk.Email,
       tk.SoDienThoai,
       HinhAnh,
       tk.NgayTao,
       tk.NgayCapNhat,
       tk.NguoiTao,
       tk.NguoiCapNhat,
       tk.IdCongTy,
       `Rule`,
       tk.IsActive,
       ct.TenCongTy
FROM TaiKhoan AS tk
         LEFT JOIN
     CongTy AS ct ON tk.IdCongTy = ct.Id
where tk.IsActive = 1;

-- select NhomDonvi by id cong ty
select *
from NhomDonvi
where IdCongTy = 'CT001'
  and IsActive = 1;
-- select ChucVu by id cong ty
select *
from ChucVu
where IdCongTy = 'CT001'
  and IsActive = 1;
-- select PhongBan aka bo phan
SELECT pb.Id,
       pb.IdNhomDonVi,
       pb.TenPhongBan,
       pb.IdQuanLy,
       pb.IdCongTy,
       pb.PhongCapTren,
       pb.MauSac,
       ndv.TenNhom,
       nv.HoTen,
       pb.NguoiTao,
       pb.NguoiCapNhat
FROM PhongBan AS pb
         LEFT JOIN
     NhomDonVi AS ndv ON pb.IdNhomDonVi = ndv.Id
         LEFT JOIN
     NhanVien AS nv ON pb.IdQuanLy = nv.Id
WHERE pb.IsActive = 1
  and pb.IdCongTy = 'CT0001';
-- select Nhanvien
SELECT nv.Id,
       nv.HoTen,
       nv.DiDong,
       nv.EmailCongViec,
       nv.KieuKy,
       nv.AgreementUUId,
       nv.PIN,
       nv.ChuKy,

       pb.Id    AS PhongBanId,
       pb.TenPhongBan,

       cv.Id    AS ChucVuId,
       cv.TenChucVu,

       ql.Id    AS QuanLyId,
       ql.HoTen AS TenQuanLy,

       nv.LaQuanLy,
       nv.Avatar,
       nv.IdCongTy,
       nv.DiaChiLamViec,
       nv.HinhThucLamViec,
       nv.GioLamViec,
       nv.MuiGio,

       nv.NgayTao,
       nv.NgayCapNhat,
       nv.NguoiTao,
       nv.NguoiCapNhat,
       nv.IsActive
FROM NhanVien AS nv
         LEFT JOIN
     PhongBan AS pb ON nv.BoPhan = pb.Id
         LEFT JOIN
     ChucVu AS cv ON nv.ChucVu = cv.Id
         LEFT JOIN
     NhanVien AS ql ON nv.NguoiQuanLy = ql.Id
WHERE nv.IsActive = 1
  AND nv.IdCongTy = 'CT001';
-- thuoc tinh nhan vien
SELECT ttnv.Id,
       ttnv.IdNhanVien,
       nv.HoTen,
       ttnv.NoiDung,
       ttnv.NgayTao,
       ttnv.NgayCapNhat,
       ttnv.NguoiTao,
       ttnv.NguoiCapNhat,
       ttnv.IsActive
FROM ThuocTinhNhanVien AS ttnv
         LEFT JOIN
     NhanVien AS nv ON ttnv.IdNhanVien = nv.Id
WHERE ttnv.IdNhanVien = 'NV001'
  and ttnv.IsActive = 1;
-- nguon von
select *
from NguonVon
where IdCongty = 'CT001';
-- lay ve toan bo tai san
SELECT ts.Id,
       ts.TenTaiSan,
       ts.NguyenGia,
       ts.GiaTriKhauHaoBanDau,
       ts.KyKhauHaoBanDau,
       ts.GiaTriThanhLy,

       -- Thông tin mô hình tài sản
       ts.IdMoHinhTaiSan,
       mhts.TenMoHinh,

       -- Thông tin nhóm tài sản
       ts.IdNhomTaiSan,
       nts.TenNhom,

       -- Thông tin dự án
       ts.IdDuDan,
       da.TenDuAn,

       -- Thông tin nguồn vốn
       ts.IdNguonVon,
       nv.TenNguonKinhPhi,

       ts.PhuongPhapKhauHao,
       ts.SoKyKhauHao,
       ts.TaiKhoanTaiSan,
       ts.TaiKhoanKhauHao,
       ts.TaiKhoanChiPhi,
       ts.NgayVaoSo,
       ts.NgaySuDung,
       ts.KyHieu,
       ts.SoKyHieu,
       ts.CongSuat,
       ts.NuocSanXuat,
       ts.NamSanXuat,
       ts.LyDoTang,
       ts.HienTrang,
       ts.SoLuong,
       ts.DonViTinh,
       ts.GhiChu,
       ts.IdDonViBanDau,
       ts.IdDonViHienThoi,
       ts.MoTa,
       ts.IdCongTy,
       ts.NgayTao,
       ts.NgayCapNhat,
       ts.NguoiTao,
       ts.NguoiCapNhat,
       ts.IsActive
FROM TaiSan AS ts
         LEFT JOIN
     MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
         LEFT JOIN
     NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
         LEFT JOIN
     DuAn AS da ON ts.IdDuDan = da.Id
         LEFT JOIN
     NguonVon AS nv ON ts.IdNguonVon = nv.Id
where ts.IsActive = 1
  and ts.IdCongTy = 'CT001';

-- lay ve tai san theo loai
SELECT ts.Id,
       ts.TenTaiSan,
       ts.NguyenGia,
       ts.GiaTriKhauHaoBanDau,
       ts.KyKhauHaoBanDau,
       ts.GiaTriThanhLy,

       -- Thông tin mô hình tài sản
       ts.IdMoHinhTaiSan,
       mhts.TenMoHinh,

       -- Thông tin nhóm tài sản
       ts.IdNhomTaiSan,
       nts.TenNhom,

       -- Thông tin dự án
       ts.IdDuDan,
       da.TenDuAn,

       -- Thông tin nguồn vốn
       ts.IdNguonVon,
       nv.TenNguonKinhPhi,

       ts.PhuongPhapKhauHao,
       ts.SoKyKhauHao,
       ts.TaiKhoanTaiSan,
       ts.TaiKhoanKhauHao,
       ts.TaiKhoanChiPhi,
       ts.NgayVaoSo,
       ts.NgaySuDung,
       ts.KyHieu,
       ts.SoKyHieu,
       ts.CongSuat,
       ts.NuocSanXuat,
       ts.NamSanXuat,
       ts.LyDoTang,
       ts.HienTrang,
       ts.SoLuong,
       ts.DonViTinh,
       ts.GhiChu,
       ts.IdDonViBanDau,
       ts.IdDonViHienThoi,
       ts.MoTa,
       ts.IdCongTy,
       ts.NgayTao,
       ts.NgayCapNhat,
       ts.NguoiTao,
       ts.NguoiCapNhat,
       ts.IsActive
FROM TaiSan AS ts
         LEFT JOIN
     MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
         LEFT JOIN
     NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
         LEFT JOIN
     DuAn AS da ON ts.IdDuDan = da.Id
         LEFT JOIN
     NguonVon AS nv ON ts.IdNguonVon = nv.Id
where ts.IsActive = 1
  and ts.IdCongTy = 'CT001'
  and ts.IdLoaiTaiSan = 'LTS001';


-- CCDC Vat tu
SELECT ccdc.Id,
       ccdc.Ten,
       ccdc.IdDonVi,
       pb.TenPhongBan AS TenDonVi,
       ccdc.NgayNhap,
       ccdc.DonVitinh,
       ccdc.SoLuong,
       ccdc.GiaTri,
       ccdc.SoKyHieu,
       ccdc.KyHieu,
       ccdc.CongSuat,
       ccdc.NuocSanXuat,
       ccdc.NamSanXuat,
       ccdc.GhiChu,
       ccdc.IdCongTy,
       ccdc.NgayTao,
       ccdc.NgayCapNhat,
       ccdc.NguoiTao,
       ccdc.NguoiCapNhat,
       ccdc.IsActive
FROM CCDCVatTu AS ccdc
         LEFT JOIN
     PhongBan AS pb ON ccdc.IdDonVi = pb.Id
WHERE ccdc.IsActive = 1
  AND ccdc.IdCongTy = 'CT001';
-- 👈 thay CT001 bằng mã công ty của bạn

-- Phu luc tai san
SELECT plt.Id,
       plt.IdTaiSan,
       ts.TenTaiSan,

       plt.TenPhuLucTS,
       plt.IdDonViHienThoi,
       pb.TenPhongBan AS TenDonViHienThoi,

       plt.MoTaThietBiDinhKemTaiSan,
       plt.MaPhuLucTSTB,
       plt.NgayTaoPhuLuc,
       plt.HienTrang,
       plt.DonViTinh,
       plt.DacDiem,

       plt.IdCongTy,
       plt.NgayTao,
       plt.NgayCapNhat,
       plt.NguoiTao,
       plt.NguoiCapNhat,
       plt.IsActive
FROM PhuLucTaiSan AS plt
         LEFT JOIN
     TaiSan AS ts ON plt.IdTaiSan = ts.Id
         LEFT JOIN
     PhongBan AS pb ON plt.IdDonViHienThoi = pb.Id
WHERE plt.IsActive = 1
  AND plt.IdCongTy = 'CT001'; -- 👈 thay 'CT001' bằng mã công ty phù hợp


SELECT ddts.Id,
       ddts.SoQuyetDinh,
       ddts.TenPhieu,

       ddts.IdDonViGiao,
       pbGiao.TenPhongBan   AS TenDonViGiao,

       ddts.IdDonViNhan,
       pbNhan.TenPhongBan   AS TenDonViNhan,

       ddts.IdDonViDeNghi,
       pbDeNghi.TenPhongBan AS TenDonViDeNghi,

       ddts.IdPhongBanXemPhieu,
       pbXem.TenPhongBan    AS TenPhongBanXemPhieu,

       ddts.IdNguoiDeNghi,
       nvDeNghi.HoTen       AS TenNguoiDeNghi,

       ddts.IdTrinhDuyetCapPhong,
       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,

       ddts.IdTrinhDuyetGiamDoc,
       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,

       ddts.IdNhanSuXemPhieu,
       nvXem.HoTen          AS TenNhanSuXemPhieu,

       ddts.NguoiLapPhieuKyNhay,
       ddts.QuanTrongCanXacNhan,
       ddts.PhoPhongXacNhan,

       ddts.TGGNTuNgay,
       ddts.TGGNDenNgay,
       ddts.DiaDiemGiaoNhan,

       ddts.VeViec,
       ddts.CanCu,
       ddts.Dieu1,
       ddts.Dieu2,
       ddts.Dieu3,
       ddts.NoiNhan,
       ddts.ThemDongTrong,


       ddts.TrichYeu,
       ddts.DuongDanFile,
       ddts.TenFile,
       ddts.NgayKy,

       ddts.TrangThai,
       ddts.IdCongTy,
       ddts.NgayTao,
       ddts.NgayCapNhat,
       ddts.NguoiTao,
       ddts.NguoiCapNhat,
       ddts.CoHieuLuc,
       ddts.Loai,
       ddts.IsActive
FROM DieuDongTaiSan AS ddts

-- Join Phòng ban
         LEFT JOIN PhongBan AS pbGiao ON ddts.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON ddts.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
         LEFT JOIN PhongBan AS pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id

-- Join Nhân viên
         LEFT JOIN NhanVien AS nvDeNghi ON ddts.IdNguoiDeNghi = nvDeNghi.Id
         LEFT JOIN NhanVien AS nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
         LEFT JOIN NhanVien AS nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
         LEFT JOIN NhanVien AS nvXem ON ddts.IdNhanSuXemPhieu = nvXem.Id

WHERE ddts.IsActive = 1
  AND ddts.IdCongTy = 'CT001';
-- 👈 thay bằng mã công ty thực tế

-- chi tiet dieu dong tai san
SELECT ctddts.Id,
       ctddts.IdDieuDongTaiSan,
       ddts.SoQuyetDinh,
       ddts.TenPhieu,

       ctddts.IdTaiSan,
       ts.TenTaiSan,
       ts.DonViTinh,
       ts.HienTrang,

       ctddts.SoLuong,
       ctddts.GhiChu,

       ctddts.NgayTao,
       ctddts.NgayCapNhat,
       ctddts.NguoiTao,
       ctddts.NguoiCapNhat,
       ctddts.IsActive
FROM ChiTietDieuDongTaiSan AS ctddts
         LEFT JOIN
     DieuDongTaiSan AS ddts ON ctddts.IdDieuDongTaiSan = ddts.Id
         LEFT JOIN
     TaiSan AS ts ON ctddts.IdTaiSan = ts.Id
WHERE ctddts.IsActive = 1;

-- Dieu dong ccdc vat tu
SELECT dd.Id,
       dd.SoQuyetDinh,
       dd.TenPhieu,

       dd.IdDonViGiao,
       pbGiao.TenPhongBan   AS TenDonViGiao,

       dd.IdDonViNhan,
       pbNhan.TenPhongBan   AS TenDonViNhan,

       dd.IdDonViDeNghi,
       pbDeNghi.TenPhongBan AS TenDonViDeNghi,

       dd.IdPhongBanXemPhieu,
       pbXem.TenPhongBan    AS TenPhongBanXemPhieu,

       dd.IdNguoiDeNghi,
       nvDeNghi.HoTen       AS TenNguoiDeNghi,

       dd.IdTrinhDuyetCapPhong,
       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,

       dd.IdTrinhDuyetGiamDoc,
       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,

       dd.IdNhanSuXemPhieu,
       nvXem.HoTen          AS TenNhanSuXemPhieu,

       dd.NguoiLapPhieuKyNhay,
       dd.QuanTrongCanXacNhan,
       dd.PhoPhongXacNhan,
       dd.TGGNTuNgay,
       dd.TGGNDenNgay,
       dd.DiaDiemGiaoNhan,
       dd.VeViec,
       dd.CanCu,
       dd.Dieu1,
       dd.Dieu2,
       dd.Dieu3,
       dd.NoiNhan,
       dd.ThemDongTrong,
       dd.TrangThai,
       dd.IdCongTy,
       dd.NgayTao,
       dd.NgayCapNhat,
       dd.NguoiTao,
       dd.NguoiCapNhat,
       dd.CoHieuLuc,
       dd.Loai,
       dd.IsActive
FROM DieuDongCCDCVatTu AS dd

-- Phòng ban
         LEFT JOIN PhongBan AS pbGiao ON dd.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON dd.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDeNghi ON dd.IdDonViDeNghi = pbDeNghi.Id
         LEFT JOIN PhongBan AS pbXem ON dd.IdPhongBanXemPhieu = pbXem.Id

-- Nhân viên
         LEFT JOIN NhanVien AS nvDeNghi ON dd.IdNguoiDeNghi = nvDeNghi.Id
         LEFT JOIN NhanVien AS nvCapPhong ON dd.IdTrinhDuyetCapPhong = nvCapPhong.Id
         LEFT JOIN NhanVien AS nvGiamDoc ON dd.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
         LEFT JOIN NhanVien AS nvXem ON dd.IdNhanSuXemPhieu = nvXem.Id

WHERE dd.IsActive = 1
  AND dd.IdCongTy = 'CT001';
-- 👈 thay 'CT001' bằng mã công ty thực tế nếu cần

-- Chi tiet CCDC Vat Tu
SELECT ct.Id,
       ct.IdDieuDongCCDCVatTu,
       dd.TenPhieu,
       dd.SoQuyetDinh,

       ct.IdCCDCVatTu,
       ccdc.Ten AS TenCCDCVatTu,
       ccdc.DonVitinh,
       ccdc.CongSuat,
       ccdc.NuocSanXuat,
       ccdc.SoKyHieu,
       ccdc.KyHieu,
       ccdc.NamSanXuat,

       ct.SoLuong,
       ct.SoLuongXuat,
       ct.GhiChu,

       ct.NgayTao,
       ct.NgayCapNhat,
       ct.NguoiTao,
       ct.NguoiCapNhat,
       ct.IsActive
FROM ChiTietDieuDongCCDCVatTu AS ct
         LEFT JOIN
     DieuDongCCDCVatTu AS dd ON ct.IdDieuDongCCDCVatTu = dd.Id
         LEFT JOIN
     CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id
WHERE ct.IsActive = 1;
-- dieu dong phu luc tai san

SELECT dd.Id,
       dd.SoQuyetDinh,
       dd.TenPhieu,

       dd.IdDonViGiao,
       pbGiao.TenPhongBan   AS TenDonViGiao,

       dd.IdDonViNhan,
       pbNhan.TenPhongBan   AS TenDonViNhan,

       dd.IdDonViDeNghi,
       pbDeNghi.TenPhongBan AS TenDonViDeNghi,

       dd.IdPhongBanXemPhieu,
       pbXem.TenPhongBan    AS TenPhongBanXemPhieu,

       dd.IdNguoiDeNghi,
       nvDeNghi.HoTen       AS TenNguoiDeNghi,

       dd.IdTrinhDuyetCapPhong,
       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,

       dd.IdTrinhDuyetGiamDoc,
       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,

       dd.IdNhanSuXemPhieu,
       nvXem.HoTen          AS TenNhanSuXemPhieu,

       dd.NguoiLapPhieuKyNhay,
       dd.QuanTrongCanXacNhan,
       dd.PhoPhongXacNhan,
       dd.TGGNTuNgay,
       dd.TGGNDenNgay,
       dd.DiaDiemGiaoNhan,
       dd.VeViec,
       dd.CanCu,
       dd.Dieu1,
       dd.Dieu2,
       dd.Dieu3,
       dd.NoiNhan,
       dd.ThemDongTrong,
       dd.TrangThai,
       dd.IdCongTy,
       dd.NgayTao,
       dd.NgayCapNhat,
       dd.NguoiTao,
       dd.NguoiCapNhat,
       dd.CoHieuLuc,
       dd.Loai,
       dd.IsActive
FROM DieuDongPhuLucTaiSan AS dd

-- Join PhongBan
         LEFT JOIN PhongBan AS pbGiao ON dd.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON dd.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDeNghi ON dd.IdDonViDeNghi = pbDeNghi.Id
         LEFT JOIN PhongBan AS pbXem ON dd.IdPhongBanXemPhieu = pbXem.Id

-- Join NhanVien
         LEFT JOIN NhanVien AS nvDeNghi ON dd.IdNguoiDeNghi = nvDeNghi.Id
         LEFT JOIN NhanVien AS nvCapPhong ON dd.IdTrinhDuyetCapPhong = nvCapPhong.Id
         LEFT JOIN NhanVien AS nvGiamDoc ON dd.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
         LEFT JOIN NhanVien AS nvXem ON dd.IdNhanSuXemPhieu = nvXem.Id

WHERE dd.IsActive = 1
  AND dd.IdCongTy = 'CT001';
-- chi tiet dieu dong phu luc
SELECT ct.Id,
       ct.IdDieuDongPhuLucTaiSan,
       dd.TenPhieu,
       dd.SoQuyetDinh,

       ct.IdPhuLucTaiSan,
       pl.TenPhuLucTS,
       pl.MaPhuLucTSTB,
       pl.DonViTinh,
       pl.HienTrang,
       pl.DacDiem,
       pl.MoTaThietBiDinhKemTaiSan,

       ct.SoLuong,

       ct.NgayTao,
       ct.NgayCapNhat,
       ct.NguoiTao,
       ct.NguoiCapNhat,
       ct.IsActive
FROM ChiTietDieuDongPhucLucTaiSan AS ct
         LEFT JOIN
     DieuDongPhuLucTaiSan AS dd ON ct.IdDieuDongPhuLucTaiSan = dd.Id
         LEFT JOIN
     PhuLucTaiSan AS pl ON ct.IdPhuLucTaiSan = pl.Id
WHERE ct.IsActive = 1;

-- Ban giao tai san
SELECT bgts.Id,
       bgts.BanGiaoTaiSan,
       bgts.QuyetDinhDieuDongSo,
       bgts.LenhDieuDong,

       bgts.IdDonViGiao,
       pbGiao.TenPhongBan    AS TenDonViGiao,

       bgts.IdDonViNhan,
       pbNhan.TenPhongBan    AS TenDonViNhan,

       bgts.IdDonViDaiDien,
       pbDaiDien.TenPhongBan AS TenDonViDaiDien,

       bgts.NgayBanGiao,

       bgts.IdLanhDao,
       nvLanhDao.HoTen       AS TenLanhDao,

       bgts.IdDaiDiendonviBanHanhQD,
       nvBanHanhQD.HoTen     AS TenDaiDienBanHanhQD,

       bgts.DaXacNhan,

       bgts.IdDaiDienBenGiao,
       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
       bgts.DaiDienBenGiaoXacNhan,

       bgts.IdDaiDienBenNhan,
       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
       bgts.DaiDienBenNhanXacNhan,

       bgts.DonViDaiDienXacNhan,
       bgts.TrangThai,
       bgts.Note,

       bgts.NgayTao,
       bgts.NgayCapNhat,
       bgts.NguoiTao,
       bgts.NguoiCapNhat,
       bgts.IsActive
FROM BanGiaoTaiSan AS bgts

-- JOIN Phòng ban
         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDaiDien ON bgts.IdDonViDaiDien = pbDaiDien.Id

-- JOIN Nhân viên
         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
         LEFT JOIN NhanVien AS nvBanHanhQD ON bgts.IdDaiDiendonviBanHanhQD = nvBanHanhQD.Id
         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id

WHERE bgts.IsActive = 1;
-- chi tiet ban giao tai san
SELECT ct.Id,
       ct.IdBanGiaoTaiSan,
       bts.BanGiaoTaiSan,
       bts.QuyetDinhDieuDongSo,

       ct.IdTaiSan,
       ts.TenTaiSan,
       ts.DonViTinh,
       ts.KyHieu,
       ts.SoKyHieu,
       ts.HienTrang,
       ts.MoTa,

       ct.SoLuong,

       ct.NgayTao,
       ct.NgayCapNhat,
       ct.NguoiTao,
       ct.NguoiCapNhat,
       ct.IsActive
FROM ChiTietBanGiaoTaiSan AS ct
         LEFT JOIN
     BanGiaoTaiSan AS bts ON ct.IdBanGiaoTaiSan = bts.Id
         LEFT JOIN
     TaiSan AS ts ON ct.IdTaiSan = ts.Id
WHERE ct.IsActive = 1;
-- Ban giao ccdc vat tu
SELECT bg.Id,
       bg.BanGiaoCCDCVatTu,
       bg.QuyetDinhDieuDongSo,
       bg.LenhDieuDong,

       bg.IdDonViGiao,
       pbGiao.TenPhongBan    AS TenDonViGiao,

       bg.IdDonViNhan,
       pbNhan.TenPhongBan    AS TenDonViNhan,

       bg.NgayBanGiao,

       bg.IdLanhDao,
       nvLanhDao.HoTen       AS TenLanhDao,

       bg.IdDaiDiendonviBanHanhQD,
       nvBanHanhQD.HoTen     AS TenDaiDienBanHanhQD,

       bg.DaXacNhan,

       bg.IdDaiDienBenGiao,
       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
       bg.DaiDienBenGiaoXacNhan,

       bg.IdDaiDienBenNhan,
       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
       bg.DaiDienBenNhanXacNhan,

       bg.IdDonViDaiDien,
       pbDaiDien.TenPhongBan AS TenDonViDaiDien,
       bg.DonViDaiDienXacNhan,

       bg.TrangThai,
       bg.Note,
       bg.NgayTao,
       bg.NgayCapNhat,
       bg.NguoiTao,
       bg.NguoiCapNhat,
       bg.IsActive

FROM BanGiaoCCDCVatTu AS bg
         LEFT JOIN PhongBan AS pbGiao ON bg.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON bg.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDaiDien ON bg.IdDonViDaiDien = pbDaiDien.Id

         LEFT JOIN NhanVien AS nvLanhDao ON bg.IdLanhDao = nvLanhDao.Id
         LEFT JOIN NhanVien AS nvBanHanhQD ON bg.IdDaiDiendonviBanHanhQD = nvBanHanhQD.Id
         LEFT JOIN NhanVien AS nvBenGiao ON bg.IdDaiDienBenGiao = nvBenGiao.Id
         LEFT JOIN NhanVien AS nvBenNhan ON bg.IdDaiDienBenNhan = nvBenNhan.Id

WHERE bg.IsActive = 1;
-- chi tiet ban giao ccdc vat tu 
SELECT ct.Id,
       ct.IdBanGiaoCCDCVatTu,
       bg.BanGiaoCCDCVatTu AS TenPhieuBanGiao,
       ct.IdCCDCVatTu,
       ccdc.Ten            AS TenVatTu,
       ccdc.DonViTinh,
       ccdc.KyHieu,
       ccdc.SoKyHieu,
       ccdc.CongSuat,
       ccdc.NuocSanXuat,
       ccdc.NamSanXuat,
       ct.SoLuong,
       ct.NgayTao,
       ct.NgayCapNhat,
       ct.NguoiTao,
       ct.NguoiCapNhat,
       ct.IsActive

FROM ChiTietBanGiaoCCDCVatTu AS ct
         LEFT JOIN BanGiaoCCDCVatTu AS bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
         LEFT JOIN CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id

WHERE ct.IsActive = 1;

-- ban giao phu luc
SELECT bg.Id,
       bg.BanGiaoPhuLuc,
       bg.QuyetDinhDieuDongSo,
       bg.LenhDieuDong,
       bg.NgayBanGiao,

       bg.IdDonViGiao,
       pbGiao.TenPhongBan    AS TenDonViGiao,

       bg.IdDonViNhan,
       pbNhan.TenPhongBan    AS TenDonViNhan,

       bg.IdDonViDaiDien,
       pbDaiDien.TenPhongBan AS TenDonViDaiDien,

       bg.IdLanhDao,
       nvLanhDao.HoTen       AS TenLanhDao,

       bg.IdDaiDiendonviBanHanhQD,
       nvBanHanh.HoTen       AS TenNguoiBanHanh,

       bg.IdDaiDienBenGiao,
       nvBenGiao.HoTen       AS TenBenGiao,

       bg.IdDaiDienBenNhan,
       nvBenNhan.HoTen       AS TenBenNhan,

       bg.DaiDienBenGiaoXacNhan,
       bg.DaiDienBenNhanXacNhan,
       bg.DonViDaiDienXacNhan,
       bg.DaXacNhan,
       bg.TrangThai,
       bg.Note,

       bg.NgayTao,
       bg.NgayCapNhat,
       bg.NguoiTao,
       bg.NguoiCapNhat,
       bg.IsActive

FROM BanGiaoPhuLuc AS bg
         LEFT JOIN PhongBan AS pbGiao ON bg.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON bg.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan AS pbDaiDien ON bg.IdDonViDaiDien = pbDaiDien.Id

         LEFT JOIN NhanVien AS nvLanhDao ON bg.IdLanhDao = nvLanhDao.Id
         LEFT JOIN NhanVien AS nvBanHanh ON bg.IdDaiDiendonviBanHanhQD = nvBanHanh.Id
         LEFT JOIN NhanVien AS nvBenGiao ON bg.IdDaiDienBenGiao = nvBenGiao.Id
         LEFT JOIN NhanVien AS nvBenNhan ON bg.IdDaiDienBenNhan = nvBenNhan.Id

WHERE bg.IsActive = 1;

-- chi tiet ban giao phu luc
SELECT ct.Id,
       ct.IdBanGiaoPhuLuc,
       ct.IdPhuLuc,
       ct.SoLuong,

       pl.TenPhuLucTS,
       pl.MaPhuLucTSTB,
       pl.MoTaThietBiDinhKemTaiSan,
       pl.HienTrang,
       pl.DonViTinh,
       pl.DacDiem,
       pl.IdTaiSan,
       pl.IdDonViHienThoi,

       ct.NgayTao,
       ct.NgayCapNhat,
       ct.NguoiTao,
       ct.NguoiCapNhat,
       ct.IsActive

FROM ChiTietBanGiaoPhuLuc AS ct
         LEFT JOIN PhuLucTaiSan AS pl ON ct.IdPhuLuc = pl.Id
         LEFT JOIN BanGiaoPhuLuc AS bg ON ct.IdBanGiaoPhuLuc = bg.Id

WHERE ct.IsActive = 1;



ALTER USER 'devuser'@'localhost' IDENTIFIED BY 'ecotel2025';

-- tai san con

SELECT ts.Id,
       ts.TenTaiSan,
       ts.NguyenGia,
       ts.GiaTriKhauHaoBanDau,
       ts.KyKhauHaoBanDau,
       ts.GiaTriThanhLy,

       -- Thông tin mô hình tài sản
       ts.IdMoHinhTaiSan,
       mhts.TenMoHinh,

       -- Thông tin nhóm tài sản
       ts.IdNhomTaiSan,
       nts.TenNhom,

       -- Thông tin dự án
       ts.IdDuDan,
       da.TenDuAn,

       -- Thông tin nguồn vốn
       ts.IdNguonVon,
       nv.TenNguonKinhPhi,

       ts.PhuongPhapKhauHao,
       ts.SoKyKhauHao,
       ts.TaiKhoanTaiSan,
       ts.TaiKhoanKhauHao,
       ts.TaiKhoanChiPhi,
       ts.NgayVaoSo,
       ts.NgaySuDung,
       ts.KyHieu,
       ts.SoKyHieu,
       ts.CongSuat,
       ts.NuocSanXuat,
       ts.NamSanXuat,
       ts.LyDoTang,
       ts.HienTrang,
       ts.SoLuong,
       ts.DonViTinh,
       ts.GhiChu,
       ts.IdDonViBanDau,
       ts.IdDonViHienThoi,
       ts.MoTa,
       ts.IdCongTy,
       ts.NgayTao,
       ts.NgayCapNhat,
       ts.NguoiTao,
       ts.NguoiCapNhat,
       ts.IsActive
FROM TaiSan AS ts
         LEFT JOIN
     MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
         LEFT JOIN
     NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
         LEFT JOIN
     DuAn AS da ON ts.IdDuDan = da.Id
         LEFT JOIN
     NguonVon AS nv ON ts.IdNguonVon = nv.Id
         LEFT JOIN TaiSanCon as tsc ON tsc.IdTaiSan = ts.Id
where ts.IsActive = 1
  and tsc.IdTaiSan = 'TS001';


delete
from TaiSan
where Id != 'TS0016';

-- khau hao tai san
SELECT Id,
       TenTaiSan,
       NguyenGia,
       SoKyKhauHao,
       TIMESTAMPDIFF(MONTH, NgaySuDung, NOW())                                                           AS SoThangSuDung,
       SoKyKhauHao - TIMESTAMPDIFF(MONTH, NgaySuDung, NOW())                                             AS SoKyKhauHaoConLai,
       GiaTriKhauHaoBanDau - ((SoKyKhauHao - TIMESTAMPDIFF(MONTH, NgaySuDung, NOW())) * GiaTriKhauHaoBanDau /
                              KyKhauHaoBanDau)                                                           AS GiaTriKhauHao,
       (SoKyKhauHao - TIMESTAMPDIFF(MONTH, NgaySuDung, NOW())) * GiaTriKhauHaoBanDau /
       KyKhauHaoBanDau                                                                                   AS GiaTriThanhLy
FROM TaiSan;

SELECT ts.Id,
       ts.TenTaiSan,
       ts.NguyenGia,
       ts.SoKyKhauHao,
       TIMESTAMPDIFF(MONTH, ts.NgaySuDung, NOW())                                                                    AS SoThangSuDung,
       ts.SoKyKhauHao - TIMESTAMPDIFF(MONTH, ts.NgaySuDung, NOW())                                                   AS SoKyKhauHaoConLai,
       ts.GiaTriKhauHaoBanDau -
       ((ts.SoKyKhauHao - TIMESTAMPDIFF(MONTH, ts.NgaySuDung, NOW())) * ts.GiaTriKhauHaoBanDau /
        ts.KyKhauHaoBanDau)                                                                                          AS GiaTriKhauHao,
       (ts.SoKyKhauHao - TIMESTAMPDIFF(MONTH, ts.NgaySuDung, NOW())) * ts.GiaTriKhauHaoBanDau /
       ts.KyKhauHaoBanDau                                                                                            AS GiaTriThanhLy,
       ts.GiaTriKhauHaoBanDau,
       ts.KyKhauHaoBanDau,
       ts.GiaTriThanhLy,

       -- Thông tin dự án
       ts.IdDuDan,
       da.TenDuAn,

       ts.PhuongPhapKhauHao,
       ts.TaiKhoanTaiSan,
       ts.TaiKhoanKhauHao,
       ts.TaiKhoanChiPhi,
       ts.NgayVaoSo,
       ts.NgaySuDung,
       ts.IsActive
FROM TaiSan AS ts
         LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
         LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
         LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
         LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
WHERE ts.IdCongTy = 'CT001';


delete
from KyTaiLieu
where id != '';
SELECT ctddts.Id,
       ctddts.IdDieuDongTaiSan,
       ddts.SoQuyetDinh,
       ddts.TenPhieu,

       ctddts.IdTaiSan,
       ts.TenTaiSan,
       ts.DonViTinh,
       ts.HienTrang,

       ctddts.SoLuong,
       ctddts.GhiChu,

       ctddts.NgayTao,
       ctddts.NgayCapNhat,
       ctddts.NguoiTao,
       ctddts.NguoiCapNhat,
       ctddts.IsActive
FROM ChiTietDieuDongTaiSan AS ctddts
         LEFT JOIN
     DieuDongTaiSan AS ddts ON ctddts.IdDieuDongTaiSan = ddts.Id
         LEFT JOIN
     TaiSan AS ts ON ctddts.IdTaiSan = ts.Id
WHERE ctddts.IsActive = 1 sql = """


SELECT tk.id,
       tk.tendangnhap,
       tk.matkhau,
       tk.hoten,
       tk.email,
       tk.sodienthoai,
       tk.hinhanh,
       tk.ngaytao,
       tk.ngaycapnhat,
       tk.nguoitao,
       tk.nguoicapnhat,
       tk.idcongty,
       tk.rule,
       tk.isactive,
       nv.ChuKy,
       nv.HoTen
FROM TaiKhoan AS tk
         LEFT JOIN NhanVien AS nv
                   ON nv.Id = tk.TenDangNhap
WHERE tk.TenDangNhap = 'admin'
  AND tk.MatKhau = 'admin';

select * from TaiKhoan;
select * from NhanVien;

select * from TaiKhoan;


SELECT
    ts.TenTaiSan,
    ts.DonViTinh,
    ts.NuocSanXuat,
    ts.HienTrang,
    ts.GhiChu
FROM
    BanGiaoTaiSan AS bgts
        LEFT JOIN
    ChiTietBanGiaoTaiSan AS ctbg ON bgts.Id = ctbg.IdBanGiaoTaiSan
        LEFT JOIN
    TaiSan AS ts ON ctbg.IdTaiSan = ts.Id
WHERE
    bgts.IdDonViNhan = 'CGCK1'
  AND bgts.NgayBanGiao < '2025-10-20';


SELECT
    ts.Ten,
    ts.DonViTinh,
    ts.NuocSanXuat,
    ts.GhiChu
FROM
    BanGiaoCCDCVatTu AS bgts
        LEFT JOIN
    ChiTietBanGiaoCCDCVatTu AS ctbg ON bgts.Id = ctbg.IdBanGiaoCCDCVatTu
        LEFT JOIN
    CCDCVatTu AS ts ON ctbg.IdCCDCVatTu = ts.Id
WHERE
    bgts.IdDonViNhan = 'CGCK1'
  AND bgts.NgayBanGiao < '2025-10-20';

select * from QuanLyTaiSan.NhanVien;

select * from MoHinhTaiSan;

SELECT
    ddts.Id,
    ddts.SoQuyetDinh,
    ddts.TenPhieu,
    ddts.IdDonViGiao,
    pbGiao.TenPhongBan AS TenDonViGiao,
    ddts.IdDonViNhan,
    pbNhan.TenPhongBan AS TenDonViNhan,
    ddts.IdDonViDeNghi,
    pbDeNghi.TenPhongBan AS TenDonViDeNghi,
    ddts.IdPhongBanXemPhieu,
    pbXem.TenPhongBan AS TenPhongBanXemPhieu,

    ddts.IdNguoiDeNghi,
    nvDeNghi.HoTen AS TenNguoiDeNghi,
    ddts.IdTruongPhongDonViGiao,
    nvTruong.HoTen AS TenTruongPhongDonViGiao,
    ddts.IdPhoPhongDonViGiao,
    nvPho.HoTen AS TenPhoPhongDonViGiao,
    ddts.IdTrinhDuyetCapPhong,
    nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
    ddts.IdTrinhDuyetGiamDoc,
    nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
    ddts.IdNhanSuXemPhieu,
    nvXem.HoTen AS TenNhanSuXemPhieu,

    ddts.NguoiLapPhieuKyNhay,
    ddts.QuanTrongCanXacNhan,
    ddts.PhoPhongXacNhan,
    ddts.TruongPhongDonViGiaoXacNhan,
    ddts.PhoPhongDonViGiaoXacNhan,
    ddts.TrinhDuyetCapPhongXacNhan,
    ddts.TrinhDuyetGiamDocXacNhan,

    ddts.TGGNTuNgay,
    ddts.TGGNDenNgay,
    ddts.DiaDiemGiaoNhan,
    ddts.NoiNhan,
    ddts.TrichYeu,
    ddts.DuongDanFile,
    ddts.TenFile,
    ddts.NgayKy,
    ddts.TrangThai,
    ddts.IdCongTy,
    ddts.NgayTao,
    ddts.NgayCapNhat,
    ddts.NguoiTao,
    ddts.NguoiCapNhat,
    ddts.CoHieuLuc,
    ddts.Loai,
    ddts.IsActive
FROM DieuDongCCDCVatTu ddts
         LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
         LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
         LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
         LEFT JOIN NhanVien nvDeNghi ON ddts.IdNguoiDeNghi = nvDeNghi.Id
         LEFT JOIN NhanVien nvTruong ON ddts.IdTruongPhongDonViGiao = nvTruong.Id
         LEFT JOIN NhanVien nvPho ON ddts.IdPhoPhongDonViGiao = nvPho.Id
         LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
         LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
         LEFT JOIN NhanVien nvXem ON ddts.IdNhanSuXemPhieu = nvXem.Id
WHERE ddts.IdNguoiDeNghi = 'admin'
   OR ddts.IdTruongPhongDonViGiao = 'admin'
   OR ddts.IdPhoPhongDonViGiao = 'admin'
   OR ddts.IdTrinhDuyetCapPhong = 'admin'
   OR ddts.IdTrinhDuyetGiamDoc = 'admin'
   OR ddts.IdNhanSuXemPhieu = 'admin'
   OR ddts.NguoiTao = 'admin';

WITH RECURSIVE periods AS (
    SELECT 1 AS ky
    UNION ALL
    SELECT ky + 1 FROM periods WHERE ky < 240
)
SELECT
    ts.KyHieu AS `so_the`,
    ts.TenTaiSan AS `ten_tai_san`,
    ts.IdNguonVon AS `nguon_von`,
    ts.TaiKhoanTaiSan AS `MA_TK`,
    DATE_ADD(DATE(ts.NgaySuDung), INTERVAL p.ky-1 MONTH) AS `ngay_tinh_khao`,
    p.ky AS `THANG_KH`,
    ts.NguyenGia AS `nguyen_gia`,
    ts.GiaTriKhauHaoBanDau AS `khau_hao_ban_dau`,

    -- Khấu hao phát sinh đầu kỳ
    (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia/ts.SoKyKhauHao) * (p.ky-1)) AS `KHAU_HAO_PSDK`,

    -- Giá trị còn lại ban đầu, không bao giờ < 0
    GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia/ts.SoKyKhauHao) * (p.ky-1)), 0) AS `GTCL_ban_dau`,

    -- Khấu hao phát sinh cuối kỳ
    (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia/ts.SoKyKhauHao) * p.ky) AS `KHAU_HAO_PSCK`,

    -- Giá trị còn lại hiện tại, không bao giờ < 0
    GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia/ts.SoKyKhauHao) * p.ky), 0) AS `GTCL_hien_tai`,

    (ts.NguyenGia/ts.SoKyKhauHao) AS `khau_hao_binh_quan`,
    (ts.NguyenGia/ts.SoKyKhauHao) AS `so_tien`,
    0 AS `chenh_lech`,

    -- Khấu hao kỳ trước
    (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia/ts.SoKyKhauHao) * GREATEST(p.ky-2, 0)) AS `KH_KYTRUOC`,

    0 AS `CL_KYTRUOC`,

    -- Hạn sử dụng còn lại, không bao giờ < 0
    GREATEST(ts.SoKyKhauHao - (ts.KyKhauHaoBanDau + p.ky), 0) AS `HSDCKH`,

    ts.TaiKhoanChiPhi AS `tk_no`,
    ts.TaiKhoanKhauHao AS `tk_co`,
    '00' AS `dtgt`,
    'P01' AS `dtth`,
    '30' AS `kmcp`,
    '' AS `GHI_CHU_KHAO`,
    ts.NguoiCapNhat AS `USER_ID`,
    ts.NgayCapNhat AS `USER_TIME`
FROM TaiSan ts
         JOIN periods p ON p.ky <= ts.SoKyKhauHao
WHERE MONTH(DATE_ADD(DATE(ts.NgaySuDung), INTERVAL p.ky-1 MONTH)) = 8
  AND YEAR(DATE_ADD(DATE(ts.NgaySuDung), INTERVAL p.ky-1 MONTH)) = 2025
ORDER BY ts.KyHieu, p.ky;

select * from QuanLyTaiSan.ChiTietDonViSoHuu;
SELECT bgts.Id,
       bgts.BanGiaoCCDCVatTu,
       bgts.QuyetDinhDieuDongSo,
       bgts.LenhDieuDong,

       bgts.IdDonViGiao,
       pbGiao.TenPhongBan    AS TenDonViGiao,

       bgts.IdDonViNhan,
       pbNhan.TenPhongBan    AS TenDonViNhan,



       bgts.NgayBanGiao,

       bgts.IdLanhDao,
       nvLanhDao.HoTen       AS TenLanhDao,

       bgts.IdDaiDiendonviBanHanhQD,
       nvBanHanhQD.HoTen     AS TenDaiDienBanHanhQD,

       bgts.DaXacNhan,

       bgts.IdDaiDienBenGiao,
       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
       bgts.DaiDienBenGiaoXacNhan,

       bgts.IdDaiDienBenNhan,
       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
       bgts.DaiDienBenNhanXacNhan,

       bgts.TrangThai,
       bgts.Note,

       bgts.NgayTao,
       bgts.NgayCapNhat,
       bgts.NguoiTao,
       bgts.NguoiCapNhat,
       bgts.IsActive,
       bgts.Share,
       bgts.DuongDanFile,
       bgts.TenFile
FROM BanGiaoCCDCVatTu AS bgts

         -- JOIN Phòng ban
         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id


    -- JOIN Nhân viên
         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
         LEFT JOIN NhanVien AS nvBanHanhQD ON bgts.IdDaiDiendonviBanHanhQD = nvBanHanhQD.Id
         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id

WHERE bgts.IdCongTy='CT01';

select * from TaiSan where IdCongTy='ct001';