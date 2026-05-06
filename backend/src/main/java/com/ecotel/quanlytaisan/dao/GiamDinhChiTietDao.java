package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhChiTiet;
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
public class GiamDinhChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<GiamDinhChiTiet> findAll() {
        String sql = "SELECT * FROM giamdinh_chitiet";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class));
    }

    public GiamDinhChiTiet findById(String id) {
        String sql = "SELECT * FROM giamdinh_chitiet WHERE Id = ?";
        List<GiamDinhChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<GiamDinhChiTiet> findByIdGiamDinh(String idGiamDinh) {
        String sql = "SELECT * FROM giamdinh_chitiet WHERE IdGiamDinh = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class), idGiamDinh);
    }

    public String generateNextId() {
        return "GDCT_" + UUID.randomUUID().toString();
    }

    public int insert(GiamDinhChiTiet entity) {
        String sql = """
            INSERT INTO giamdinh_chitiet (
                Id, IdGiamDinh, TinhTrang, SuaChua, ThayMoi, GhiChu,
                IdTaiSan, IdSuaChuaChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        if (entity.getId() == null) entity.setId(generateNextId());
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdGiamDinh(), entity.getTinhTrang(),
                entity.getSuaChua(), entity.getThayMoi(), entity.getGhiChu(),
                entity.getIdTaiSan(), entity.getIdSuaChuaChiTiet(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(), entity.getNguoiCapNhat()
        );
    }

    public int[] batchInsert(List<GiamDinhChiTiet> list) {
        String sql = """
            INSERT INTO giamdinh_chitiet (
                Id, IdGiamDinh, TinhTrang, SuaChua, ThayMoi, GhiChu,
                IdTaiSan, IdSuaChuaChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(generateNextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdGiamDinh());
                ps.setString(3, e.getTinhTrang());
                ps.setBoolean(4, e.getSuaChua() != null ? e.getSuaChua() : false);
                ps.setBoolean(5, e.getThayMoi() != null ? e.getThayMoi() : false);
                ps.setString(6, e.getGhiChu());
                ps.setString(7, e.getIdTaiSan());
                ps.setString(8, e.getIdSuaChuaChiTiet());
                ps.setString(9, e.getNgayTao());
                ps.setString(10, e.getNgayCapNhat());
                ps.setString(11, e.getNguoiTao());
                ps.setString(12, e.getNguoiCapNhat());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int update(GiamDinhChiTiet entity) {
        String sql = """
            UPDATE giamdinh_chitiet SET
                TinhTrang = ?, SuaChua = ?, ThayMoi = ?, GhiChu = ?,
                IdTaiSan = ?, IdSuaChuaChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getTinhTrang(), entity.getSuaChua(), entity.getThayMoi(), entity.getGhiChu(),
                entity.getIdTaiSan(), entity.getIdSuaChuaChiTiet(), entity.getNgayCapNhat(), entity.getNguoiCapNhat(),
                entity.getId()
        );
    }

    public int[] batchUpdate(List<GiamDinhChiTiet> list) {
        String sql = """
            UPDATE giamdinh_chitiet SET
                TinhTrang = ?, SuaChua = ?, ThayMoi = ?, GhiChu = ?,
                IdTaiSan = ?, IdSuaChuaChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhChiTiet e = list.get(i);
                ps.setString(1, e.getTinhTrang());
                ps.setBoolean(2, e.getSuaChua() != null ? e.getSuaChua() : false);
                ps.setBoolean(3, e.getThayMoi() != null ? e.getThayMoi() : false);
                ps.setString(4, e.getGhiChu());
                ps.setString(5, e.getIdTaiSan());
                ps.setString(6, e.getIdSuaChuaChiTiet());
                ps.setString(7, e.getNgayCapNhat());
                ps.setString(8, e.getNguoiCapNhat());
                ps.setString(9, e.getId());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int deleteByIdGiamDinh(String idGiamDinh) {
        String sql = "DELETE FROM giamdinh_chitiet WHERE IdGiamDinh = ?";
        return jdbcTemplate.update(sql, idGiamDinh);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM giamdinh_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {
        String sql = "DELETE FROM giamdinh_chitiet WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
