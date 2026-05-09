package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KiemTraSuCoChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class KiemTraSuCoChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<KiemTraSuCoChiTiet> findByIdKiemTraSuCo(String idKiemTraSuCo) {
        String sql = """
            SELECT ct.*, ts.TenTaiSan, ts.DonViTinh
            FROM kiemtra_suco_chitiet ct
                LEFT JOIN taisan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.IdKiemTraSuCo = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KiemTraSuCoChiTiet.class), idKiemTraSuCo);
    }

    public void insertBatch(List<KiemTraSuCoChiTiet> list) {
        String sql = """
            INSERT INTO kiemtra_suco_chitiet (
                Id, IdKiemTraSuCo, IdTaiSan, IdSuCoChiTiet, CapBaoDuong,
                TinhTrang, SuaChua, ThayMoi, GhiChu, SoLuong
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.batchUpdate(sql, list, 50, (ps, item) -> {
            if (item.getId() == null || item.getId().isEmpty()) {
                item.setId(UUID.randomUUID().toString());
            }
            ps.setString(1, item.getId());
            ps.setString(2, item.getIdKiemTraSuCo());
            ps.setString(3, item.getIdTaiSan());
            ps.setString(4, item.getIdSuCoChiTiet());
            ps.setString(5, item.getCapBaoDuong());
            ps.setString(6, item.getTinhTrang());
            ps.setBoolean(7, item.getSuaChua());
            ps.setBoolean(8, item.getThayMoi());
            ps.setString(9, item.getGhiChu());
            ps.setInt(10, item.getSoLuong() != null ? item.getSoLuong() : 1);
        });
    }

    public void deleteByIdKiemTraSuCo(String idKiemTraSuCo) {
        jdbcTemplate.update("DELETE FROM kiemtra_suco_chitiet WHERE IdKiemTraSuCo = ?", idKiemTraSuCo);
    }
}
