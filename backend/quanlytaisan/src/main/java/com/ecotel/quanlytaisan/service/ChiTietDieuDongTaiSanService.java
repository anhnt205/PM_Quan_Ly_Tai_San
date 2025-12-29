package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDieuDongTaiSanDao;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSanDTO;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSan;
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
public class ChiTietDieuDongTaiSanService {
    @Autowired
    private ChiTietDieuDongTaiSanDao dao;

    public ChiTietDieuDongTaiSanService() {
        dao = new ChiTietDieuDongTaiSanDao();
    }

    public List<ChiTietDieuDongTaiSanDTO> findAll(String idDieuDongTaiSan) {
        return dao.findAll(idDieuDongTaiSan);
    }

    public ChiTietDieuDongTaiSanDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(ChiTietDieuDongTaiSan obj) {
        return dao.insert(obj);
    }

    public int update(ChiTietDieuDongTaiSan obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public List<ChiTietDieuDongTaiSan> readCsv(MultipartFile file) throws IOException {
        List<ChiTietDieuDongTaiSan> list = new ArrayList<>();

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
                ChiTietDieuDongTaiSan ts = ChiTietDieuDongTaiSan.mapToChiTietDieuDongTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChiTietDieuDongTaiSan> readExcel(MultipartFile file) throws IOException {
        List<ChiTietDieuDongTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietDieuDongTaiSan ts = ChiTietDieuDongTaiSan.mapToChiTietDieuDongTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
