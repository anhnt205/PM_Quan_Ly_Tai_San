package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTu;
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
public class ChiTietDieuDongCCDCVatTuService {
    @Autowired
    private ChiTietDieuDongCCDCVatTuDao dao;

    public ChiTietDieuDongCCDCVatTuService() {
        dao = new ChiTietDieuDongCCDCVatTuDao();
    }

    public List<ChiTietDieuDongCCDCVatTuDTO> findAll(String IdDieuDongCCDCVatTu) {
        return dao.findAll(IdDieuDongCCDCVatTu);
    }
    public List<ChiTietDieuDongCCDCVatTu> getAll() {
        return dao.getAll();
    }


    public ChiTietDieuDongCCDCVatTuDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(ChiTietDieuDongCCDCVatTu obj) {
        return dao.insert(obj);
    }

    public int update(ChiTietDieuDongCCDCVatTu obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public List<ChiTietDieuDongCCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<ChiTietDieuDongCCDCVatTu> list = new ArrayList<>();

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
                ChiTietDieuDongCCDCVatTu ts = ChiTietDieuDongCCDCVatTu.mapToChiTietDieuDongCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChiTietDieuDongCCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<ChiTietDieuDongCCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietDieuDongCCDCVatTu ts = ChiTietDieuDongCCDCVatTu.mapToChiTietDieuDongCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
