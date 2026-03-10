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
                CASE 
                    WHEN ct.IdTaiSan IS NOT NULL AND ct.IdTaiSan <> '' THEN ts.TenTaiSan
                    WHEN ct.IdCCDC IS NOT NULL AND ct.IdCCDC <> '' THEN 
                        CONCAT(c.Ten, ' (', IFNULL(ctts.SoKyHieu, ''), ') - ', IFNULL(ctts.NamSanXuat, ''))
                    ELSE '' 
                END AS Ten,
                COALESCE(ts.DonViTinh, c.DonViTinh) AS DonViTinh,
                ct.IdCCDC,
                ct.IdChiTietCCDC,
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
                LEFT JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
                LEFT JOIN ccdcvattu c ON ct.IdCCDC = c.Id
                LEFT JOIN chitiettaisan ctts ON ct.IdChiTietCCDC = ctts.Id
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
                CASE 
                    WHEN ct.IdTaiSan IS NOT NULL AND ct.IdTaiSan <> '' THEN ts.TenTaiSan
                    WHEN ct.IdCCDC IS NOT NULL AND ct.IdCCDC <> '' THEN 
                        CONCAT(c.Ten, ' (', IFNULL(ctts.SoKyHieu, ''), ') - ', IFNULL(ctts.NamSanXuat, ''))
                    ELSE '' 
                END AS Ten,
                COALESCE(ts.DonViTinh, c.DonViTinh) AS DonViTinh,
                ct.IdCCDC,
                ct.IdChiTietCCDC,
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
                LEFT JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
                LEFT JOIN ccdcvattu c ON ct.IdCCDC = c.Id
                LEFT JOIN chitiettaisan ctts ON ct.IdChiTietCCDC = ctts.Id
            WHERE ct.Id = ?
        """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietSuaChuaDTO.class), id);
    }

    public int insert(ChiTietSuaChua entity) {
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        entity.setIsActive(true);
        String sql = """
            INSERT INTO ChiTietSuaChua (Id, IdSuaChua, IdTaiSan, IdCCDC, IdChiTietCCDC, SoLuong, HienTrang, MoTa, GhiChu,
                                        NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getIdCCDC(), entity.getIdChiTietCCDC(),
                entity.getSoLuong(), entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(),
                entity.getNguoiCapNhat(), entity.getIsActive());
    }

    public void batchInsert(List<ChiTietSuaChua> list) {

        String sql = """
        INSERT INTO ChiTietSuaChua (
            Id, IdSuaChua, IdTaiSan,IdCCDC, IdChiTietCCDC, SoLuong, HienTrang, MoTa, GhiChu,
            NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
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
            ps.setString(4, entity.getIdCCDC());
            ps.setString(5, entity.getIdChiTietCCDC());
            ps.setInt(6, entity.getSoLuong());
            ps.setString(7, entity.getHienTrang());
            ps.setString(8, entity.getMoTa());
            ps.setString(9, entity.getGhiChu());
            ps.setObject(10, entity.getNgayTao());
            ps.setObject(11, entity.getNgayCapNhat());
            ps.setString(12, entity.getNguoiTao());
            ps.setString(13, entity.getNguoiCapNhat());
            ps.setBoolean(14, entity.getIsActive());
        });
    }

    public int update(ChiTietSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE ChiTietSuaChua SET
                IdSuaChua = ?, IdTaiSan = ?, IdCCDC = ?, IdChiTietCCDC = ?, SoLuong = ?, HienTrang = ?, MoTa = ?, GhiChu = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getIdCCDC(), entity.getIdChiTietCCDC(),
                entity.getSoLuong(), entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayCapNhat(), entity.getNguoiCapNhat(), entity.getIsActive(),
                entity.getId());
    }

    public void batchUpdate(List<ChiTietSuaChua> list) {

        String sql = """
        UPDATE ChiTietSuaChua SET
            IdSuaChua = ?, IdTaiSan = ?, IdCCDC = ?, IdChiTietCCDC = ?, SoLuong = ?, HienTrang = ?, MoTa = ?, GhiChu = ?,
            NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?
        WHERE Id = ?
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getIdSuaChua());
            ps.setString(2, entity.getIdTaiSan());
            ps.setString(3, entity.getIdCCDC());
            ps.setString(4, entity.getIdChiTietCCDC());
            ps.setInt(5, entity.getSoLuong());
            ps.setString(6, entity.getHienTrang());
            ps.setString(7, entity.getMoTa());
            ps.setString(8, entity.getGhiChu());
            ps.setObject(9, entity.getNgayCapNhat());
            ps.setString(10, entity.getNguoiCapNhat());
            ps.setBoolean(11, entity.getIsActive());
            ps.setString(12, entity.getId());
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