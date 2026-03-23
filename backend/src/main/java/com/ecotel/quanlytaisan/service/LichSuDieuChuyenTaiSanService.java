package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LichSuDieuChuyenTaiSanDao;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSanDTO;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSan;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LichSuDieuChuyenTaiSanService {

    @Autowired
    private LichSuDieuChuyenTaiSanDao lichSuDieuChuyenTaiSanDao;

    public int createBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }
        return lichSuDieuChuyenTaiSanDao.createBatch(list);
    }

    public PageResponse<LichSuDieuChuyenTaiSan> getAllPaged(int page, int size, String idTaiSan, String fromDate, String toDate) {
        int offset = page * size;
        List<LichSuDieuChuyenTaiSan> list = lichSuDieuChuyenTaiSanDao.findAllPaged(offset, size, idTaiSan, fromDate, toDate);
        long total = lichSuDieuChuyenTaiSanDao.countAll(idTaiSan, fromDate, toDate);
        return new PageResponse<>(list, total, page, size);
    }

    public int update(String id, LichSuDieuChuyenTaiSanDTO item) {
        return lichSuDieuChuyenTaiSanDao.update(id, item);
    }

    public int delete(String id) {
        return lichSuDieuChuyenTaiSanDao.delete(id);
    }

    // ================== BATCH UPDATE & DELETE ==================
    public int updateBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        int[] results = lichSuDieuChuyenTaiSanDao.updateBatch(list);
        int successCount = 0;
        for (int r : results) {
            if (r > 0) successCount++;
        }
        return successCount;
    }

    public int deleteBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return lichSuDieuChuyenTaiSanDao.deleteBatch(ids);
    }
}