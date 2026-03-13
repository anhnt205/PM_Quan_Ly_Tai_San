package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaChiTietTaiSanDao;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaChiTietTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class KeHoachSuaChuaChiTietTaiSanService {

    @Autowired
    private KeHoachSuaChuaChiTietTaiSanDao chiTietTaiSanDao;

    private String getCurrentDateTimeString() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public List<KeHoachSuaChuaChiTietTaiSan> getAll() {
        return chiTietTaiSanDao.findAll();
    }

    public KeHoachSuaChuaChiTietTaiSan getById(String id) {
        return chiTietTaiSanDao.findById(id);
    }

    public List<KeHoachSuaChuaChiTietTaiSan> getByIdKeHoach(String idKeHoach) {
        return chiTietTaiSanDao.findByIdKeHoach(idKeHoach);
    }

    @Transactional
    public KeHoachSuaChuaChiTietTaiSan create(KeHoachSuaChuaChiTietTaiSan entity) {
        entity.setId(chiTietTaiSanDao.generateNextId());
        entity.setNgayTao(getCurrentDateTimeString());
        entity.setNgayCapNhat(getCurrentDateTimeString());
        entity.setIsActive(true);
        int result = chiTietTaiSanDao.insert(entity);
        return result > 0 ? entity : null;
    }

    @Transactional
    public KeHoachSuaChuaChiTietTaiSan update(KeHoachSuaChuaChiTietTaiSan entity) {
        KeHoachSuaChuaChiTietTaiSan existing = chiTietTaiSanDao.findById(entity.getId());
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
    public int batchInsert(List<KeHoachSuaChuaChiTietTaiSan> list) {
        for (KeHoachSuaChuaChiTietTaiSan item : list) {
            item.setId(chiTietTaiSanDao.generateNextId());
            item.setNgayTao(getCurrentDateTimeString());
            item.setNgayCapNhat(getCurrentDateTimeString());
            item.setIsActive(true);
        }
        return chiTietTaiSanDao.batchInsert(list).length; // int[] -> .length
    }

    @Transactional
    public int batchUpdate(List<KeHoachSuaChuaChiTietTaiSan> list) {
        for (KeHoachSuaChuaChiTietTaiSan item : list) {
            item.setNgayCapNhat(getCurrentDateTimeString());
        }
        return chiTietTaiSanDao.batchUpdate(list).length;
    }

    @Transactional
    public int batchDelete(List<String> ids) {
        return chiTietTaiSanDao.batchDelete(ids).length;
    }
}