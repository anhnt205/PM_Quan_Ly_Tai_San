package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PermissionDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<Permission> rowMapper = new RowMapper<Permission>() {
        @Override
        public Permission mapRow(ResultSet rs, int rowNum) throws SQLException {
            Permission permission = new Permission();
            permission.setId(rs.getString("Id"));
            permission.setPermissionName(rs.getString("PermissionName"));
            permission.setPermissionCode(rs.getString("PermissionCode"));
            permission.setDescription(rs.getString("Description"));
            permission.setIsActive(rs.getBoolean("IsActive"));
            return permission;
        }
    };

    public List<Permission> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "permissionname";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "p.Id";
                break;
            case "permissioncode":
                orderColumn = "p.PermissionCode";
                break;
            case "description":
                orderColumn = "p.Description";
                break;
            case "isactive":
                orderColumn = "p.IsActive";
                break;
            case "permissionname":
            default:
                orderColumn = "p.PermissionName";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause = """
                WHERE (
                    LOWER(p.Id) LIKE LOWER(?) OR
                    LOWER(p.PermissionName) LIKE LOWER(?) OR
                    LOWER(p.PermissionCode) LIKE LOWER(?) OR
                    LOWER(p.Description) LIKE LOWER(?)
                )
                """;
        }

        String sql = """
            SELECT p.Id,
                   p.PermissionName,
                   p.PermissionCode,
                   p.Description,
                   p.IsActive
            FROM Permission AS p
            %s
            ORDER BY %s %s
            LIMIT ? OFFSET ?
            """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Permission.class),
                    searchPattern, searchPattern, searchPattern, searchPattern,
                    limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Permission.class),
                    limit, offset);
        }
    }

    public long countAll(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM Permission";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = """
                SELECT COUNT(*)
                FROM Permission AS p
                WHERE (
                    LOWER(p.Id) LIKE LOWER(?) OR
                    LOWER(p.PermissionName) LIKE LOWER(?) OR
                    LOWER(p.PermissionCode) LIKE LOWER(?) OR
                    LOWER(p.Description) LIKE LOWER(?)
                )
                """;
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class,
                    searchPattern, searchPattern, searchPattern, searchPattern);
        }
    }

    public List<Permission> findAll() {
        String sql = "SELECT * FROM Permission";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Permission findById(String id) {
        String sql = "SELECT * FROM Permission WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }

    public Permission findByCode(String permissionCode) {
        String sql = "SELECT * FROM Permission WHERE PermissionCode = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, permissionCode);
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(Permission permission) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM Permission WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, permission.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(permission);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO Permission (Id, PermissionName, PermissionCode, Description, IsActive) VALUES (?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, permission.getId(), permission.getPermissionName(), 
                    permission.getPermissionCode(), permission.getDescription(), permission.getIsActive());
        }
    }

    public int update(Permission permission) {
        String sql = "UPDATE Permission SET PermissionName=?, PermissionCode=?, Description=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, permission.getPermissionName(), permission.getPermissionCode(), 
                permission.getDescription(), permission.getIsActive(), permission.getId());
    }

    public int delete(String id) {
        String sql = "UPDATE Permission SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<Permission> permissions) {
        String sql = "INSERT INTO Permission (Id, PermissionName, PermissionCode, Description, IsActive) VALUES (?, ?, ?, ?, ?)";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Permission permission = permissions.get(i);
                ps.setString(1, permission.getId());
                ps.setString(2, permission.getPermissionName());
                ps.setString(3, permission.getPermissionCode());
                ps.setString(4, permission.getDescription());
                ps.setBoolean(5, permission.getIsActive());
            }
            
            @Override
            public int getBatchSize() {
                return permissions.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<Permission> permissions) {
        String sql = "UPDATE Permission SET PermissionName=?, PermissionCode=?, Description=?, IsActive=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Permission permission = permissions.get(i);
                ps.setString(1, permission.getPermissionName());
                ps.setString(2, permission.getPermissionCode());
                ps.setString(3, permission.getDescription());
                ps.setBoolean(4, permission.getIsActive());
                ps.setString(5, permission.getId());
            }
            
            @Override
            public int getBatchSize() {
                return permissions.size();
            }
        });
        return results.length;
    }
}
