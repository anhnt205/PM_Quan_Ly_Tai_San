package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.RoleDao;
import com.ecotel.quanlytaisan.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleDao roleDao;

    public List<Role> getAll() {
        return roleDao.findAll();
    }

    public Role getById(String id) {
        return roleDao.findById(id);
    }

    public Role getByCode(String roleCode) {
        return roleDao.findByCode(roleCode);
    }

    public int create(Role role) {
        return roleDao.insert(role);
    }

    public int update(Role role) {
        return roleDao.update(role);
    }

    public int delete(String id) {
        return roleDao.delete(id);
    }

    public int createBatch(List<Role> roles) {
        return roleDao.insertBatch(roles);
    }

    public int updateBatch(List<Role> roles) {
        return roleDao.updateBatch(roles);
    }
}
