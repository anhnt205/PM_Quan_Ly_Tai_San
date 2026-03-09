package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ChiTietSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietSuaChuaDTO> findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT 
                ct.Id,
                ct.IdSuaChua,
                ct.IdTaiSan,
                ts.TenTaiSan,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.DonViTinh,
                ct.SoLuong,
                ct.HienTrang,
                ct.MoTa,
                ct.GhiChu,
                ct.NgayTao,
                ct.NgayCapNhat,
                ct.NguoiTao,
                ct.NguoiCapNhat,
                ct.IsActive
            FROM ChiTietSuaChua ct
                INNER JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.IdSuaChua = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietSuaChuaDTO.class), idSuaChua);
    }

    public ChiTietSuaChuaDTO findById(String id) {
        String sql = """
            SELECT 
                ct.Id,
                ct.IdSuaChua,
                ct.IdTaiSan,
                ts.TenTaiSan,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.DonViTinh,
                ct.SoLuong,
                ct.HienTrang,
                ct.MoTa,
                ct.GhiChu,
                ct.NgayTao,
                ct.NgayCapNhat,
                ct.NguoiTao,
                ct.NguoiCapNhat,
                ct.IsActive
            FROM ChiTietSuaChua ct
                INNER JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.Id = ?
        """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietSuaChuaDTO.class), id);
    }

    public int insert(ChiTietSuaChua entity) {
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        entity.setIsActive(true);
        String sql = """
            INSERT INTO ChiTietSuaChua (Id, IdSuaChua, IdTaiSan, SoLuong, HienTrang, MoTa, GhiChu,
                                        NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getSoLuong(),
                entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(),
                entity.getNguoiCapNhat(), entity.getIsActive());
    }

    public void batchInsert(List<ChiTietSuaChua> list) {

        String sql = """
        INSERT INTO ChiTietSuaChua (
            Id, IdSuaChua, IdTaiSan, SoLuong, HienTrang, MoTa, GhiChu,
            NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            entity.setNgayTao(now);
            entity.setNgayCapNhat(now);

            if (entity.getIsActive() == null) {
                entity.setIsActive(true);
            }

            ps.setString(1, entity.getId());
            ps.setString(2, entity.getIdSuaChua());
            ps.setString(3, entity.getIdTaiSan());
            ps.setInt(4, entity.getSoLuong());
            ps.setString(5, entity.getHienTrang());
            ps.setString(6, entity.getMoTa());
            ps.setString(7, entity.getGhiChu());
            ps.setObject(8, entity.getNgayTao());
            ps.setObject(9, entity.getNgayCapNhat());
            ps.setString(10, entity.getNguoiTao());
            ps.setString(11, entity.getNguoiCapNhat());
            ps.setBoolean(12, entity.getIsActive());
        });
    }

    public int update(ChiTietSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE ChiTietSuaChua SET
                IdSuaChua = ?, IdTaiSan = ?, SoLuong = ?, HienTrang = ?, MoTa = ?, GhiChu = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getSoLuong(),
                entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayCapNhat(), entity.getNguoiCapNhat(), entity.getIsActive(),
                entity.getId());
    }

    public void batchUpdate(List<ChiTietSuaChua> list) {

        String sql = """
        UPDATE ChiTietSuaChua SET
            IdSuaChua = ?, IdTaiSan = ?, SoLuong = ?, HienTrang = ?, MoTa = ?, GhiChu = ?,
            NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?
        WHERE Id = ?
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getIdSuaChua());
            ps.setString(2, entity.getIdTaiSan());
            ps.setInt(3, entity.getSoLuong());
            ps.setString(4, entity.getHienTrang());
            ps.setString(5, entity.getMoTa());
            ps.setString(6, entity.getGhiChu());
            ps.setObject(7, entity.getNgayCapNhat());
            ps.setString(8, entity.getNguoiCapNhat());
            ps.setBoolean(9, entity.getIsActive());
            ps.setString(10, entity.getId());
        });
    }


    public int delete(String id) {
        String sql = "DELETE FROM ChiTietSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {

        if (ids == null || ids.isEmpty()) return;

        String inSql = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM ChiTietSuaChua WHERE Id IN (" + inSql + ")";

        jdbcTemplate.update(sql, ids.toArray());
    }

    public int deleteByIdSuaChua(String idSuaChua) {
        String sql = "DELETE FROM ChiTietSuaChua WHERE IdSuaChua = ?";
        return jdbcTemplate.update(sql, idSuaChua);
    }
}