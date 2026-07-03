package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SetNguonKinhPhiDao;
import com.ecotel.quanlytaisan.model.NguonKinhPhi;
import com.ecotel.quanlytaisan.model.SetNguonKinhPhi;
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
public class SetNguonKinhPhiService {
    @Autowired
    private SetNguonKinhPhiDao setNguonKinhPhiDao;

    public SetNguonKinhPhiService() {
        this.setNguonKinhPhiDao = new SetNguonKinhPhiDao();
    }

    public List<SetNguonKinhPhi> getAll() {
        return setNguonKinhPhiDao.findAll();
    }

    public List<SetNguonKinhPhi> getByTaiSanId(String idTaiSan) {
        return setNguonKinhPhiDao.findByTaiSanId(idTaiSan);
    }

    public List<SetNguonKinhPhi> getByNguonKinhPhiId(String idNguonKinhPhi) {
        return setNguonKinhPhiDao.findByNguonKinhPhiId(idNguonKinhPhi);
    }

    public SetNguonKinhPhi getById(String id) {
        return setNguonKinhPhiDao.findById(id);
    }

    public int create(SetNguonKinhPhi snkp) {
        return setNguonKinhPhiDao.insert(snkp);
    }

    public int update(SetNguonKinhPhi snkp) {
        return setNguonKinhPhiDao.update(snkp);
    }

    public int delete(String id) {
        return setNguonKinhPhiDao.delete(id);
    }

    public int deleteByTaiSanId(String idTaiSan) {
        return setNguonKinhPhiDao.deleteByTaiSanId(idTaiSan);
    }

    public int deleteByNguonKinhPhiId(String idNguonKinhPhi) {
        return setNguonKinhPhiDao.deleteByNguonKinhPhiId(idNguonKinhPhi);
    }

    public List<NguonKinhPhi> getNguonKinhPhiByTaiSan(String idTaiSan) {
        return setNguonKinhPhiDao.getNguonKinhPhiByTaiSan(idTaiSan);
    }

    public List<SetNguonKinhPhi> readCsv(MultipartFile file) throws IOException {
        List<SetNguonKinhPhi> list = new ArrayList<>();

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
                SetNguonKinhPhi snkp = SetNguonKinhPhi.mapToSetNguonKinhPhi(fields); // map từ CSV sang object
                list.add(snkp);
            }
        }
        return list;
    }

    public List<SetNguonKinhPhi> readExcel(MultipartFile file) throws IOException {
        List<SetNguonKinhPhi> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            SetNguonKinhPhi snkp = SetNguonKinhPhi.mapToSetNguonKinhPhi(row); // map từ Row sang object
            list.add(snkp);
        }
        workbook.close();
        return list;
    }
}
