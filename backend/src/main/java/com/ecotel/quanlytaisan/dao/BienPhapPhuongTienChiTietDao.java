package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.BienPhapPhuongTienChiTiet;
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
public class BienPhapPhuongTienChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String buildSelectSql() {
        return """
            SELECT ct.*, cv.Ten AS tenVatTu, cv.DonViTinh AS donViTinh
            FROM bienphap_phuongtien_chitiet ct
                LEFT JOIN CCDCVatTu cv ON cv.Id = ct.IdVatTu
            """;
    }

    public List<BienPhapPhuongTienChiTiet> findByIdBienPhap(String idBienPhap) {
        String sql = buildSelectSql() + " WHERE ct.IdBienPhap = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BienPhapPhuongTienChiTiet.class), idBienPhap);
    }

    public BienPhapPhuongTienChiTiet findById(String id) {
        String sql = buildSelectSql() + " WHERE ct.Id = ?";
        List<BienPhapPhuongTienChiTiet> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BienPhapPhuongTienChiTiet.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    private String nextId() { return "BPPTCT_" + UUID.randomUUID(); }

    public int insert(BienPhapPhuongTienChiTiet e) {
        if (e.getId() == null) e.setId(nextId());
        String sql = """
            INSERT INTO bienphap_phuongtien_chitiet
                (Id, IdBienPhap, IdVatTu, IdChiTietVatTu, SoLuongCap, SoLuongThuHoi, GhiChu)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getId(), e.getIdBienPhap(), e.getIdVatTu(), e.getIdChiTietVatTu(),
                e.getSoLuongCap() != null ? e.getSoLuongCap() : 0,
                e.getSoLuongThuHoi() != null ? e.getSoLuongThuHoi() : 0,
                e.getGhiChu()
        );
    }

    public int[] batchInsert(List<BienPhapPhuongTienChiTiet> list) {
        String sql = """
            INSERT INTO bienphap_phuongtien_chitiet
                (Id, IdBienPhap, IdVatTu, IdChiTietVatTu, SoLuongCap, SoLuongThuHoi, GhiChu)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                BienPhapPhuongTienChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(nextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdBienPhap());
                ps.setString(3, e.getIdVatTu());
                ps.setString(4, e.getIdChiTietVatTu());
                ps.setObject(5, e.getSoLuongCap() != null ? e.getSoLuongCap() : 0);
                ps.setObject(6, e.getSoLuongThuHoi() != null ? e.getSoLuongThuHoi() : 0);
                ps.setString(7, e.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int update(BienPhapPhuongTienChiTiet e) {
        String sql = """
            UPDATE bienphap_phuongtien_chitiet SET
                IdVatTu = ?, IdChiTietVatTu = ?, SoLuongCap = ?, SoLuongThuHoi = ?, GhiChu = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                e.getIdVatTu(), e.getIdChiTietVatTu(),
                e.getSoLuongCap(), e.getSoLuongThuHoi(), e.getGhiChu(),
                e.getId()
        );
    }

    public int deleteByIdBienPhap(String idBienPhap) {
        return jdbcTemplate.update("DELETE FROM bienphap_phuongtien_chitiet WHERE IdBienPhap = ?", idBienPhap);
    }

    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM bienphap_phuongtien_chitiet WHERE Id = ?", id);
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM bienphap_phuongtien_chitiet WHERE Id = ?",
                ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
