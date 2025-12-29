package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.TaiKhoanDao;
import com.ecotel.quanlytaisan.model.TaiKhoan;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.opencsv.CSVReader;
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
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanDao taiKhoanDao;

    public TaiKhoanService() {
        taiKhoanDao = new TaiKhoanDao();
    }

    public List<TaiKhoan> getAll() {
        return taiKhoanDao.findAll();
    }

    public PageResponse<TaiKhoan> getAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        
        long totalItems = taiKhoanDao.countAll(search);
        if (totalItems == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        
        List<TaiKhoan> items = taiKhoanDao.findAllPaged(page, size, sortBy, sortDir, search);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public TaiKhoan getById(String id) {
        return taiKhoanDao.findById(id);
    }

    public int create(TaiKhoan tk) {
        return taiKhoanDao.insert(tk);
    }

    public int update(TaiKhoan tk) {
        return taiKhoanDao.update(tk);
    }

    public int delete(String id) {
        return taiKhoanDao.delete(id);
    }

    public Map<String, Object> login(String tenDangNhap, String matKhau) {
        return taiKhoanDao.login(tenDangNhap, matKhau);
    }
    public List<TaiKhoan> readCsv(MultipartFile file) throws IOException {
        List<TaiKhoan> list = new ArrayList<>();

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
                TaiKhoan ts = TaiKhoan.mapToTaiKhoan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<TaiKhoan> readExcel(MultipartFile file) throws IOException {
        List<TaiKhoan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            TaiKhoan ts = TaiKhoan.mapToTaiKhoan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
