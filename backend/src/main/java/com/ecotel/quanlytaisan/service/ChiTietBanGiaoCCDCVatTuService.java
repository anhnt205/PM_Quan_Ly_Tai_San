package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.model.BanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTu;
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
public class ChiTietBanGiaoCCDCVatTuService {
    @Autowired
    private ChiTietBanGiaoCCDCVatTuDao dao;
    @Autowired
    private BanGiaoCCDCVatTuDao bDao;

    public ChiTietBanGiaoCCDCVatTuService() {
        dao = new ChiTietBanGiaoCCDCVatTuDao();
    }

    public List<ChiTietBanGiaoCCDCVatTuDTO> findAll(String idBanGiaoCCDCVatTu) {
        return dao.findAll(idBanGiaoCCDCVatTu);
    }
    public List<ChiTietBanGiaoCCDCVatTu> getdAll() {
        return dao.getAll();
    }

    public List<ChiTietBanGiaoCCDCVatTuDTO> findByIdDieuDong(String idDieuDong) {
        List<BanGiaoCCDCVatTu> banGiaoCCDCVatTus = bDao.findByIdDieuDong(idDieuDong);
        System.out.println(banGiaoCCDCVatTus.size());
        List<ChiTietBanGiaoCCDCVatTuDTO> dtos = new ArrayList<>();
        for (BanGiaoCCDCVatTu banGiaoCCDCVatTu : banGiaoCCDCVatTus) {
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuList = dao.findAll(banGiaoCCDCVatTu.getId());
            dtos.addAll(chiTietBanGiaoCCDCVatTuList);
        }
        return dtos;
    }

    public ChiTietBanGiaoCCDCVatTuDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(ChiTietBanGiaoCCDCVatTu obj) {
        return dao.insert(obj);
    }

    public int update(ChiTietBanGiaoCCDCVatTu obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public List<ChiTietBanGiaoCCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<ChiTietBanGiaoCCDCVatTu> list = new ArrayList<>();

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
                ChiTietBanGiaoCCDCVatTu ts = ChiTietBanGiaoCCDCVatTu.mapToChiTietBanGiaoCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<ChiTietBanGiaoCCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<ChiTietBanGiaoCCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietBanGiaoCCDCVatTu ts = ChiTietBanGiaoCCDCVatTu.mapToChiTietBanGiaoCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
