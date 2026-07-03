package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.UserPermissionDao;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.UserPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPermissionService {
    @Autowired
    private UserPermissionDao userPermissionDao;

    public List<UserPermission> getUserPermissionPaged(String userId, int page, int size, String sortBy, String sortDir, String search){
        int offset = page * size;
        return userPermissionDao.getUserPermissionsPaged(userId, offset, size, sortBy, sortDir, search);
    }

    public long countUserPermissions(String userId, String search){
        return userPermissionDao.countUserPermissions(userId, search);
    }

    public PageResponse<UserPermission> getUserPermissionsPagedResponse(String userId, int page, int size, String sortBy, String sortDir, String search){
        List<UserPermission> items = getUserPermissionPaged(userId, page, size, sortBy, sortDir, search);
        long totalItems = countUserPermissions(userId, search);

        return new PageResponse<>(items, totalItems, page, size);
    }
    public List<UserPermission> getUserPermissions(String userId) {
        return userPermissionDao.getUserPermissions(userId);
    }

    public List<UserPermission> getUserPermissionsByCode(String userId, String permissionCode) {
        return userPermissionDao.getUserPermissionsByCode(userId, permissionCode);
    }

    public boolean hasPermission(String userId, String permissionCode, String action) {
        return userPermissionDao.hasPermission(userId, permissionCode, action);
    }

    public boolean canCreate(String userId, String permissionCode) {
        return hasPermission(userId, permissionCode, "CanCreate");
    }

    public boolean canRead(String userId, String permissionCode) {
        return hasPermission(userId, permissionCode, "CanRead");
    }

    public boolean canUpdate(String userId, String permissionCode) {
        return hasPermission(userId, permissionCode, "CanUpdate");
    }

    public boolean canDelete(String userId, String permissionCode) {
        return hasPermission(userId, permissionCode, "CanDelete");
    }

    public int setUserPermission(UserPermission userPermission) {
        return userPermissionDao.setUserPermission(userPermission);
    }

    public int updateUserPermission(UserPermission userPermission) {
        return userPermissionDao.updateUserPermission(userPermission);
    }

    public int removeUserPermission(String userId, String permissionCode) {
        return userPermissionDao.removeUserPermission(userId, permissionCode);
    }

    public int setUserPermissionsBatch(List<UserPermission> userPermissions) {
        return userPermissionDao.setUserPermissionsBatch(userPermissions);
    }

    public int updateUserPermissionsBatch(List<UserPermission> userPermissions) {
        return userPermissionDao.updateUserPermissionsBatch(userPermissions);
    }
}
