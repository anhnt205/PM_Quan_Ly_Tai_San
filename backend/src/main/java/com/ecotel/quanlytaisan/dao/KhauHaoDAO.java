package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KhauHao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class KhauHaoDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<KhauHao> findAll() {
        String sql = "SELECT * FROM KhauHao";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KhauHao.class));
    }

    public List<KhauHao> findAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        // Xử lý sortBy an toàn
        String orderBy = "Id"; // mặc định
        String[] allowedColumns = {"Id", "TenKhauHao", "CongThuc", "NgayTao", "NgayCapNhat"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowedColumns) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = col;
                    break;
                }
            }
        }

        String direction = (sortDir != null && sortDir.trim().equalsIgnoreCase("desc")) ? "DESC" : "ASC";

        // Xây dựng SQL động
        StringBuilder sql = new StringBuilder("SELECT * FROM KhauHao WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (Id LIKE ? OR TenKhauHao LIKE ? OR CongThuc LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction)
                .append(" LIMIT ? OFFSET ?");

        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(KhauHao.class), params.toArray());
    }

    public long countAll(String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM KhauHao WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (Id LIKE ? OR TenKhauHao LIKE ? OR CongThuc LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
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