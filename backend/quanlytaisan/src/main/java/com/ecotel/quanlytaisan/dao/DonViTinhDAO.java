package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DonViTinh;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class DonViTinhDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<DonViTinh> rowMapper = new RowMapper<DonViTinh>() {
        @Override
        public DonViTinh mapRow(ResultSet rs, int rowNum) throws SQLException {
            DonViTinh dvt = new DonViTinh();
            dvt.setId(rs.getString("Id"));
            dvt.setTenDonVi(rs.getString("TenDonVi"));
            dvt.setNote(rs.getString("Note"));
            return dvt;
        }
    };

    public List<DonViTinh> findAll() {
        String sql = "SELECT * FROM DonViTinh";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public DonViTinh findById(String id) {
        String sql = "SELECT * FROM DonViTinh WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(DonViTinh dvt) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM DonViTinh WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, dvt.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(dvt);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO DonViTinh (Id, TenDonVi, Note) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, dvt.getId(), dvt.getTenDonVi(), dvt.getNote());
        }
    }

    public int update(DonViTinh dvt) {
        String sql = "UPDATE DonViTinh SET TenDonVi=?, Note=? WHERE Id=?";
        return jdbcTemplate.update(sql, dvt.getTenDonVi(), dvt.getNote(), dvt.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM DonViTinh WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
