package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DonViTinhDAO;
import com.ecotel.quanlytaisan.model.DonViTinh;
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
public class DonViTinhService {
    @Autowired
    private DonViTinhDAO donViTinhDAO;

    public DonViTinhService() {
        this.donViTinhDAO = new DonViTinhDAO();
    }

    public List<DonViTinh> getAll() {
        return donViTinhDAO.findAll();
    }

    public DonViTinh getById(String id) {
        return donViTinhDAO.findById(id);
    }

    public int create(DonViTinh dvt) {
        return donViTinhDAO.insert(dvt);
    }

    public int update(DonViTinh dvt) {
        return donViTinhDAO.update(dvt);
    }

    public int delete(String id) {
        return donViTinhDAO.delete(id);
    }

    public List<DonViTinh> readCsv(MultipartFile file) throws IOException {
        List<DonViTinh> list = new ArrayList<>();

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
                DonViTinh dvt = DonViTinh.mapToDonViTinh(fields); // map từ CSV sang object
                list.add(dvt);
            }
        }
        return list;
    }

    public List<DonViTinh> readExcel(MultipartFile file) throws IOException {
        List<DonViTinh> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            DonViTinh dvt = DonViTinh.mapToDonViTinh(row); // map từ Row sang object
            list.add(dvt);
        }
        workbook.close();
        return list;
    }
}
