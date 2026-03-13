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

    // ==================== Các phương thức query ====================

    // Lấy tất cả bản ghi (chỉ active)
    public List<KeHoachSuaChuaChiTietTaiSan> findAll() {
        String sql = "SELECT * FROM kehoachsuachua_chitiet_taisan WHERE IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class));
    }

    // Lấy theo Id
    public KeHoachSuaChuaChiTietTaiSan findById(String id) {
        String sql = "SELECT * FROM kehoachsuachua_chitiet_taisan WHERE Id = ? AND IsActive = 1";
        List<KeHoachSuaChuaChiTietTaiSan> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    // Lấy danh sách theo IdKeHoachSuaChua
    public List<KeHoachSuaChuaChiTietTaiSan> findByIdKeHoach(String idKeHoach) {
        String sql = "SELECT * FROM kehoachsuachua_chitiet_taisan WHERE IdKeHoachSuaChua = ? AND IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaChiTietTaiSan.class), idKeHoach);
    }

    // ==================== Sinh ID ====================
    public String generateNextId() {
        // Sử dụng UUID để đảm bảo duy nhất, có thể thay bằng logic sinh ID theo format riêng
        return "CTTS_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================
    public int insert(KeHoachSuaChuaChiTietTaiSan entity) {
        String sql = "INSERT INTO kehoachsuachua_chitiet_taisan (Id, IdKeHoachSuaChua, IdTaiSan, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdTaiSan(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive());
    }

    // Insert nhiều bản ghi (batch)
    public int[] batchInsert(List<KeHoachSuaChuaChiTietTaiSan> list) {
        String sql = "INSERT INTO kehoachsuachua_chitiet_taisan (Id, IdKeHoachSuaChua, IdTaiSan, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdKeHoachSuaChua());
                ps.setString(3, entity.getIdTaiSan());
                ps.setString(4, entity.getGhiChu());
                ps.setString(5, entity.getNgayTao());
                ps.setString(6, entity.getNgayCapNhat());
                ps.setString(7, entity.getNguoiTao());
                ps.setString(8, entity.getNguoiCapNhat());
                ps.setBoolean(9, entity.getIsActive() != null ? entity.getIsActive() : true);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Update ====================
    public int update(KeHoachSuaChuaChiTietTaiSan entity) {
        String sql = "UPDATE kehoachsuachua_chitiet_taisan SET IdTaiSan = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    // Update nhiều bản ghi (batch)
    public int[] batchUpdate(List<KeHoachSuaChuaChiTietTaiSan> list) {
        String sql = "UPDATE kehoachsuachua_chitiet_taisan SET IdTaiSan = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaChiTietTaiSan entity = list.get(i);
                ps.setString(1, entity.getIdTaiSan());
                ps.setString(2, entity.getGhiChu());
                ps.setString(3, entity.getNgayCapNhat());
                ps.setString(4, entity.getNguoiCapNhat());
                ps.setBoolean(5, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(6, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Delete (soft) ====================
    // Xóa mềm theo IdKeHoachSuaChua (cập nhật IsActive = 0)
    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "UPDATE kehoachsuachua_chitiet_taisan SET IsActive = 0 WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    // Xóa mềm theo Id
    public int deleteById(String id) {
        String sql = "UPDATE kehoachsuachua_chitiet_taisan SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Xóa mềm nhiều bản ghi (batch) theo danh sách Id
    public int[] batchDelete(List<String> ids) {
        String sql = "UPDATE kehoachsuachua_chitiet_taisan SET IsActive = 0 WHERE Id = ?";
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

    // ==================== Hard delete (nếu cần) ====================
    // Xóa cứng theo IdKeHoachSuaChua
    public int hardDeleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM kehoachsuachua_chitiet_taisan WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    // Xóa cứng theo Id
    public int hardDeleteById(String id) {
        String sql = "DELETE FROM kehoachsuachua_chitiet_taisan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Xóa cứng nhiều bản ghi (batch)
    public int[] hardBatchDelete(List<String> ids) {
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