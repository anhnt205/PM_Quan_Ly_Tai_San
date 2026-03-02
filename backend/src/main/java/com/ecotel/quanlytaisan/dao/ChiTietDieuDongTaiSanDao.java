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
