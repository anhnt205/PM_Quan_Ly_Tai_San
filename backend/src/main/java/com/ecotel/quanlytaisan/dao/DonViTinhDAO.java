package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DonViTinh;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
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

    public List<DonViTinh> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn - tránh SQL injection
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "tendonvi";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "dvt.Id";
                break;
            case "note":
                orderColumn = "dvt.Note";
                break;
            case "tendonvi":
            default:
                orderColumn = "dvt.TenDonVi";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause = """
                WHERE (
                    LOWER(dvt.Id) LIKE LOWER(?) OR
                    LOWER(dvt.TenDonVi) LIKE LOWER(?) OR
                    LOWER(dvt.Note) LIKE LOWER(?)
                )
                """;
        }

        String sql = """
            SELECT dvt.Id,
                   dvt.TenDonVi,
                   dvt.Note
            FROM DonViTinh AS dvt
            %s
            ORDER BY %s %s
            LIMIT ? OFFSET ?
            """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DonViTinh.class),
                    searchPattern, searchPattern, searchPattern,
                    limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DonViTinh.class),
                    limit, offset);
        }
    }

    /**
     * Đếm tổng số bản ghi
     */
    public long countAll(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM DonViTinh";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = """
                SELECT COUNT(*)
                FROM DonViTinh AS dvt
                WHERE (
                    LOWER(dvt.Id) LIKE LOWER(?) OR
                    LOWER(dvt.TenDonVi) LIKE LOWER(?) OR
                    LOWER(dvt.Note) LIKE LOWER(?)
                )
                """;
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class,
                    searchPattern, searchPattern, searchPattern);
        }
    }

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

    public int batchUpdate(List<DonViTinh> list) {
        String sql = "UPDATE DonViTinh SET TenDonVi=?, Note=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                DonViTinh dvt = list.get(i);
                ps.setString(1, dvt.getTenDonVi());
                ps.setString(2, dvt.getNote());
                ps.setString(3, dvt.getId());
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

    public int batchInsert(List<DonViTinh> list) {
        String sql = "INSERT INTO DonViTinh (Id, TenDonVi, Note) VALUES (?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                DonViTinh dvt = list.get(i);
                ps.setString(1, dvt.getId());
                ps.setString(2, dvt.getTenDonVi());
                ps.setString(3, dvt.getNote());
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

    public int batchCreate(List<DonViTinh> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (DonViTinh dvt : list) {
            if (dvt.getId() != null && !dvt.getId().trim().isEmpty()) {
                ids.add(dvt.getId());
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

        String checkSql = "SELECT Id FROM DonViTinh WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<DonViTinh> toInsert = new java.util.ArrayList<>();
        List<DonViTinh> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (DonViTinh dvt : list) {
            if (dvt.getId() == null || dvt.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(dvt.getId())) {
                toUpdate.add(dvt);
            } else {
                toInsert.add(dvt);
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
        String sql = "DELETE FROM DonViTinh WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM DonViTinh WHERE Id=?";
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



    public int deleteAll() {
        String sql = "DELETE FROM DonViTinh";
        return jdbcTemplate.update(sql);
    }




}
