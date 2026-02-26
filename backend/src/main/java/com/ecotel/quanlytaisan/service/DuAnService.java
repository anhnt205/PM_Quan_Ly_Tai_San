package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DuAnDao;
import com.ecotel.quanlytaisan.model.DuAn;
import com.ecotel.quanlytaisan.model.DuAnEnrichedDTO;
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
public class DuAnService {
    @Autowired
    private DuAnDao duAnDao;

    public DuAnService() {
        duAnDao = new DuAnDao();
    }

    public List<DuAnEnrichedDTO> getAll(String idCongTy) {
        return duAnDao.findAll(idCongTy);
    }

    public PageResponse<DuAnEnrichedDTO> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        List<DuAnEnrichedDTO> items = duAnDao.findAllPaged(idCongTy, page, size, sortBy, sortDir, search);
        long totalItems = duAnDao.countAll(idCongTy, search);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public DuAnEnrichedDTO getById(String id) {
        DuAnEnrichedDTO dto = duAnDao.findById(id);
        if (dto == null) {
            throw new RuntimeException("Không tìm thấy dự án với mã: " + id);
        }
        return dto;
    }

    public int create(DuAn da) {
        return duAnDao.insert(da);
    }

    public int update(DuAn da) {
        return duAnDao.update(da);
    }

    public int delete(String id) {
        return duAnDao.delete(id);
    }

    public List<DuAn> readCsv(MultipartFile file) throws IOException {
        List<DuAn> list = new ArrayList<>();

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
                DuAn ts = DuAn.mapToDuAn(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<DuAn> readExcel(MultipartFile file) throws IOException {
        List<DuAn> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            DuAn ts = DuAn.mapToDuAn(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }



    public void deleteAll() {
        duAnDao.deleteAll();
    }



}
