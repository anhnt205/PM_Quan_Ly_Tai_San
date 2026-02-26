package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiTaiSanCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class LoaiTaiSanConDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<LoaiTaiSanCon> findAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        // Xử lý sortBy an toàn
        String orderBy = "ltsc.Id"; // mặc định
        String[] allowedColumns = {"Id", "IdLoaiTs", "TenLoai"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowedColumns) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = "ltsc." + col;
                    break;
                }
            }
        }

        String direction = (sortDir != null && sortDir.trim().equalsIgnoreCase("desc")) ? "DESC" : "ASC";

        // Xây dựng SQL động với JOIN
        StringBuilder sql = new StringBuilder(
                "SELECT ltsc.*, lts.TenLoaiTaiSan as TenLoaiTs " +
                        "FROM LoaiTaiSanCon ltsc " +
                        "LEFT JOIN LoaiTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                        "WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (ltsc.Id LIKE ? OR ltsc.IdLoaiTs LIKE ? OR ltsc.TenLoai LIKE ? OR lts.TenLoaiTaiSan LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction)
                .append(" LIMIT ? OFFSET ?");

        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), rowMapperWithJoin, params.toArray());
    }

    public long countAll(String search) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(*) FROM LoaiTaiSanCon ltsc " +
                        "LEFT JOIN LoaiTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                        "WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (ltsc.Id LIKE ? OR ltsc.IdLoaiTs LIKE ? OR ltsc.TenLoai LIKE ? OR lts.TenLoaiTaiSan LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    // RowMapper với JOIN
    private RowMapper<LoaiTaiSanCon> rowMapperWithJoin = new RowMapper<LoaiTaiSanCon>() {
        @Override
        public LoaiTaiSanCon mapRow(ResultSet rs, int rowNum) throws SQLException {
            LoaiTaiSanCon ltsc = new LoaiTaiSanCon();
            ltsc.setId(rs.getString("Id"));
            ltsc.setIdLoaiTs(rs.getString("IdLoaiTs"));
            ltsc.setTenLoai(rs.getString("TenLoai"));
            ltsc.setTenLoaiTs(rs.getString("TenLoaiTs")); // Lấy tên từ bảng LoaiTaiSan
            return ltsc;
        }
    };

    // RowMapper không JOIN (dùng cho các method không cần tên loại tài sản)
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
        String sql = "SELECT ltsc.*, lts.TenLoaiTaiSan as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN LoaiTaiSan lts ON ltsc.IdLoaiTs = lts.Id";
        return jdbcTemplate.query(sql, rowMapperWithJoin);
    }


    public LoaiTaiSanCon findById(String id) {
        String sql = "SELECT ltsc.*, lts.TenLoaiTaiSan as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN LoaiTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                "WHERE ltsc.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapperWithJoin, id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<LoaiTaiSanCon> findByIdLoaiTs(String idLoaiTs) {
        String sql = "SELECT ltsc.*, lts.TenLoaiTaiSan as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN LoaiTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                "WHERE ltsc.IdLoaiTs = ?";
        return jdbcTemplate.query(sql, rowMapperWithJoin, idLoaiTs);
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