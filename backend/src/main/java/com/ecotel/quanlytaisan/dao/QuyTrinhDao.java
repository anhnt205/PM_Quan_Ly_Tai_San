package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.QuyTrinhSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class QuyTrinhDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<QuyTrinhSuaChuaDTO> getPagedQuyTrinh(int page, int pageSize, String idTaiSan, Integer nam) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                scct.Id AS idSuaChuaChiTiet,
                ts.TenTaiSan AS thietBi,
                ts.Id AS thietBiId,
                sc.SoPhieu AS lenhSuaChua,
                sc.Id AS idSuaChua,
                sc.TrangThai AS trangThaiSuaChua,
                gd.SoPhieu AS bienBanGiamDinh,
                gd.Id AS idGiamDinh,
                gd.TrangThai AS trangThaiGiamDinh,
                nt.SoPhieu AS phieuNghiemThu,
                nt.Id AS idNghiemThu,
                nt.TrangThai AS trangThaiNghiemThu
            FROM suachua_chitiet scct
            LEFT JOIN suachua sc ON scct.IdSuaChua = sc.Id
            LEFT JOIN taisan ts ON scct.IdTaiSan = ts.Id
            LEFT JOIN giamdinh_maymoc_chitiet gdct ON gdct.IdBienBanChiTiet = scct.Id
            LEFT JOIN giamdinh_maymoc gd ON gdct.IdGiamDinhMayMoc = gd.Id
            LEFT JOIN nghiemthu_taisan ntts ON ntts.IdChiTietGiamDinhMayMoc = gdct.Id
            LEFT JOIN nghiemthu nt ON ntts.IdBienBan = nt.Id
            WHERE 1=1
        """);

        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND scct.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (nam != null) {
            sql.append(" AND sc.nam = ?");
            params.add(nam);
        }

        sql.append(" ORDER BY scct.NgayTao DESC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add((page - 1) * pageSize);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(QuyTrinhSuaChuaDTO.class), params.toArray());
    }

    public int countQuyTrinh(String idTaiSan, Integer nam) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(scct.Id)
            FROM suachua_chitiet scct
            LEFT JOIN suachua sc ON scct.IdSuaChua = sc.Id
            WHERE 1=1
        """);

        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND scct.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (nam != null) {
            sql.append(" AND sc.nam = ?");
            params.add(nam);
        }

        Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
        return count != null ? count : 0;
    }

    public List<QuyTrinhSuaChuaDTO> getPagedHistory(int page, int pageSize, String search, Integer status) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                scct.Id AS idSuaChuaChiTiet,
                ts.TenTaiSan AS thietBi,
                ts.Id AS thietBiId,
                ts.IdNhomTaiSan AS nhomTaiSan,
                CONCAT(LPAD(sc.Thang, 2, '0'), '/', sc.Nam) AS lanBTGanNhat,
                CASE 
                    WHEN sc.Thang = 1 THEN khct.CapSuaChuaThang1
                    WHEN sc.Thang = 2 THEN khct.CapSuaChuaThang2
                    WHEN sc.Thang = 3 THEN khct.CapSuaChuaThang3
                    WHEN sc.Thang = 4 THEN khct.CapSuaChuaThang4
                    WHEN sc.Thang = 5 THEN khct.CapSuaChuaThang5
                    WHEN sc.Thang = 6 THEN khct.CapSuaChuaThang6
                    WHEN sc.Thang = 7 THEN khct.CapSuaChuaThang7
                    WHEN sc.Thang = 8 THEN khct.CapSuaChuaThang8
                    WHEN sc.Thang = 9 THEN khct.CapSuaChuaThang9
                    WHEN sc.Thang = 10 THEN khct.CapSuaChuaThang10
                    WHEN sc.Thang = 11 THEN khct.CapSuaChuaThang11
                    WHEN sc.Thang = 12 THEN khct.CapSuaChuaThang12
                    ELSE ''
                END AS loaiBT,
                nt.Id AS idNghiemThu,
                CASE WHEN nt.Id IS NOT NULL THEN 1 ELSE 0 END as statusHistory
            FROM suachua_chitiet scct
            LEFT JOIN suachua sc ON scct.IdSuaChua = sc.Id
            LEFT JOIN taisan ts ON scct.IdTaiSan = ts.Id
            LEFT JOIN kehoachsuachua_chitiet_taisan khct ON scct.IdKeHoachChiTiet = khct.Id
            LEFT JOIN giamdinh_maymoc_chitiet gdct ON gdct.IdBienBanChiTiet = scct.Id
            LEFT JOIN nghiemthu_taisan ntts ON ntts.IdChiTietGiamDinhMayMoc = gdct.Id
            LEFT JOIN nghiemthu nt ON ntts.IdBienBan = nt.Id
            WHERE scct.Id = (
                SELECT s_sub.Id 
                FROM suachua_chitiet s_sub
                INNER JOIN suachua sc_sub ON s_sub.IdSuaChua = sc_sub.Id
                WHERE s_sub.IdTaiSan = scct.IdTaiSan
                ORDER BY sc_sub.Nam DESC, sc_sub.Thang DESC, s_sub.NgayTao DESC
                LIMIT 1
            )
        """);

        List<Object> params = new ArrayList<>();

        if (search != null && !search.isEmpty()) {
            sql.append(" AND (ts.TenTaiSan LIKE ? OR ts.Id LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (status != null) {
            sql.append(" AND (CASE WHEN nt.Id IS NOT NULL THEN 1 ELSE 0 END) = ?");
            params.add(status);
        }

        sql.append(" ORDER BY ts.Id ASC LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add((page - 1) * pageSize);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(QuyTrinhSuaChuaDTO.class), params.toArray());
    }

    public int countHistory(String search, Integer status) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(*)
            FROM suachua_chitiet scct
            LEFT JOIN taisan ts ON scct.IdTaiSan = ts.Id
            LEFT JOIN giamdinh_maymoc_chitiet gdct ON gdct.IdBienBanChiTiet = scct.Id
            LEFT JOIN nghiemthu_taisan ntts ON ntts.IdChiTietGiamDinhMayMoc = gdct.Id
            LEFT JOIN nghiemthu nt ON ntts.IdBienBan = nt.Id
            WHERE scct.Id = (
                SELECT s_sub.Id 
                FROM suachua_chitiet s_sub
                INNER JOIN suachua sc_sub ON s_sub.IdSuaChua = sc_sub.Id
                WHERE s_sub.IdTaiSan = scct.IdTaiSan
                ORDER BY sc_sub.Nam DESC, sc_sub.Thang DESC, s_sub.NgayTao DESC
                LIMIT 1
            )
        """);

        List<Object> params = new ArrayList<>();

        if (search != null && !search.isEmpty()) {
            sql.append(" AND (ts.TenTaiSan LIKE ? OR ts.Id LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (status != null) {
            sql.append(" AND (CASE WHEN nt.Id IS NOT NULL THEN 1 ELSE 0 END) = ?");
            params.add(status);
        }

        Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
        return count != null ? count : 0;
    }

    public List<Map<String, Object>> countHistoryByStatus(String search) {
        StringBuilder sql = new StringBuilder("""
            SELECT (CASE WHEN nt.Id IS NOT NULL THEN 1 ELSE 0 END) as statusHistory, COUNT(*) as count
            FROM suachua_chitiet scct
            LEFT JOIN taisan ts ON scct.IdTaiSan = ts.Id
            LEFT JOIN giamdinh_maymoc_chitiet gdct ON gdct.IdBienBanChiTiet = scct.Id
            LEFT JOIN nghiemthu_taisan ntts ON ntts.IdChiTietGiamDinhMayMoc = gdct.Id
            LEFT JOIN nghiemthu nt ON ntts.IdBienBan = nt.Id
            WHERE scct.Id = (
                SELECT s_sub.Id 
                FROM suachua_chitiet s_sub
                INNER JOIN suachua sc_sub ON s_sub.IdSuaChua = sc_sub.Id
                WHERE s_sub.IdTaiSan = scct.IdTaiSan
                ORDER BY sc_sub.Nam DESC, sc_sub.Thang DESC, s_sub.NgayTao DESC
                LIMIT 1
            )
        """);

        List<Object> params = new ArrayList<>();

        if (search != null && !search.isEmpty()) {
            sql.append(" AND (ts.TenTaiSan LIKE ? OR ts.Id LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }

        sql.append(" GROUP BY statusHistory");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<com.ecotel.quanlytaisan.model.VatTuTieuHaoDTO> getMaterialConsumption(
            String idTaiSan, String dateFrom, String dateTo, String nhomTaiSan) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new java.util.ArrayList<>();

        boolean isMayMoc = nhomTaiSan != null && 
            (nhomTaiSan.equalsIgnoreCase("MAY_MOC") || nhomTaiSan.equalsIgnoreCase("MAYMOC") || nhomTaiSan.equalsIgnoreCase("may_moc"));

        if (isMayMoc) {
            sql.append("""
                SELECT 
                    cv.Id AS ma,
                    cv.Ten AS ten,
                    cv.DonViTinh AS donViTinh,
                    SUM(ntvt.SoLuong) AS soLuong,
                    cv.GiaTri AS giaTri
                FROM nghiemthu_maymoc_vattu ntvt
                JOIN nghiemthu_maymoc_taisan ntts ON ntvt.IdBienBanTaiSan = ntts.Id
                JOIN nghiemthu_maymoc nt ON ntts.IdBienBan = nt.Id
                LEFT JOIN CCDCVatTu cv ON ntvt.IdVatTu = cv.Id
                WHERE ntts.IdTaiSan = ?
            """);
            params.add(idTaiSan);
        } else {
            sql.append("""
                SELECT 
                    cv.Id AS ma,
                    cv.Ten AS ten,
                    cv.DonViTinh AS donViTinh,
                    SUM(ntptct.SoLuongThayTe) AS soLuong,
                    cv.GiaTri AS giaTri
                FROM nghiemthu_phuongtien_chitiet ntptct
                JOIN nghiemthu_phuongtien nt ON ntptct.IdNghiemThuPhuongTien = nt.Id
                LEFT JOIN CCDCVatTu cv ON ntptct.IdVatTu = cv.Id
                WHERE nt.IdTaiSan = ?
            """);
            params.add(idTaiSan);
        }

        if (dateFrom != null && !dateFrom.isEmpty()) {
            sql.append(" AND nt.NgayTao >= ?");
            params.add(dateFrom);
        }

        if (dateTo != null && !dateTo.isEmpty()) {
            sql.append(" AND nt.NgayTao <= ?");
            params.add(dateTo + " 23:59:59");
        }

        sql.append(" GROUP BY cv.Id, cv.Ten, cv.DonViTinh, cv.GiaTri");

        return jdbcTemplate.query(sql.toString(), 
                new BeanPropertyRowMapper<>(com.ecotel.quanlytaisan.model.VatTuTieuHaoDTO.class), 
                params.toArray());
    }

    public List<Map<String, Object>> getLichSuHoatDong(String idTaiSan, String dateFrom, String dateTo, String nhomTaiSan) {
        boolean isMayMoc = "MAY_MOC".equalsIgnoreCase(nhomTaiSan) || "MAYMOC".equalsIgnoreCase(nhomTaiSan);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT DISTINCT * FROM ( ");

        // --- PHẦN 1: TỪ SỬA CHỮA ---
        sql.append("SELECT ")
           .append("sc.NgayTao AS ngayBatDau, ")
           .append("dg.NgayTao AS ngayKetThuc, ")
           .append("COALESCE(lsc.Ten, dg.CapSuaChua) AS loaiSuaChua, ")
           .append("dg.GhiChuBienBan AS ghiChu ")
           .append("FROM suachua sc ")
           .append("JOIN suachua_chitiet sct ON sc.Id = sct.IdSuaChua ");

        if (isMayMoc) {
            sql.append("LEFT JOIN giamdinh_maymoc gd ON gd.IdBienBan = sc.Id AND LOWER(gd.LoaiBienBan) = 'sua_chua' ")
               .append("LEFT JOIN bienphap_maymoc bp ON bp.IdGiamDinhMayMoc = gd.Id ")
               .append("LEFT JOIN nghiemthu_maymoc nt ON (nt.IdGiamDinhMayMoc = gd.Id OR nt.IdBienPhapMayMoc = bp.Id) ")
               .append("LEFT JOIN danhgia_vattu dg ON dg.IdNghiemThu = nt.Id ");
        } else {
            sql.append("LEFT JOIN giamdinh_phuongtien gd ON gd.IdBienBan = sc.Id AND LOWER(gd.LoaiBienBan) = 'sua_chua' ")
               .append("LEFT JOIN bienphap_phuongtien bp ON bp.IdGiamDinhPhuongTien = gd.Id ")
               .append("LEFT JOIN nghiemthu_phuongtien ntp ON (ntp.IdGiamDinhPhuongTien = gd.Id OR ntp.IdBienPhapPhuongTien = bp.Id) ")
               .append("LEFT JOIN danhgia_vattu dg ON dg.IdNghiemThu = ntp.Id ");
        }

        sql.append("LEFT JOIN LoaiSCBD lsc ON dg.CapSuaChua = lsc.Id ")
           .append("WHERE sct.IdTaiSan = ? ");

        sql.append(" UNION ALL ");

        // --- PHẦN 2: TỪ SỰ CỐ ---
        sql.append("SELECT ")
           .append("scb.NgayTao AS ngayBatDau, ")
           .append("dg.NgayTao AS ngayKetThuc, ")
           .append("COALESCE(lsc.Ten, dg.CapSuaChua) AS loaiSuaChua, ")
           .append("dg.GhiChuBienBan AS ghiChu ")
           .append("FROM suco_thietbi scb ")
           .append("JOIN suco_thietbi_chitiet scbct ON scb.Id = scbct.IdSuCo ")
           .append("LEFT JOIN kiemtra_suco ktsc ON scb.Id = ktsc.IdSuCo ");

        if (isMayMoc) {
            sql.append("LEFT JOIN giamdinh_maymoc gd ON gd.IdBienBan = ktsc.Id AND LOWER(gd.LoaiBienBan) = 'su_co' ")
               .append("LEFT JOIN bienphap_maymoc bp ON bp.IdGiamDinhMayMoc = gd.Id ")
               .append("LEFT JOIN nghiemthu_maymoc nt ON (nt.IdGiamDinhMayMoc = gd.Id OR nt.IdBienPhapMayMoc = bp.Id) ")
               .append("LEFT JOIN danhgia_vattu dg ON dg.IdNghiemThu = nt.Id ");
        } else {
            sql.append("LEFT JOIN giamdinh_phuongtien gd ON gd.IdBienBan = ktsc.Id AND LOWER(gd.LoaiBienBan) = 'su_co' ")
               .append("LEFT JOIN bienphap_phuongtien bp ON bp.IdGiamDinhPhuongTien = gd.Id ")
               .append("LEFT JOIN nghiemthu_phuongtien ntp ON (ntp.IdGiamDinhPhuongTien = gd.Id OR ntp.IdBienPhapPhuongTien = bp.Id) ")
               .append("LEFT JOIN danhgia_vattu dg ON dg.IdNghiemThu = ntp.Id ");
        }

        sql.append("LEFT JOIN LoaiSCBD lsc ON dg.CapSuaChua = lsc.Id ")
           .append("WHERE scbct.IdTaiSan = ? ");
           
        sql.append(") AS combined WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        params.add(idTaiSan);
        params.add(idTaiSan);

        if (dateFrom != null && !dateFrom.isEmpty()) {
            sql.append(" AND ngayBatDau >= ?");
            params.add(dateFrom);
        }

        if (dateTo != null && !dateTo.isEmpty()) {
            sql.append(" AND ngayBatDau <= ?");
            params.add(dateTo + " 23:59:59");
        }

        sql.append(" ORDER BY ngayBatDau DESC");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
}
