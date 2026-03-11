package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietKetQuaSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KetQuaSuaChuaDao;
import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KetQuaSuaChuaService {

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        KetQuaSuaChuaDTO dto = ketQuaSuaChuaDao.findByIdSuaChua(idSuaChua);
        if (dto != null) {
            dto.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(dto.getId()));
        }
        return dto;
    }

    public KetQuaSuaChua findById(String id) {
        return ketQuaSuaChuaDao.findById(id);
    }

    public PageResponse<KetQuaSuaChuaDTO> findWithFilters(
            String idCongTy, Integer trangThai,
            LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size) {

        // Lấy dữ liệu phân trang (có áp dụng bộ lọc trạng thái nếu có)
        List<KetQuaSuaChuaDTO> items = ketQuaSuaChuaDao.findByFilters(
                idCongTy, trangThai, fromDate, toDate, page, size);
        long totalItems = ketQuaSuaChuaDao.countByFilters(
                idCongTy, trangThai, fromDate, toDate);

        // Thống kê theo trạng thái (không bị ảnh hưởng bởi bộ lọc trạng thái)
        Map<Integer, Long> rawStats = ketQuaSuaChuaDao.countByTrangThai(idCongTy, fromDate, toDate);
        Map<String, Long> trangThaiCounts = new HashMap<>();

        long totalAll = 0;
        for (Map.Entry<Integer, Long> entry : rawStats.entrySet()) {
            String name = mapTrangThai(entry.getKey());
            trangThaiCounts.put(name, entry.getValue());
            totalAll += entry.getValue();
        }
        // Thêm mục "Tất cả" với tổng số
        trangThaiCounts.put("Tất cả", totalAll);

        return new PageResponse<>(items, totalItems, page, size, null, null, trangThaiCounts);
    }

    // Hàm chuyển mã số sang tên hiển thị
    private String mapTrangThai(Integer code) {
        switch (code) {
            case 0: return "Nháp";
            case 1: return "Duyệt";
            case 2: return "Hủy";
            case 3: return "Hoàn thành";
            default: return "Tất Cả";
        }
    }

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        return ketQuaSuaChuaDao.insert(entity);
    }

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        KetQuaSuaChua existing = ketQuaSuaChuaDao.findById(entity.getId());
        if (existing == null) {
            return null;
        }
        return ketQuaSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        return ketQuaSuaChuaDao.delete(id);
    }

    // Import CSV (nếu cần)
    public List<KetQuaSuaChua> readCsv(MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(fields);
                list.add(entity);
            }
        }
        return list;
    }

    // Import Excel (nếu cần)
    public List<KetQuaSuaChua> readExcel(MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(row);
            list.add(entity);
        }
        workbook.close();
        return list;
    }
}