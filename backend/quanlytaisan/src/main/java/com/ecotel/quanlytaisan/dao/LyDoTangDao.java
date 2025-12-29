package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LyDoTang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LyDoTangDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<LyDoTang> findAll() {
        String sql = "SELECT * FROM LyDoTang";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LyDoTang.class));
    }

    public LyDoTang findById(String id) {
        String sql = "SELECT * FROM LyDoTang WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(LyDoTang.class), id);
    }

    public int insert(LyDoTang lyDoTang) {
        // Kiểm tra id không null và không empty
        if (lyDoTang.getId() == null || lyDoTang.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM LyDoTang WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, lyDoTang.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(lyDoTang);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO LyDoTang (Id, Ten, TangGiam) VALUES (?, ?,?)";
            return jdbcTemplate.update(sql, lyDoTang.getId(), lyDoTang.getTen(), lyDoTang.getTangGiam());
        }
    }

    public int update(LyDoTang lyDoTang) {
        String sql = "UPDATE LyDoTang SET Ten=?, TangGiam=? WHERE Id=?";
        return jdbcTemplate.update(sql, lyDoTang.getTen(), lyDoTang.getTangGiam(), lyDoTang.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM LyDoTang WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<LyDoTang> lyDoTangs) {
        String sql = "INSERT INTO LyDoTang (Id, Ten, TangGiam) VALUES (?, ?,?) " +
                "ON DUPLICATE KEY UPDATE " +
                "Ten = VALUES(Ten)";

        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LyDoTang lyDoTang = lyDoTangs.get(i);
                ps.setString(1, lyDoTang.getId());
                ps.setString(2, lyDoTang.getTen());
                ps.setInt(3,lyDoTang.getTangGiam());
            }

            @Override
            public int getBatchSize() {
                return lyDoTangs.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<LyDoTang> lyDoTangs) {
        String sql = "UPDATE LyDoTang SET Ten=?, TangGiam=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LyDoTang lyDoTang = lyDoTangs.get(i);
                ps.setString(1, lyDoTang.getTen());
                ps.setString(2, lyDoTang.getId());
                ps.setInt(3,lyDoTang.getTangGiam());
            }

            @Override
            public int getBatchSize() {
                return lyDoTangs.size();
            }
        });
        return results.length;
    }

    public int deleteBatch(List<String> ids) {
        String sql = "DELETE FROM LyDoTang WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });
        return results.length;
    }
}
