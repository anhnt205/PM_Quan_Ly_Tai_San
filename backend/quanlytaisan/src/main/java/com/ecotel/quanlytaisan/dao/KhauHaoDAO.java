package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KhauHao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class KhauHaoDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<KhauHao> findAll() {
        String sql = "SELECT * FROM KhauHao";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KhauHao.class));
    }

    public List<KhauHao> findAllPaged(int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenKhauHao", "CongThuc", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM KhauHao ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KhauHao.class), size, offset);
    }

    public long countAll() {
        String sql = "SELECT COUNT(*) FROM KhauHao";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public KhauHao findById(String id) {
        String sql = "SELECT * FROM KhauHao WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KhauHao.class), id);
    }

    public int insert(KhauHao khauHao) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM KhauHao WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, khauHao.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(khauHao);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO KhauHao (Id, TenKhauHao, CongThuc, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    khauHao.getId(),
                    khauHao.getTenKhauHao(),
                    khauHao.getCongThuc(),
                    khauHao.getNgayTao(),
                    khauHao.getNgayCapNhat(),
                    khauHao.getNguoiTao(),
                    khauHao.getNguoiCapNhat()
            );
        }
    }

    public int update(KhauHao khauHao) {
        String sql = "UPDATE KhauHao SET TenKhauHao=?, CongThuc=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                khauHao.getTenKhauHao(),
                khauHao.getCongThuc(),
                khauHao.getNgayTao(),
                khauHao.getNgayCapNhat(),
                khauHao.getNguoiTao(),
                khauHao.getNguoiCapNhat(),
                khauHao.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM KhauHao WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}