package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiCCDCConDao;
import com.ecotel.quanlytaisan.model.LoaiCCDCCon;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiCCDCConService {
    @Autowired
    private LoaiCCDCConDao loaiCCDCConDao;

    // ==================== PHÂN TRANG TOÀN BỘ ====================

    public List<LoaiCCDCCon> getAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;
        return loaiCCDCConDao.findAllPaged(offset, size, sortBy, sortDir, search);
    }

    public long countAll(String search) {
        return loaiCCDCConDao.countAll(search);
    }

    public PageResponse<LoaiCCDCCon> getAllPagedResponse(int page, int size, String sortBy, String sortDir, String search) {
        List<LoaiCCDCCon> items = getAllPaged(page, size, sortBy, sortDir, search);
        long totalItems = countAll(search);

        return new PageResponse<>(items, totalItems, page, size);
    }

    // ==================== PHÂN TRANG THEO CHA ====================

    public List<LoaiCCDCCon> getPagedByIdLoaiCCDC(String idLoaiCCDC, int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;
        return loaiCCDCConDao.findPagedByIdLoaiCCDC(idLoaiCCDC, offset, size, sortBy, sortDir, search);
    }

    public long countByIdLoaiCCDC(String idLoaiCCDC, String search) {
        return loaiCCDCConDao.countByIdLoaiCCDC(idLoaiCCDC, search);
    }

    public PageResponse<LoaiCCDCCon> getPagedResponseByIdLoaiCCDC(String idLoaiCCDC, int page, int size, String sortBy, String sortDir, String search) {
        List<LoaiCCDCCon> items = getPagedByIdLoaiCCDC(idLoaiCCDC, page, size, sortBy, sortDir, search);
        long totalItems = countByIdLoaiCCDC(idLoaiCCDC, search);

        return new PageResponse<>(items, totalItems, page, size);
    }

    public List<LoaiCCDCCon> getAll() {
        return loaiCCDCConDao.findAll();
    }

    public LoaiCCDCCon getById(String id) {
        return loaiCCDCConDao.findById(id);
    }

    public List<LoaiCCDCCon> getByIdLoaiCCDC(String idLoaiCCDC) {
        return loaiCCDCConDao.findByIdLoaiCCDC(idLoaiCCDC);
    }

    public int create(LoaiCCDCCon lccdc) {
        return loaiCCDCConDao.insert(lccdc);
    }

    public int batchCreate(List<LoaiCCDCCon> list) {
        return loaiCCDCConDao.batchCreate(list);
    }

    public int update(LoaiCCDCCon lccdc) {
        return loaiCCDCConDao.update(lccdc);
    }

    public int batchUpdate(List<LoaiCCDCCon> list) {
        return loaiCCDCConDao.batchUpdate(list);
    }

    public int delete(String id) {
        return loaiCCDCConDao.delete(id);
    }

    public int batchDelete(List<String> ids) {
        return loaiCCDCConDao.batchDelete(ids);
    }




    public void deleteAll() {
        loaiCCDCConDao.deleteAll();
    }





}
