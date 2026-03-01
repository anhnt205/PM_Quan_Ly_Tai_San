package com.ecotel.quanlytaisan.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class DashboardDao {
    @Autowired
    private JdbcTemplate jdbc;

    // ===== 1. Tổng quan =====
    public int getTongTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM TaiSan", Integer.class);
    }

    public Double getTongNguyenGia() {
        return jdbc.queryForObject("SELECT COALESCE(SUM(NguyenGia),0) FROM TaiSan", Double.class);
    }

    public int getTongCCDC() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM CCDCVatTu", Integer.class);
    }

    public int getTongPhongBan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM PhongBan", Integer.class);
    }

    public int getTongNhanVien() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM NhanVien", Integer.class);
    }

    public int getTongDuAn() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM DuAn WHERE HieuLuc=1", Integer.class);
    }

    public int getNguonVonHieuLuc() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM NguonVon WHERE HieuLuc=1", Integer.class);
    }

    // Thống kê tổng quan mở rộng
    public int getTongCongTy() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM CongTy", Integer.class);
    }

    public int getTongLoaiTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM LoaiTaiSan", Integer.class);
    }

    public int getTongNhomTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM NhomTaiSan", Integer.class);
    }

    public Double getTongGiaTriCCDC() {
        return jdbc.queryForObject("SELECT COALESCE(SUM(SoLuong * GiaTri),0) FROM CCDCVatTu", Double.class);
    }

    // ===== 2. Thống kê nhóm, loại =====
    public List<Map<String, Object>> getTaiSanTheoLoai() {
        return jdbc.queryForList("""
                SELECT lts.TenLoaiTaiSan AS ten,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN LoaiTaiSan lts ON ts.IdLoaiTaiSan=lts.Id
                GROUP BY lts.TenLoaiTaiSan
                ORDER BY soLuong DESC
                """);
    }

    public List<Map<String, Object>> getTaiSanTheoNhom() {
        return jdbc.queryForList("""
                SELECT nts.TenNhom AS ten,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN NhomTaiSan nts ON ts.IdNhomTaiSan=nts.Id
                GROUP BY nts.TenNhom
                ORDER BY soLuong DESC
                """);
    }

    public List<Map<String, Object>> getCCDCTheoPhongBan() {
        return jdbc.queryForList("""
                SELECT pb.TenPhongBan AS phongBan,
                       SUM(c.SoLuong) AS tongSoLuong,
                       COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri
                FROM CCDCVatTu c
                JOIN PhongBan pb ON c.IdDonVi=pb.Id
                GROUP BY pb.TenPhongBan
                ORDER BY tongSoLuong DESC
                """);
    }

    public List<Map<String, Object>> getTaiSanTheoPhongBan() {
        return jdbc.queryForList("""
                SELECT pb.TenPhongBan AS phongBan,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN PhongBan pb ON ts.IdDonViHienThoi=pb.Id
                GROUP BY pb.TenPhongBan
                ORDER BY soLuong DESC
                """);
    }

    // Thống kê CCDC theo loại
    public List<Map<String, Object>> getCCDCTheoLoai() {
        return jdbc.queryForList("""
                SELECT lc.TenLoai AS ten,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(c.SoLuong),0) AS tongSoLuong,
                       COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri
                FROM CCDCVatTu c
                JOIN LoaiCCDCCon lc ON c.IdLoaiCCDCCon=lc.Id
                GROUP BY lc.TenLoai
                ORDER BY soLuong DESC
                """);
    }

    // Thống kê tài sản theo trạng thái
    public List<Map<String, Object>> getTaiSanTheoTrangThai() {
        return jdbc.queryForList("""
                SELECT
                    CASE
                        WHEN HienTrang = 1 THEN 'Đang sử dụng'
                        WHEN HienTrang = 2 THEN 'Tạm dừng'
                        WHEN HienTrang = 3 THEN 'Hỏng'
                        WHEN HienTrang = 4 THEN 'Mất'
                        ELSE 'Không xác định'
                    END AS trangThai,
                    COUNT(*) AS soLuong,
                    COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                GROUP BY
                    CASE
                        WHEN HienTrang = 1 THEN 'Đang sử dụng'
                        WHEN HienTrang = 2 THEN 'Tạm dừng'
                        WHEN HienTrang = 3 THEN 'Hỏng'
                        WHEN HienTrang = 4 THEN 'Mất'
                        ELSE 'Không xác định'
                    END
                ORDER BY soLuong DESC
                """);
    }

    // Thống kê tài sản theo loại con (chi tiết) với phần trăm
    public List<Map<String, Object>> getTaiSanTheoLoaiConPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            ltc.TenLoai AS ten,
                            ltc.IdLoaiTs AS idLoaiTaiSan,
                            ltc.TenLoai AS tenLoai,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN LoaiTaiSanCon ltc ON ts.IdLoaiTaiSanCon = ltc.Id
                        GROUP BY ltc.TenLoai, ltc.IdLoaiTs
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê CCDC theo loại con (chi tiết) với phần trăm
    public List<Map<String, Object>> getCCDCTheoLoaiConPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            lc.TenLoai AS ten,
                            lc.IdLoaiCCDC AS idLoaiCCDC,
                            lc.TenLoai AS tenLoai,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(c.SoLuong),0) AS tongSoLuong,
                            COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CCDCVatTu), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong),1) FROM CCDCVatTu), 2) AS phanTramTongSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong * c.GiaTri),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong * GiaTri),1) FROM CCDCVatTu), 2) AS phanTramGiaTri
                        FROM CCDCVatTu c
                        JOIN LoaiCCDCCon lc ON c.IdLoaiCCDCCon = lc.Id
                        GROUP BY lc.TenLoai, lc.IdLoaiCCDC
                        ORDER BY soLuong DESC
                        """);
    }
    public List<Map<String, Object>> getThongKeTaiSanTheoLoaiCon(String idCongTy, String idNhomTaiSan) {
            StringBuilder sql = new StringBuilder("""
            SELECT 
                ltsc.Id AS idLoai,
                ltsc.TenLoai AS tenLoai,
                COUNT(ts.Id) AS soLuong
            FROM TaiSan ts
            LEFT JOIN LoaiTaiSanCon ltsc ON ts.IdLoaiTaiSanCon = ltsc.Id
            WHERE ts.IdCongTy = ?
        """);

        List<Object> params = new ArrayList<>();
        params.add(idCongTy);

        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            sql.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }

        sql.append(" GROUP BY ltsc.Id, ltsc.TenLoai");

        return jdbc.queryForList(sql.toString(), params.toArray());
    }
    // Thống kê tài sản theo loại chính với phần trăm
    public List<Map<String, Object>> getTaiSanTheoLoaiChinhPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            lts.TenLoaiTaiSan AS ten,
                            lts.Id AS idLoaiTaiSan,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN LoaiTaiSan lts ON ts.IdLoaiTaiSan = lts.Id
                        GROUP BY lts.TenLoaiTaiSan, lts.Id
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo nhóm với phần trăm
    public List<Map<String, Object>> getTaiSanTheoNhomPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            nts.TenNhom AS ten,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                        GROUP BY nts.TenNhom
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo trạng thái với phần trăm
    public List<Map<String, Object>> getTaiSanTheoTrangThaiPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            CASE
                                WHEN HienTrang = 1 THEN 'Đang sử dụng'
                                WHEN HienTrang = 2 THEN 'Tạm dừng'
                                WHEN HienTrang = 3 THEN 'Hỏng'
                                WHEN HienTrang = 4 THEN 'Mất'
                                ELSE 'Không xác định'
                            END AS trangThai,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan
                        GROUP BY
                            CASE
                                WHEN HienTrang = 1 THEN 'Đang sử dụng'
                                WHEN HienTrang = 2 THEN 'Tạm dừng'
                                WHEN HienTrang = 3 THEN 'Hỏng'
                                WHEN HienTrang = 4 THEN 'Mất'
                                ELSE 'Không xác định'
                            END
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo phòng ban với phần trăm
    public List<Map<String, Object>> getTaiSanTheoPhongBanPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            pb.TenPhongBan AS phongBan,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN PhongBan pb ON ts.IdDonViHienThoi = pb.Id
                        GROUP BY pb.TenPhongBan
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê CCDC theo phòng ban với phần trăm
    public List<Map<String, Object>> getCCDCTheoPhongBanPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            pb.TenPhongBan AS phongBan,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(c.SoLuong),0) AS tongSoLuong,
                            COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CCDCVatTu), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong),1) FROM CCDCVatTu), 2) AS phanTramTongSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong * c.GiaTri),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong * GiaTri),1) FROM CCDCVatTu), 2) AS phanTramGiaTri
                        FROM CCDCVatTu c
                        JOIN PhongBan pb ON c.IdDonVi = pb.Id
                        GROUP BY pb.TenPhongBan
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo nguồn vốn với phần trăm
    public List<Map<String, Object>> getTaiSanTheoNguonVonPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            nv.TenNguonKinhPhi AS nguonVon,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN NguonVon nv ON ts.IdNguonVon = nv.Id
                        GROUP BY nv.TenNguonKinhPhi
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo dự án với phần trăm
    public List<Map<String, Object>> getTaiSanTheoDuAnPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            da.TenDuAn AS duAn,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN DuAn da ON ts.IdDuDan = da.Id
                        GROUP BY da.TenDuAn
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo công ty với phần trăm
    public List<Map<String, Object>> getTaiSanTheoCongTyPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            c.TenCongTy AS congTy,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN CongTy c ON ts.IdCongTy = c.Id
                        GROUP BY c.TenCongTy
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo loại con với thông tin đầy đủ về mối liên kết
    public List<Map<String, Object>> getTaiSanTheoLoaiConChiTietPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            ltc.Id AS idLoaiTaiSanCon,
                            ltc.TenLoai AS tenLoaiTaiSanCon,
                            ltc.IdLoaiTs AS idLoaiTaiSan,
                            lts.TenLoaiTaiSan AS tenLoaiTaiSan,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN LoaiTaiSanCon ltc ON ts.IdLoaiTaiSanCon = ltc.Id
                        JOIN LoaiTaiSan lts ON ltc.IdLoaiTs = lts.Id
                        GROUP BY ltc.Id, ltc.TenLoai, ltc.IdLoaiTs, lts.TenLoaiTaiSan
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê tài sản theo loại chính với thông tin đầy đủ
    public List<Map<String, Object>> getTaiSanTheoLoaiChinhChiTietPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            lts.Id AS idLoaiTaiSan,
                            lts.TenLoaiTaiSan AS tenLoaiTaiSan,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM TaiSan), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(ts.NguyenGia),0) * 100.0 / (SELECT COALESCE(SUM(NguyenGia),1) FROM TaiSan), 2) AS phanTramGiaTri
                        FROM TaiSan ts
                        JOIN LoaiTaiSan lts ON ts.IdLoaiTaiSan = lts.Id
                        GROUP BY lts.Id, lts.TenLoaiTaiSan
                        ORDER BY soLuong DESC
                        """);
    }

    // Thống kê CCDC theo loại con với thông tin đầy đủ về mối liên kết
    public List<Map<String, Object>> getCCDCTheoLoaiConChiTietPhanTram() {
        return jdbc.queryForList(
                """
                       SELECT
    lc.TenLoai AS ten,
    lc.IdLoaiCCDC AS idLoaiCCDC,
    lc.TenLoai AS tenLoai,
    COUNT(*) AS soLuong,
    COALESCE(SUM(c.SoLuong),0) AS tongSoLuong,
    COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CCDCVatTu), 2) AS phanTramSoLuong,
    ROUND(COALESCE(SUM(c.SoLuong),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong),1) FROM CCDCVatTu), 2) AS phanTramTongSoLuong,
    ROUND(COALESCE(SUM(c.SoLuong * c.GiaTri),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong * GiaTri),1) FROM CCDCVatTu), 2) AS phanTramGiaTri
FROM CCDCVatTu c
         JOIN LoaiCCDCCon lc ON c.IdLoaiCCDCCon = lc.Id
GROUP BY lc.TenLoai, lc.IdLoaiCCDC
ORDER BY soLuong DESC
                        """);
    }

    // Thống kê CCDC theo loại chính với thông tin đầy đủ
    public List<Map<String, Object>> getCCDCTheoLoaiChinhChiTietPhanTram() {
        return jdbc.queryForList(
                """
                        SELECT
                            lc.IdLoaiCCDC AS idLoaiCCDC,
                            'Không có bảng LoaiCCDC' AS tenLoaiCCDC,
                            COUNT(*) AS soLuong,
                            COALESCE(SUM(c.SoLuong),0) AS tongSoLuong,
                            COALESCE(SUM(c.SoLuong * c.GiaTri),0) AS tongGiaTri,
                            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CCDCVatTu), 2) AS phanTramSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong),1) FROM CCDCVatTu), 2) AS phanTramTongSoLuong,
                            ROUND(COALESCE(SUM(c.SoLuong * c.GiaTri),0) * 100.0 / (SELECT COALESCE(SUM(SoLuong * GiaTri),1) FROM CCDCVatTu), 2) AS phanTramGiaTri
                        FROM CCDCVatTu c
                        JOIN LoaiCCDCCon lc ON c.IdLoaiCCDCCon = lc.Id
                        GROUP BY lc.IdLoaiCCDC
                        ORDER BY soLuong DESC
                        """);
    }

    // ===== 3. Giá trị =====
    public List<Map<String, Object>> getGiaTriTheoNguonVon() {
        return jdbc.queryForList("""
                SELECT nv.TenNguonKinhPhi AS nguonVon,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN NguonVon nv ON ts.IdNguonVon=nv.Id
                GROUP BY nv.TenNguonKinhPhi
                ORDER BY tongGiaTri DESC
                """);
    }

    public List<Map<String, Object>> getGiaTriTheoDuAn() {
        return jdbc.queryForList("""
                SELECT da.TenDuAn AS duAn,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN DuAn da ON ts.IdDuDan=da.Id
                GROUP BY da.TenDuAn
                ORDER BY tongGiaTri DESC
                """);
    }

    // Thống kê giá trị theo công ty
    public List<Map<String, Object>> getGiaTriTheoCongTy() {
        return jdbc.queryForList("""
                SELECT c.TenCongTy AS congTy,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(ts.NguyenGia),0) AS tongGiaTri
                FROM TaiSan ts
                JOIN CongTy c ON ts.IdCongTy=c.Id
                GROUP BY c.TenCongTy
                ORDER BY tongGiaTri DESC
                """);
    }

    // Thống kê giá trị theo năm sản xuất
    public List<Map<String, Object>> getGiaTriTheoNamSanXuat() {
        return jdbc.queryForList("""
                SELECT NamSanXuat AS nam,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                WHERE NamSanXuat IS NOT NULL
                GROUP BY NamSanXuat
                ORDER BY NamSanXuat DESC
                """);
    }

    // ===== 4. Điều động/Bàn giao =====
    public int getTongPhieuDieuDongTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM DieuDongTaiSan", Integer.class);
    }

    public int getTongChiTietDieuDongTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM ChiTietDieuDongTaiSan", Integer.class);
    }

    public int getTongPhieuDieuDongCCDC() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM DieuDongCCDCVatTu", Integer.class);
    }

    public int getTongSoLuongCCDCDieuDong() {
        return jdbc.queryForObject("SELECT COALESCE(SUM(SoLuong),0) FROM ChiTietDieuDongCCDCVatTu", Integer.class);
    }

    // Thống kê bàn giao tài sản
    public int getTongPhieuBanGiaoTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM BanGiaoTaiSan", Integer.class);
    }

    public int getTongChiTietBanGiaoTaiSan() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM ChiTietBanGiaoTaiSan", Integer.class);
    }

    public int getTongPhieuBanGiaoCCDC() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM BanGiaoCCDCVatTu", Integer.class);
    }

    public int getTongSoLuongCCDCBanGiao() {
        return jdbc.queryForObject("SELECT COALESCE(SUM(SoLuong),0) FROM ChiTietBanGiaoCCDCVatTu", Integer.class);
    }

    // Thống kê điều động theo tháng
    public List<Map<String, Object>> getDieuDongTaiSanTheoThang() {
        return jdbc.queryForList("""
                SELECT
                    YEAR(NgayDieuDong) AS nam,
                    MONTH(NgayDieuDong) AS thang,
                    COUNT(*) AS soPhieu
                FROM DieuDongTaiSan
                WHERE NgayDieuDong IS NOT NULL
                GROUP BY YEAR(NgayDieuDong), MONTH(NgayDieuDong)
                ORDER BY nam DESC, thang DESC
                """);
    }

    // Thống kê bàn giao theo tháng
    public List<Map<String, Object>> getBanGiaoTaiSanTheoThang() {
        return jdbc.queryForList("""
                SELECT
                    YEAR(NgayBanGiao) AS nam,
                    MONTH(NgayBanGiao) AS thang,
                    COUNT(*) AS soPhieu
                FROM BanGiaoTaiSan
                WHERE NgayBanGiao IS NOT NULL
                GROUP BY YEAR(NgayBanGiao), MONTH(NgayBanGiao)
                ORDER BY nam DESC, thang DESC
                """);
    }

    // ===== 5. Nâng cao/biểu đồ =====
    public List<Map<String, Object>> getTangTruongTaiSanTheoNamSX() {
        return jdbc.queryForList("""
                SELECT NamSanXuat AS nam,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                WHERE NamSanXuat IS NOT NULL
                GROUP BY NamSanXuat
                ORDER BY NamSanXuat
                """);
    }

    public List<Map<String, Object>> getNhapKhoCCDCTheoNam() {
        return jdbc.queryForList("""
                SELECT YEAR(NgayNhap) AS nam,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(SoLuong),0) AS tongSoLuong,
                       COALESCE(SUM(SoLuong * GiaTri),0) AS tongGiaTri
                FROM CCDCVatTu
                WHERE NgayNhap IS NOT NULL
                GROUP BY YEAR(NgayNhap)
                ORDER BY nam DESC
                """);
    }

    // Thống kê tài sản theo năm tạo
    public List<Map<String, Object>> getTaiSanTheoNamTao() {
        return jdbc.queryForList("""
                SELECT YEAR(NgayTao) AS nam,
                       COUNT(*) AS soLuong,
                       COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                WHERE NgayTao IS NOT NULL
                GROUP BY YEAR(NgayTao)
                ORDER BY nam DESC
                """);
    }

    // Thống kê tài sản theo quý
    public List<Map<String, Object>> getTaiSanTheoQuy() {
        return jdbc.queryForList("""
                SELECT
                    YEAR(NgayTao) AS nam,
                    QUARTER(NgayTao) AS quy,
                    COUNT(*) AS soLuong,
                    COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                WHERE NgayTao IS NOT NULL
                GROUP BY YEAR(NgayTao), QUARTER(NgayTao)
                ORDER BY nam DESC, quy DESC
                """);
    }

    // Thống kê tài sản theo tháng
    public List<Map<String, Object>> getTaiSanTheoThang() {
        return jdbc.queryForList("""
                SELECT
                    YEAR(NgayTao) AS nam,
                    MONTH(NgayTao) AS thang,
                    COUNT(*) AS soLuong,
                    COALESCE(SUM(NguyenGia),0) AS tongGiaTri
                FROM TaiSan
                WHERE NgayTao IS NOT NULL
                GROUP BY YEAR(NgayTao), MONTH(NgayTao)
                ORDER BY nam DESC, thang DESC
                """);
    }

    // ===== 6. Một số thống kê mở rộng =====
    public List<Map<String, Object>> getTop5TaiSanGiaTriCao() {
        return jdbc.queryForList("""
                SELECT TenTaiSan,
                       NguyenGia,
                       IdLoaiTaiSan,
                       IdNhomTaiSan,
                       HienTrang
                FROM TaiSan
                ORDER BY NguyenGia DESC
                LIMIT 5
                """);
    }

    public List<Map<String, Object>> getTaiSanChuaDieuDong() {
        return jdbc.queryForList("""
                SELECT ts.Id,
                       ts.TenTaiSan,
                       ts.NguyenGia,
                       ts.HienTrang,
                       lts.TenLoaiTaiSan,
                       nts.TenNhom,
                       pb.TenPhongBan
                FROM TaiSan ts
                LEFT JOIN ChiTietDieuDongTaiSan ctd ON ts.Id=ctd.IdTaiSan
                LEFT JOIN LoaiTaiSan lts ON ts.IdLoaiTaiSan = lts.Id
                LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN PhongBan pb ON ts.IdDonViHienThoi = pb.Id
                WHERE ctd.Id IS NULL
                ORDER BY ts.NguyenGia DESC
                """);
    }

    // Thống kê tài sản sắp hết hạn bảo hành (sử dụng NgayVaoSo thay vì NgayMua)
    public List<Map<String, Object>> getTaiSanSapHetHanBaoHanh() {
        return jdbc.queryForList("""
                SELECT Id,
                       TenTaiSan,
                       NguyenGia,
                       NgayVaoSo,
                       'Không có thông tin bảo hành' AS ThoiHanBaoHanh,
                       'Không có thông tin bảo hành' AS NgayHetHanBaoHanh,
                       0 AS SoNgayConLai
                FROM TaiSan
                WHERE NgayVaoSo IS NOT NULL
                ORDER BY NgayVaoSo ASC
                LIMIT 10
                """);
    }

    // Thống kê tài sản cần bảo trì (sử dụng NgayVaoSo thay vì NgayMua)
    public List<Map<String, Object>> getTaiSanCanBaoTri() {
        return jdbc.queryForList("""
                SELECT Id,
                       TenTaiSan,
                       NguyenGia,
                       NgayVaoSo,
                       'Không có thông tin bảo hành' AS ThoiHanBaoHanh,
                       HienTrang,
                       CASE
                           WHEN NgayVaoSo IS NOT NULL THEN DATEDIFF(NOW(), STR_TO_DATE(NgayVaoSo, '%Y-%m-%d'))
                           ELSE 0
                       END AS SoNgaySuDung
                FROM TaiSan
                WHERE HienTrang = 1
                  AND NgayVaoSo IS NOT NULL
                  AND DATEDIFF(NOW(), STR_TO_DATE(NgayVaoSo, '%Y-%m-%d')) > 365
                ORDER BY SoNgaySuDung DESC
                """);
    }

    // ===== 7. Thống kê trạng thái tài sản (HienTrang) =====
    public List<Map<String, Object>> getTaiSanTheoHienTrangPhanTram() {
        return jdbc.queryForList("""
                            SELECT
                                HienTrang,
                CASE HienTrang
                    WHEN 1 THEN 'Đang sử dụng'
                    WHEN 2 THEN 'Chờ thanh lý'
                    WHEN 3 THEN 'Chưa sử dụng'
                    WHEN 4 THEN 'Ngừng khấu hao'
                    WHEN 5 THEN 'Thanh lý'
                    ELSE 'Không xác định'
                END AS HienTrang,
                                COUNT(*) AS SoLuong,
                                ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM TaiSan), 2) AS TiLePhanTram
                            FROM TaiSan
                            GROUP BY HienTrang
                            ORDER BY HienTrang
                """);
    }

    // Thống kê trạng thái CCDC (HienTrang)
    public List<Map<String, Object>> getCCDCTheoHienTrangPhanTram() {
        return jdbc.queryForList("""
                       SELECT
                           HienTrang,
                            CASE HienTrang
                WHEN 1 THEN 'Đang sử dụng'
                WHEN 2 THEN 'Chờ thanh lý'
                WHEN 3 THEN 'Chưa sử dụng'
                WHEN 4 THEN 'Ngừng khấu hao'
                WHEN 5 THEN 'Thanh lý'
                ELSE 'Không xác định'
                            END AS HienTrang,
                           COUNT(*) AS SoLuong,
                           ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM CCDCVatTu), 2) AS TiLePhanTram
                       FROM CCDCVatTu
                       GROUP BY HienTrang
                       ORDER BY HienTrang
                """);
    }

    // ===== 8. Thống kê tài sản sắp hết hạn khấu hao =====
    public List<Map<String, Object>> getTaiSanSapHetHanKhauHao() {
        return jdbc.queryForList("""
                SELECT
                    Id,
                    TenTaiSan,
                    NgaySuDung,
                    SoKyKhauHao,
                    NguyenGia,
                    DATE_ADD(STR_TO_DATE(NgaySuDung, '%Y-%m-%d'), INTERVAL SoKyKhauHao MONTH) AS NgayHetHan,
                    TIMESTAMPDIFF(MONTH, NOW(), DATE_ADD(STR_TO_DATE(NgaySuDung, '%Y-%m-%d'), INTERVAL SoKyKhauHao MONTH)) AS ThoiHanConLai
                FROM TaiSan
                WHERE TIMESTAMPDIFF(MONTH, NOW(), DATE_ADD(STR_TO_DATE(NgaySuDung, '%Y-%m-%d'), INTERVAL SoKyKhauHao MONTH)) BETWEEN 0 AND 4
                ORDER BY NgayHetHan
                """);
    }

    // ===== 9. Thống kê tài sản theo nhóm và loại con với phần trăm =====
    public List<Map<String, Object>> getTaiSanTheoNhomLoaiConPhanTram(String idNhomTaiSan) {
        return jdbc.queryForList("""
                SELECT
                    nts.Id AS IdNhomTaiSan,
                    nts.TenNhom,
                    ltsc.Id AS IdLoaiTaiSanCon,
                    ltsc.TenLoai,
                    COUNT(ts.Id) AS SoLuong,
                    ROUND(100.0 * COUNT(ts.Id) / SUM(COUNT(ts.Id)) OVER (PARTITION BY nts.Id), 2) AS TiLePhanTram
                FROM TaiSan ts
                         JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                         JOIN LoaiTaiSanCon ltsc ON ts.IdLoaiTaiSanCon = ltsc.Id
                WHERE IdNhomTaiSan = ?
                GROUP BY nts.Id, nts.TenNhom, ltsc.Id, ltsc.TenLoai
                ORDER BY nts.Id, TiLePhanTram DESC
                """, idNhomTaiSan);
    }

    // ===== 10. Thống kê CCDC theo nhóm và loại con với phần trăm =====
    public List<Map<String, Object>> getCCDCTheoNhomLoaiConPhanTram(String idNhomCCDC) {
        return jdbc.queryForList("""
                SELECT
                    nccdc.Id AS IdNhomCCDC,
                    nccdc.Ten AS TenNhom,
                    lccdc.Id AS IdLoaiCCDCCon,
                    lccdc.TenLoai,
                    COUNT(c.Id) AS SoLuong,
                    ROUND(100.0 * COUNT(c.Id) / SUM(COUNT(c.Id)) OVER (PARTITION BY nccdc.Id), 2) AS TiLePhanTram
                FROM CCDCVatTu c
                         JOIN NhomCCDC nccdc ON c.IdNhomCCDC = nccdc.Id
                         JOIN LoaiCCDCCon lccdc ON c.IdLoaiCCDCCon = lccdc.Id
                WHERE c.IdNhomCCDC = ?
                GROUP BY nccdc.Id, nccdc.Ten, lccdc.Id, lccdc.TenLoai
                ORDER BY nccdc.Id, TiLePhanTram DESC
                """, idNhomCCDC);
    }

    // ===== 11. Thống kê nhóm tài sản với phần trăm =====
    public List<Map<String, Object>> getTaiSanTheoNhomPhanTramChiTiet() {
        return jdbc.queryForList("""
                SELECT
                    nts.Id AS IdNhomTaiSan,
                    nts.TenNhom,
                    COUNT(ts.Id) AS SoLuong,
                    ROUND(100.0 * COUNT(ts.Id) / SUM(COUNT(ts.Id)) OVER (), 2) AS TiLePhanTram
                FROM TaiSan ts
                         JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                GROUP BY nts.Id, nts.TenNhom
                ORDER BY TiLePhanTram DESC
                """);
    }

    // ===== 12. Thống kê nhóm CCDC với phần trăm =====
    public List<Map<String, Object>> getCCDCTheoNhomPhanTramChiTiet() {
        return jdbc.queryForList("""
                SELECT
                    nccdc.Id AS IdNhomCCDC,
                    nccdc.Ten AS TenNhom,
                    COUNT(c.Id) AS SoLuong,
                    ROUND(100.0 * COUNT(c.Id) / SUM(COUNT(c.Id)) OVER (), 2) AS TiLePhanTram
                FROM CCDCVatTu c
                         JOIN NhomCCDC nccdc ON c.IdNhomCCDC = nccdc.Id
                GROUP BY nccdc.Id, nccdc.Ten
                ORDER BY TiLePhanTram DESC
                """);
    }
    public List<Map<String, Object>> getCCDCTheoThang() {
        return jdbc.queryForList("""
                SELECT
                    YEAR(NgayTao) AS nam,
                    MONTH(NgayTao) AS thang,
                    COUNT(*) AS soLuong
                FROM CCDCVatTu
                WHERE NgayTao IS NOT NULL
                GROUP BY YEAR(NgayTao), MONTH(NgayTao)
                ORDER BY nam DESC, thang DESC
                """);
    }
    // Thống kê tổng hợp dashboard
    public Map<String, Object> getTongHopDashboard() {
        Map<String, Object> result = new java.util.HashMap<>();

        // Tổng quan
        result.put("tongTaiSan", getTongTaiSan());
        result.put("tongNguyenGia", getTongNguyenGia());
        result.put("tongCCDC", getTongCCDC());
        result.put("tongGiaTriCCDC", getTongGiaTriCCDC());
        result.put("tongPhongBan", getTongPhongBan());
        result.put("tongNhanVien", getTongNhanVien());
        result.put("tongDuAn", getTongDuAn());
        result.put("tongCongTy", getTongCongTy());

        // Thống kê theo loại
        result.put("taiSanTheoNhom", getTaiSanTheoNhom());
        result.put("taiSanTheoTrangThai", getTaiSanTheoTrangThai());
        result.put("ccdcTheoLoai", getCCDCTheoLoai());


        // Thống kê thời gian
        result.put("taiSanTheoNamTao", getTaiSanTheoNamTao());
        result.put("taiSanTheoQuy", getTaiSanTheoQuy());
        result.put("taiSanTheoThang", getTaiSanTheoThang());


        result.put("ccdcTheoThang",  getCCDCTheoThang());

        // Top tài sản
        result.put("top5TaiSanGiaTriCao", getTop5TaiSanGiaTriCao());

        return result;
    }
}
