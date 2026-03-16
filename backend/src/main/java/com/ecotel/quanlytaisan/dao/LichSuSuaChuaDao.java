package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.LichSuSuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;

@Repository
public class LichSuSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "LSSC-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM lichsu_suachua
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    public LichSuSuaChua findById(String id) {
        String sql = "SELECT * FROM lichsu_suachua WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(LichSuSuaChua.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public LichSuSuaChuaDTO findByIdDTO(String id) {
        String sql = """
            SELECT 
                ls.Id, ls.IdTaiSan, ts.TenTaiSan AS tenTaiSan,
                ls.NgayBatDau, ls.NgayKetThuc,
                ls.IdKetQuaSuaChua, kq.TenPhieu AS soPhieuSuaChua,
                ls.NgayTao, ls.NgayCapNhat
            FROM lichsu_suachua ls
            LEFT JOIN taisan ts ON ls.IdTaiSan = ts.Id
            LEFT JOIN ketquasuachua kq ON ls.IdKetQuaSuaChua = kq.Id
            WHERE ls.Id = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(LichSuSuaChuaDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<LichSuSuaChuaDTO> findByTaiSan(String idTaiSan) {
        String sql = """
            SELECT 
                ls.Id, ls.IdTaiSan, ts.TenTaiSan AS tenTaiSan,
                ls.NgayBatDau, ls.NgayKetThuc,
                ls.IdKetQuaSuaChua, kq.TenPhieu AS soPhieuSuaChua,
                ls.NgayTao, ls.NgayCapNhat
            FROM lichsu_suachua ls
            LEFT JOIN taisan ts ON ls.IdTaiSan = ts.Id
            LEFT JOIN ketquasuachua kq ON ls.IdKetQuaSuaChua = kq.Id
            WHERE ls.IdTaiSan = ?
            ORDER BY ls.NgayBatDau DESC
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LichSuSuaChuaDTO.class), idTaiSan);
    }

    public List<LichSuSuaChuaDTO> findByKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = """
            SELECT 
                ls.Id, ls.IdTaiSan, ts.TenTaiSan AS tenTaiSan,
                ls.NgayBatDau, ls.NgayKetThuc,
                ls.IdKetQuaSuaChua, kq.TenPhieu AS soPhieuSuaChua,
                ls.NgayTao, ls.NgayCapNhat
            FROM lichsu_suachua ls
            LEFT JOIN taisan ts ON ls.IdTaiSan = ts.Id
            LEFT JOIN ketquasuachua kq ON ls.IdKetQuaSuaChua = kq.Id
            WHERE ls.IdKetQuaSuaChua = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LichSuSuaChuaDTO.class), idKetQuaSuaChua);
    }

    public List<LichSuSuaChuaDTO> findAll() {
        String sql = """
            SELECT 
                ls.Id, ls.IdTaiSan, ts.TenTaiSan AS tenTaiSan,
                ls.NgayBatDau, ls.NgayKetThuc,
                ls.IdKetQuaSuaChua, kq.TenPhieu AS soPhieuSuaChua,
                ls.NgayTao, ls.NgayCapNhat
            FROM lichsu_suachua ls
            LEFT JOIN taisan ts ON ls.IdTaiSan = ts.Id
            LEFT JOIN ketquasuachua kq ON ls.IdKetQuaSuaChua = kq.Id
            ORDER BY ls.NgayBatDau DESC
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LichSuSuaChuaDTO.class));
    }

    public LichSuSuaChua insert(LichSuSuaChua entity) {
        entity.setId(generateNextId());
        String sql = """
            INSERT INTO lichsu_suachua (Id, IdTaiSan, NgayBatDau, NgayKetThuc, IdKetQuaSuaChua, NgayTao, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdTaiSan(),
                entity.getNgayBatDau(),
                entity.getNgayKetThuc(),
                entity.getIdKetQuaSuaChua(),
                entity.getNgayTao(),
                entity.getNgayCapNhat()
        );
        return entity;
    }

    public LichSuSuaChua update(LichSuSuaChua entity) {
        String sql = """
            UPDATE lichsu_suachua SET
                IdTaiSan = ?, NgayBatDau = ?, NgayKetThuc = ?,
                IdKetQuaSuaChua = ?, NgayTao = ?, NgayCapNhat = ?
            WHERE Id = ?
        """;
        jdbcTemplate.update(sql,
                entity.getIdTaiSan(),
                entity.getNgayBatDau(),
                entity.getNgayKetThuc(),
                entity.getIdKetQuaSuaChua(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getId()
        );
        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM lichsu_suachua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = "DELETE FROM lichsu_suachua WHERE IdKetQuaSuaChua = ?";
        return jdbcTemplate.update(sql, idKetQuaSuaChua);
    }
}