package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class BaoCaoDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DieuDongTaiSanDTO> getDieuDongTaiSan(String idCongty, int loai) {
        String query = """
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
                
                
                
                       ddts.IdTrinhDuyetCapPhong,
                       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,
                
                       ddts.IdTrinhDuyetGiamDoc,
                       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,
                
                
                       ddts.NguoiLapPhieuKyNhay,
                
                
                
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
                       ddts.Loai
                
                FROM DieuDongTaiSan AS ddts
                
                -- Join Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                         LEFT JOIN PhongBan AS pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                         LEFT JOIN PhongBan AS pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                
                -- Join Nhân viên
                
                         LEFT JOIN NhanVien AS nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                         LEFT JOIN NhanVien AS nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                
                
                WHERE ddts.IdCongTy = ? and ddts.Loai=?;
                """;
        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class), idCongty, loai);
    }

    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSan(String idDonVi, String ngayBanGiao) {
        String sql = """
                            SELECT
                                ts.TenTaiSan,
                                ts.DonViTinh,
                                ts.NuocSanXuat,
                CASE HienTrang
                    WHEN 1 THEN 'Đang sử dụng'
                    WHEN 2 THEN 'Chờ thanh lý'
                    WHEN 3 THEN 'Chưa sử dụng'
                    WHEN 4 THEN 'Ngừng khấu hao'
                    WHEN 5 THEN 'Thanh lý'
                    ELSE 'Không xác định'
                END AS HienTrang,
                                ts.GhiChu
                            FROM
                                TaiSan AS ts
                            WHERE
                                ts.IdDonViHienThoi = ?;
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BaoCaoKiemKeTaiSan.class), idDonVi);
    }

    public List<BaoCaoKiemKeCCDC> getBaoCaoKiemKeCCDC(String idDonVi, String ngayBanGiao) {
        String sql = """
                 SELECT
                    ts.Ten,
                    ts.DonViTinh,
                    ts.NuocSanXuat,
                    ts.GhiChu
                FROM
                
                    CCDCVatTu AS ts
                WHERE
                     ts.IdDonVi = ?;""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BaoCaoKiemKeCCDC.class), idDonVi);

    }

    public List<Map<String, Object>> getTaiSanCoDinh(String idDonVi) {
        String sql = """
                SELECT
                    ts.Id,
                    ts.TenTaiSan,
                    ts.SoLuong,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.IdDonViHienThoi,
                    ts.GhiChu
                FROM
                    TaiSan AS ts
                WHERE
                    ts.IdDonViHienThoi = ?;
                """;

        return jdbcTemplate.queryForList(sql, idDonVi);
    }

    public List<Map<String, Object>> getS22DnIncrease(String idDonVi, String nam) {
        String sql = """
        SELECT
            bg.Id AS soQuyetDinh,
            bg.NgayBanGiao AS ngayThang,
            ts.Id AS idTaiSan,
            ts.TenTaiSan AS tenTaiSan,
            ts.DonViTinh AS donViTinh,
            ct.SoLuong AS soLuong,
            ts.NguyenGia AS donGia,
            (ct.SoLuong * ts.NguyenGia) AS tongTien,
            bg.Note AS ghiChu
        FROM ChiTietBanGiaoTaiSan ct
        JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
        JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
        WHERE bg.IdDonViNhan = ? AND bg.NgayBanGiao LIKE ?
        """;
        return jdbcTemplate.queryForList(sql, idDonVi, nam + "%");
    }

    public List<Map<String, Object>> getS22DnDecrease(String idDonVi, String nam) {
        String sql = """
        SELECT
            bg.Id AS soQuyetDinh,
            bg.NgayBanGiao AS ngayThang,
            ts.Id AS idTaiSan,
            ts.TenTaiSan AS tenTaiSan,
            ts.DonViTinh AS donViTinh,
            ct.SoLuong AS soLuong,
            ts.NguyenGia AS donGia,
            (ct.SoLuong * ts.NguyenGia) AS tongTien,
            bg.Note AS ghiChu
        FROM ChiTietBanGiaoTaiSan ct
        JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
        JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
        WHERE bg.IdDonViGiao = ? AND bg.NgayBanGiao LIKE ?
        """;
        return jdbcTemplate.queryForList(sql, idDonVi, nam + "%");
    }


    public List<Map<String, Object>> getS22DnIncreaseCCDC(String idDonVi, String nam) {
        String sql = """
        SELECT
            bg.Id AS soQuyetDinh,
            bg.NgayBanGiao AS ngayThang,
            ts.Id AS idCCDC,
            ts.Ten AS tenTaiSan,
            ts.DonVitinh AS donViTinh,
            ct.SoLuong AS soLuong,
            ts.GiaTri AS donGia,
            (ct.SoLuong * ts.GiaTri) AS tongTien,
            bg.Note AS ghiChu
        FROM ChiTietBanGiaoCCDCVatTu ct
        JOIN BanGiaoCCDCVatTu bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
        JOIN CCDCVatTu ts ON ct.IdCCDCVatTu = ts.Id
        WHERE bg.IdDonViNhan = ? AND bg.NgayBanGiao LIKE ?
        """;
        return jdbcTemplate.queryForList(sql, idDonVi, nam + "%");
    }

    public List<Map<String, Object>> getS22DnDecreaseCCDC(String idDonVi, String nam) {
        String sql = """
        SELECT
            bg.Id AS soQuyetDinh,
            bg.NgayBanGiao AS ngayThang,
            ts.Id AS idCCDC,
            ts.Ten AS tenTaiSan,
            ts.DonVitinh AS donViTinh,
            ct.SoLuong AS soLuong,
            ts.GiaTri AS donGia,
            (ct.SoLuong * ts.GiaTri) AS tongTien,
            bg.Note AS ghiChu
        FROM ChiTietBanGiaoCCDCVatTu ct
        JOIN BanGiaoCCDCVatTu bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
        JOIN CCDCVatTu ts ON ct.IdCCDCVatTu = ts.Id
        WHERE bg.IdDonViGiao = ? AND bg.NgayBanGiao LIKE ?
        """;
        return jdbcTemplate.queryForList(sql, idDonVi, nam + "%");
    }

    /**
     * Báo cáo kiểm kê tài sản theo phòng ban
     * Dựa trên BanGiaoTaiSan với TrangThai = 3 (hoàn thành)
     * Lọc theo IdDonViGiao hoặc IdDonViNhan = idPhongBan
     */
    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSanTheoPhongBan(String idPhongBan) {
        String sql = """
                SELECT
                    ts.Id AS idTaiSan,
                    ts.TenTaiSan,
                    COALESCE(ts.SoKyHieu, ts.KyHieu) AS maSo,
                    pb.TenPhongBan AS noiSuDung,
                    ts.IdDonViHienThoi,
                    ts.SoLuong AS soLuongSoSach,
                    ts.NguyenGia AS nguyenGiaSoSach,
                    (ts.NguyenGia - COALESCE(ts.GiaTriKhauHaoBanDau, 0)) AS giaTriConLaiSoSach,
                    CAST(ct.SoLuong AS SIGNED) AS soLuongKiemKe,
                    ts.NguyenGia AS nguyenGiaKiemKe,
                    CASE
                        WHEN ts.SoLuong > 0 THEN ((ts.NguyenGia - COALESCE(ts.GiaTriKhauHaoBanDau, 0)) / ts.SoLuong * ct.SoLuong)
                        ELSE 0
                    END AS giaTriConLaiKiemKe,
                    (CAST(ct.SoLuong AS SIGNED) - ts.SoLuong) AS chenhLechSoLuong,
                    0 AS chenhLechNguyenGia,
                    CASE
                        WHEN ts.SoLuong > 0 THEN (((ts.NguyenGia - COALESCE(ts.GiaTriKhauHaoBanDau, 0)) / ts.SoLuong * ct.SoLuong) - (ts.NguyenGia - COALESCE(ts.GiaTriKhauHaoBanDau, 0)))
                        ELSE 0
                    END AS chenhLechGiaTriConLai,
                    ct.MoTa AS ghiChu,
                    ts.DonViTinh,
                    CASE ts.HienTrang
                        WHEN 1 THEN 'Đang sử dụng'
                        WHEN 2 THEN 'Chờ thanh lý'
                        WHEN 3 THEN 'Chưa sử dụng'
                        WHEN 4 THEN 'Ngừng khấu hao'
                        WHEN 5 THEN 'Thanh lý'
                        ELSE 'Không xác định'
                    END AS hienTrang
                FROM BanGiaoTaiSan bg
                JOIN ChiTietBanGiaoTaiSan ct ON bg.Id = ct.IdBanGiaoTaiSan
                JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
                LEFT JOIN PhongBan pb ON ts.IdDonViHienThoi = pb.Id
                WHERE bg.TrangThai = 3
                  AND ct.IsActive = 1
                  AND (bg.IdDonViGiao = ? OR bg.IdDonViNhan = ?)
                ORDER BY ts.TenTaiSan
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BaoCaoKiemKeTaiSan.class), idPhongBan, idPhongBan);
    }

    /**
     * Biên bản kiểm kê TaiSan - căn cứ IdDonViHienThoi
     */
    public List<BienBanKiemKe> getBienBanKiemKeTaiSan(String idPhongBan) {
        String sql = """
                SELECT
                    ts.Id AS id,
                    ts.TenTaiSan AS tenTaiSan,
                    ts.DonViTinh,
                    ts.NuocSanXuat,
                    'Kiểm đếm' AS phuongThucKiemKe,
                    ts.SoLuong AS soLuongKiemKeThucTe,
                    CASE ts.HienTrang
                        WHEN 1 THEN 'Đang sử dụng'
                        WHEN 2 THEN 'Chờ thanh lý'
                        WHEN 3 THEN 'Chưa sử dụng'
                        WHEN 4 THEN 'Ngừng khấu hao'
                        WHEN 5 THEN 'Thanh lý'
                        ELSE 'Không xác định'
                    END AS hienTrang,
                    ts.GhiChu,
                    'TaiSan' AS loai
                FROM TaiSan ts
                WHERE ts.IdDonViHienThoi = ?
                  AND ts.IsActive = 1
                ORDER BY ts.TenTaiSan
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BienBanKiemKe.class), idPhongBan);
    }

    /**
     * Biên bản kiểm kê CCDCVatTu - căn cứ IdDonViNhan trong BanGiaoCCDCVatTu
     */
    public List<BienBanKiemKe> getBienBanKiemKeCCDCVatTu(String idPhongBan) {
        String sql = """
                SELECT
                    ccdc.Id AS id,
                    ccdc.Ten AS tenTaiSan,
                    ccdc.DonViTinh,
                    ccdc.NuocSanXuat,
                    'Kiểm đếm' AS phuongThucKiemKe,
                    CAST(ct.SoLuong AS SIGNED) AS soLuongKiemKeThucTe,
                    CASE ccdc.HienTrang
                        WHEN 1 THEN 'Đang sử dụng'
                        WHEN 2 THEN 'Chờ thanh lý'
                        WHEN 3 THEN 'Chưa sử dụng'
                        WHEN 4 THEN 'Ngừng khấu hao'
                        WHEN 5 THEN 'Thanh lý'
                        ELSE 'Không xác định'
                    END AS hienTrang,
                    ccdc.GhiChu,
                    'CCDCVatTu' AS loai
                FROM BanGiaoCCDCVatTu bg
                JOIN ChiTietBanGiaoCCDCVatTu ct ON bg.Id = ct.IdBanGiaoCCDCVatTu
                JOIN CCDCVatTu ccdc ON ct.IdCCDCVatTu = ccdc.Id
                WHERE bg.IdDonViNhan = ?
                  AND ct.IsActive = 1
                ORDER BY ccdc.Ten
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BienBanKiemKe.class), idPhongBan);
    }

    /**
     * Báo cáo tăng giảm TaiSan trong kỳ
     * Logic: Lấy tất cả tài sản có giao dịch tăng/giảm với phòng ban trong tháng/năm
     * - Tăng: phòng ban là đơn vị nhận (IdDonViNhan)
     * - Giảm: phòng ban là đơn vị giao (IdDonViGiao)
     * @param idPhongBan ID phòng ban
     * @param thangNam Tháng/Năm (format: MM/yyyy hoặc M/yyyy, ví dụ: 12/2025 hoặc 1/2025)
     */
    public List<BaoCaoTangGiamTrongKy> getBaoCaoTangGiamTaiSan(String idPhongBan, String thangNam) {
        // Parse thangNam (format: M/yyyy hoặc MM/yyyy)
        String[] parts = thangNam.split("/");
        int thang = Integer.parseInt(parts[0]);
        int nam = Integer.parseInt(parts[1]);

        String sql = """
                SELECT
                    ts.Id AS id,
                    ts.TenTaiSan AS tenTaiSan,
                    ts.DonViTinh,
                    ts.NuocSanXuat,
                    ts.SoLuong AS soDuDauKy,
                    COALESCE(tang.soLuongTang, 0) AS soLuongTangTrongKy,
                    tang.lyDoTang AS lyDoTangTrongKy,
                    COALESCE(giam.soLuongGiam, 0) AS soLuongGiamTrongKy,
                    giam.lyDoGiam AS lyDoGiamTrongKy,
                    (ts.SoLuong + COALESCE(tang.soLuongTang, 0) - COALESCE(giam.soLuongGiam, 0)) AS soDuCuoiKy,
                    CASE ts.HienTrang
                        WHEN 1 THEN 'Đang sử dụng'
                        WHEN 2 THEN 'Chờ thanh lý'
                        WHEN 3 THEN 'Chưa sử dụng'
                        WHEN 4 THEN 'Ngừng khấu hao'
                        WHEN 5 THEN 'Thanh lý'
                        ELSE 'Không xác định'
                    END AS tinhTrangKyThuat,
                    ts.GhiChu,
                    'TaiSan' AS loai
                FROM (
                    -- Lấy tất cả tài sản có giao dịch tăng hoặc giảm với phòng ban trong tháng/năm
                    SELECT DISTINCT ct.IdTaiSan
                    FROM ChiTietBanGiaoTaiSan ct
                    JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
                    WHERE bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                      AND (bg.IdDonViNhan = ? OR bg.IdDonViGiao = ?)
                ) ds
                JOIN TaiSan ts ON ds.IdTaiSan = ts.Id
                LEFT JOIN (
                    -- Tính tổng số lượng tăng (phòng ban là đơn vị nhận) trong tháng/năm
                    SELECT ct.IdTaiSan, SUM(ct.SoLuong) AS soLuongTang, GROUP_CONCAT(DISTINCT bg.Note SEPARATOR ', ') AS lyDoTang
                    FROM ChiTietBanGiaoTaiSan ct
                    JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
                    WHERE bg.IdDonViNhan = ?
                      AND bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                    GROUP BY ct.IdTaiSan
                ) tang ON ts.Id = tang.IdTaiSan
                LEFT JOIN (
                    -- Tính tổng số lượng giảm (phòng ban là đơn vị giao) trong tháng/năm
                    SELECT ct.IdTaiSan, SUM(ct.SoLuong) AS soLuongGiam, GROUP_CONCAT(DISTINCT bg.Note SEPARATOR ', ') AS lyDoGiam
                    FROM ChiTietBanGiaoTaiSan ct
                    JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
                    WHERE bg.IdDonViGiao = ?
                      AND bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                    GROUP BY ct.IdTaiSan
                ) giam ON ts.Id = giam.IdTaiSan
                WHERE ts.IsActive = 1
                ORDER BY ts.TenTaiSan
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BaoCaoTangGiamTrongKy.class),
                thang, nam, idPhongBan, idPhongBan, idPhongBan, thang, nam, idPhongBan, thang, nam);
    }

    /**
     * Báo cáo tăng giảm CCDCVatTu trong kỳ
     * Logic: Lấy tất cả CCDC có giao dịch tăng/giảm với phòng ban trong tháng/năm
     * - Tăng: phòng ban là đơn vị nhận (IdDonViNhan)
     * - Giảm: phòng ban là đơn vị giao (IdDonViGiao)
     * @param idPhongBan ID phòng ban
     * @param thangNam Tháng/Năm (format: MM/yyyy hoặc M/yyyy, ví dụ: 12/2025 hoặc 1/2025)
     */
    public List<BaoCaoTangGiamTrongKy> getBaoCaoTangGiamCCDCVatTu(String idPhongBan, String thangNam) {
        // Parse thangNam (format: M/yyyy hoặc MM/yyyy)
        String[] parts = thangNam.split("/");
        int thang = Integer.parseInt(parts[0]);
        int nam = Integer.parseInt(parts[1]);

        String sql = """
                SELECT
                    ccdc.Id AS id,
                    ccdc.Ten AS tenTaiSan,
                    ccdc.DonViTinh,
                    ccdc.NuocSanXuat,
                    ccdc.SoLuong AS soDuDauKy,
                    COALESCE(tang.soLuongTang, 0) AS soLuongTangTrongKy,
                    tang.lyDoTang AS lyDoTangTrongKy,
                    COALESCE(giam.soLuongGiam, 0) AS soLuongGiamTrongKy,
                    giam.lyDoGiam AS lyDoGiamTrongKy,
                    (ccdc.SoLuong + COALESCE(tang.soLuongTang, 0) - COALESCE(giam.soLuongGiam, 0)) AS soDuCuoiKy,
                    CASE ccdc.HienTrang
                        WHEN 1 THEN 'Đang sử dụng'
                        WHEN 2 THEN 'Chờ thanh lý'
                        WHEN 3 THEN 'Chưa sử dụng'
                        WHEN 4 THEN 'Ngừng khấu hao'
                        WHEN 5 THEN 'Thanh lý'
                        ELSE 'Không xác định'
                    END AS tinhTrangKyThuat,
                    ccdc.GhiChu,
                    'CCDCVatTu' AS loai
                FROM (
                    -- Lấy tất cả CCDC có giao dịch tăng hoặc giảm với phòng ban trong tháng/năm
                    SELECT DISTINCT ct.IdCCDCVatTu
                    FROM ChiTietBanGiaoCCDCVatTu ct
                    JOIN BanGiaoCCDCVatTu bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
                    WHERE bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                      AND (bg.IdDonViNhan = ? OR bg.IdDonViGiao = ?)
                ) ds
                JOIN CCDCVatTu ccdc ON ds.IdCCDCVatTu = ccdc.Id
                LEFT JOIN (
                    -- Tính tổng số lượng tăng (phòng ban là đơn vị nhận) trong tháng/năm
                    SELECT ct.IdCCDCVatTu, SUM(ct.SoLuong) AS soLuongTang, GROUP_CONCAT(DISTINCT bg.Note SEPARATOR ', ') AS lyDoTang
                    FROM ChiTietBanGiaoCCDCVatTu ct
                    JOIN BanGiaoCCDCVatTu bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
                    WHERE bg.IdDonViNhan = ?
                      AND bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                    GROUP BY ct.IdCCDCVatTu
                ) tang ON ccdc.Id = tang.IdCCDCVatTu
                LEFT JOIN (
                    -- Tính tổng số lượng giảm (phòng ban là đơn vị giao) trong tháng/năm
                    SELECT ct.IdCCDCVatTu, SUM(ct.SoLuong) AS soLuongGiam, GROUP_CONCAT(DISTINCT bg.Note SEPARATOR ', ') AS lyDoGiam
                    FROM ChiTietBanGiaoCCDCVatTu ct
                    JOIN BanGiaoCCDCVatTu bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
                    WHERE bg.IdDonViGiao = ?
                      AND bg.TrangThai = 3
                      AND MONTH(bg.NgayBanGiao) = ?
                      AND YEAR(bg.NgayBanGiao) = ?
                    GROUP BY ct.IdCCDCVatTu
                ) giam ON ccdc.Id = giam.IdCCDCVatTu
                WHERE ccdc.IsActive = 1
                ORDER BY ccdc.Ten
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BaoCaoTangGiamTrongKy.class),
                thang, nam, idPhongBan, idPhongBan, idPhongBan, thang, nam, idPhongBan, thang, nam);
    }

}
