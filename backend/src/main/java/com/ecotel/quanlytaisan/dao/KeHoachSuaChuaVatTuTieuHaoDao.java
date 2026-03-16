package com.ecotel.quanlytaisan.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.KeHoachSuaChuaVatTuTieuHao;

@Repository
public class KeHoachSuaChuaVatTuTieuHaoDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Các phương thức query ====================

    /**
     * Lấy tất cả bản ghi đang active
     */
    public List<KeHoachSuaChuaVatTuTieuHao> findAll() {
        String sql = "SELECT * FROM kehoachsuachua_vattu_tieuhao";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaVatTuTieuHao.class));
    }

    /**
     * Lấy bản ghi theo ID
     */
    public KeHoachSuaChuaVatTuTieuHao findById(String id) {
        String sql = "SELECT * FROM kehoachsuachua_vattu_tieuhao WHERE Id = ?";
        List<KeHoachSuaChuaVatTuTieuHao> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaVatTuTieuHao.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * Lấy danh sách theo IdKeHoachSuaChua
     */
    public List<KeHoachSuaChuaVatTuTieuHao> findByIdKeHoach(String idKeHoach) {
        String sql = """
        SELECT 
            kh.Id,
            kh.IdKeHoachSuaChua,
            kh.IdNhomCCDC,
            n.Ten AS tenNhomCCDC,
            kh.IdCCDC,
            kh.IdChiTietCCDC,
            kh.GhiChu,
            kh.TenVatTu AS tenVatTu,
            ctts.SoKyHieu AS soKyHieu,
            ctts.NuocSanXuat AS nuocSanXuat,
            ctts.NamSanXuat AS namSanXuat,
            vt.DonViTinh AS donViTinh,
            kh.SoLuong AS soLuong
        FROM kehoachsuachua_vattu_tieuhao kh
            LEFT JOIN chitiettaisan ctts ON kh.IdChiTietCCDC = ctts.Id 
            LEFT JOIN ccdcvattu vt ON kh.IdCCDC = vt.Id 
            LEFT JOIN nhomccdc n ON kh.IdNhomCCDC = n.Id
        WHERE IdKeHoachSuaChua = ?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaVatTuTieuHao.class), idKeHoach);
    }

    // ==================== Sinh ID ====================
    public String generateNextId() {
        // Sinh UUID với tiền tố "VATTU_" để dễ nhận biết
        return "VATTU_" + UUID.randomUUID().toString();
    }

    // ==================== Insert ====================
    public int insert(KeHoachSuaChuaVatTuTieuHao entity) {
        String sql = "INSERT INTO kehoachsuachua_vattu_tieuhao (Id, IdKeHoachSuaChua, IdCCDC,IdChiTietCCDC,IdNhomCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKeHoachSuaChua(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getIdNhomCCDC(),
                entity.getTenVatTu(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() != null ? entity.getIsActive() : true);
    }

    /**
     * Insert hàng loạt
     */
    public int[] batchInsert(List<KeHoachSuaChuaVatTuTieuHao> list) {
        String sql = "INSERT INTO kehoachsuachua_vattu_tieuhao (Id, IdKeHoachSuaChua, IdCCDC,IdChiTietCCDC, TenVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive,IdNhomCCDC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getId());
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
                ps.setString(8, entity.getNgayTao());
                ps.setString(9, entity.getNgayCapNhat());
                ps.setString(10, entity.getNguoiTao());
                ps.setString(11, entity.getNguoiCapNhat());
                ps.setBoolean(12, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(13, entity.getIdNhomCCDC());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Update ====================
    public int update(KeHoachSuaChuaVatTuTieuHao entity) {
        String sql = "UPDATE kehoachsuachua_vattu_tieuhao SET IdCCDC = ?,IdChiTietCCDC=?,IdNhomCCDC=?, TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getIdNhomCCDC(),
                entity.getTenVatTu(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    /**
     * Update hàng loạt
     */
    public int[] batchUpdate(List<KeHoachSuaChuaVatTuTieuHao> list) {
        String sql = "UPDATE kehoachsuachua_vattu_tieuhao SET IdCCDC = ?,IdChiTietCCDC=?, TenVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?,IdNhomCCDC=?, WHERE Id = ?";

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KeHoachSuaChuaVatTuTieuHao entity = list.get(i);
                ps.setString(1, entity.getIdCCDC());
                ps.setString(2, entity.getIdChiTietCCDC());
                ps.setString(3, entity.getTenVatTu());
                if (entity.getSoLuong() != null) {
                    ps.setInt(4, entity.getSoLuong());
                } else {
                    ps.setNull(4, java.sql.Types.INTEGER);
                }
                ps.setString(5, entity.getGhiChu());
                ps.setString(6, entity.getNgayCapNhat());
                ps.setString(7, entity.getNguoiCapNhat());
                ps.setBoolean(8, entity.getIsActive() != null ? entity.getIsActive() : true);
                ps.setString(9, entity.getIdNhomCCDC());
                ps.setString(9, entity.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    // ==================== Delete (soft) ====================
    /**
     * Xóa mềm theo IdKeHoachSuaChua (cập nhật IsActive = 0)
     */
    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    /**
     * Xóa mềm theo Id
     */
    public int deleteById(String id) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    /**
     * Xóa mềm hàng loạt theo danh sách Id
     */
    public int[] batchDelete(List<String> ids) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE Id = ?";
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
    public int hardDeleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE IdKeHoachSuaChua = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public int hardDeleteById(String id) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] hardBatchDelete(List<String> ids) {
        String sql = "DELETE FROM kehoachsuachua_vattu_tieuhao WHERE Id = ?";
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