package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietLichSuSuaChuaDao;
import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietLichSuSuaChuaService {

    @Autowired
    private ChiTietLichSuSuaChuaDao chiTietDao;

    public ChiTietLichSuSuaChua findById(String id) {
        return chiTietDao.findById(id);
    }

    public List<ChiTietLichSuSuaChuaDTO> findByIdLichSu(String idLichSuSuaChua) {
        return chiTietDao.findByIdLichSu(idLichSuSuaChua);
    }

    public ChiTietLichSuSuaChua insert(ChiTietLichSuSuaChua entity) {
        return chiTietDao.insert(entity);
    }

    public ChiTietLichSuSuaChua update(ChiTietLichSuSuaChua entity) {
        ChiTietLichSuSuaChua existing = chiTietDao.findById(entity.getId());
        if (existing == null) return null;
        return chiTietDao.update(entity);
    }

    public int delete(String id) {
        return chiTietDao.delete(id);
    }

    public int deleteByIdLichSu(String idLichSuSuaChua) {
        return chiTietDao.deleteByIdLichSu(idLichSuSuaChua);
    }

    // Bulk operations
    public void bulkInsert(List<ChiTietLichSuSuaChua> list) {
        for (ChiTietLichSuSuaChua entity : list) {
            insert(entity);
        }
    }

    public void bulkUpdate(List<ChiTietLichSuSuaChua> list) {
        for (ChiTietLichSuSuaChua entity : list) {
            update(entity);
        }
    }

    public void bulkDelete(List<String> ids) {
        for (String id : ids) {
            delete(id);
        }
    }
}