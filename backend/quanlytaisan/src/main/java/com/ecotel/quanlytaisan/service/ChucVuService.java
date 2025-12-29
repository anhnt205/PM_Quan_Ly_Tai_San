package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChucVuDao;
import com.ecotel.quanlytaisan.model.ChucVu;
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
public class ChucVuService {
    @Autowired
    private ChucVuDao chucVuDAO;

    // Thêm
    public int insert(ChucVu cv) {
        return chucVuDAO.insert(cv);
    }

    // Sửa
    public int update(ChucVu cv) {
        return chucVuDAO.update(cv);
    }

    // Xóa
    public int delete(String id) {
        return chucVuDAO.delete(id);
    }

    // Lấy tất cả theo công ty
    public List<ChucVu> findAll(String idCongTy) {
        return chucVuDAO.findAll(idCongTy);
    }

    public PageResponse<ChucVu> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        List<ChucVu> items = chucVuDAO.findAllPaged(idCongTy, page, size, sortBy, sortDir);
        long totalItems = chucVuDAO.countAll(idCongTy);
        return new PageResponse<>(items, totalItems, page, size);
    }

    // Lấy theo Id
    public ChucVu findById(String id) {
        return chucVuDAO.findById(id);
    }

    // Lấy theo tên (LIKE)
    public List<ChucVu> findByTen(String ten) {
        return chucVuDAO.findByTen(ten);
    }

    public List<ChucVu> readCsv(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();

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
                ChucVu ts = ChucVu.mapToChucVu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChucVu> readExcel(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChucVu ts = ChucVu.mapToChucVu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
