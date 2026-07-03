package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuCoThietBiChiTietDao;
import com.ecotel.quanlytaisan.model.SuCoThietBiChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service chi tiết tài sản trong phiếu sự cố thiết bị.
 */
@Service
public class SuCoThietBiChiTietService {

    @Autowired
    private SuCoThietBiChiTietDao chiTietDao;

    private String now() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    // ==================== Query ====================

    public List<SuCoThietBiChiTiet> getAll() {
        return chiTietDao.findAll();
    }

    public SuCoThietBiChiTiet getById(String id) {
        return chiTietDao.findById(id);
    }

    public List<SuCoThietBiChiTiet> getByIdSuCo(String idSuCo) {
        return chiTietDao.findByIdSuCo(idSuCo);
    }

    // ==================== Create ====================

    @Transactional
    public SuCoThietBiChiTiet create(SuCoThietBiChiTiet entity) {
        entity.setId(chiTietDao.generateNextId());
        entity.setNgayTao(now());
        entity.setNgayCapNhat(now());
        int r = chiTietDao.insert(entity);
        return r > 0 ? entity : null;
    }

    // ==================== Update ====================

    @Transactional
    public SuCoThietBiChiTiet update(SuCoThietBiChiTiet entity) {
        SuCoThietBiChiTiet existing = chiTietDao.findById(entity.getId());
        if (existing == null) return null;
        entity.setNgayTao(existing.getNgayTao()); // giữ nguyên ngày tạo
        entity.setNgayCapNhat(now());
        int r = chiTietDao.update(entity);
        return r > 0 ? entity : null;
    }

    // ==================== Delete ====================

    @Transactional
    public boolean delete(String id) {
        return chiTietDao.deleteById(id) > 0;
    }

    // ==================== Batch Insert ====================

    @Transactional
    public int batchInsert(List<SuCoThietBiChiTiet> list) {
        for (SuCoThietBiChiTiet item : list) {
            item.setId(chiTietDao.generateNextId());
            item.setNgayTao(now());
            item.setNgayCapNhat(now());
        }
        return chiTietDao.batchInsert(list).length;
    }

    // ==================== Batch Update ====================

    @Transactional
    public int batchUpdate(List<SuCoThietBiChiTiet> list) {
        for (SuCoThietBiChiTiet item : list)
            item.setNgayCapNhat(now());
        return chiTietDao.batchUpdate(list).length;
    }

    // ==================== Batch Delete ====================

    @Transactional
    public int batchDelete(List<String> ids) {
        return chiTietDao.batchDelete(ids).length;
    }
}
