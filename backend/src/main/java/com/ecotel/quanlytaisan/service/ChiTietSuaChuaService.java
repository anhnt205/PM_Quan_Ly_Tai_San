package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietSuaChuaDao;
import com.ecotel.quanlytaisan.model.ChiTietSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietSuaChuaDTO;
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
public class ChiTietSuaChuaService {

    @Autowired
    private ChiTietSuaChuaDao chiTietSuaChuaDao;

    public List<ChiTietSuaChuaDTO> findByIdSuaChua(String idSuaChua) {
        return chiTietSuaChuaDao.findByIdSuaChua(idSuaChua);
    }

    public ChiTietSuaChuaDTO findById(String id) {
        return chiTietSuaChuaDao.findById(id);
    }

    public int insert(ChiTietSuaChua entity) {
        return chiTietSuaChuaDao.insert(entity);
    }

    public int update(ChiTietSuaChua entity) {
        return chiTietSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        return chiTietSuaChuaDao.delete(id);
    }

    public void bulkInsert(List<ChiTietSuaChua> list) {
        chiTietSuaChuaDao.batchInsert(list);
    }

    public void bulkUpdate(List<ChiTietSuaChua> list) {
        chiTietSuaChuaDao.batchUpdate(list);
    }

    public void bulkDelete(List<String> ids) {
        chiTietSuaChuaDao.batchDelete(ids);
    }


    public int deleteByIdSuaChua(String idSuaChua) {
        return chiTietSuaChuaDao.deleteByIdSuaChua(idSuaChua);
    }

    // Import từ CSV
    public List<ChiTietSuaChua> readCsv(MultipartFile file) throws IOException {
        List<ChiTietSuaChua> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                ChiTietSuaChua entity = ChiTietSuaChua.mapToChiTietSuaChua(fields);
                list.add(entity);
            }
        }
        return list;
    }

    // Import từ Excel
    public List<ChiTietSuaChua> readExcel(MultipartFile file) throws IOException {
        List<ChiTietSuaChua> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            ChiTietSuaChua entity = ChiTietSuaChua.mapToChiTietSuaChua(row);
            list.add(entity);
        }
        workbook.close();
        return list;
    }
}