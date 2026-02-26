package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChucVuDao;
import com.ecotel.quanlytaisan.model.ChucVu;
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
public class ChucVuService {
    @Autowired
    private ChucVuDao chucVuDAO;

    public int insert(ChucVu cv) {
        return chucVuDAO.insert(cv);
    }

    public int update(ChucVu cv) {
        return chucVuDAO.update(cv);
    }

    public int delete(String id) {
        return chucVuDAO.delete(id);
    }

    public List<ChucVu> findAll(String idCongTy) {
        return chucVuDAO.findAll(idCongTy);
    }

    public PageResponse<ChucVu> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String searchKeyword) {
        List<ChucVu> items = chucVuDAO.findAllPaged(idCongTy, page, size, sortBy, sortDir, searchKeyword);
        long totalItems = chucVuDAO.countAll(idCongTy, searchKeyword);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public ChucVu findById(String id) {
        return chucVuDAO.findById(id);
    }

    public List<ChucVu> findByTen(String ten) {
        return chucVuDAO.findByTen(ten);
    }

    public List<ChucVu> readCsv(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                ChucVu ts = ChucVu.mapToChucVu(fields);
                list.add(ts);
            }
        }
        return list;
    }

    public List<ChucVu> readExcel(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            ChucVu ts = ChucVu.mapToChucVu(row);
            list.add(ts);
        }
        workbook.close();
        return list;
    }


    public int deleteAll() {
        return chucVuDAO.deleteAll();
    }





}