package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiCCDCCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LoaiCCDCConDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<LoaiCCDCCon> rowMapper = new RowMapper<LoaiCCDCCon>() {
        @Override
        public LoaiCCDCCon mapRow(ResultSet rs, int rowNum) throws SQLException {
            LoaiCCDCCon lccdc = new LoaiCCDCCon();
            lccdc.setId(rs.getString("Id"));
            lccdc.setIdLoaiCCDC(rs.getString("IdLoaiCCDC"));
            lccdc.setTenLoai(rs.getString("TenLoai"));
            return lccdc;
        }
    };

    public List<LoaiCCDCCon> findAll() {
        String sql = "SELECT * FROM LoaiCCDCCon";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public LoaiCCDCCon findById(String id) {
        String sql = "SELECT * FROM LoaiCCDCCon WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<LoaiCCDCCon> findByIdLoaiCCDC(String idLoaiCCDC) {
        String sql = "SELECT * FROM LoaiCCDCCon WHERE IdLoaiCCDC = ?";
        return jdbcTemplate.query(sql, rowMapper, idLoaiCCDC);
    }

    public int insert(LoaiCCDCCon lccdc) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM LoaiCCDCCon WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, lccdc.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(lccdc);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO LoaiCCDCCon (Id, IdLoaiCCDC, TenLoai) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, lccdc.getId(), lccdc.getIdLoaiCCDC(), lccdc.getTenLoai());
        }
    }

    public int update(LoaiCCDCCon lccdc) {
        String sql = "UPDATE LoaiCCDCCon SET IdLoaiCCDC=?, TenLoai=? WHERE Id=?";
        return jdbcTemplate.update(sql, lccdc.getIdLoaiCCDC(), lccdc.getTenLoai(), lccdc.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM LoaiCCDCCon WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
