package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuCoTaiSanDao;
import com.ecotel.quanlytaisan.model.SuCoTaiSan;
import com.ecotel.quanlytaisan.model.SuCoTaiSanDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SuCoTaiSanService {

    @Autowired
    private SuCoTaiSanDao dao;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ================== CRUD ==================

    public int create(SuCoTaiSanDTO dto) {
        String now = LocalDateTime.now().format(formatter);
        if (dto.getNgayTao() == null || dto.getNgayTao().isEmpty()) {
            dto.setNgayTao(now);
        }
        if (dto.getNgayCapNhat() == null || dto.getNgayCapNhat().isEmpty()) {
            dto.setNgayCapNhat(now);
        }
        return dao.insert(dto);
    }

    public int update(String id, SuCoTaiSanDTO dto) {
        dto.setNgayCapNhat(LocalDateTime.now().format(formatter));
        return dao.update(id, dto);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public SuCoTaiSan getById(String id) {
        return dao.findById(id);
    }

    public PageResponse<SuCoTaiSan> getAllPaged(int page, int size, String tuNgay, String denNgay, String noiSuaChua) {
        int offset = page * size;
        List<SuCoTaiSan> list = dao.findAllPaged(offset, size, tuNgay, denNgay, noiSuaChua);
        long total = dao.countAll(tuNgay, denNgay, noiSuaChua);
        return new PageResponse<>(list, total, page, size);
    }

    // ================== BATCH OPERATIONS ==================

    public int createBatch(List<SuCoTaiSanDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        String now = LocalDateTime.now().format(formatter);
        for (SuCoTaiSanDTO dto : list) {
            if (dto.getNgayTao() == null || dto.getNgayTao().isEmpty()) {
                dto.setNgayTao(now);
            }
            if (dto.getNgayCapNhat() == null || dto.getNgayCapNhat().isEmpty()) {
                dto.setNgayCapNhat(now);
            }
        }
        int[] results = dao.insertBatch(list);
        int success = 0;
        for (int r : results) if (r > 0) success++;
        return success;
    }

    public int updateBatch(List<SuCoTaiSanDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        String now = LocalDateTime.now().format(formatter);
        for (SuCoTaiSanDTO dto : list) {
            dto.setNgayCapNhat(now);
        }
        int[] results = dao.updateBatch(list);
        int success = 0;
        for (int r : results) if (r > 0) success++;
        return success;
    }

    public int deleteBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return dao.deleteBatch(ids);
    }
}