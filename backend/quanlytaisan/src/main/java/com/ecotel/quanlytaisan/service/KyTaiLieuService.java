package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DuAnDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.KyTaiLieu;
import com.ecotel.quanlytaisan.model.NguoiKy;
import com.ecotel.quanlytaisan.model.NguoiKy;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class KyTaiLieuService {
    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<KyTaiLieu> getList(String idTaiLieu) {
        return kyTaiLieuDao.findById(idTaiLieu);
    }

    public KyTaiLieu getById(String id) {
        List<KyTaiLieu> list = kyTaiLieuDao.findById(id);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }
    public int addKyTaiLieu(KyTaiLieu ktLieu) {
        return kyTaiLieuDao.insert(ktLieu);
    }

    public int delete(String id) {
        return kyTaiLieuDao.delete(id);
    }

    public int addNguoiKy(NguoiKy nguoiKy) {
        return kyTaiLieuDao.addNguoiKy(nguoiKy);
    }

    public int updateTrangThai(String id, String trangThai) {
        return kyTaiLieuDao.updateTrangThai(id, trangThai);
    }

    public List<NguoiKy> getAllNguoiKyByIdTaiLieu(String idTaiLieu) {
      return kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(idTaiLieu);
    }

    public NguoiKy getNguoiKy(String idNguoiKy, String idTaiLieu) {
        return kyTaiLieuDao.getNguoiKy(idNguoiKy, idTaiLieu);
    }
    public List<NguoiKy> readCsv(MultipartFile file) throws IOException {
        List<NguoiKy> list = new ArrayList<>();

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
                NguoiKy ts = NguoiKy.mapToNguoiKy(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<NguoiKy> readExcel(MultipartFile file) throws IOException {
        List<NguoiKy> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NguoiKy ts = NguoiKy.mapToNguoiKy(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
    public int updateNguoiKy(String idTaiLieu, List<NguoiKy>nguoiKyList){
        return kyTaiLieuDao.updateNguoiKy(idTaiLieu, nguoiKyList);
    }
}
