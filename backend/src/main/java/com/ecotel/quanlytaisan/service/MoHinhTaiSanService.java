package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.MoHinhTaiSanDao;
import com.ecotel.quanlytaisan.model.MoHinhTaiSan;
import com.ecotel.quanlytaisan.model.MoHinhTaiSanEnrichedDTO;
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
public class MoHinhTaiSanService {
    @Autowired
    private MoHinhTaiSanDao moHinhTaiSanDao;

    public MoHinhTaiSanService() {
        moHinhTaiSanDao = new MoHinhTaiSanDao();
    }

    public List<MoHinhTaiSanEnrichedDTO> getAll(String idCongTy) {
        return moHinhTaiSanDao.findAll(idCongTy);
    }

    public PageResponse<MoHinhTaiSanEnrichedDTO> getAllPaged(
            String idCongTy, int page, int size, String sortBy, String sortDir, String search) {

        List<MoHinhTaiSanEnrichedDTO> items = moHinhTaiSanDao.findAllPaged(idCongTy, page, size, sortBy, sortDir, search);
        long totalItems = moHinhTaiSanDao.countAll(idCongTy, search);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public MoHinhTaiSanEnrichedDTO getById(String id) {
        MoHinhTaiSanEnrichedDTO dto = moHinhTaiSanDao.findById(id);
        if (dto == null) {
            throw new RuntimeException("Không tìm thấy mô hình tài sản với mã: " + id);
        }
        return dto;
    }

    public int create(MoHinhTaiSan mhts) {
        return moHinhTaiSanDao.insert(mhts);
    }

    public int batchCreate(List<MoHinhTaiSan> list) {
        return moHinhTaiSanDao.batchCreate(list);
    }

    public int update(MoHinhTaiSan mhts) {
        return moHinhTaiSanDao.update(mhts);
    }

    public int batchUpdate(List<MoHinhTaiSan> list) {
        return moHinhTaiSanDao.batchUpdate(list);
    }

    public int delete(String id) {
        return moHinhTaiSanDao.delete(id);
    }

    public int batchDelete(List<String> ids) {
        return moHinhTaiSanDao.batchDelete(ids);
    }
    public List<MoHinhTaiSan> readCsv(MultipartFile file) throws IOException {
        List<MoHinhTaiSan> list = new ArrayList<>();

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
                MoHinhTaiSan ts = MoHinhTaiSan.mapToMoHinhTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<MoHinhTaiSan> readExcel(MultipartFile file) throws IOException {
        List<MoHinhTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            MoHinhTaiSan ts = MoHinhTaiSan.mapToMoHinhTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }


    public void deleteAll() {
        moHinhTaiSanDao.deleteAll();
    }


}
