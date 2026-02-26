package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.UserRoleDao;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserRoleService {
    @Autowired
    private UserRoleDao userRoleDao;

    public List<UserRole> getPagedByUserId (String userId, int page, int size, String sortBy, String sortDir, String search){
        int offset = page * size;
        return userRoleDao.findPagedByUserId(userId, offset, size, sortBy, sortDir, search);
    }

    public long countByUserId(String userId, String search){
        return userRoleDao.countByUserId(userId, search);
    }

    public PageResponse<UserRole> getPagedResponseByUserId(String useId, int page, int size, String sortBy, String sortDir, String search){
        List<UserRole> items = getPagedByUserId(useId, page, size, sortBy, sortDir, search);
        long totalItems = countByUserId(useId, search);
        return  new PageResponse<>(items, totalItems, page, size);
    }
    public List<UserRole> getAll() {
        return userRoleDao.findAll();
    }

    public List<UserRole> getByUserId(String userId) {
        return userRoleDao.findByUserId(userId);
    }

    public List<UserRole> getByRoleId(String roleId) {
        return userRoleDao.findByRoleId(roleId);
    }

    public UserRole getByUserAndRole(String userId, String roleId) {
        return userRoleDao.findByUserAndRole(userId, roleId);
    }

    public int create(UserRole userRole) {
        if (userRole.getCreatedDate() == null) {
            userRole.setCreatedDate(LocalDateTime.now());
        }
        return userRoleDao.insert(userRole);
    }

    public int update(UserRole userRole) {
        return userRoleDao.update(userRole);
    }

    public int delete(String id) {
        return userRoleDao.delete(id);
    }

    public int deleteByUserId(String userId) {
        return userRoleDao.deleteByUserId(userId);
    }

    public int deleteByRoleId(String roleId) {
        return userRoleDao.deleteByRoleId(roleId);
    }
}
