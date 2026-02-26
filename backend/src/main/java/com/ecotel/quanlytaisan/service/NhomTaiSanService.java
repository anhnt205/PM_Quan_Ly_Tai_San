package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NhomTaiSanDao;
import com.ecotel.quanlytaisan.model.NhomTaiSan;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.TaiSan;
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

@Service
public class NhomTaiSanService {
    @Autowired
    private NhomTaiSanDao nhomTaiSanDao;

    public List<NhomTaiSan> getAll(String idCongTy) {
        return nhomTaiSanDao.findAll(idCongTy);
    }

    public PageResponse<NhomTaiSan> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        List<NhomTaiSan> items = nhomTaiSanDao.findAllPaged(idCongTy, page * size, size, sortBy, sortDir, search);
        long totalItems = nhomTaiSanDao.countAll(idCongTy, search);

        return new PageResponse<>(items, totalItems, page, size);
    }

    public NhomTaiSan getById(String id) {
        return nhomTaiSanDao.findById(id);
    }

    public int create(NhomTaiSan nts) {
        return nhomTaiSanDao.insert(nts);
    }

    public int update(NhomTaiSan nts) {
        return nhomTaiSanDao.update(nts);
    }

    public int delete(String id) {
        return nhomTaiSanDao.delete(id);
    }

    public List<NhomTaiSan> readCsv(MultipartFile file) throws IOException {
        List<NhomTaiSan> list = new ArrayList<>();

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
                NhomTaiSan ts = NhomTaiSan.mapToNhomTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<NhomTaiSan> readExcel(MultipartFile file) throws IOException {
        List<NhomTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NhomTaiSan ts = NhomTaiSan.mapToNhomTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }


    public void deleteAll() {
        nhomTaiSanDao.deleteAll();
    }


}
