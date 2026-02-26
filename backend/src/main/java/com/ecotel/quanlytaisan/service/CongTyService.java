package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CongTyDao;
import com.ecotel.quanlytaisan.model.CongTy;
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
import java.util.ArrayList;
import java.util.List;

@Service
public class CongTyService {

    @Autowired
    private CongTyDao congTyDao;

    public CongTyService() {
        this.congTyDao = new CongTyDao();
    }

    public List<CongTy> getAll() {
        return congTyDao.findAll();
    }

    public PageResponse<CongTy> getAllPaged(int page, int size, String sortBy, String sortDir, String searchKeyword) {
        List<CongTy> items = congTyDao.findAllPaged(page, size, sortBy, sortDir, searchKeyword);
        long totalItems = congTyDao.countAll(searchKeyword);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public CongTy getById(String id) {
        return congTyDao.findById(id);
    }

    public int create(CongTy ct) {
        return congTyDao.insert(ct);
    }

    public int update(CongTy ct) {
        return congTyDao.update(ct);
    }

    public int delete(String id) {
        return congTyDao.delete(id);
    }

    public List<CongTy> readCsv(MultipartFile file) throws IOException {
        List<CongTy> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                CongTy ts = CongTy.mapToCongTy(fields);
                list.add(ts);
            }
        }
        return list;
    }

    public List<CongTy> readExcel(MultipartFile file) throws IOException {
        List<CongTy> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            CongTy ts = CongTy.mapToCongTy(row);
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}