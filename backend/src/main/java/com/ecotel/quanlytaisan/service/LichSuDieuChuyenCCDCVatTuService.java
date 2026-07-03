package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LichSuDieuChuyenCCDCVatTuDao;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTu;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LichSuDieuChuyenCCDCVatTuService {

    @Autowired
    private LichSuDieuChuyenCCDCVatTuDao lichSuDieuChuyenCCDCVatTuDao;

    public int createBatch(List<LichSuDieuChuyenCCDCVatTuDTO> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }
        return lichSuDieuChuyenCCDCVatTuDao.createBatch(list);
    }

    public PageResponse<LichSuDieuChuyenCCDCVatTu> getAllPaged(int page, int size, String idCCDCVatTu, String fromDate, String toDate) {
        int offset = page * size;
        List<LichSuDieuChuyenCCDCVatTu> list = lichSuDieuChuyenCCDCVatTuDao.findAllPaged(offset, size, idCCDCVatTu, fromDate, toDate);
        long total = lichSuDieuChuyenCCDCVatTuDao.countAll(idCCDCVatTu, fromDate, toDate);
        
        // SỬA LỖI: Sử dụng constructor có tham số của PageResponse
        return new PageResponse<>(list, total, page, size);
    }
}
