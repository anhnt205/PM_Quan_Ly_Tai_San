package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NhomDonViDao;
import com.ecotel.quanlytaisan.model.NhomDonVi;
import com.ecotel.quanlytaisan.model.NhomDonVi;
import com.ecotel.quanlytaisan.model.NhomDonVi;
import com.opencsv.CSVReader;
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
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class NhomDonViService {
    @Autowired
    private NhomDonViDao nhomDonViDao;

    public NhomDonViService() {
        nhomDonViDao= new NhomDonViDao();
    }

    public List<NhomDonVi> getAll(String idCongTy) {
        return nhomDonViDao.findAll(idCongTy);
    }

    public NhomDonVi getById(String id) {
        return nhomDonViDao.findById(id);
    }

    public int create(NhomDonVi ndv) {
        return nhomDonViDao.insert(ndv);
    }

    public int update(NhomDonVi ndv) {
        return nhomDonViDao.update(ndv);
    }

    public int delete(String id) {
        return nhomDonViDao.delete(id);
    }
    public List<NhomDonVi> readCsv(MultipartFile file) throws IOException {
        List<NhomDonVi> list = new ArrayList<>();

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
                NhomDonVi ts = NhomDonVi.mapToNhomDonVi(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<NhomDonVi> readExcel(MultipartFile file) throws IOException {
        List<NhomDonVi> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NhomDonVi ts = NhomDonVi.mapToNhomDonVi(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
