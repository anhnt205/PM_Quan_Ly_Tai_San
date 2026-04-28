package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuaChuaChiTietDao;
import com.ecotel.quanlytaisan.model.SuaChuaChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuaChuaChiTietService {

    @Autowired
    private SuaChuaChiTietDao chiTietDao;

    public List<SuaChuaChiTiet> getAll() {
        return chiTietDao.findAll();
    }

    public SuaChuaChiTiet getById(String id) {
        return chiTietDao.findById(id);
    }

    public List<SuaChuaChiTiet> getByIdSuaChua(String idSuaChua) {
        return chiTietDao.findByIdSuaChua(idSuaChua);
    }

    public SuaChuaChiTiet create(SuaChuaChiTiet entity) {
        entity.setId(chiTietDao.generateNextId());
        int r = chiTietDao.insert(entity);
        return r > 0 ? entity : null;
    }

    public int batchInsert(List<SuaChuaChiTiet> list) {
        for (SuaChuaChiTiet item : list) {
            item.setId(chiTietDao.generateNextId());
        }
        int[] result = chiTietDao.batchInsert(list);
        int total = 0;
        for (int i : result) total += i;
        return total;
    }

    public SuaChuaChiTiet update(SuaChuaChiTiet entity) {
        int r = chiTietDao.update(entity);
        return r > 0 ? entity : null;
    }

    public boolean delete(String id) {
        return chiTietDao.deleteById(id) > 0;
    }

    public boolean deleteByIdSuaChua(String idSuaChua) {
        return chiTietDao.deleteByIdSuaChua(idSuaChua) > 0;
    }
}
