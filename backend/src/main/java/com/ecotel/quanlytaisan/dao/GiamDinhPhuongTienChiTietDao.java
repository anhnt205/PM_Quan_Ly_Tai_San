package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhPhuongTienChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Repository
public class GiamDinhPhuongTienChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String buildSelectSql() {
        return """
            SELECT gdct.*, cv.Ten AS tenVatTu, cv.DonViTinh AS donViTinh
            FROM giamdinh_phuongtien_chitiet gdct
                LEFT JOIN CCDCVatTu cv ON cv.Id = gdct.IdVatTu
            """;
    }

    public List<GiamDinhPhuongTienChiTiet> findAll() {
        String sql = buildSelectSql();
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhPhuongTienChiTiet.class));
    }

    public GiamDinhPhuongTienChiTiet findById(String id) {
        String sql = buildSelectSql() + " WHERE gdct.Id = ?";
        List<GiamDinhPhuongTienChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhPhuongTienChiTiet.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<GiamDinhPhuongTienChiTiet> findByIdGiamDinh(String idGiamDinhPhuongTien) {
        String sql = buildSelectSql() + " WHERE gdct.IdGiamDinhPhuongTien = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhPhuongTienChiTiet.class), idGiamDinhPhuongTien);
    }

    public String generateNextId() {
        return "GDPT_CT_" + UUID.randomUUID().toString();
    }

    public int insert(GiamDinhPhuongTienChiTiet entity) {
        String sql = """
            INSERT INTO giamdinh_phuongtien_chitiet (
                Id, IdGiamDinhPhuongTien, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        if (entity.getId() == null) entity.setId(generateNextId());
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdGiamDinhPhuongTien(),
                entity.getIdVatTu(), entity.getIdChiTietVatTu(),
                entity.getSoLuong(), entity.getTinhTrang(),
                entity.getSoLuongSuaChua() != null ? entity.getSoLuongSuaChua() : 0,
                entity.getSoLuongThayMoi() != null ? entity.getSoLuongThayMoi() : 0,
                entity.getGhiChu()
        );
    }

    public int[] batchInsert(List<GiamDinhPhuongTienChiTiet> list) {
        String sql = """
            INSERT INTO giamdinh_phuongtien_chitiet (
                Id, IdGiamDinhPhuongTien, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhPhuongTienChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(generateNextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdGiamDinhPhuongTien());
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

    public int update(GiamDinhPhuongTienChiTiet entity) {
        String sql = """
            UPDATE giamdinh_phuongtien_chitiet SET
                IdVatTu = ?, IdChiTietVatTu = ?, SoLuong = ?, TinhTrang = ?, SoLuongSuaChua = ?, SoLuongThayMoi = ?, GhiChu = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getIdVatTu(), entity.getIdChiTietVatTu(), entity.getSoLuong(), entity.getTinhTrang(),
                entity.getSoLuongSuaChua(), entity.getSoLuongThayMoi(), entity.getGhiChu(), entity.getId()
        );
    }

    public int deleteByIdGiamDinh(String idGiamDinhPhuongTien) {
        String sql = "DELETE FROM giamdinh_phuongtien_chitiet WHERE IdGiamDinhPhuongTien = ?";
        return jdbcTemplate.update(sql, idGiamDinhPhuongTien);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM giamdinh_phuongtien_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {
        String sql = "DELETE FROM giamdinh_phuongtien_chitiet WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
