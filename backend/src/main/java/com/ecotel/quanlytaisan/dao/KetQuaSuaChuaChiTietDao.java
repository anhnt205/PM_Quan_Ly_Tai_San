package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTiet;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;

@Repository
public class KetQuaSuaChuaChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "KQCT-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM ketquasuachua_chitiet
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    public KetQuaSuaChuaChiTiet findById(String id) {
        String sql = "SELECT * FROM ketquasuachua_chitiet WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaChiTiet.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<KetQuaSuaChuaChiTietDTO> findByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = "SELECT kq.*,ts.TenTaiSan AS tenTaiSan FROM ketquasuachua_chitiet kq LEFT JOIN taisan ts ON kq.IdTaiSan = ts.Id WHERE kq.IdKetQuaSuaChua = ? AND (kq.IsActive IS NULL OR kq.IsActive = 1)";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaChiTietDTO.class), idKetQuaSuaChua);
    }

    public KetQuaSuaChuaChiTiet insert(KetQuaSuaChuaChiTiet entity) {
        entity.setId(generateNextId());
        String sql = """

        INSERT INTO ketquasuachua_chitiet (
            Id, IdKetQuaSuaChua, IdTaiSan, SoLuong,
            GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, hienTrang
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;
        jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKetQuaSuaChua(),
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() ? 1 : 0,
                entity.getHienTrang()

        );
        if (entity.getHienTrang() == null) entity.setHienTrang(0);
        return entity;
    }

    public KetQuaSuaChuaChiTiet update(KetQuaSuaChuaChiTiet entity) {
        String sql = """

        UPDATE ketquasuachua_chitiet SET
            IdKetQuaSuaChua = ?, IdTaiSan = ?, SoLuong = ?,
            GhiChu = ?, NgayTao = ?, NgayCapNhat = ?, NguoiTao = ?, NguoiCapNhat = ?, IsActive = ?, hienTrang = ?
        WHERE Id = ?
    """;
        jdbcTemplate.update(sql,
                entity.getIdKetQuaSuaChua(),
                entity.getIdTaiSan(),
                entity.getSoLuong(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() ? 1 : 0,
                entity.getHienTrang(),
                entity.getId()
        );
        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM ketquasuachua_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = "DELETE FROM ketquasuachua_chitiet WHERE IdKetQuaSuaChua = ?";
        return jdbcTemplate.update(sql, idKetQuaSuaChua);
    }

    public int softDelete(String id) {
        String sql = "UPDATE ketquasuachua_chitiet SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}