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
        String sql = "SELECT * FROM suachua_vattu_tieuhao";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class));
    }

    public SuaChuaVatTuTieuHao findById(String id) {
        String sql = "SELECT * FROM suachua_vattu_tieuhao WHERE Id = ?";
        List<SuaChuaVatTuTieuHao> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<SuaChuaVatTuTieuHao> findByIdSuaChua(String idSuaChua) {
        String sql = "SELECT * FROM suachua_vattu_tieuhao WHERE IdSuaChua = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaVatTuTieuHao.class), idSuaChua);
    }

    // ==================== ID Generator ====================

    public String generateNextId() {
        return "SVTT_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================

    public int insert(SuaChuaVatTuTieuHao entity) {
        String sql = "INSERT INTO suachua_vattu_tieuhao (Id,IdSuaChua, IdKeHoachSuaChua, IdCCDC,IdChiTietCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdSuaChua(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
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
        String sql = "INSERT INTO suachua_vattu_tieuhao (Id,IdSuaChua, IdKeHoachSuaChua, IdCCDC,IdChiTietCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdSuaChua());
                ps.setString(3, entity.getIdKeHoachSuaChua());
                ps.setString(4, entity.getIdCCDC());
                ps.setString(5, entity.getIdChiTietCCDC());
                ps.setString(6, entity.getTenVatTu());
                if (entity.getSoLuong() != null) {
                    ps.setInt(7, entity.getSoLuong());
                } else {
                    ps.setNull(7, java.sql.Types.INTEGER);
                }
                ps.setString(8, entity.getGhiChu());
                ps.setString(9, entity.getNgayTao());
                ps.setString(10, entity.getNgayCapNhat());
                ps.setString(11, entity.getNguoiTao());
                ps.setString(12, entity.getNguoiCapNhat());
                ps.setBoolean(13, entity.getIsActive() != null ? entity.getIsActive() : true);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Update ====================

    public int update(SuaChuaVatTuTieuHao entity) {
        String sql = "UPDATE suachua_vattu_tieuhao SET SuaChua=?,IdKeHoachSuaChua = ?,IdCCDC = ?,IdChiTietCCDC = ?,TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                entity.getIdSuaChua(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getTenVatTu(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    public int[] batchUpdate(List<SuaChuaVatTuTieuHao> list) {
        String sql = "UPDATE suachua_vattu_tieuhao SET IdSuaChua=?,IdKeHoachSuaChua = ?,IdCCDC = ?,IdChiTietCCDC = ?,TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getIdSuaChua());
                ps.setString(2, entity.getIdKeHoachSuaChua());
                ps.setString(3, entity.getIdCCDC());
                ps.setString(4, entity.getIdChiTietCCDC());
                ps.setString(5, entity.getTenVatTu());
                if (entity.getSoLuong() != null) {
                    ps.setInt(6, entity.getSoLuong());
                } else {
                    ps.setNull(6, java.sql.Types.INTEGER);
                }
                ps.setString(7, entity.getGhiChu());
                ps.setString(8, entity.getNgayCapNhat());
                ps.setString(9, entity.getNguoiCapNhat());
                ps.setBoolean(10, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(11, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Delete (soft) ====================

    public int deleteByIdSuaChua(String idSuaChua) {
        String sql = "DELETE FROM suachua_vattu_tieuhao WHERE IdSuaCHua = ?";
        return jdbcTemplate.update(sql, idSuaChua);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM suachua_vattu_tieuhao WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchDelete(List<String> ids) {
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