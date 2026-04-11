package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChuKySuaChuaDao;
import com.ecotel.quanlytaisan.model.ChuKySuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChuKySuaChuaService {
    @Autowired
    private ChuKySuaChuaDao chuKySuaChuaDao;

    public List<ChuKySuaChua> getByIdTaiSan(String idTaiSan) {
        return chuKySuaChuaDao.findByIdTaiSan(idTaiSan);
    }

    public int syncChuKySuaChua(List<ChuKySuaChua> list) {
        int count = 0;
        for (ChuKySuaChua item : list) {
            // Delete case
            if (Boolean.TRUE.equals(item.getIsDeleted())) {
                if (item.getId() != null && !item.getId().isEmpty()) {
                    count += chuKySuaChuaDao.delete(item.getId());
                }
                continue;
            }
            
            // Insert case
            if (Boolean.TRUE.equals(item.getIsInserted()) || item.getId() == null || item.getId().isEmpty()) {
                if (item.getId() == null || item.getId().isEmpty()) {
                    item.setId(UUID.randomUUID().toString());
                }
                count += chuKySuaChuaDao.insert(item);
                continue;
            }
            
            // Update case
            count += chuKySuaChuaDao.update(item);
        }
        return count;
    }
}
