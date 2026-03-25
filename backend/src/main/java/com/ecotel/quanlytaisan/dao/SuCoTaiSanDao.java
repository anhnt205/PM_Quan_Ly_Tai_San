package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuCoTaiSan;
import com.ecotel.quanlytaisan.model.SuCoTaiSanDTO;
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
public class SuCoTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================== QUERY METHODS ==================

    /**
     * Lấy danh sách phân trang (có thể lọc theo tuNgay, denNgay, noiSuaChua)
     */
    public List<SuCoTaiSan> findAllPaged(int offset, int limit, String tuNgay, String denNgay, String noiSuaChua) {
        StringBuilder sql = new StringBuilder("SELECT * FROM suco_taisan WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (tuNgay != null && !tuNgay.isEmpty()) {
            sql.append(" AND TuNgay >= ?");
            params.add(tuNgay);
        }
        if (denNgay != null && !denNgay.isEmpty()) {
            sql.append(" AND DenNgay <= ?");
            params.add(denNgay);
        }
        if (noiSuaChua != null && !noiSuaChua.isEmpty()) {
            sql.append(" AND NoiSuaChua = ?");
            params.add(noiSuaChua);
        }

        sql.append(" ORDER BY TuNgay DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(SuCoTaiSan.class), params.toArray());
    }

    /**
     * Đếm tổng số bản ghi
     */
    public long countAll(String tuNgay, String denNgay, String noiSuaChua) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM suco_taisan WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (tuNgay != null && !tuNgay.isEmpty()) {
            sql.append(" AND TuNgay >= ?");
            params.add(tuNgay);
        }
        if (denNgay != null && !denNgay.isEmpty()) {
            sql.append(" AND DenNgay <= ?");
            params.add(denNgay);
        }
        if (noiSuaChua != null && !noiSuaChua.isEmpty()) {
            sql.append(" AND NoiSuaChua = ?");
            params.add(noiSuaChua);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public SuCoTaiSan findById(String id) {
        String sql = "SELECT * FROM suco_taisan WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SuCoTaiSan.class), id);
    }

    // ================== SINGLE CRUD ==================

    public int insert(SuCoTaiSanDTO dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }
        String sql = """
            INSERT INTO suco_taisan 
            (Id, TuNgay, DenNgay, NoiDung, NoiSuaChua, NguoiTao, NgayTao, NguoiCapNhat, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                dto.getId(), dto.getTuNgay(), dto.getDenNgay(), dto.getNoiDung(),
                dto.getNoiSuaChua(), dto.getNguoiTao(), dto.getNgayTao(),
                dto.getNguoiCapNhat(), dto.getNgayCapNhat());
    }

    public int update(String id, SuCoTaiSanDTO dto) {
        String sql = """
            UPDATE suco_taisan SET
                TuNgay = ?, DenNgay = ?, NoiDung = ?, NoiSuaChua = ?,
                NguoiCapNhat = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                dto.getTuNgay(), dto.getDenNgay(), dto.getNoiDung(),
                dto.getNoiSuaChua(), dto.getNguoiCapNhat(), dto.getNgayCapNhat(), id);
    }

    public int delete(String id) {
        String sql = "DELETE FROM suco_taisan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // ================== BATCH OPERATIONS ==================

    public int[] insertBatch(List<SuCoTaiSanDTO> list) {
        String sql = """
            INSERT INTO suco_taisan 
            (Id, TuNgay, DenNgay, NoiDung, NoiSuaChua, NguoiTao, NgayTao, NguoiCapNhat, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        for (SuCoTaiSanDTO dto : list) {
            if (dto.getId() == null || dto.getId().isEmpty()) {
                dto.setId(UUID.randomUUID().toString());
            }
        }

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuCoTaiSanDTO dto = list.get(i);
                ps.setString(1, dto.getId());
                ps.setString(2, dto.getTuNgay());
                ps.setString(3, dto.getDenNgay());
                ps.setString(4, dto.getNoiDung());
                ps.setString(5, dto.getNoiSuaChua());
                ps.setString(6, dto.getNguoiTao());
                ps.setString(7, dto.getNgayTao());
                ps.setString(8, dto.getNguoiCapNhat());
                ps.setString(9, dto.getNgayCapNhat());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int[] updateBatch(List<SuCoTaiSanDTO> list) {
        String sql = """
            UPDATE suco_taisan SET
                TuNgay = ?, DenNgay = ?, NoiDung = ?, NoiSuaChua = ?,
                NguoiCapNhat = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuCoTaiSanDTO dto = list.get(i);
                ps.setString(1, dto.getTuNgay());
                ps.setString(2, dto.getDenNgay());
                ps.setString(3, dto.getNoiDung());
                ps.setString(4, dto.getNoiSuaChua());
                ps.setString(5, dto.getNguoiCapNhat());
                ps.setString(6, dto.getNgayCapNhat());
                ps.setString(7, dto.getId());
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
        String sql = "DELETE FROM suco_taisan WHERE Id IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }
}