package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;

@Repository
public class ChiTietLichSuSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "CTLS-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM chitiet_lichsu_suachua
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    public ChiTietLichSuSuaChua findById(String id) {
        String sql = "SELECT * FROM chitiet_lichsu_suachua WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietLichSuSuaChua.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<ChiTietLichSuSuaChuaDTO> findByIdLichSu(String idLichSuSuaChua) {
        String sql = """
            SELECT 
                ct.Id, ct.IdLichSuSuaChua,
                ct.IdCCDC, cc.MaCCDC AS maCCDC, cc.TenCCDC AS tenCCDC,
                ct.IdChiTietCCDC, ctts.TenChiTiet AS tenChiTietCCDC,
                ct.DonGia, ct.SoLuong,
                (ct.DonGia * ct.SoLuong) AS thanhTien
            FROM chitiet_lichsu_suachua ct
            LEFT JOIN ccdcvattu cc ON ct.IdCCDC = cc.Id
            LEFT JOIN chitiettaisan ctts ON ct.IdChiTietCCDC = ctts.Id
            WHERE ct.IdLichSuSuaChua = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietLichSuSuaChuaDTO.class), idLichSuSuaChua);
    }

    public ChiTietLichSuSuaChua insert(ChiTietLichSuSuaChua entity) {
        entity.setId(generateNextId());
        String sql = """
            INSERT INTO chitiet_lichsu_suachua (Id, IdLichSuSuaChua, IdCCDC, IdChiTietCCDC, DonGia, SoLuong)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdLichSuSuaChua(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getDonGia(),
                entity.getSoLuong()
        );
        return entity;
    }

    public ChiTietLichSuSuaChua update(ChiTietLichSuSuaChua entity) {
        String sql = """
            UPDATE chitiet_lichsu_suachua SET
                IdLichSuSuaChua = ?, IdCCDC = ?, IdChiTietCCDC = ?, DonGia = ?, SoLuong = ?
            WHERE Id = ?
        """;
        jdbcTemplate.update(sql,
                entity.getIdLichSuSuaChua(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getDonGia(),
                entity.getSoLuong(),
                entity.getId()
        );
        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM chitiet_lichsu_suachua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdLichSu(String idLichSuSuaChua) {
        String sql = "DELETE FROM chitiet_lichsu_suachua WHERE IdLichSuSuaChua = ?";
        return jdbcTemplate.update(sql, idLichSuSuaChua);
    }
}