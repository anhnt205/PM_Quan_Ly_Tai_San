package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class UserRoleDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<UserRole> rowMapper = new RowMapper<UserRole>() {
        @Override
        public UserRole mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserRole userRole = new UserRole();
            userRole.setId(rs.getString("Id"));
            userRole.setUserId(rs.getString("UserId"));
            userRole.setRoleId(rs.getString("RoleId"));
            userRole.setIsActive(rs.getBoolean("IsActive"));
            userRole.setCreatedDate(rs.getTimestamp("CreatedDate").toLocalDateTime());
            return userRole;
        }
    };

    public List<UserRole> findPagedByUserId(String userId, int offset, int limit, String sortBy, String sortDir, String keyword){
        // Xử lý SortBy
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "rolename";
        String orderColumn;
        switch (normalizedSortBy){
            case "rolecode":
                orderColumn = "r.RoleCode";
                break;
            case "isactive":
                orderColumn = "ur.IsActive";
                break;
            case "createddate":
                orderColumn = "ur.CreatedDate";
                break;
            case "rolename":
            default:
                orderColumn = "r.RoleName";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereKeyword = "";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereKeyword = """
                    AND (
                        LOWER(r.RoleName) LIKE LOWER(?) OR
                        LOWER(r.RoleCode) LIKE LOWER(?)
                    )""";
        }

        String sql = """
            SELECT ur.Id,
                   ur.UserId,
                   ur.RoleId,
                   ur.IsActive,
                   ur.CreatedDate,
                   r.RoleName
            FROM UserRole ur
            JOIN Role r ON ur.RoleId = r.Id
            WHERE ur.UserId = ? AND ur.IsActive = 1
            %s
            ORDER BY %s %s
            LIMIT ? OFFSET ?
            """.formatted(whereKeyword, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(UserRole.class),
                    userId, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(UserRole.class),
                    userId, limit, offset);
        }
    }

    public long countByUserId(String userId, String keyword){
        String whereKeyword = "";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereKeyword = """
                AND (
                    LOWER(r.RoleName) LIKE LOWER(?) OR
                    LOWER(r.RoleCode) LIKE LOWER(?)
                )
                """;
        }

        String sql = """
            SELECT COUNT(*)
            FROM UserRole ur
            JOIN Role r ON ur.RoleId = r.Id
            WHERE ur.UserId = ? AND ur.IsActive = 1
            %s
            """.formatted(whereKeyword);

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, userId, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, userId);
        }
    }

    private RowMapper<UserRole> rowMapperWithRoleName = new RowMapper<UserRole>() {
        @Override
        public UserRole mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserRole userRole = new UserRole();
            userRole.setId(rs.getString("Id"));
            userRole.setUserId(rs.getString("UserId"));
            userRole.setRoleId(rs.getString("RoleId"));
            userRole.setIsActive(rs.getBoolean("IsActive"));
            userRole.setCreatedDate(rs.getTimestamp("CreatedDate").toLocalDateTime());
            userRole.setRoleName(rs.getString("RoleName"));
            return userRole;
        }
    };

    public List<UserRole> findAll() {
        String sql = "SELECT ur.*, r.RoleName FROM UserRole ur " +
                    "JOIN Role r ON ur.RoleId = r.Id " +
                    "";
        return jdbcTemplate.query(sql, rowMapperWithRoleName);
    }

    public List<UserRole> findByUserId(String userId) {
        String sql = "SELECT ur.*, r.RoleName FROM UserRole ur " +
                    "JOIN Role r ON ur.RoleId = r.Id " +
                    "WHERE ur.UserId = ?";
        return jdbcTemplate.query(sql, rowMapperWithRoleName, userId);
    }

    public List<UserRole> findByRoleId(String roleId) {
        String sql = "SELECT ur.*, r.RoleName FROM UserRole ur " +
                    "JOIN Role r ON ur.RoleId = r.Id " +
                    "WHERE ur.RoleId = ?";
        return jdbcTemplate.query(sql, rowMapperWithRoleName, roleId);
    }

    public UserRole findByUserAndRole(String userId, String roleId) {
        String sql = "SELECT * FROM UserRole WHERE UserId = ? AND RoleId = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, userId, roleId);
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(UserRole userRole) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM UserRole WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, userRole.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(userRole);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO UserRole (Id, UserId, RoleId, IsActive, CreatedDate) VALUES (?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, userRole.getId(), userRole.getUserId(), 
                    userRole.getRoleId(), userRole.getIsActive(), userRole.getCreatedDate());
        }
    }

    public int update(UserRole userRole) {
        String sql = "UPDATE UserRole SET RoleId=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, userRole.getRoleId(), userRole.getIsActive(), userRole.getId());
    }

    public int delete(String id) {
        String sql = "UPDATE UserRole SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByUserId(String userId) {
        String sql = "UPDATE UserRole SET IsActive = 0 WHERE UserId = ?";
        return jdbcTemplate.update(sql, userId);
    }

    public int deleteByRoleId(String roleId) {
        String sql = "UPDATE UserRole SET IsActive = 0 WHERE RoleId = ?";
        return jdbcTemplate.update(sql, roleId);
    }
}
