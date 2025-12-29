package com.ecotel.quanlytaisan.service;
import com.ecotel.quanlytaisan.dao.NhomCCDCDAO;
import com.ecotel.quanlytaisan.model.NhomCCDC;
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

@Service
public class NhomCCDCService {

    @Autowired
    private NhomCCDCDAO dao;

    public List<NhomCCDC> getAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public PageResponse<NhomCCDC> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        List<NhomCCDC> items = dao.findAllPaged(idCongTy, page, size, sortBy, sortDir);
        long totalItems = dao.countAll(idCongTy);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public NhomCCDC getById(String id) {
        return dao.findById(id);
    }

    public int create(NhomCCDC nhom) {
        return dao.insert(nhom);
    }

    public int update(NhomCCDC nhom) {
        return dao.update(nhom);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public int createBatch(List<NhomCCDC> nhomCCDCs) {
        return dao.insertBatch(nhomCCDCs);
    }

    public int updateBatch(List<NhomCCDC> nhomCCDCs) {
        return dao.updateBatch(nhomCCDCs);
    }

    public int deleteBatch(List<String> ids) {
        return dao.deleteBatch(ids);
    }
    public List<NhomCCDC> readCsv(MultipartFile file) throws IOException {
        List<NhomCCDC> list = new ArrayList<>();

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
                NhomCCDC ts = NhomCCDC.mapToNhomCCDC(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<NhomCCDC> readExcel(MultipartFile file) throws IOException {
        List<NhomCCDC> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NhomCCDC ts = NhomCCDC.mapToNhomCCDC(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
