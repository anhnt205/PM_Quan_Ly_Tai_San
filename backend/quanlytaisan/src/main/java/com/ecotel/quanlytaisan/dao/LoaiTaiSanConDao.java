package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiTaiSanCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LoaiTaiSanConDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<LoaiTaiSanCon> rowMapper = new RowMapper<LoaiTaiSanCon>() {
        @Override
        public LoaiTaiSanCon mapRow(ResultSet rs, int rowNum) throws SQLException {
            LoaiTaiSanCon ltsc = new LoaiTaiSanCon();
            ltsc.setId(rs.getString("Id"));
            ltsc.setIdLoaiTs(rs.getString("IdLoaiTs"));
            ltsc.setTenLoai(rs.getString("TenLoai"));
            return ltsc;
        }
    };

    public List<LoaiTaiSanCon> findAll() {
        String sql = "SELECT * FROM LoaiTaiSanCon";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public LoaiTaiSanCon findById(String id) {
        String sql = "SELECT * FROM LoaiTaiSanCon WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<LoaiTaiSanCon> findByIdLoaiTs(String idLoaiTs) {
        String sql = "SELECT * FROM LoaiTaiSanCon WHERE IdLoaiTs = ?";
        return jdbcTemplate.query(sql, rowMapper, idLoaiTs);
    }

    public int insert(LoaiTaiSanCon ltsc) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM LoaiTaiSanCon WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, ltsc.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(ltsc);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO LoaiTaiSanCon (Id, IdLoaiTs, TenLoai) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, ltsc.getId(), ltsc.getIdLoaiTs(), ltsc.getTenLoai());
        }
    }

    public int update(LoaiTaiSanCon ltsc) {
        String sql = "UPDATE LoaiTaiSanCon SET IdLoaiTs=?, TenLoai=? WHERE Id=?";
        return jdbcTemplate.update(sql, ltsc.getIdLoaiTs(), ltsc.getTenLoai(), ltsc.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM LoaiTaiSanCon WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
