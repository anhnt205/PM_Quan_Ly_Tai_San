package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietDieuDongTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietDieuDongTaiSanDTO> findAll(String idDieuDongTaiSan) {
        String sql = """
                SELECT ctddts.Id,
                       ctddts.IdDieuDongTaiSan,
                       ddts.SoQuyetDinh,
                       ddts.TenPhieu,

                       ctddts.IdTaiSan,
                       ts.TenTaiSan,
                       ts.DonViTinh,
                       ts.KyHieu,
                       ts.NuocSanXuat,
                       ctddts.HienTrang,
                       ctddts.MoTa,

                       ctddts.SoLuong,
                       ctddts.GhiChu,

                       ctddts.NgayTao,
                       ctddts.NgayCapNhat,
                       ctddts.NguoiTao,
                       ctddts.NguoiCapNhat,
                       ctddts.IsActive,
                       ddts.DaBanGiao
                FROM ChiTietDieuDongTaiSan AS ctddts
                         INNER JOIN
                     DieuDongTaiSan AS ddts ON ctddts.IdDieuDongTaiSan = ddts.Id
                         INNER JOIN TaiSan AS ts
                                   ON ctddts.IdTaiSan = ts.Id
                WHERE ctddts.IdDieuDongTaiSan = ?
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongTaiSanDTO.class),idDieuDongTaiSan);
    }

    public ChiTietDieuDongTaiSanDTO findById(String id) {
        String sql = """
                SELECT
                    ctddts.Id,
                    ctddts.IdDieuDongTaiSan,
                    ddts.SoQuyetDinh,
                    ddts.TenPhieu,

                    ctddts.IdTaiSan,
                    ts.TenTaiSan,
                    ts.DonViTinh,
                    ts.KyHieu,
                    ts.NuocSanXuat,
                    ctddts.HienTrang,
                    ctddts.MoTa,

                    ctddts.SoLuong,
                    ctddts.GhiChu,

                    ctddts.NgayTao,
                    ctddts.NgayCapNhat,
                    ctddts.NguoiTao,
                    ctddts.NguoiCapNhat,
                    ctddts.IsActive,
                    ctddts.DaBanGiao
                FROM ChiTietDieuDongTaiSan AS ctddts
                         LEFT JOIN
                     DieuDongTaiSan AS ddts ON ctddts.IdDieuDongTaiSan = ddts.Id
                         LEFT JOIN TaiSan AS ts
                                   ON ctddts.IdTaiSan = ts.Id
                WHERE
                    ctddts.Id=?
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongTaiSanDTO.class),id);
    }

    public int insert(ChiTietDieuDongTaiSan obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietDieuDongTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert, mặc định DaBanGiao = false
            String sql = "INSERT INTO ChiTietDieuDongTaiSan (Id, IdDieuDongTaiSan, IdTaiSan, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, HienTrang, MoTa, DaBanGiao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, obj.getId(), obj.getIdDieuDongTaiSan(), obj.getIdTaiSan(), obj.getSoLuong(), obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getHienTrang(), obj.getMoTa(), false);
        }
    }

    public int update(ChiTietDieuDongTaiSan obj) {
        String sql = "UPDATE ChiTietDieuDongTaiSan SET IdDieuDongTaiSan=?, IdTaiSan=?, SoLuong=?, GhiChu=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, HienTrang=?, MoTa=? WHERE Id=?";
        return jdbcTemplate.update(sql, obj.getIdDieuDongTaiSan(), obj.getIdTaiSan(), obj.getSoLuong(), obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getHienTrang(), obj.getMoTa(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietDieuDongTaiSan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchInsert(List<ChiTietDieuDongTaiSan> list) {
        String sql = "INSERT INTO ChiTietDieuDongTaiSan (Id, IdDieuDongTaiSan, IdTaiSan, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, HienTrang, MoTa, DaBanGiao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ChiTietDieuDongTaiSan obj = list.get(i);
                ps.setString(1, obj.getId());
                ps.setString(2, obj.getIdDieuDongTaiSan());
                ps.setString(3, obj.getIdTaiSan());
                ps.setObject(4, obj.getSoLuong());
                ps.setString(5, obj.getGhiChu());
                ps.setString(6, obj.getNgayTao());
                ps.setString(7, obj.getNgayCapNhat());
                ps.setString(8, obj.getNguoiTao());
                ps.setString(9, obj.getNguoiCapNhat());
                ps.setObject(10, obj.getIsActive());
                ps.setString(11, obj.getHienTrang());
                ps.setString(12, obj.getMoTa());
                ps.setObject(13, false);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int[] batchUpdate(List<ChiTietDieuDongTaiSan> list) {
        String sql = "UPDATE ChiTietDieuDongTaiSan SET IdDieuDongTaiSan=?, IdTaiSan=?, SoLuong=?, GhiChu=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, HienTrang=?, MoTa=? WHERE Id=?";
        return jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ChiTietDieuDongTaiSan obj = list.get(i);
                ps.setString(1, obj.getIdDieuDongTaiSan());
                ps.setString(2, obj.getIdTaiSan());
                ps.setObject(3, obj.getSoLuong());
                ps.setString(4, obj.getGhiChu());
                ps.setString(5, obj.getNgayTao());
                ps.setString(6, obj.getNgayCapNhat());
                ps.setString(7, obj.getNguoiTao());
                ps.setString(8, obj.getNguoiCapNhat());
                ps.setObject(9, obj.getIsActive());
                ps.setString(10, obj.getHienTrang());
                ps.setString(11, obj.getMoTa());
                ps.setString(12, obj.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int[] batchDelete(List<String> ids) {
        String sql = "DELETE FROM ChiTietDieuDongTaiSan WHERE Id = ?";
        return jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });
    }

    /**
     * Cập nhật trạng thái DaBanGiao của chi tiết điều động tài sản
     */
    public int updateDaBanGiao(String id, Boolean daBanGiao) {
        String sql = "UPDATE ChiTietDieuDongTaiSan SET DaBanGiao = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, daBanGiao, id);
    }

    /**
     * Cập nhật DaBanGiao theo IdTaiSan và IdDieuDongTaiSan
     */
    public int updateDaBanGiaoByTaiSan(String idTaiSan, String idDieuDongTaiSan, Boolean daBanGiao) {
        String sql = "UPDATE ChiTietDieuDongTaiSan SET DaBanGiao = ? WHERE IdTaiSan = ? AND IdDieuDongTaiSan = ?";
        return jdbcTemplate.update(sql, daBanGiao, idTaiSan, idDieuDongTaiSan);
    }

    /**
     * Lấy Id chi tiết điều động theo IdTaiSan và IdDieuDongTaiSan
     */
    public String findIdByTaiSanAndDieuDong(String idTaiSan, String idDieuDongTaiSan) {
        String sql = "SELECT Id FROM ChiTietDieuDongTaiSan WHERE IdTaiSan = ? AND IdDieuDongTaiSan = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, idTaiSan, idDieuDongTaiSan);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Lấy danh sách chi tiết điều động CHƯA bàn giao.
     * Logic: DaBanGiao = false hoặc NULL
     */
    public List<ChiTietDieuDongTaiSanDTO> findAllChuaBanGiao(String idDieuDongTaiSan) {
        String sql = """
                SELECT ctddts.Id,
                       ctddts.IdDieuDongTaiSan,
                       ddts.SoQuyetDinh,
                       ddts.TenPhieu,

                       ctddts.IdTaiSan,
                       ts.TenTaiSan,
                       ts.DonViTinh,
                       ts.KyHieu,
                       ts.NuocSanXuat,
                       ctddts.HienTrang,
                       ctddts.MoTa,

                       ctddts.SoLuong,
                       ctddts.GhiChu,

                       ctddts.NgayTao,
                       ctddts.NgayCapNhat,
                       ctddts.NguoiTao,
                       ctddts.NguoiCapNhat,
                       ctddts.IsActive,
                       ctddts.DaBanGiao
                FROM ChiTietDieuDongTaiSan AS ctddts
                         INNER JOIN
                     DieuDongTaiSan AS ddts ON ctddts.IdDieuDongTaiSan = ddts.Id
                         INNER JOIN TaiSan AS ts
                                   ON ctddts.IdTaiSan = ts.Id
                WHERE ctddts.IdDieuDongTaiSan = ?
                  AND ctddts.IsActive = 1
                  AND (ctddts.DaBanGiao = 0 OR ctddts.DaBanGiao IS NULL)
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongTaiSanDTO.class), idDieuDongTaiSan);
    }
}
