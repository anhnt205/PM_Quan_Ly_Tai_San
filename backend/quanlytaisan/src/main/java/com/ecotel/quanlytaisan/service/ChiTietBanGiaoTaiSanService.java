package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoTaiSanDao;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSanDTO;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSan;
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
public class ChiTietBanGiaoTaiSanService {
    @Autowired
    private ChiTietBanGiaoTaiSanDao dao;

    public ChiTietBanGiaoTaiSanService() {
        dao = new ChiTietBanGiaoTaiSanDao();
    }

    public List<ChiTietBanGiaoTaiSanDTO> findAll(String idBanGiaoTaiSan) {
        return dao.findAll(idBanGiaoTaiSan);
    }

    public ChiTietBanGiaoTaiSanDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(ChiTietBanGiaoTaiSan obj) {
        return dao.insert(obj);
    }

    public int update(ChiTietBanGiaoTaiSan obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public List<ChiTietBanGiaoTaiSan> readCsv(MultipartFile file) throws IOException {
        List<ChiTietBanGiaoTaiSan> list = new ArrayList<>();

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
                ChiTietBanGiaoTaiSan ts = ChiTietBanGiaoTaiSan.mapToChiTietBanGiaoTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChiTietBanGiaoTaiSan> readExcel(MultipartFile file) throws IOException {
        List<ChiTietBanGiaoTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietBanGiaoTaiSan ts = ChiTietBanGiaoTaiSan.mapToChiTietBanGiaoTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
