package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachSuaChuaChiTietTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Repository
public class KeHoachSuaChuaChiTietTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Query ====================

    public List<KeHoachSuaChuaChiTietTaiSan> findAll() {
        String sql = "SELECT * FROM kehoachsuachua_chitiet_taisan";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class));
    }

    public KeHoachSuaChuaChiTietTaiSan findById(String id) {
        String sql = "SELECT * FROM kehoachsuachua_chitiet_taisan WHERE Id = ?";
        List<KeHoachSuaChuaChiTietTaiSan> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<KeHoachSuaChuaChiTietTaiSan> findByIdKeHoachAndThang(String idKeHoach, Integer thang) {
        // Lấy cột capSuaChuaThangX theo tháng động
        String colThang = "CapSuaChuaThang" + thang;
        
        String nhomTaiSan = "";
        try {
            nhomTaiSan = jdbcTemplate.queryForObject(
                "SELECT NhomTaiSan FROM kehoachsuachua WHERE Id = ?",
                String.class,
                idKeHoach
            );
        } catch (Exception e) {
            // fallback
        }
        if (nhomTaiSan == null) {
            nhomTaiSan = "";
        }
        boolean isMayMoc = nhomTaiSan.equalsIgnoreCase("MAY_MOC") || nhomTaiSan.equalsIgnoreCase("MAYMOC") || nhomTaiSan.equalsIgnoreCase("may_moc");

        String subQuery5;
        String subQuery4;
        String subQuery3;
        String subQuery2;
        String subQuery1;

        if (isMayMoc) {
            subQuery5 = """
                EXISTS (
                    SELECT 1 FROM danhgia_vattu dg
                    INNER JOIN nghiemthu_maymoc ntmm ON dg.IdNghiemThu = ntmm.Id
                    INNER JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                    INNER JOIN giamdinh_maymoc gdmm ON bpm.IdGiamDinhMayMoc = gdmm.Id
                    INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                    INNER JOIN suachua_chitiet scct ON gdmmct.IdBienBanChiTiet = scct.Id
                    INNER JOIN suachua sc ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND dg.TrangThai != 2
                )""";
            subQuery4 = """
                EXISTS (
                    SELECT 1 FROM nghiemthu_maymoc ntmm
                    INNER JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                    INNER JOIN giamdinh_maymoc gdmm ON bpm.IdGiamDinhMayMoc = gdmm.Id
                    INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                    INNER JOIN suachua_chitiet scct ON gdmmct.IdBienBanChiTiet = scct.Id
                    INNER JOIN suachua sc ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND ntmm.TrangThai != 2
                )""";
            subQuery3 = """
                EXISTS (
                    SELECT 1 FROM bienphap_maymoc bpm
                    INNER JOIN giamdinh_maymoc gdmm ON bpm.IdGiamDinhMayMoc = gdmm.Id
                    INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                    INNER JOIN suachua_chitiet scct ON gdmmct.IdBienBanChiTiet = scct.Id
                    INNER JOIN suachua sc ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND bpm.TrangThai != 2
                )""";
            subQuery2 = """
                EXISTS (
                    SELECT 1 FROM giamdinh_maymoc gdmm
                    INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                    INNER JOIN suachua_chitiet scct ON gdmmct.IdBienBanChiTiet = scct.Id
                    INNER JOIN suachua sc ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND gdmm.TrangThai != 2
                )""";
        } else {
            subQuery5 = """
                EXISTS (
                    SELECT 1 FROM danhgia_vattu dg
                    INNER JOIN nghiemthu_phuongtien ntpt ON dg.IdNghiemThu = ntpt.Id
                    INNER JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                    INNER JOIN giamdinh_phuongtien gdpt ON bpp.IdGiamDinhPhuongTien = gdpt.Id
                    INNER JOIN suachua sc ON gdpt.IdBienBan = sc.Id AND gdpt.LoaiBienBan = 'sua_chua'
                    INNER JOIN suachua_chitiet scct ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND dg.TrangThai != 2
                )""";
            subQuery4 = """
                EXISTS (
                    SELECT 1 FROM nghiemthu_phuongtien ntpt
                    INNER JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                    INNER JOIN giamdinh_phuongtien gdpt ON bpp.IdGiamDinhPhuongTien = gdpt.Id
                    INNER JOIN suachua sc ON gdpt.IdBienBan = sc.Id AND gdpt.LoaiBienBan = 'sua_chua'
                    INNER JOIN suachua_chitiet scct ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND ntpt.TrangThai != 2
                )""";
            subQuery3 = """
                EXISTS (
                    SELECT 1 FROM bienphap_phuongtien bpp
                    INNER JOIN giamdinh_phuongtien gdpt ON bpp.IdGiamDinhPhuongTien = gdpt.Id
                    INNER JOIN suachua sc ON gdpt.IdBienBan = sc.Id AND gdpt.LoaiBienBan = 'sua_chua'
                    INNER JOIN suachua_chitiet scct ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND bpp.TrangThai != 2
                )""";
            subQuery2 = """
                EXISTS (
                    SELECT 1 FROM giamdinh_phuongtien gdpt
                    INNER JOIN suachua sc ON gdpt.IdBienBan = sc.Id AND gdpt.LoaiBienBan = 'sua_chua'
                    INNER JOIN suachua_chitiet scct ON scct.IdSuaChua = sc.Id
                    WHERE scct.IdKeHoachChiTiet = kscctt.Id
                      AND sc.Thang = ?
                      AND gdpt.TrangThai != 2
                )""";
        }

        subQuery1 = """
            EXISTS (
                SELECT 1 FROM suachua_chitiet scct
                INNER JOIN suachua sc ON scct.IdSuaChua = sc.id
                WHERE scct.idKeHoachChiTiet = kscctt.id
                AND sc.thang = ?
                AND sc.trangThai != 2 
            )""";
        
        String sql = """
            SELECT 
                kscctt.*,
                %s as capSuaChua,
                ts.TenTaiSan AS tenTaiSan,
                ts.IdNhomTaiSan AS idNhomTaiSan,
                CASE 
                    WHEN %s THEN 5
                    WHEN %s THEN 4
                    WHEN %s THEN 3
                    WHEN %s THEN 2
                    WHEN %s THEN 1
                    ELSE 0 
                END as daCoLenhSuaChua
            FROM kehoachsuachua_chitiet_taisan kscctt
                LEFT JOIN TaiSan ts ON kscctt.IdTaiSan = ts.Id
            WHERE kscctt.idKeHoachSuaChua = ?
            AND %s IS NOT NULL
            AND %s != ''
            """.formatted(colThang, subQuery5, subQuery4, subQuery3, subQuery2, subQuery1, colThang, colThang);
        
        return jdbcTemplate.query(sql, 
            new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class), 
            thang, thang, thang, thang, thang,
            idKeHoach
        );
    }

    public List<KeHoachSuaChuaChiTietTaiSan> findByIdKeHoach(String idKeHoach) {
        String sql = """
            SELECT kh.*,
                   ts.TenTaiSan AS tenTaiSan,
                   ts.IdNhomTaiSan AS idNhomTaiSan,
                   ts.IdLoaiTaiSan AS idLoaiTaiSan,
                   ts.DonViTinh AS donViTinh
            FROM kehoachsuachua_chitiet_taisan kh
                LEFT JOIN TaiSan ts ON kh.IdTaiSan = ts.Id
            WHERE kh.IdKeHoachSuaChua = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class), idKeHoach);
    }

    public List<String> findKeHoachIdsByTaiSanId(String idTaiSan) {
        String sql = "SELECT DISTINCT IdKeHoachSuaChua FROM kehoachsuachua_chitiet_taisan WHERE IdTaiSan = ?";
        return jdbcTemplate.queryForList(sql, String.class, idTaiSan);
    }

    // ==================== ID ====================
    public String generateNextId() {
        return "CTTS_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================
    public int insert(KeHoachSuaChuaChiTietTaiSan entity) {
        String sql = """
            INSERT INTO kehoachsuachua_chitiet_taisan (
                Id, IdKeHoachSuaChua, IdTaiSan, SoLuong, GhiChu,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive,
                CapSuaChuaThang1, CapSuaChuaThang2, CapSuaChuaThang3,
                CapSuaChuaThang4, CapSuaChuaThang5, CapSuaChuaThang6,
                CapSuaChuaThang7, CapSuaChuaThang8, CapSuaChuaThang9,
                CapSuaChuaThang10, CapSuaChuaThang11, CapSuaChuaThang12,
                IdDonViBaoTri
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() != null ? entity.getIsActive() : true,
                entity.getCapSuaChuaThang1(),
                entity.getCapSuaChuaThang2(),
                entity.getCapSuaChuaThang3(),
                entity.getCapSuaChuaThang4(),
                entity.getCapSuaChuaThang5(),
                entity.getCapSuaChuaThang6(),
                entity.getCapSuaChuaThang7(),
                entity.getCapSuaChuaThang8(),
                entity.getCapSuaChuaThang9(),
                entity.getCapSuaChuaThang10(),
                entity.getCapSuaChuaThang11(),
                entity.getCapSuaChuaThang12(),
                entity.getIdDonViBaoTri()
        );
    }

    public int[] batchInsert(List<KeHoachSuaChuaChiTietTaiSan> list) {
        String sql = """
            INSERT INTO kehoachsuachua_chitiet_taisan (
                Id, IdKeHoachSuaChua, IdTaiSan, SoLuong, GhiChu,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive,
                CapSuaChuaThang1, CapSuaChuaThang2, CapSuaChuaThang3,
                CapSuaChuaThang4, CapSuaChuaThang5, CapSuaChuaThang6,
                CapSuaChuaThang7, CapSuaChuaThang8, CapSuaChuaThang9,
                CapSuaChuaThang10, CapSuaChuaThang11, CapSuaChuaThang12,
                IdDonViBaoTri
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdKeHoachSuaChua());
                ps.setString(3, entity.getIdTaiSan());
                if (entity.getSoLuong() != null) {
                    ps.setInt(4, entity.getSoLuong());
                } else {
                    ps.setNull(4, java.sql.Types.INTEGER);
                }
                ps.setString(5, entity.getGhiChu());
                ps.setString(6, entity.getNgayTao());
                ps.setString(7, entity.getNgayCapNhat());
                ps.setString(8, entity.getNguoiTao());
                ps.setString(9, entity.getNguoiCapNhat());
                ps.setBoolean(10, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(11, entity.getCapSuaChuaThang1());
                ps.setString(12, entity.getCapSuaChuaThang2());
                ps.setString(13, entity.getCapSuaChuaThang3());
                ps.setString(14, entity.getCapSuaChuaThang4());
                ps.setString(15, entity.getCapSuaChuaThang5());
                ps.setString(16, entity.getCapSuaChuaThang6());
                ps.setString(17, entity.getCapSuaChuaThang7());
                ps.setString(18, entity.getCapSuaChuaThang8());
                ps.setString(19, entity.getCapSuaChuaThang9());
                ps.setString(20, entity.getCapSuaChuaThang10());
                ps.setString(21, entity.getCapSuaChuaThang11());
                ps.setString(22, entity.getCapSuaChuaThang12());
                ps.setString(23, entity.getIdDonViBaoTri());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Update ====================
    public int update(KeHoachSuaChuaChiTietTaiSan entity) {
        String sql = """
            UPDATE kehoachsuachua_chitiet_taisan SET
                IdTaiSan = ?, SoLuong = ?, GhiChu = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?,
                CapSuaChuaThang1 = ?, CapSuaChuaThang2 = ?, CapSuaChuaThang3 = ?,
                CapSuaChuaThang4 = ?, CapSuaChuaThang5 = ?, CapSuaChuaThang6 = ?,
                CapSuaChuaThang7 = ?, CapSuaChuaThang8 = ?, CapSuaChuaThang9 = ?,
                CapSuaChuaThang10 = ?, CapSuaChuaThang11 = ?, CapSuaChuaThang12 = ?,
                IdDonViBaoTri = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getCapSuaChuaThang1(),
                entity.getCapSuaChuaThang2(),
                entity.getCapSuaChuaThang3(),
                entity.getCapSuaChuaThang4(),
                entity.getCapSuaChuaThang5(),
                entity.getCapSuaChuaThang6(),
                entity.getCapSuaChuaThang7(),
                entity.getCapSuaChuaThang8(),
                entity.getCapSuaChuaThang9(),
                entity.getCapSuaChuaThang10(),
                entity.getCapSuaChuaThang11(),
                entity.getCapSuaChuaThang12(),
                entity.getIdDonViBaoTri(),
                entity.getId()
        );
    }

    public int[] batchUpdate(List<KeHoachSuaChuaChiTietTaiSan> list) {
        String sql = """
            UPDATE kehoachsuachua_chitiet_taisan SET
                IdTaiSan = ?, SoLuong = ?, GhiChu = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?,
                CapSuaChuaThang1 = ?, CapSuaChuaThang2 = ?, CapSuaChuaThang3 = ?,
                CapSuaChuaThang4 = ?, CapSuaChuaThang5 = ?, CapSuaChuaThang6 = ?,
                CapSuaChuaThang7 = ?, CapSuaChuaThang8 = ?, CapSuaChuaThang9 = ?,
                CapSuaChuaThang10 = ?, CapSuaChuaThang11 = ?, CapSuaChuaThang12 = ?,
                IdDonViBaoTri = ?
            WHERE Id = ?
            """;

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getIdTaiSan());
                if (entity.getSoLuong() != null) {
                    ps.setInt(2, entity.getSoLuong());
                } else {
                    ps.setNull(2, java.sql.Types.INTEGER);
                }
                ps.setString(3, entity.getGhiChu());
                ps.setString(4, entity.getNgayCapNhat());
                ps.setString(5, entity.getNguoiCapNhat());
                ps.setBoolean(6, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(7, entity.getCapSuaChuaThang1());
                ps.setString(8, entity.getCapSuaChuaThang2());
                ps.setString(9, entity.getCapSuaChuaThang3());
                ps.setString(10, entity.getCapSuaChuaThang4());
                ps.setString(11, entity.getCapSuaChuaThang5());
                ps.setString(12, entity.getCapSuaChuaThang6());
                ps.setString(13, entity.getCapSuaChuaThang7());
                ps.setString(14, entity.getCapSuaChuaThang8());
                ps.setString(15, entity.getCapSuaChuaThang9());
                ps.setString(16, entity.getCapSuaChuaThang10());
                ps.setString(17, entity.getCapSuaChuaThang11());
                ps.setString(18, entity.getCapSuaChuaThang12());
                ps.setString(19, entity.getIdDonViBaoTri());
                ps.setString(20, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Delete ====================
    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM kehoachsuachua_chitiet_taisan WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM kehoachsuachua_chitiet_taisan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchDelete(List<String> ids) {
        String sql = "DELETE FROM kehoachsuachua_chitiet_taisan WHERE Id = ?";
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });
    }
}