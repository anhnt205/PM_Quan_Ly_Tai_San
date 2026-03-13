package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuaChuaVatTuTieuHaoDao;
import com.ecotel.quanlytaisan.model.SuaChuaVatTuTieuHao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SuaChuaVatTuTieuHaoService {

    @Autowired
    private SuaChuaVatTuTieuHaoDao vatTuTieuHaoDao;

    private String getCurrentDateTimeString() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public List<SuaChuaVatTuTieuHao> getAll() {
        return vatTuTieuHaoDao.findAll();
    }

    public SuaChuaVatTuTieuHao getById(String id) {
        return vatTuTieuHaoDao.findById(id);
    }

    public List<SuaChuaVatTuTieuHao> getByIdKeHoach(String idKeHoach) {
        return vatTuTieuHaoDao.findByIdKeHoach(idKeHoach);
    }

    @Transactional
    public SuaChuaVatTuTieuHao create(SuaChuaVatTuTieuHao entity) {
        entity.setId(vatTuTieuHaoDao.generateNextId());
        entity.setNgayTao(getCurrentDateTimeString());
        entity.setNgayCapNhat(getCurrentDateTimeString());
        entity.setIsActive(true);
        int result = vatTuTieuHaoDao.insert(entity);
        return result > 0 ? entity : null;
    }

    @Transactional
    public SuaChuaVatTuTieuHao update(SuaChuaVatTuTieuHao entity) {
        SuaChuaVatTuTieuHao existing = vatTuTieuHaoDao.findById(entity.getId());
        if (existing == null) return null;
        entity.setNgayCapNhat(getCurrentDateTimeString());
        entity.setNgayTao(existing.getNgayTao());
        int result = vatTuTieuHaoDao.update(entity);
        return result > 0 ? entity : null;
    }

    @Transactional
    public boolean delete(String id) {
        return vatTuTieuHaoDao.deleteById(id) > 0;
    }

    @Transactional
    public int batchInsert(List<SuaChuaVatTuTieuHao> list) {
        for (SuaChuaVatTuTieuHao item : list) {
            item.setId(vatTuTieuHaoDao.generateNextId());
            item.setNgayTao(getCurrentDateTimeString());
            item.setNgayCapNhat(getCurrentDateTimeString());
            item.setIsActive(true);
        }
        return vatTuTieuHaoDao.batchInsert(list).length;
    }

    @Transactional
    public int batchUpdate(List<SuaChuaVatTuTieuHao> list) {
        for (SuaChuaVatTuTieuHao item : list) {
            item.setNgayCapNhat(getCurrentDateTimeString());
        }
        return vatTuTieuHaoDao.batchUpdate(list).length;
    }

    @Transactional
    public int batchDelete(List<String> ids) {
        return vatTuTieuHaoDao.batchDelete(ids).length;
    }
}