package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.HienTrangKyThuatDAO;
import com.ecotel.quanlytaisan.model.HienTrangKyThuat;
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
import java.util.ArrayList;
import java.util.List;

import com.ecotel.quanlytaisan.model.PageResponse;

@Service
public class HienTrangKyThuatService {
    @Autowired
    private HienTrangKyThuatDAO hienTrangKyThuatDAO;

    public List<HienTrangKyThuat> getAll() {
        return hienTrangKyThuatDAO.findAll();
    }

    public List<HienTrangKyThuat> getAllIncludeInactive() {
        return hienTrangKyThuatDAO.findAllIncludeInactive();
    }

    public HienTrangKyThuat getById(String id) {
        return hienTrangKyThuatDAO.findById(id);
    }

    public int create(HienTrangKyThuat htkt) {
        return hienTrangKyThuatDAO.insert(htkt);
    }

    public int batchCreate(List<HienTrangKyThuat> list) {
        return hienTrangKyThuatDAO.batchCreate(list);
    }

    public int update(HienTrangKyThuat htkt) {
        return hienTrangKyThuatDAO.update(htkt);
    }

    public int batchUpdate(List<HienTrangKyThuat> list) {
        return hienTrangKyThuatDAO.batchUpdate(list);
    }

    public int delete(String id) {
        return hienTrangKyThuatDAO.delete(id);
    }

    public int batchDelete(List<String> ids) {
        return hienTrangKyThuatDAO.batchDelete(ids);
    }

    public int softDelete(String id) {
        return hienTrangKyThuatDAO.softDelete(id);
    }

    public PageResponse<HienTrangKyThuat> getAllPaged(int page, int size, String sortBy, String sortDir, String keyword) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = hienTrangKyThuatDAO.count(keyword);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<HienTrangKyThuat> items = hienTrangKyThuatDAO.findAllPaged(offset, size, sortBy, sortDir, keyword);
        return new PageResponse<>(items, total, page, size);
    }

    public List<HienTrangKyThuat> readCsv(MultipartFile file) throws IOException {
        List<HienTrangKyThuat> list = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                HienTrangKyThuat htkt = HienTrangKyThuat.mapToHienTrangKyThuat(fields);
                list.add(htkt);
            }
        }
        return list;
    }

    public List<HienTrangKyThuat> readExcel(MultipartFile file) throws IOException {
        List<HienTrangKyThuat> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            HienTrangKyThuat htkt = HienTrangKyThuat.mapToHienTrangKyThuat(row);
            list.add(htkt);
        }
        workbook.close();
        return list;
    }




    public void deleteAll() {
        hienTrangKyThuatDAO.deleteAll();
    }



}
