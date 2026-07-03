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
                "SELECT ltsc.*, lts.TenNhom as TenLoaiTs " +
                        "FROM LoaiTaiSanCon ltsc " +
                        "LEFT JOIN NhomTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                        "WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (ltsc.Id LIKE ? OR ltsc.IdLoaiTs LIKE ? OR ltsc.TenLoai LIKE ? OR lts.TenNhom LIKE ?)");
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
                        "LEFT JOIN NhomTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                        "WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (ltsc.Id LIKE ? OR ltsc.IdLoaiTs LIKE ? OR ltsc.TenLoai LIKE ? OR lts.TenNhom LIKE ?)");
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
        String sql = "SELECT ltsc.*, lts.TenNhom as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN NhomTaiSan lts ON ltsc.IdLoaiTs = lts.Id";
        return jdbcTemplate.query(sql, rowMapperWithJoin);
    }


    public LoaiTaiSanCon findById(String id) {
        String sql = "SELECT ltsc.*, lts.TenNhom as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN NhomTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
                "WHERE ltsc.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapperWithJoin, id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<LoaiTaiSanCon> findByIdLoaiTs(String idLoaiTs) {
        String sql = "SELECT ltsc.*, lts.TenNhom as TenLoaiTs " +
                "FROM LoaiTaiSanCon ltsc " +
                "LEFT JOIN NhomTaiSan lts ON ltsc.IdLoaiTs = lts.Id " +
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

    public int batchUpdate(List<LoaiTaiSanCon> list) {
        String sql = "UPDATE LoaiTaiSanCon SET IdLoaiTs=?, TenLoai=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                LoaiTaiSanCon ltsc = list.get(i);
                ps.setString(1, ltsc.getIdLoaiTs());
                ps.setString(2, ltsc.getTenLoai());
                ps.setString(3, ltsc.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchInsert(List<LoaiTaiSanCon> list) {
        String sql = "INSERT INTO LoaiTaiSanCon (Id, IdLoaiTs, TenLoai) VALUES (?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                LoaiTaiSanCon ltsc = list.get(i);
                ps.setString(1, ltsc.getId());
                ps.setString(2, ltsc.getIdLoaiTs());
                ps.setString(3, ltsc.getTenLoai());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchCreate(List<LoaiTaiSanCon> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (LoaiTaiSanCon ltsc : list) {
            if (ltsc.getId() != null && !ltsc.getId().trim().isEmpty()) {
                ids.add(ltsc.getId());
            }
        }

        if (ids.isEmpty()) {
            return 0;
        }

        StringBuilder inBuilder = new StringBuilder();
        for (int i = 0; i < ids.size(); i++) {
            inBuilder.append("?");
            if (i < ids.size() - 1) {
                inBuilder.append(",");
            }
        }

        String checkSql = "SELECT Id FROM LoaiTaiSanCon WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<LoaiTaiSanCon> toInsert = new java.util.ArrayList<>();
        List<LoaiTaiSanCon> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (LoaiTaiSanCon ltsc : list) {
            if (ltsc.getId() == null || ltsc.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(ltsc.getId())) {
                toUpdate.add(ltsc);
            } else {
                toInsert.add(ltsc);
            }
        }

        int total = 0;
        if (!toInsert.isEmpty()) {
            total += batchInsert(toInsert);
        }
        if (!toUpdate.isEmpty()) {
            total += batchUpdate(toUpdate);
        }

        return total;
    }

    public int delete(String id) {
        String sql = "DELETE FROM LoaiTaiSanCon WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM LoaiTaiSanCon WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }
}