package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.RolePermissionDao;
import com.ecotel.quanlytaisan.model.RolePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolePermissionService {
    @Autowired
    private RolePermissionDao rolePermissionDao;

    public List<RolePermission> getAll() {
        return rolePermissionDao.findAll();
    }

    public List<RolePermission> getByRoleId(String roleId) {
        return rolePermissionDao.findByRoleId(roleId);
    }

    public List<RolePermission> getByPermissionId(String permissionId) {
        return rolePermissionDao.findByPermissionId(permissionId);
    }

    public RolePermission getByRoleAndPermission(String roleId, String permissionId) {
        return rolePermissionDao.findByRoleAndPermission(roleId, permissionId);
    }

    public int create(RolePermission rolePermission) {
        return rolePermissionDao.insert(rolePermission);
    }

    public int update(RolePermission rolePermission) {
        return rolePermissionDao.update(rolePermission);
    }

    public int delete(String id) {
        return rolePermissionDao.delete(id);
    }

    public int deleteByRoleId(String roleId) {
        return rolePermissionDao.deleteByRoleId(roleId);
    }

    public int deleteByPermissionId(String permissionId) {
        return rolePermissionDao.deleteByPermissionId(permissionId);
    }

    public int createBatch(List<RolePermission> rolePermissions) {
        return rolePermissionDao.insertBatch(rolePermissions);
    }

    public int updateBatch(List<RolePermission> rolePermissions) {
        return rolePermissionDao.updateBatch(rolePermissions);
    }
}
