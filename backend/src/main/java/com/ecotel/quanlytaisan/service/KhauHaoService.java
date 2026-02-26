package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KhauHaoDAO;
import com.ecotel.quanlytaisan.model.KhauHao;
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
public class KhauHaoService {
    @Autowired
    private KhauHaoDAO dao;

    public List<KhauHao> findAll() {
        return dao.findAll();
    }

    public PageResponse<KhauHao> findAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        List<KhauHao> items = dao.findAllPaged(page, size, sortBy, sortDir, search);
        long totalItems = dao.countAll(search);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public KhauHao findById(String id) {
        return dao.findById(id);
    }

    public int insert(KhauHao khauHao) {
        return dao.insert(khauHao);
    }

    public int update(KhauHao khauHao) {
        return dao.update(khauHao);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
    public List<KhauHao> readCsv(MultipartFile file) throws IOException {
        List<KhauHao> list = new ArrayList<>();

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
                KhauHao ts = KhauHao.mapToKhauHao(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<KhauHao> readExcel(MultipartFile file) throws IOException {
        List<KhauHao> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            KhauHao ts = KhauHao.mapToKhauHao(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
