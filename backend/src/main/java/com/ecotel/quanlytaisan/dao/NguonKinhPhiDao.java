package com.ecotel.quanlytaisan.dao;

import java.util.ArrayList;
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

    public List<NguonKinhPhi> findAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        // Xử lý phân trang
        int offset = page * size;

        // Xử lý sortBy (chỉ cho phép các cột an toàn)
        String orderBy = "Id"; // mặc định
        String[] allowedColumns = {"Id", "Ten", "Note"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowedColumns) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = col;
                    break;
                }
            }
        }

        String direction = sortDir != null && sortDir.trim().equalsIgnoreCase("desc") ? "DESC" : "ASC";

        // Xử lý tìm kiếm
        StringBuilder sql = new StringBuilder("SELECT * FROM NguonKinhPhi");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" WHERE (Id LIKE ? OR Ten LIKE ? OR Note LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        // Thêm ORDER BY và LIMIT
        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction)
                .append(" LIMIT ? OFFSET ?");

        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(),
                new BeanPropertyRowMapper<>(NguonKinhPhi.class),
                params.toArray());
    }

    public long countAll(String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM NguonKinhPhi");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" WHERE (Id LIKE ? OR Ten LIKE ? OR Note LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public long countAll() {
        String sql = "SELECT COUNT(*) FROM NguonKinhPhi";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public NguonKinhPhi findById(String id) {
        String sql = "SELECT * FROM NguonKinhPhi WHERE Id = ?";

        List<NguonKinhPhi> results = jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(NguonKinhPhi.class),
                id
        );

        if (results.isEmpty()) {
            return null;  // ← quan trọng: trả về null khi không tìm thấy
            // Hoặc nếu bạn muốn ném exception có ý nghĩa hơn:
            // throw new EntityNotFoundException("Không tìm thấy nguồn kinh phí với ID: " + id);
        }

        if (results.size() > 1) {
            // Trường hợp bất thường (vi phạm ràng buộc PK)
            throw new IllegalStateException(
                    "Tìm thấy nhiều hơn 1 bản ghi nguồn kinh phí với cùng ID: " + id
            );
        }

        return results.get(0);
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
