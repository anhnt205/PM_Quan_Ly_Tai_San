package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KiemTraSuCoChiTiet;
import com.ecotel.quanlytaisan.model.KiemTraSuCoVattu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
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
        List<KiemTraSuCoChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KiemTraSuCoChiTiet.class), idKiemTraSuCo);
        for (KiemTraSuCoChiTiet item : list) {
            item.setDanhSachVatTu(findVatTuByIdChiTietKiemTraSuCo(item.getId()));
        }
        return list;
    }

    public List<String> findIdKiemTraSuCoByIdTaiSan(String idTaiSan) {
        return jdbcTemplate.queryForList(
                "SELECT DISTINCT IdKiemTraSuCo FROM kiemtra_suco_chitiet WHERE IdTaiSan = ?",
                String.class, idTaiSan);
    }

    public void insertBatch(List<KiemTraSuCoChiTiet> list) {
        String sql = """
            INSERT INTO kiemtra_suco_chitiet (
                Id, IdKiemTraSuCo, IdTaiSan, IdSuCoChiTiet
            ) VALUES (?, ?, ?, ?)
            """;
        jdbcTemplate.batchUpdate(sql, list, 50, (ps, item) -> {
            if (item.getId() == null || item.getId().isEmpty()) {
                item.setId("KSCT_" + UUID.randomUUID().toString());
            }
            ps.setString(1, item.getId());
            ps.setString(2, item.getIdKiemTraSuCo());
            ps.setString(3, item.getIdTaiSan());
            ps.setString(4, item.getIdSuCoChiTiet());
        });

        // Batch insert materials
        List<KiemTraSuCoVattu> allVatTu = new ArrayList<>();
        for (KiemTraSuCoChiTiet detail : list) {
            if (detail.getDanhSachVatTu() != null && !detail.getDanhSachVatTu().isEmpty()) {
                for (KiemTraSuCoVattu vt : detail.getDanhSachVatTu()) {
                    vt.setIdChiTietKiemTraSuCo(detail.getId());
                    if (vt.getId() == null || vt.getId().isEmpty()) {
                        vt.setId("KSVT_" + UUID.randomUUID().toString());
                    }
                    allVatTu.add(vt);
                }
            }
        }
        if (!allVatTu.isEmpty()) {
            batchInsertVatTu(allVatTu);
        }
    }

    public int[] batchInsertVatTu(List<KiemTraSuCoVattu> list) {
        String sql = """
            INSERT INTO kiemtra_suco_vattu (
                Id, IdChiTietKiemTraSuCo, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                KiemTraSuCoVattu e = list.get(i);
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdChiTietKiemTraSuCo());
                ps.setString(3, e.getIdVatTu());
                ps.setString(4, e.getIdChiTietVatTu());
                ps.setObject(5, e.getSoLuong());
                ps.setString(6, e.getTinhTrang());
                ps.setObject(7, e.getSoLuongSuaChua() != null ? e.getSoLuongSuaChua() : 0);
                ps.setObject(8, e.getSoLuongThayMoi() != null ? e.getSoLuongThayMoi() : 0);
                ps.setString(9, e.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public List<KiemTraSuCoVattu> findVatTuByIdChiTietKiemTraSuCo(String idChiTietKiemTraSuCo) {
        String sql = """
            SELECT ksvt.*, cv2.Ten AS tenVatTu, cv2.DonVitinh as donViTinh
            FROM kiemtra_suco_vattu ksvt
                LEFT JOIN CCDCVatTu cv2 ON cv2.Id = ksvt.IdVatTu
            WHERE ksvt.IdChiTietKiemTraSuCo = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KiemTraSuCoVattu.class), idChiTietKiemTraSuCo);
    }

    public void deleteByIdKiemTraSuCo(String idKiemTraSuCo) {
        jdbcTemplate.update("DELETE FROM kiemtra_suco_chitiet WHERE IdKiemTraSuCo = ?", idKiemTraSuCo);
    }
}

