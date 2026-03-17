package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuaChuaChiTietTaiSan;
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
public class SuaChuaChiTietTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Query methods ====================

    public List<SuaChuaChiTietTaiSan> findAll() {
        String sql = "SELECT * FROM suachua_chitiet_taisan";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTietTaiSan.class));
    }

    public SuaChuaChiTietTaiSan findById(String id) {
        String sql = "SELECT * FROM suachua_chitiet_taisan WHERE Id = ?";
        List<SuaChuaChiTietTaiSan> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTietTaiSan.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<SuaChuaChiTietTaiSan> findByIdSuaChua(String idSuaChua) {
        String sql = "SELECT * FROM suachua_chitiet_taisan WHERE IdSuaChua = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTietTaiSan.class), idSuaChua);
    }

    public List<SuaChuaChiTietTaiSan> findChuaSuaChua(String idSuaChua) {
        String sql = "SELECT * FROM suachua_chitiet_taisan WHERE IdSuaChua=? AND (DaSuaChua = 0 OR DaSuaChua IS NULL)";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTietTaiSan.class),idSuaChua);
    }

    public int countChuaSuaByIdSuaChua(String idSuaChua) {
        String sql = "SELECT COUNT(*) FROM suachua_chitiet_taisan WHERE IdSuaChua = ? AND (DaSuaChua IS NULL OR DaSuaChua = 0)";
        return jdbcTemplate.queryForObject(sql, Integer.class, idSuaChua);
    }

    // ==================== ID Generator ====================

    public String generateNextId() {
        return "SCTS_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================

    public int insert(SuaChuaChiTietTaiSan entity) {
        String sql = "INSERT INTO suachua_chitiet_taisan (Id,IdSuaChua, IdKeHoachSuaChua, IdTaiSan,SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdSuaChua(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() != null ? entity.getIsActive() : true);
    }

    public int[] batchInsert(List<SuaChuaChiTietTaiSan> list) {
        String sql = "INSERT INTO suachua_chitiet_taisan (Id,IdSuaChua, IdKeHoachSuaChua, IdTaiSan,SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdSuaChua());
                ps.setString(3, entity.getIdKeHoachSuaChua());
                ps.setString(4, entity.getIdTaiSan());
                if (entity.getSoLuong() != null) {
                    ps.setInt(5, entity.getSoLuong());
                } else {
                    ps.setNull(5, java.sql.Types.INTEGER);
                }
                ps.setString(6, entity.getGhiChu());
                ps.setString(7, entity.getNgayTao());
                ps.setString(8, entity.getNgayCapNhat());
                ps.setString(9, entity.getNguoiTao());
                ps.setString(10, entity.getNguoiCapNhat());
                ps.setBoolean(11, entity.getIsActive() != null ? entity.getIsActive() : true);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Update ====================

    public int update(SuaChuaChiTietTaiSan entity) {
        String sql = "UPDATE suachua_chitiet_taisan SET IdSuaChua = ?, IdKeHoachSuaChua = ?,TaiSan = ?,SoLuong = ?,GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                entity.getIdSuaChua(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    public int[] batchUpdate(List<SuaChuaChiTietTaiSan> list) {
        String sql = "UPDATE suachua_chitiet_taisan SET IdSuaChua = ?, IdKeHoachSuaChua = ?,IdTaiSan = ?,SoLuong = ?,GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getIdSuaChua());
                ps.setString(2, entity.getIdKeHoachSuaChua());
                ps.setString(3, entity.getIdTaiSan());
                if (entity.getSoLuong() != null) {
                    ps.setInt(4, entity.getSoLuong());
                } else {
                    ps.setNull(4, java.sql.Types.INTEGER);
                }
                ps.setString(5, entity.getGhiChu());
                ps.setString(6, entity.getNgayCapNhat());
                ps.setString(7, entity.getNguoiCapNhat());
                ps.setBoolean(8, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(9, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int updateDaSuaChua(String id, Boolean daSuaChua) {
        String sql = "UPDATE suachua_chitiet_taisan SET DaSuaChua = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, daSuaChua, id);
    }

    // ==================== Delete (soft) ====================

    public int deleteByIdSuaChua(String idSuaChua) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE IdSuaChua = ?";
        return jdbcTemplate.update(sql, idSuaChua);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchDelete(List<String> ids) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE Id = ?";
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

    // ==================== Hard delete (optional) ====================

    public int hardDeleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public int hardDeleteById(String id) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] hardBatchDelete(List<String> ids) {
        String sql = "DELETE FROM suachua_chitiet_taisan WHERE Id = ?";
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