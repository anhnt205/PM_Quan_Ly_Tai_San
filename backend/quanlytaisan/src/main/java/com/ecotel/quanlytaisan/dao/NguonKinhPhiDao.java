package com.ecotel.quanlytaisan.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.NguonKinhPhi;

@Repository
public class NguonKinhPhiDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NguonKinhPhi> findAll() {
        String sql = "SELECT * FROM NguonKinhPhi";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonKinhPhi.class));
    }

    public List<NguonKinhPhi> findAllPaged(int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "Ten", "Note"};
            for (String column : allowedColumns) {
                if (column.equalsIgnoreCase(sortBy)) {
                    orderBy = column;
                    break;
                }
            }
        }
        
        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = "DESC";
        }
        
        String sql = "SELECT * FROM NguonKinhPhi ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonKinhPhi.class), size, offset);
    }

    public long countAll() {
        String sql = "SELECT COUNT(*) FROM NguonKinhPhi";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public NguonKinhPhi findById(String id) {
        String sql = "SELECT * FROM NguonKinhPhi WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NguonKinhPhi.class), id);
    }

    public int insert(NguonKinhPhi obj) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NguonKinhPhi WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NguonKinhPhi (Id, Ten, Note) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(),
                    obj.getTen(),
                    obj.getNote());
        }
    }

    public int update(NguonKinhPhi obj) {
        String sql = "UPDATE NguonKinhPhi SET Ten=?, Note=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getTen(),
                obj.getNote(),
                obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM NguonKinhPhi WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
