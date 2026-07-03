package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.PermissionDao;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {
    @Autowired
    private PermissionDao permissionDao;

    /**
     * Lấy danh sách Permission có phân trang, sắp xếp và tìm kiếm
     */
    public List<Permission> getAllPaged(int page, int size, String sortBy, String sortDir, String keyword) {
        int offset = page * size;
        return permissionDao.findAllPaged(offset, size, sortBy, sortDir, keyword);
    }

    /**
     * Đếm tổng số bản ghi (có hỗ trợ tìm kiếm)
     */
    public long countAll(String keyword) {
        return permissionDao.countAll(keyword);
    }

    /**
     * Trả về PageResponse đầy đủ (dùng trực tiếp trong controller)
     */
    public PageResponse<Permission> getAllPagedResponse(int page, int size, String sortBy, String sortDir, String keyword) {
        List<Permission> items = getAllPaged(page, size, sortBy, sortDir, keyword);
        long totalItems = countAll(keyword);

        // PageResponse tự tính totalPages
        return new PageResponse<>(items, totalItems, page, size);
    }

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
