package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiTaiSanDao;
import com.ecotel.quanlytaisan.model.LoaiTaiSan;
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
public class LoaiTaiSanService {
    @Autowired
    private LoaiTaiSanDao loaiTaiSanDao;

    public LoaiTaiSanService() {
        loaiTaiSanDao = new LoaiTaiSanDao();
    }

    public List<LoaiTaiSan> getAll(String idCongty) {
        return loaiTaiSanDao.findAll(idCongty);
    }

    public PageResponse<LoaiTaiSan> getAllPaged(String idCongty, int page, int size, String sortBy, String sortDir) {
        List<LoaiTaiSan> items = loaiTaiSanDao.findAllPaged(idCongty, page, size, sortBy, sortDir);
        long totalItems = loaiTaiSanDao.countAll(idCongty);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public LoaiTaiSan getById(String id) {
        return loaiTaiSanDao.findById(id);
    }

    public int create(LoaiTaiSan lts) {
        return loaiTaiSanDao.insert(lts);
    }

    public int update(LoaiTaiSan lts) {
        return loaiTaiSanDao.update(lts);
    }

    public int delete(String id) {
        return loaiTaiSanDao.delete(id);
    }
    public List<LoaiTaiSan> readCsv(MultipartFile file) throws IOException {
        List<LoaiTaiSan> list = new ArrayList<>();

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
                LoaiTaiSan ts = LoaiTaiSan.mapToLoaiTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<LoaiTaiSan> readExcel(MultipartFile file) throws IOException {
        List<LoaiTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            LoaiTaiSan ts = LoaiTaiSan.mapToLoaiTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
