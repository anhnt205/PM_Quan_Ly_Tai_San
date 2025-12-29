package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.PermissionDao;
import com.ecotel.quanlytaisan.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {
    @Autowired
    private PermissionDao permissionDao;

    public List<Permission> getAll() {
        return permissionDao.findAll();
    }

    public Permission getById(String id) {
        return permissionDao.findById(id);
    }

    public Permission getByCode(String permissionCode) {
        return permissionDao.findByCode(permissionCode);
    }

    public int create(Permission permission) {
        return permissionDao.insert(permission);
    }

    public int update(Permission permission) {
        return permissionDao.update(permission);
    }

    public int delete(String id) {
        return permissionDao.delete(id);
    }

    public int createBatch(List<Permission> permissions) {
        return permissionDao.insertBatch(permissions);
    }

    public int updateBatch(List<Permission> permissions) {
        return permissionDao.updateBatch(permissions);
    }
}
