package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.GioHoatDongDao;
import com.ecotel.quanlytaisan.model.GioHoatDong;
import com.ecotel.quanlytaisan.model.GioHoatDongDTO;
import com.ecotel.quanlytaisan.model.GioHoatDongYearData;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class GioHoatDongService {

    @Autowired
    private GioHoatDongDao dao;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public int create(GioHoatDongDTO dto) {
        if (dto.getNgayTao() == null || dto.getNgayTao().isEmpty()) {
            dto.setNgayTao(LocalDateTime.now().format(formatter));
        }
        if (dto.getNgayCapNhat() == null || dto.getNgayCapNhat().isEmpty()) {
            dto.setNgayCapNhat(dto.getNgayTao());
        }
        return dao.insert(dto);
    }

    public int update(String id, GioHoatDongDTO dto) {
        dto.setNgayCapNhat(LocalDateTime.now().format(formatter));
        return dao.update(id, dto);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public GioHoatDong getById(String id) {
        return dao.findById(id);
    }

    public List<GioHoatDongYearData> getYearsWithData(String idTaiSan) {
        List<GioHoatDong> allRecords = dao.findByIdTaiSan(idTaiSan);
        Map<String, List<GioHoatDong>> grouped = new LinkedHashMap<>();

        for (GioHoatDong record : allRecords) {
            grouped.computeIfAbsent(record.getNam(), k -> new ArrayList<>()).add(record);
        }

        List<GioHoatDongYearData> result = new ArrayList<>();
        for (Map.Entry<String, List<GioHoatDong>> entry : grouped.entrySet()) {
            GioHoatDongYearData yearData = new GioHoatDongYearData();
            yearData.setNam(entry.getKey());
            List<GioHoatDong> monthlyData = entry.getValue();
            monthlyData.sort(Comparator.comparing(GioHoatDong::getThang));
            yearData.setData(monthlyData);
            result.add(yearData);
        }
        return result;
    }

    public PageResponse<GioHoatDong> getAllPaged(int page, int size, String idTaiSan, String nam, String thang, String ngay) {
        int offset = page * size;
        List<GioHoatDong> list = dao.findAllPaged(offset, size, idTaiSan, nam, thang, ngay);
        long total = dao.countAll(idTaiSan, nam, thang, ngay);
        return new PageResponse<>(list, total, page, size);
    }

    public int createBatch(List<GioHoatDongDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        String now = LocalDateTime.now().format(formatter);
        for (GioHoatDongDTO dto : list) {
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

    public int updateBatch(List<GioHoatDongDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        String now = LocalDateTime.now().format(formatter);
        for (GioHoatDongDTO dto : list) {
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