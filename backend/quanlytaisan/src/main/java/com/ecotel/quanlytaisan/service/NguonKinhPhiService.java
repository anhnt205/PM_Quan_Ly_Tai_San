package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NguonKinhPhiDao;
import com.ecotel.quanlytaisan.model.NguonKinhPhi;
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
public class NguonKinhPhiService {
    @Autowired
    private NguonKinhPhiDao nguonKinhPhiDao;

    public NguonKinhPhiService() {
        this.nguonKinhPhiDao = new NguonKinhPhiDao();
    }

    public List<NguonKinhPhi> getAll() {
        return nguonKinhPhiDao.findAll();
    }

    public PageResponse<NguonKinhPhi> getAllPaged(int page, int size, String sortBy, String sortDir) {
        List<NguonKinhPhi> items = nguonKinhPhiDao.findAllPaged(page, size, sortBy, sortDir);
        long totalItems = nguonKinhPhiDao.countAll();
        return new PageResponse<>(items, totalItems, page, size);
    }

    public NguonKinhPhi getById(String id) {
        return nguonKinhPhiDao.findById(id);
    }

    public int create(NguonKinhPhi nkp) {
        return nguonKinhPhiDao.insert(nkp);
    }

    public int update(NguonKinhPhi nkp) {
        return nguonKinhPhiDao.update(nkp);
    }

    public int delete(String id) {
        return nguonKinhPhiDao.delete(id);
    }

    public List<NguonKinhPhi> readCsv(MultipartFile file) throws IOException {
        List<NguonKinhPhi> list = new ArrayList<>();

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
                NguonKinhPhi nkp = NguonKinhPhi.mapToNguonKinhPhi(fields); // map từ CSV sang object
                list.add(nkp);
            }
        }
        return list;
    }

    public List<NguonKinhPhi> readExcel(MultipartFile file) throws IOException {
        List<NguonKinhPhi> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NguonKinhPhi nkp = NguonKinhPhi.mapToNguonKinhPhi(row); // map từ Row sang object
            list.add(nkp);
        }
        workbook.close();
        return list;
    }
}
