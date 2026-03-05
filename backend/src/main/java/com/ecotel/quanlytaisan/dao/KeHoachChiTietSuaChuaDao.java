package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public class KeHoachChiTietSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String upper(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    public List<KeHoachChiTietSuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        String sql = """
        SELECT 
            ct.Id,
            ct.IdKeHoach,
            ct.IdTaiSan,
            ts.TenTaiSan AS tenTaiSan,
            ct.IdCCDC,
            c.Ten AS tenCCDC,
            ct.GhiChu,
            ct.NgayTao,
            ct.NgayCapNhat
        FROM KeHoachChiTietSuaChua ct
            LEFT JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            LEFT JOIN ccdcvattu c ON ct.IdCCDC = c.Id
        WHERE ct.IdKeHoach = ?
    """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachChiTietSuaChuaDTO.class), idKeHoach);
    }

    public KeHoachChiTietSuaChuaDTO findById(String id) {
        String sql = """
        SELECT 
            ct.Id,
            ct.IdKeHoach,
            ct.IdTaiSan,
            ts.TenTaiSan AS tenTaiSan,
            ct.IdCCDC,
            c.Ten AS tenCCDC,
            ct.GhiChu,
            ct.NgayTao,
            ct.NgayCapNhat
        FROM KeHoachChiTietSuaChua ct
            LEFT JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            LEFT JOIN ccdcvattu c ON ct.IdCCDC = c.Id
        WHERE ct.Id = ?
    """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachChiTietSuaChuaDTO.class), id);
    }

    public int insert(KeHoachChiTietSuaChua entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(UUID.randomUUID().toString());
        }
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        String sql = """
            INSERT INTO KeHoachChiTietSuaChua (
                   Id, IdKeHoach, IdTaiSan, IdCCDC, IdChiTietTaiSan, GhiChu, NgayTao, NgayCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdKeHoach(), entity.getIdTaiSan(), entity.getIdCCDC(),
                entity.getIdChiTietTaiSan(), entity.getGhiChu(), entity.getNgayTao(), entity.getNgayCapNhat()
        );
    }

    public void batchInsert(List<KeHoachChiTietSuaChua> list) {

        String sql = """
        INSERT INTO KeHoachChiTietSuaChua (
            Id, IdKeHoach, IdTaiSan, IdCCDC, IdChiTietTaiSan, GhiChu, NgayTao, NgayCapNhat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            if (entity.getId() == null || entity.getId().isBlank()) {
                entity.setId(UUID.randomUUID().toString());
            }

            entity.setIdKeHoach(upper(entity.getIdKeHoach()));
            entity.setIdTaiSan(upper(entity.getIdTaiSan()));
            entity.setIdCCDC(upper(entity.getIdCCDC()));
            entity.setIdChiTietTaiSan(upper(entity.getIdChiTietTaiSan()));
            entity.setNgayTao(now);
            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getId());
            ps.setString(2, entity.getIdKeHoach());
            ps.setString(3, entity.getIdTaiSan());
            ps.setString(4, entity.getIdCCDC());
            ps.setString(5, entity.getIdChiTietTaiSan());
            ps.setString(6, entity.getGhiChu());
            ps.setObject(7, entity.getNgayTao());
            ps.setObject(8, entity.getNgayCapNhat());
        });
    }

    public int update(KeHoachChiTietSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachChiTietSuaChua SET
                IdTaiSan = ?, IdCCDC = ?, IdChiTietTaiSan = ?, GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(), entity.getIdCCDC(), entity.getIdChiTietTaiSan(), entity.getGhiChu(),
                entity.getNgayCapNhat(), entity.getId()
        );
    }

    public void batchUpdate(List<KeHoachChiTietSuaChua> list) {

        String sql = """
        UPDATE KeHoachChiTietSuaChua SET
            IdTaiSan = ?, IdCCDC = ?, IdChiTietTaiSan = ?, GhiChu = ?, NgayCapNhat = ?
        WHERE Id = ?
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            entity.setIdTaiSan(upper(entity.getIdTaiSan()));
            entity.setIdCCDC(upper(entity.getIdCCDC()));
            entity.setNgayCapNhat(now);
            entity.setIdChiTietTaiSan(entity.getIdChiTietTaiSan());

            ps.setString(1, entity.getIdTaiSan());
            ps.setString(2, entity.getIdCCDC());
            ps.setString(3, entity.getIdChiTietTaiSan());
            ps.setString(4, entity.getGhiChu());
            ps.setObject(5, entity.getNgayCapNhat());
            ps.setString(6, entity.getId());
        });
    }


    public int delete(String id) {
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {

        if (ids == null || ids.isEmpty()) return;

        String inSql = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE Id IN (" + inSql + ")";

        jdbcTemplate.update(sql, ids.toArray());
    }


    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE IdKeHoach = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public void deleteByIdKeHoachIn(List<String> ids) {
        String inSql = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE IdKeHoach IN (" + inSql + ")";
        jdbcTemplate.update(sql, ids.toArray());
    }
}