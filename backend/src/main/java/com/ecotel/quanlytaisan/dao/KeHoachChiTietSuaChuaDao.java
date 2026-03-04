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
                Id, IdKeHoach, IdTaiSan, IdCCDC, GhiChu, NgayTao, NgayCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdKeHoach(), entity.getIdTaiSan(), entity.getIdCCDC(),
                entity.getGhiChu(), entity.getNgayTao(), entity.getNgayCapNhat()
        );
    }

    public int update(KeHoachChiTietSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachChiTietSuaChua SET
                IdTaiSan = ?, IdCCDC = ?, GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(), entity.getIdCCDC(), entity.getGhiChu(),
                entity.getNgayCapNhat(), entity.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM KeHoachChiTietSuaChua WHERE IdKeHoach = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public void deleteByIdKeHoachIn(List<String> ids) {
        String inSql = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM KeHoachCongViecSuaChua WHERE IdKeHoach IN (" + inSql + ")";
        jdbcTemplate.update(sql, ids.toArray());
    }
}