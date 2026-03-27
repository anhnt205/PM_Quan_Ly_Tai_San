package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GioHoatDong;
import com.ecotel.quanlytaisan.model.GioHoatDongDTO;
import com.ecotel.quanlytaisan.model.GioHoatDongYearData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class GioHoatDongDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<GioHoatDong> findAllPaged(int offset, int limit, String idTaiSan, String nam, String thang, String ngay) {
        StringBuilder sql = new StringBuilder("SELECT * FROM giohoatdong WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND IdTaiSan = ?");
            params.add(idTaiSan);
        }
        if (nam != null && !nam.isEmpty()) {
            sql.append(" AND Nam = ?");
            params.add(nam);
        }
        if (thang != null && !thang.isEmpty()) {
            sql.append(" AND Thang = ?");
            params.add(thang);
        }
        if (ngay != null && !ngay.isEmpty()) {
            sql.append(" AND Ngay = ?");
            params.add(ngay);
        }

        sql.append(" ORDER BY Nam DESC, Thang DESC, Ngay DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(GioHoatDong.class), params.toArray());
    }

    public long countAll(String idTaiSan, String nam, String thang, String ngay) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM giohoatdong WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND IdTaiSan = ?");
            params.add(idTaiSan);
        }
        if (nam != null && !nam.isEmpty()) {
            sql.append(" AND Nam = ?");
            params.add(nam);
        }
        if (thang != null && !thang.isEmpty()) {
            sql.append(" AND Thang = ?");
            params.add(thang);
        }
        if (ngay != null && !ngay.isEmpty()) {
            sql.append(" AND Ngay = ?");
            params.add(ngay);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public GioHoatDong findById(String id) {
        String sql = "SELECT * FROM giohoatdong WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), id);
    }

    public List<GioHoatDong> findByIdTaiSan(String idTaiSan) {
        String sql = "SELECT * FROM giohoatdong WHERE IdTaiSan = ? ORDER BY Nam DESC, Thang DESC, Ngay DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), idTaiSan);
    }

    public List<GioHoatDong> findByIdTaiSanPaged(String idTaiSan, int offset, int limit) {
        String sql = "SELECT * FROM giohoatdong WHERE IdTaiSan = ? ORDER BY Nam DESC, Thang DESC, Ngay DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), idTaiSan, limit, offset);
    }

    public long countByIdTaiSan(String idTaiSan) {
        String sql = "SELECT COUNT(*) FROM giohoatdong WHERE IdTaiSan = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idTaiSan);
    }

    public List<GioHoatDongYearData> groupByYear(String idTaiSan) {
        String sql = """
            SELECT 
                Nam,
                SUM(GioHoatDong) AS tongGioHoatDong,
                SUM(GioNgungMay_HongMay) AS tongGioNgungMay_HongMay,
                SUM(GioNgungMay_ChoDoi) AS tongGioNgungMay_ChoDoi,
                SUM(GioNgungMay_MatDien) AS tongGioNgungMay_MatDien,
                SUM(GioNgungMay_ThieuNguyenLieu) AS tongGioNgungMay_ThieuNguyenLieu,
                SUM(GioNgungMay_LyDoKhac) AS tongGioNgungMay_LyDoKhac,
                COUNT(Thang) AS soThangCoDuLieu
            FROM giohoatdong
            WHERE IdTaiSan = ?
            GROUP BY Nam
            ORDER BY Nam DESC
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GioHoatDongYearData.class), idTaiSan);
    }

    public List<String> getYearsByIdTaiSan(String idTaiSan) {
        String sql = "SELECT DISTINCT Nam FROM giohoatdong WHERE IdTaiSan = ? ORDER BY Nam DESC";
        return jdbcTemplate.queryForList(sql, String.class, idTaiSan);
    }

    public List<GioHoatDong> findByTaiSanAndYear(String idTaiSan, String year) {
        String sql = "SELECT * FROM giohoatdong WHERE IdTaiSan = ? AND Nam = ? ORDER BY Thang ASC, Ngay ASC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), idTaiSan, year);
    }

    public List<GioHoatDong> findByTaiSanAndYearAndMonth(String idTaiSan, String year, String month) {
        String sql = "SELECT * FROM giohoatdong WHERE IdTaiSan = ? AND Nam = ? AND Thang = ? ORDER BY Ngay ASC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), idTaiSan, year, month);
    }

    public int insert(GioHoatDongDTO dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }
        String sql = """
            INSERT INTO giohoatdong 
            (Id, IdTaiSan, Nam, Thang, Ngay, GioHoatDong, KetQuaHoatDong,
             GioNgungMay_HongMay, GioNgungMay_ChoDoi, GioNgungMay_MatDien,
             GioNgungMay_ThieuNguyenLieu, GioNgungMay_LyDoKhac,
             GhiChu, NgayTao, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                dto.getId(), dto.getIdTaiSan(), dto.getNam(), dto.getThang(), dto.getNgay(),
                dto.getGioHoatDong(), dto.getKetQuaHoatDong(),
                dto.getGioNgungMay_HongMay(), dto.getGioNgungMay_ChoDoi(),
                dto.getGioNgungMay_MatDien(), dto.getGioNgungMay_ThieuNguyenLieu(),
                dto.getGioNgungMay_LyDoKhac(),
                dto.getGhiChu(), dto.getNgayTao(), dto.getNgayCapNhat());
    }

    public int update(String id, GioHoatDongDTO dto) {
        String sql = """
            UPDATE giohoatdong SET
                IdTaiSan = ?, Nam = ?, Thang = ?, Ngay = ?,
                GioHoatDong = ?, KetQuaHoatDong = ?,
                GioNgungMay_HongMay = ?, GioNgungMay_ChoDoi = ?,
                GioNgungMay_MatDien = ?, GioNgungMay_ThieuNguyenLieu = ?,
                GioNgungMay_LyDoKhac = ?,
                GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                dto.getIdTaiSan(), dto.getNam(), dto.getThang(), dto.getNgay(),
                dto.getGioHoatDong(), dto.getKetQuaHoatDong(),
                dto.getGioNgungMay_HongMay(), dto.getGioNgungMay_ChoDoi(),
                dto.getGioNgungMay_MatDien(), dto.getGioNgungMay_ThieuNguyenLieu(),
                dto.getGioNgungMay_LyDoKhac(),
                dto.getGhiChu(), dto.getNgayCapNhat(), id);
    }

    public int delete(String id) {
        String sql = "DELETE FROM giohoatdong WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] insertBatch(List<GioHoatDongDTO> list) {
        String sql = """
            INSERT INTO giohoatdong 
            (Id, IdTaiSan, Nam, Thang, Ngay, GioHoatDong, KetQuaHoatDong,
             GioNgungMay_HongMay, GioNgungMay_ChoDoi, GioNgungMay_MatDien,
             GioNgungMay_ThieuNguyenLieu, GioNgungMay_LyDoKhac,
             GhiChu, NgayTao, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        for (GioHoatDongDTO dto : list) {
            if (dto.getId() == null || dto.getId().isEmpty()) {
                dto.setId(UUID.randomUUID().toString());
            }
        }
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GioHoatDongDTO dto = list.get(i);
                ps.setString(1, dto.getId());
                ps.setString(2, dto.getIdTaiSan());
                ps.setString(3, dto.getNam());
                ps.setString(4, dto.getThang());
                ps.setString(5, dto.getNgay());
                ps.setObject(6, dto.getGioHoatDong());
                ps.setString(7, dto.getKetQuaHoatDong());
                ps.setObject(8, dto.getGioNgungMay_HongMay());
                ps.setObject(9, dto.getGioNgungMay_ChoDoi());
                ps.setObject(10, dto.getGioNgungMay_MatDien());
                ps.setObject(11, dto.getGioNgungMay_ThieuNguyenLieu());
                ps.setObject(12, dto.getGioNgungMay_LyDoKhac());
                ps.setString(13, dto.getGhiChu());
                ps.setString(14, dto.getNgayTao());
                ps.setString(15, dto.getNgayCapNhat());
            }
            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int[] updateBatch(List<GioHoatDongDTO> list) {
        String sql = """
            UPDATE giohoatdong SET
                IdTaiSan = ?, Nam = ?, Thang = ?, Ngay = ?,
                GioHoatDong = ?, KetQuaHoatDong = ?,
                GioNgungMay_HongMay = ?, GioNgungMay_ChoDoi = ?,
                GioNgungMay_MatDien = ?, GioNgungMay_ThieuNguyenLieu = ?,
                GioNgungMay_LyDoKhac = ?,
                GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GioHoatDongDTO dto = list.get(i);
                ps.setString(1, dto.getIdTaiSan());
                ps.setString(2, dto.getNam());
                ps.setString(3, dto.getThang());
                ps.setString(4, dto.getNgay());
                ps.setObject(5, dto.getGioHoatDong());
                ps.setString(6, dto.getKetQuaHoatDong());
                ps.setObject(7, dto.getGioNgungMay_HongMay());
                ps.setObject(8, dto.getGioNgungMay_ChoDoi());
                ps.setObject(9, dto.getGioNgungMay_MatDien());
                ps.setObject(10, dto.getGioNgungMay_ThieuNguyenLieu());
                ps.setObject(11, dto.getGioNgungMay_LyDoKhac());
                ps.setString(12, dto.getGhiChu());
                ps.setString(13, dto.getNgayCapNhat());
                ps.setString(14, dto.getId());
            }
            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int deleteBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        String placeholders = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM giohoatdong WHERE Id IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }
}