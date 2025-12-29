package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.RolePermission;
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
public class RolePermissionDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<RolePermission> rowMapper = new RowMapper<RolePermission>() {
        @Override
        public RolePermission mapRow(ResultSet rs, int rowNum) throws SQLException {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setId(rs.getString("Id"));
            rolePermission.setRoleId(rs.getString("RoleId"));
            rolePermission.setPermissionId(rs.getString("PermissionId"));
            rolePermission.setCanCreate(rs.getBoolean("CanCreate"));
            rolePermission.setCanRead(rs.getBoolean("CanRead"));
            rolePermission.setCanUpdate(rs.getBoolean("CanUpdate"));
            rolePermission.setCanDelete(rs.getBoolean("CanDelete"));
            return rolePermission;
        }
    };

    private RowMapper<RolePermission> rowMapperWithNames = new RowMapper<RolePermission>() {
        @Override
        public RolePermission mapRow(ResultSet rs, int rowNum) throws SQLException {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setId(rs.getString("Id"));
            rolePermission.setRoleId(rs.getString("RoleId"));
            rolePermission.setPermissionId(rs.getString("PermissionId"));
            rolePermission.setCanCreate(rs.getBoolean("CanCreate"));
            rolePermission.setCanRead(rs.getBoolean("CanRead"));
            rolePermission.setCanUpdate(rs.getBoolean("CanUpdate"));
            rolePermission.setCanDelete(rs.getBoolean("CanDelete"));
            rolePermission.setRoleName(rs.getString("RoleName"));
            rolePermission.setPermissionName(rs.getString("PermissionName"));
            return rolePermission;
        }
    };

    public List<RolePermission> findAll() {
        String sql = "SELECT rp.*, r.RoleName, p.PermissionName FROM RolePermission rp " +
                    "JOIN Role r ON rp.RoleId = r.Id " +
                    "JOIN Permission p ON rp.PermissionId = p.Id";
        return jdbcTemplate.query(sql, rowMapperWithNames);
    }

    public List<RolePermission> findByRoleId(String roleId) {
        String sql = "SELECT rp.*, r.RoleName, p.PermissionName FROM RolePermission rp " +
                    "JOIN Role r ON rp.RoleId = r.Id " +
                    "JOIN Permission p ON rp.PermissionId = p.Id " +
                    "WHERE rp.RoleId = ?";
        return jdbcTemplate.query(sql, rowMapperWithNames, roleId);
    }

    public List<RolePermission> findByPermissionId(String permissionId) {
        String sql = "SELECT rp.*, r.RoleName, p.PermissionName FROM RolePermission rp " +
                    "JOIN Role r ON rp.RoleId = r.Id " +
                    "JOIN Permission p ON rp.PermissionId = p.Id " +
                    "WHERE rp.PermissionId = ?";
        return jdbcTemplate.query(sql, rowMapperWithNames, permissionId);
    }

    public RolePermission findByRoleAndPermission(String roleId, String permissionId) {
        String sql = "SELECT * FROM RolePermission WHERE RoleId = ? AND PermissionId = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, roleId, permissionId);
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(RolePermission rolePermission) {
        String sql = "INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, rolePermission.getId(), rolePermission.getRoleId(), 
                rolePermission.getPermissionId(), rolePermission.getCanCreate(), 
                rolePermission.getCanRead(), rolePermission.getCanUpdate(), rolePermission.getCanDelete());
    }

    public int update(RolePermission rolePermission) {
        String sql = "UPDATE RolePermission SET CanCreate=?, CanRead=?, CanUpdate=?, CanDelete=? WHERE Id=?";
        return jdbcTemplate.update(sql, rolePermission.getCanCreate(), rolePermission.getCanRead(), 
                rolePermission.getCanUpdate(), rolePermission.getCanDelete(), rolePermission.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM RolePermission WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByRoleId(String roleId) {
        String sql = "DELETE FROM RolePermission WHERE RoleId = ?";
        return jdbcTemplate.update(sql, roleId);
    }

    public int deleteByPermissionId(String permissionId) {
        String sql = "DELETE FROM RolePermission WHERE PermissionId = ?";
        return jdbcTemplate.update(sql, permissionId);
    }

    public int insertBatch(List<RolePermission> rolePermissions) {
        String sql = "INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete) VALUES (?, ?, ?, ?, ?, ?, ?)";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                RolePermission rolePermission = rolePermissions.get(i);
                ps.setString(1, rolePermission.getId());
                ps.setString(2, rolePermission.getRoleId());
                ps.setString(3, rolePermission.getPermissionId());
                ps.setBoolean(4, rolePermission.getCanCreate());
                ps.setBoolean(5, rolePermission.getCanRead());
                ps.setBoolean(6, rolePermission.getCanUpdate());
                ps.setBoolean(7, rolePermission.getCanDelete());
            }
            
            @Override
            public int getBatchSize() {
                return rolePermissions.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<RolePermission> rolePermissions) {
        String sql = "UPDATE RolePermission SET CanCreate=?, CanRead=?, CanUpdate=?, CanDelete=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                RolePermission rolePermission = rolePermissions.get(i);
                ps.setBoolean(1, rolePermission.getCanCreate());
                ps.setBoolean(2, rolePermission.getCanRead());
                ps.setBoolean(3, rolePermission.getCanUpdate());
                ps.setBoolean(4, rolePermission.getCanDelete());
                ps.setString(5, rolePermission.getId());
            }
            
            @Override
            public int getBatchSize() {
                return rolePermissions.size();
            }
        });
        return results.length;
    }
}
