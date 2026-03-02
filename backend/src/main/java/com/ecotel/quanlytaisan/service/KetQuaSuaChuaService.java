package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietKetQuaSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KetQuaSuaChuaDao;
import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
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
public class KetQuaSuaChuaService {

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        KetQuaSuaChuaDTO dto = ketQuaSuaChuaDao.findByIdSuaChua(idSuaChua);
        if (dto != null) {
            dto.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(dto.getId()));
        }
        return dto;
    }

    public KetQuaSuaChua findById(String id) {
        return ketQuaSuaChuaDao.findById(id);
    }

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        return ketQuaSuaChuaDao.insert(entity);
    }

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        return ketQuaSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        // Chi tiết kết quả sẽ tự xóa nếu có ON DELETE CASCADE
        return ketQuaSuaChuaDao.delete(id);
    }

    // Import CSV/Excel (nếu cần)
    public List<KetQuaSuaChua> readCsv(MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = new ArrayList<>();
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
                KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(fields);
                list.add(entity);
            }
        }
        return list;
    }

    public List<KetQuaSuaChua> readExcel(MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(row);
            list.add(entity);
        }
        workbook.close();
        return list;
    }
}