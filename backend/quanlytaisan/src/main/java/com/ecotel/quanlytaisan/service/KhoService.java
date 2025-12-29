package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KhoDAO;
import com.ecotel.quanlytaisan.model.Kho;
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
public class KhoService {

    @Autowired
    private KhoDAO dao;

    public List<Kho> getAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public PageResponse<Kho> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        List<Kho> items = dao.findAllPaged(idCongTy, page, size, sortBy, sortDir);
        long totalItems = dao.countAll(idCongTy);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public Kho getById(String id) {
        return dao.findById(id);
    }

    public int create(Kho kho) {
        return dao.insert(kho);
    }

    public int update(Kho kho) {
        return dao.update(kho);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public int createBatch(List<Kho> khos) {
        return dao.insertBatch(khos);
    }

    public int updateBatch(List<Kho> khos) {
        return dao.updateBatch(khos);
    }

    public int deleteBatch(List<String> ids) {
        return dao.deleteBatch(ids);
    }

    public List<Kho> readCsv(MultipartFile file) throws IOException {
        List<Kho> list = new ArrayList<>();

        // Sử dụng InputStreamReader với UTF-8
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true; // bỏ qua header
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1); // giữ giá trị rỗng
                Kho kho = Kho.mapToKho(fields); // map từ CSV sang object
                list.add(kho);
            }
        }
        return list;
    }

    public List<Kho> readExcel(MultipartFile file) throws IOException {
        List<Kho> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            Kho kho = Kho.mapToKho(row); // map từ Row sang object
            list.add(kho);
        }
        workbook.close();
        return list;
    }
}

