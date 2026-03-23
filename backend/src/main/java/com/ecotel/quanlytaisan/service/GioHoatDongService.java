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
import java.util.stream.Collectors;

@Service
public class GioHoatDongService {

    @Autowired
    private GioHoatDongDao dao;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ================== CRUD ==================
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
        // Fetch all records for the asset, already sorted by year desc, month desc
        List<GioHoatDong> allRecords = dao.findByIdTaiSan(idTaiSan);

        // Group by year
        Map<Integer, List<GioHoatDong>> grouped = allRecords.stream()
                .collect(Collectors.groupingBy(
                        GioHoatDong::getNam,
                        LinkedHashMap::new, // preserve order (years desc)
                        Collectors.toList()
                ));

        // Build result list
        List<GioHoatDongYearData> result = new ArrayList<>();
        for (Map.Entry<Integer, List<GioHoatDong>> entry : grouped.entrySet()) {
            GioHoatDongYearData yearData = new GioHoatDongYearData();
            yearData.setNam(entry.getKey());
            // Sort months ascending for each year
            List<GioHoatDong> monthlyData = entry.getValue();
            monthlyData.sort(Comparator.comparing(GioHoatDong::getThang));
            yearData.setData(monthlyData);
            result.add(yearData);
        }
        return result;
    }

    public PageResponse<GioHoatDong> getAllPaged(int page, int size, String idTaiSan, Integer nam, Integer thang) {
        int offset = page * size;
        List<GioHoatDong> list = dao.findAllPaged(offset, size, idTaiSan, nam, thang);
        long total = dao.countAll(idTaiSan, nam, thang);
        return new PageResponse<>(list, total, page, size);
    }


    // ================== BATCH OPERATIONS ==================
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