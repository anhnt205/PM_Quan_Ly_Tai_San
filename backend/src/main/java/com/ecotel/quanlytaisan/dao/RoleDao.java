package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class RoleDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<Role> rowMapper = new RowMapper<Role>() {
        @Override
        public Role mapRow(ResultSet rs, int rowNum) throws SQLException {
            Role role = new Role();
            role.setId(rs.getString("Id"));
            role.setRoleName(rs.getString("RoleName"));
            role.setRoleCode(rs.getString("RoleCode"));
            role.setDescription(rs.getString("Description"));
            role.setIsActive(rs.getBoolean("IsActive"));
            return role;
        }
    };

    public List<Role> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sắp xếp an toàn (tránh SQL injection)
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "rolename";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "r.Id";
                break;
            case "rolecode":
                orderColumn = "r.RoleCode";
                break;
            case "description":
                orderColumn = "r.Description";
                break;
            case "isactive":
                orderColumn = "r.IsActive";
                break;
            case "rolename":
            default:
                orderColumn = "r.RoleName";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause = """
                WHERE (
                    LOWER(r.Id) LIKE LOWER(?) OR
                    LOWER(r.RoleName) LIKE LOWER(?) OR
                    LOWER(r.RoleCode) LIKE LOWER(?) OR
                    LOWER(r.Description) LIKE LOWER(?)
                )
                """;
        }

        String sql = """
            SELECT r.Id,
                   r.RoleName,
                   r.RoleCode,
                   r.Description,
                   r.IsActive
            FROM Role AS r
            %s
            ORDER BY %s %s
            LIMIT ? OFFSET ?
            """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Role.class),
                    searchPattern, searchPattern, searchPattern, searchPattern,
                    limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Role.class),
                    limit, offset);
        }
    }

    public long countAll(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM Role";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = """
                SELECT COUNT(*)
                FROM Role AS r
                WHERE (
                    LOWER(r.Id) LIKE LOWER(?) OR
                    LOWER(r.RoleName) LIKE LOWER(?) OR
                    LOWER(r.RoleCode) LIKE LOWER(?) OR
                    LOWER(r.Description) LIKE LOWER(?)
                )
                """;
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class,
                    searchPattern, searchPattern, searchPattern, searchPattern);
        }
    }


    public List<Role> findAll() {
        String sql = "SELECT * FROM Role";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Role findById(String id) {
        String sql = "SELECT * FROM Role WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (Exception e) {
            return null;
        }
    }

    public Role findByCode(String roleCode) {
        String sql = "SELECT * FROM Role WHERE RoleCode = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, roleCode);
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(Role role) {
        // Kiểm tra id không null và không empty
        if (role.getId() == null || role.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM Role WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, role.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(role);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO Role (Id, RoleName, RoleCode, Description, IsActive) VALUES (?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, role.getId(), role.getRoleName(), 
                    role.getRoleCode(), role.getDescription(), role.getIsActive());
        }
    }

    public int update(Role role) {
        String sql = "UPDATE Role SET RoleName=?, RoleCode=?, Description=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, role.getRoleName(), role.getRoleCode(), 
                role.getDescription(), role.getIsActive(), role.getId());
    }

    public int delete(String id) {
        String sql = "UPDATE Role SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<Role> roles) {
        String sql = "INSERT INTO Role (Id, RoleName, RoleCode, Description, IsActive) VALUES (?, ?, ?, ?, ?)";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Role role = roles.get(i);
                ps.setString(1, role.getId());
                ps.setString(2, role.getRoleName());
                ps.setString(3, role.getRoleCode());
                ps.setString(4, role.getDescription());
                ps.setBoolean(5, role.getIsActive());
            }
            
            @Override
            public int getBatchSize() {
                return roles.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<Role> roles) {
        String sql = "UPDATE Role SET RoleName=?, RoleCode=?, Description=?, IsActive=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Role role = roles.get(i);
                ps.setString(1, role.getRoleName());
                ps.setString(2, role.getRoleCode());
                ps.setString(3, role.getDescription());
                ps.setBoolean(4, role.getIsActive());
                ps.setString(5, role.getId());
            }
            
            @Override
            public int getBatchSize() {
                return roles.size();
            }
        });
        return results.length;
    }
}
