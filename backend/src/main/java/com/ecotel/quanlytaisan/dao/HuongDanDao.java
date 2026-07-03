package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.HuongDan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class HuongDanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<HuongDan> findAll() {
        String sql = "SELECT * FROM HuongDan";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(HuongDan.class));
    }

    public HuongDan findById(String id) {
        String sql = "SELECT * FROM HuongDan WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(HuongDan.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(HuongDan hd) {
        if (hd.getId() == null || hd.getId().trim().isEmpty()) {
            hd.setId(UUID.randomUUID().toString());
        }

        String checkSql = "SELECT COUNT(*) FROM HuongDan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, hd.getId());

        if (count > 0) {
            return update(hd);
        } else {
            String sql = "INSERT INTO HuongDan (Id, TenHuongDan, TaiLieu, NguoiTao, NgayTao) VALUES (?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, hd.getId(), hd.getTenHuongDan(), hd.getTaiLieu(), hd.getNguoiTao(), hd.getNgayTao());
        }
    }

    public int update(HuongDan hd) {
        String sql = "UPDATE HuongDan SET TenHuongDan = ?, TaiLieu = ?, NguoiTao = ?, NgayTao = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, hd.getTenHuongDan(), hd.getTaiLieu(), hd.getNguoiTao(), hd.getNgayTao(), hd.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM HuongDan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
