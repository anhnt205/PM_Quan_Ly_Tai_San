package com.ecotel.quanlytaisan.dao;

import java.util.List;

import com.ecotel.quanlytaisan.model.NguonKinhPhi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.SetNguonKinhPhi;

@Repository
public class SetNguonKinhPhiDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<SetNguonKinhPhi> findAll() {
        String sql = "SELECT * FROM SetNguonKinhPhi";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class));
    }

    public List<SetNguonKinhPhi> findByTaiSanId(String idTaiSan) {
        String sql = "SELECT * FROM SetNguonKinhPhi WHERE IdTaiSan = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class), idTaiSan);
    }

    public List<SetNguonKinhPhi> findByNguonKinhPhiId(String idNguonKinhPhi) {
        String sql = "SELECT * FROM SetNguonKinhPhi WHERE IdNguonKinhPhi = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class), idNguonKinhPhi);
    }

    public SetNguonKinhPhi findById(String id) {
        String sql = "SELECT * FROM SetNguonKinhPhi WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class), id);
    }

    public int insert(SetNguonKinhPhi obj) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM SetNguonKinhPhi WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO SetNguonKinhPhi (Id, IdTaiSan, IdNguonKinhPhi, TenNguonKinhPhi) VALUES (?, ?, ?, ?)";
            return jdbcTemplate.update(sql, obj.getId(), obj.getIdTaiSan(), obj.getIdNguonKinhPhi(), obj.getTenNguonKinhPhi());
        }
    }

    public int update(SetNguonKinhPhi obj) {
        String sql = "UPDATE SetNguonKinhPhi SET IdTaiSan=?, IdNguonKinhPhi=?, TenNguonKinhPhi=? WHERE Id=?";
        return jdbcTemplate.update(sql, obj.getIdTaiSan(), obj.getIdNguonKinhPhi(), obj.getTenNguonKinhPhi(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM SetNguonKinhPhi WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByTaiSanId(String idTaiSan) {
        String sql = "DELETE FROM SetNguonKinhPhi WHERE IdTaiSan = ?";
        return jdbcTemplate.update(sql, idTaiSan);
    }

    public int deleteByNguonKinhPhiId(String idNguonKinhPhi) {
        String sql = "DELETE FROM SetNguonKinhPhi WHERE IdNguonKinhPhi = ?";
        return jdbcTemplate.update(sql, idNguonKinhPhi);
    }

    public List<NguonKinhPhi> getNguonKinhPhiByTaiSan(String idTaiSan) {
        String sql = "select nkp.Id,nkp.Ten,nkp.Note from SetNguonKinhPhi as snkp, NguonKinhPhi as nkp where IdTaiSan = ? and snkp.IdNguonKinhPhi=nkp.Id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonKinhPhi.class), idTaiSan);
    }

    public List<SetNguonKinhPhi> getSetNguonKinhPhiTaiSan(String idTaiSan) {
        String sql = "select Id, IdTaiSan, IdNguonKinhPhi, TenNguonKinhPhi  from SetNguonKinhPhi as snkp where snkp.IdTaiSan=?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class), idTaiSan);
    }

    public List<SetNguonKinhPhi> getSetNguonKinhPhiTaiSanIds(List<String> taiSanIds) {
        if (taiSanIds == null || taiSanIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String inSql = String.join(",", java.util.Collections.nCopies(taiSanIds.size(), "?"));
        String sql = String.format("select Id, IdTaiSan, IdNguonKinhPhi, TenNguonKinhPhi from SetNguonKinhPhi as snkp where snkp.IdTaiSan IN (%s)", inSql);
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SetNguonKinhPhi.class), taiSanIds.toArray());
    }

    public List<java.util.Map<String, Object>> getNguonKinhPhiWithTaiSanId(List<String> taiSanIds) {
        if (taiSanIds == null || taiSanIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String inSql = String.join(",", java.util.Collections.nCopies(taiSanIds.size(), "?"));
        String sql = String.format("select nkp.Id, nkp.Ten, nkp.Note, snkp.IdTaiSan from SetNguonKinhPhi as snkp, NguonKinhPhi as nkp where snkp.IdTaiSan IN (%s) and snkp.IdNguonKinhPhi=nkp.Id", inSql);
        return jdbcTemplate.queryForList(sql, taiSanIds.toArray());
    }
}
