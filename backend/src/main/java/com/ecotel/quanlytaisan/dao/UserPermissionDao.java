package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.UserPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserPermissionDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<UserPermission> getUserPermissionsPaged(String userId, int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Lấy toàn bộ quyền trước (merge role + direct)
        List<UserPermission> allPermissions = getUserPermissions(userId);

        // Tìm kiếm ở mức Java (vì danh sách thường < 500 permission)
        List<UserPermission> filtered = allPermissions.stream()
                .filter(p -> {
                    if (keyword == null || keyword.trim().isEmpty()) return true;
                    String lowerKeyword = keyword.toLowerCase();
                    return p.getPermissionName().toLowerCase().contains(lowerKeyword) ||
                            p.getPermissionCode().toLowerCase().contains(lowerKeyword);
                })
                .sorted((p1, p2) -> {
                    int compare = 0;
                    String dir = sortDir != null && sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC";

                    String column = sortBy != null ? sortBy.toLowerCase() : "permissionname";
                    switch (column) {
                        case "permissioncode":
                            compare = p1.getPermissionCode().compareToIgnoreCase(p2.getPermissionCode());
                            break;
                        case "permissionname":
                        default:
                            compare = p1.getPermissionName().compareToIgnoreCase(p2.getPermissionName());
                            break;
                    }
                    return "DESC".equalsIgnoreCase(dir) ? -compare : compare;
                })
                .skip(offset)
                .limit(limit)
                .toList();

        return filtered;
    }

    public long countUserPermissions(String userId, String keyword) {
        List<UserPermission> all = getUserPermissions(userId);
        if (keyword == null || keyword.trim().isEmpty()) {
            return all.size();
        }
        String lowerKeyword = keyword.toLowerCase();
        return all.stream()
                .filter(p -> p.getPermissionName().toLowerCase().contains(lowerKeyword) ||
                        p.getPermissionCode().toLowerCase().contains(lowerKeyword))
                .count();
    }

    private RowMapper<UserPermission> rowMapper = new RowMapper<UserPermission>() {
        @Override
        public UserPermission mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserPermission userPermission = new UserPermission();
            userPermission.setUserId(rs.getString("UserId"));
            userPermission.setPermissionCode(rs.getString("PermissionCode"));
            userPermission.setCanCreate(rs.getBoolean("CanCreate"));
            userPermission.setCanRead(rs.getBoolean("CanRead"));
            userPermission.setCanUpdate(rs.getBoolean("CanUpdate"));
            userPermission.setCanDelete(rs.getBoolean("CanDelete"));
            userPermission.setPermissionName(rs.getString("PermissionName"));
            return userPermission;
        }
    };

    public List<UserPermission> getUserPermissions(String userId) {
        // Lấy quyền trực tiếp từ UserPermission
        String directSql = "SELECT up.UserId, p.PermissionCode, up.CanCreate, up.CanRead, up.CanUpdate, up.CanDelete, p.PermissionName " +
                          "FROM UserPermission up " +
                          "JOIN Permission p ON up.PermissionId = p.Id " +
                          "WHERE up.UserId = ?";
        
        // Lấy quyền từ RolePermission thông qua UserRole
        String roleSql = "SELECT ur.UserId, p.PermissionCode, rp.CanCreate, rp.CanRead, rp.CanUpdate, rp.CanDelete, p.PermissionName " +
                        "FROM UserRole ur " +
                        "JOIN RolePermission rp ON ur.RoleId = rp.RoleId " +
                        "JOIN Permission p ON rp.PermissionId = p.Id " +
                        "WHERE ur.UserId = ?";
        
        // Kết hợp cả hai kết quả
        List<UserPermission> directPermissions = jdbcTemplate.query(directSql, rowMapper, userId);
        List<UserPermission> rolePermissions = jdbcTemplate.query(roleSql, rowMapper, userId);
        
        // Merge permissions (quyền trực tiếp sẽ override quyền từ role)
        Map<String, UserPermission> permissionMap = new HashMap<>();
        
        // Thêm quyền từ role trước
        for (UserPermission rolePerm : rolePermissions) {
            permissionMap.put(rolePerm.getPermissionCode(), rolePerm);
        }
        
        // Override với quyền trực tiếp
        for (UserPermission directPerm : directPermissions) {
            permissionMap.put(directPerm.getPermissionCode(), directPerm);
        }
        
        return new ArrayList<>(permissionMap.values());
    }

    public List<UserPermission> getUserPermissionsByCode(String userId, String permissionCode) {
        String sql = "SELECT ur.UserId, p.PermissionCode, rp.CanCreate, rp.CanRead, rp.CanUpdate, rp.CanDelete, p.PermissionName " +
                    "FROM UserRole ur " +
                    "JOIN RolePermission rp ON ur.RoleId = rp.RoleId " +
                    "JOIN Permission p ON rp.PermissionId = p.Id " +
                    "WHERE ur.UserId = ? AND p.PermissionCode = ?";
        return jdbcTemplate.query(sql, rowMapper, userId, permissionCode);
    }

    public boolean hasPermission(String userId, String permissionCode, String action) {
        // Kiểm tra quyền từ UserPermission trực tiếp
        String directSql = "SELECT COUNT(*) FROM UserPermission up " +
                          "JOIN Permission p ON up.PermissionId = p.Id " +
                          "WHERE up.UserId = ? AND p.PermissionCode = ? " +
                          "AND (" + action + " = 1)";
        Integer directCount = jdbcTemplate.queryForObject(directSql, Integer.class, userId, permissionCode);
        
        // Kiểm tra quyền từ RolePermission thông qua UserRole
        String roleSql = "SELECT COUNT(*) FROM UserRole ur " +
                        "JOIN RolePermission rp ON ur.RoleId = rp.RoleId " +
                        "JOIN Permission p ON rp.PermissionId = p.Id " +
                        "WHERE ur.UserId = ? AND p.PermissionCode = ? " +
                        "AND (" + action + " = 1)";
        Integer roleCount = jdbcTemplate.queryForObject(roleSql, Integer.class, userId, permissionCode);
        
        return (directCount != null && directCount > 0) || (roleCount != null && roleCount > 0);
    }

    public int setUserPermission(UserPermission userPermission) {
        // Lấy PermissionId từ PermissionCode
        String permissionIdSql = "SELECT Id FROM Permission WHERE PermissionCode = ?";
        String permissionId;
        try {
            permissionId = jdbcTemplate.queryForObject(permissionIdSql, String.class, userPermission.getPermissionCode());
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            System.err.println("Warning: Permission code '" + userPermission.getPermissionCode() + "' does not exist in DB. Skipping.");
            return 0;
        }
        
        if (permissionId == null) {
            throw new RuntimeException("Permission code không tồn tại: " + userPermission.getPermissionCode());
        }
        
        // Kiểm tra xem đã có quyền này chưa
        String checkSql = "SELECT COUNT(*) FROM UserPermission WHERE UserId = ? AND PermissionId = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userPermission.getUserId(), permissionId);
        
        if (count != null && count > 0) {
            // Cập nhật quyền hiện có
            String updateSql = "UPDATE UserPermission SET CanCreate = ?, CanRead = ?, CanUpdate = ?, CanDelete = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE UserId = ? AND PermissionId = ?";
            return jdbcTemplate.update(updateSql, 
                userPermission.getCanCreate(), 
                userPermission.getCanRead(), 
                userPermission.getCanUpdate(), 
                userPermission.getCanDelete(),
                userPermission.getUserId(), 
                permissionId);
        } else {
            // Tạo quyền mới
            String insertSql = "INSERT INTO UserPermission (Id, UserId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete, CreatedDate, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 1)";
            String id = java.util.UUID.randomUUID().toString();
            return jdbcTemplate.update(insertSql, 
                id,
                userPermission.getUserId(), 
                permissionId,
                userPermission.getCanCreate(), 
                userPermission.getCanRead(), 
                userPermission.getCanUpdate(), 
                userPermission.getCanDelete());
        }
    }

    public int updateUserPermission(UserPermission userPermission) {
        // Lấy PermissionId từ PermissionCode
        String permissionIdSql = "SELECT Id FROM Permission WHERE PermissionCode = ?";
        String permissionId = jdbcTemplate.queryForObject(permissionIdSql, String.class, userPermission.getPermissionCode());
        
        if (permissionId == null) {
            throw new RuntimeException("Permission code không tồn tại: " + userPermission.getPermissionCode());
        }
        
        String sql = "UPDATE UserPermission SET CanCreate = ?, CanRead = ?, CanUpdate = ?, CanDelete = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE UserId = ? AND PermissionId = ?";
        return jdbcTemplate.update(sql, 
            userPermission.getCanCreate(), 
            userPermission.getCanRead(), 
            userPermission.getCanUpdate(), 
            userPermission.getCanDelete(),
            userPermission.getUserId(), 
            permissionId);
    }

    public int removeUserPermission(String userId, String permissionCode) {
        // Lấy PermissionId từ PermissionCode
        String permissionIdSql = "SELECT Id FROM Permission WHERE PermissionCode = ?";
        String permissionId = jdbcTemplate.queryForObject(permissionIdSql, String.class, permissionCode);
        
        if (permissionId == null) {
            throw new RuntimeException("Permission code không tồn tại: " + permissionCode);
        }
        
        String sql = "DELETE FROM UserPermission WHERE UserId = ? AND PermissionId = ?";
        return jdbcTemplate.update(sql, userId, permissionId);
    }

    public int setUserPermissionsBatch(List<UserPermission> userPermissions) {
        int totalProcessed = 0;
        
        for (UserPermission userPermission : userPermissions) {
            try {
                int result = setUserPermission(userPermission);
                totalProcessed += result;
            } catch (Exception e) {
                // Log error but continue with other permissions
                System.err.println("Error setting permission for user " + userPermission.getUserId() + 
                                 " and permission " + userPermission.getPermissionCode() + ": " + e.getMessage());
            }
        }
        
        return totalProcessed;
    }

    public int updateUserPermissionsBatch(List<UserPermission> userPermissions) {
        String sql = "UPDATE UserPermission SET CanCreate = ?, CanRead = ?, CanUpdate = ?, CanDelete = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE UserId = ? AND PermissionId = ?";
        
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                UserPermission userPermission = userPermissions.get(i);
                
                // Lấy PermissionId từ PermissionCode
                String permissionIdSql = "SELECT Id FROM Permission WHERE PermissionCode = ?";
                String permissionId = jdbcTemplate.queryForObject(permissionIdSql, String.class, userPermission.getPermissionCode());
                
                if (permissionId == null) {
                    throw new RuntimeException("Permission code không tồn tại: " + userPermission.getPermissionCode());
                }
                
                ps.setBoolean(1, userPermission.getCanCreate());
                ps.setBoolean(2, userPermission.getCanRead());
                ps.setBoolean(3, userPermission.getCanUpdate());
                ps.setBoolean(4, userPermission.getCanDelete());
                ps.setString(5, userPermission.getUserId());
                ps.setString(6, permissionId);
            }
            
            @Override
            public int getBatchSize() {
                return userPermissions.size();
            }
        });
        
        return results.length;
    }
}
