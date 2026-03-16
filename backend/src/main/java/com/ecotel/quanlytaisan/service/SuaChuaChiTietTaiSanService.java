package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuaChuaChiTietTaiSanDao;
import com.ecotel.quanlytaisan.model.SuaChuaChiTietTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SuaChuaChiTietTaiSanService {

    @Autowired
    private SuaChuaChiTietTaiSanDao chiTietTaiSanDao;

    private String getCurrentDateTimeString() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public List<SuaChuaChiTietTaiSan> getAll() {
        return chiTietTaiSanDao.findAll();
    }

    public SuaChuaChiTietTaiSan getById(String id) {
        return chiTietTaiSanDao.findById(id);
    }

    public List<SuaChuaChiTietTaiSan> getByIdSuaChua(String idSuaChua) {
        return chiTietTaiSanDao.findByIdSuaChua(idSuaChua);
    }

    public List<SuaChuaChiTietTaiSan> getChuaSuaChua(String idSuaChua) {
        return chiTietTaiSanDao.findChuaSuaChua(idSuaChua);
    }

    @Transactional
    public SuaChuaChiTietTaiSan create(SuaChuaChiTietTaiSan entity) {
        entity.setId(chiTietTaiSanDao.generateNextId());
        entity.setNgayTao(getCurrentDateTimeString());
        entity.setNgayCapNhat(getCurrentDateTimeString());
        entity.setIsActive(true);
        int result = chiTietTaiSanDao.insert(entity);
        return result > 0 ? entity : null;
    }

    @Transactional
    public SuaChuaChiTietTaiSan update(SuaChuaChiTietTaiSan entity) {
        SuaChuaChiTietTaiSan existing = chiTietTaiSanDao.findById(entity.getId());
        if (existing == null) return null;
        entity.setNgayCapNhat(getCurrentDateTimeString());
        entity.setNgayTao(existing.getNgayTao()); // giữ nguyên ngày tạo
        int result = chiTietTaiSanDao.update(entity);
        return result > 0 ? entity : null;
    }

    @Transactional
    public boolean delete(String id) {
        return chiTietTaiSanDao.deleteById(id) > 0;
    }

    @Transactional
    public int batchInsert(List<SuaChuaChiTietTaiSan> list) {
        for (SuaChuaChiTietTaiSan item : list) {
            item.setId(chiTietTaiSanDao.generateNextId());
            item.setNgayTao(getCurrentDateTimeString());
            item.setNgayCapNhat(getCurrentDateTimeString());
            item.setIsActive(true);
        }
        return chiTietTaiSanDao.batchInsert(list).length;
    }

    @Transactional
    public int batchUpdate(List<SuaChuaChiTietTaiSan> list) {
        for (SuaChuaChiTietTaiSan item : list) {
            item.setNgayCapNhat(getCurrentDateTimeString());
        }
        return chiTietTaiSanDao.batchUpdate(list).length;
    }

    @Transactional
    public int updateDaSuaChua(String id, Boolean daSuaChua) {  
        if (id == null || id.trim().isEmpty()) {
            return 0; 
        }
        
        int result = chiTietTaiSanDao.updateDaSuaChua(id, daSuaChua);
        return result;
    }
    @Transactional
    public int batchDelete(List<String> ids) {
        return chiTietTaiSanDao.batchDelete(ids).length;
    }
}