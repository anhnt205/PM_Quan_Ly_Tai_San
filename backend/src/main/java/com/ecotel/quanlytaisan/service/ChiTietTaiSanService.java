package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietTaiSanDao;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
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
public class ChiTietTaiSanService {
    @Autowired
    private ChiTietTaiSanDao dao;



    public List<ChiTietTaiSan> getAll(String idTaiSan) {
        return dao.findAll(idTaiSan);
    }

    public ChiTietTaiSan getById(String id) {
        return dao.findById(id);
    }

    public int create(ChiTietTaiSan ts) {
        return dao.insert(ts);
    }

    public int update(ChiTietTaiSan ts) {
        return dao.update(ts);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
    public List<ChiTietTaiSan> readCsv(MultipartFile file) throws IOException {
        List<ChiTietTaiSan> list = new ArrayList<>();

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
                ChiTietTaiSan ts = ChiTietTaiSan.mapToChiTietTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChiTietTaiSan> readExcel(MultipartFile file) throws IOException {
        List<ChiTietTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietTaiSan ts = ChiTietTaiSan.mapToChiTietTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
