package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.PhongBanDao;
import com.ecotel.quanlytaisan.model.PhongBan;
import com.ecotel.quanlytaisan.model.PhongBanDTO;
// removed unused imports
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
public class PhongBanService {
    @Autowired
    private PhongBanDao phongBanDao;

    public PhongBanService() {
        phongBanDao = new PhongBanDao();
    }

    public List<PhongBanDTO> getAll(String idCongTy) {
        return phongBanDao.findAll(idCongTy);
    }

    public PageResponse<PhongBanDTO> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String keyword) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = phongBanDao.countByCongTy(idCongTy, keyword);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<PhongBanDTO> items = phongBanDao.findAllPaged(idCongTy, offset, size, sortBy, sortDir, keyword);
        return new PageResponse<>(items, total, page, size);
    }

    public PhongBanDTO getById(String id) {
        return phongBanDao.findById(id);
    }

    public int create(PhongBan pb) {
        return phongBanDao.insert(pb);
    }

    public int update(PhongBan pb) {
        return phongBanDao.update(pb);
    }

    public int delete(String id) {
        return phongBanDao.delete(id);
    }
    public List<PhongBan> readCsv(MultipartFile file) throws IOException {
        List<PhongBan> list = new ArrayList<>();

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
                PhongBan ts = PhongBan.mapToPhongBan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<PhongBan> readExcel(MultipartFile file) throws IOException {
        List<PhongBan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            PhongBan ts = PhongBan.mapToPhongBan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
