package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuaChuaChiTiet;
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
public class SuaChuaChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<SuaChuaChiTiet> findAll() {
        String sql = "SELECT * FROM suachua_chitiet";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTiet.class));
    }

    public SuaChuaChiTiet findById(String id) {
        String sql = "SELECT * FROM suachua_chitiet WHERE Id = ?";
        List<SuaChuaChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTiet.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<SuaChuaChiTiet> findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT 
                scct.*, ts.TenTaiSan, ts.IdNhomTaiSan as nhomTaiSan, kscctt.SoLuong, ksc.IdDonViGiao as donViQuanLy, ksc.IdDonViNhan as donViBaoTri,
                CASE sc.Thang
                    WHEN 1  THEN kscctt.CapSuaChuaThang1
                    WHEN 2  THEN kscctt.CapSuaChuaThang2
                    WHEN 3  THEN kscctt.CapSuaChuaThang3
                    WHEN 4  THEN kscctt.CapSuaChuaThang4
                    WHEN 5  THEN kscctt.CapSuaChuaThang5
                    WHEN 6  THEN kscctt.CapSuaChuaThang6
                    WHEN 7  THEN kscctt.CapSuaChuaThang7
                    WHEN 8  THEN kscctt.CapSuaChuaThang8
                    WHEN 9  THEN kscctt.CapSuaChuaThang9
                    WHEN 10 THEN kscctt.CapSuaChuaThang10
                    WHEN 11 THEN kscctt.CapSuaChuaThang11
                    WHEN 12 THEN kscctt.CapSuaChuaThang12
                END as capSuaChua
                FROM suachua_chitiet scct 
                LEFT JOIN suachua sc ON scct.IdSuaChua = sc.id
                LEFT JOIN taisan ts on scct.idTaiSan = ts.id 
                LEFT JOIN kehoachsuachua_chitiet_taisan kscctt on scct.idKeHoachChiTiet = kscctt.id 
                LEFT JOIN kehoachsuachua ksc ON kscctt.idKeHoachSuaChua = ksc.id
                WHERE scct.IdSuaChua = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaChiTiet.class), idSuaChua);
    }

    public String generateNextId() {
        return "SCCT_" + UUID.randomUUID().toString();
    }

    public int insert(SuaChuaChiTiet entity) {
        String sql = """
            INSERT INTO suachua_chitiet (
                Id, IdSuaChua, IdTaiSan, IdKeHoachChiTiet,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getIdKeHoachChiTiet(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(), entity.getNguoiCapNhat()
        );
    }
    
    public int[] batchInsert(List<SuaChuaChiTiet> list) {
        String sql = """
            INSERT INTO suachua_chitiet (
                Id, IdSuaChua, IdTaiSan, IdKeHoachChiTiet,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaChiTiet entity = list.get(i);
                ps.setString(1, entity.getId());
                ps.setString(2, entity.getIdSuaChua());
                ps.setString(3, entity.getIdTaiSan());
                ps.setString(4, entity.getIdKeHoachChiTiet());
                ps.setString(5, entity.getNgayTao());
                ps.setString(6, entity.getNgayCapNhat());
                ps.setString(7, entity.getNguoiTao());
                ps.setString(8, entity.getNguoiCapNhat());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int update(SuaChuaChiTiet entity) {
        String sql = """
            UPDATE suachua_chitiet SET
                IdTaiSan = ?, IdKeHoachChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(), entity.getIdKeHoachChiTiet(), entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(), entity.getId()
        );
    }

    public int deleteByIdSuaChua(String idSuaChua) {
        String sql = "DELETE FROM suachua_chitiet WHERE IdSuaChua = ?";
        return jdbcTemplate.update(sql, idSuaChua);
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM suachua_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int[] batchUpdate(List<SuaChuaChiTiet> list) {
        String sql = """
            UPDATE suachua_chitiet SET
                IdTaiSan = ?, IdKeHoachChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuaChuaChiTiet entity = list.get(i);
                ps.setString(1, entity.getIdTaiSan());
                ps.setString(2, entity.getIdKeHoachChiTiet());
                ps.setString(3, entity.getNgayCapNhat());
                ps.setString(4, entity.getNguoiCapNhat());
                ps.setString(5, entity.getId());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public void batchDelete(List<String> ids) {
        String sql = "DELETE FROM suachua_chitiet WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
