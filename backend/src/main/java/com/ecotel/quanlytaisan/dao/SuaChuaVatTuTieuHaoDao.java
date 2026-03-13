package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuaChuaVatTuTieuHao;
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
public class SuaChuaVatTuTieuHaoDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Query methods ====================

    public List<SuaChuaVatTuTieuHao> findAll() {
        String sql = "SELECT * FROM suachua_vattu_tieuhao WHERE IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class));
    }

    public SuaChuaVatTuTieuHao findById(String id) {
        String sql = "SELECT * FROM suachua_vattu_tieuhao WHERE Id = ? AND IsActive = 1";
        List<SuaChuaVatTuTieuHao> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<SuaChuaVatTuTieuHao> findByIdKeHoach(String idKeHoach) {
        String sql = "SELECT * FROM suachua_vattu_tieuhao WHERE IdKeHoachSuaChua = ? AND IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class), idKeHoach);
    }

    // ==================== ID Generator ====================

    public String generateNextId() {
        return "SVTT_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================

    public int insert(SuaChuaVatTuTieuHao entity) {
        String sql = "INSERT INTO suachua_vattu_tieuhao (Id, IdKeHoachSuaChua, IdCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdCCDC(),
                entity.getTenVatTu(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() != null ? entity.getIsActive() : true);
    }

    public int[] batchInsert(List<SuaChuaVatTuTieuHao> list) {
        String sql = "INSERT INTO suachua_vattu_tieuhao (Id, IdKeHoachSuaChua, IdCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdKeHoachSuaChua());
                ps.setString(3, entity.getIdCCDC());
                ps.setString(4, entity.getTenVatTu());
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

    public int update(SuaChuaVatTuTieuHao entity) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IdCCDC = ?, TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                entity.getIdCCDC(),
                entity.getTenVatTu(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    public int[] batchUpdate(List<SuaChuaVatTuTieuHao> list) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IdCCDC = ?, TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getIdCCDC());
                ps.setString(2, entity.getTenVatTu());
                if (entity.getSoLuong() != null) {
                    ps.setInt(3, entity.getSoLuong());
                } else {
                    ps.setNull(3, java.sql.Types.INTEGER);
                }
                ps.setString(4, entity.getGhiChu());
                ps.setString(5, entity.getNgayCapNhat());
                ps.setString(6, entity.getNguoiCapNhat());
                ps.setBoolean(7, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(8, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Delete (soft) ====================

    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IsActive = 0 WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public int deleteById(String id) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchDelete(List<String> ids) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IsActive = 0 WHERE Id = ?";
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
        String sql = "DELETE FROM suachua_vattu_tieuhao WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public int hardDeleteById(String id) {
        String sql = "DELETE FROM suachua_vattu_tieuhao WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] hardBatchDelete(List<String> ids) {
        String sql = "DELETE FROM suachua_vattu_tieuhao WHERE Id = ?";
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