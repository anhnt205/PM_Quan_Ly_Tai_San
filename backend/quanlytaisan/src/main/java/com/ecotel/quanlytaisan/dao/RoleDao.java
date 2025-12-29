package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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
