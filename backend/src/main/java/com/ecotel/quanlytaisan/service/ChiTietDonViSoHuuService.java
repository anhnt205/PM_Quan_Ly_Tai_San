package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDonViSoHuuDao;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuuEnrichedDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecotel.quanlytaisan.model.PageResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChiTietDonViSoHuuService {

    @Autowired
    private ChiTietDonViSoHuuDao dao;

    public List<ChiTietDonViSoHuu> getAll() {
        return dao.findAll();
    }

    public ChiTietDonViSoHuu getById(String id) {
        return dao.findById(id);
    }

    public List<ChiTietDonViSoHuu> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return dao.findAll();
        }
        return dao.search(keyword.trim());
    }

    public List<ChiTietDonViSoHuu> getByIdCCDCVT(String idCCDCVT) {
        return dao.findByIdCCDCVT(idCCDCVT);
    }

    public List<ChiTietDonViSoHuu> getByIdDonViSoHuu(String idDonViSoHuu) {
        return dao.findByIdDonViSoHuu(idDonViSoHuu);
    }

    /**
     * Lấy danh sách ChiTietDonViSoHuu theo idDonViSoHuu, đã JOIN sẵn thông tin
     * CCDCVatTu và ChiTietTaiSan trong một câu SQL dữ liệu đầy đủ.
     */
    public List<ChiTietDonViSoHuuEnrichedDTO> getEnrichedByIdDonViSoHuu(String idDonViSoHuu,String loai) {
        return dao.findEnrichedByIdDonViSoHuu(idDonViSoHuu,loai);
    }

    public ChiTietDonViSoHuu add(ChiTietDonViSoHuu entity) {
        dao.insert(entity); // entity.id được set bên DAO
        return entity;
    }

    public boolean update(String id, ChiTietDonViSoHuu entity) {
        entity.setId(id);
        return dao.update(entity) > 0;
    }

    public boolean delete(String id) {
        return dao.deleteById(id) > 0;
    }

    /**
     * Bàn giao tài sản từ đơn vị gửi sang đơn vị nhận
     */
    public int updateSoLuong(String idCCDCVT,
                             String idDonViGui,
                             String idDonViNhan,
                             int soLuongBanGiao,
                             String soQuyetDinh,
                             String soChungTu,
                             String thoiGianBanGiao, String idTaiSanCon) {
        return dao.updateSoLuong(
                idCCDCVT,
                idDonViGui,
                idDonViNhan,
                soLuongBanGiao,
                soQuyetDinh,
                soChungTu,
                thoiGianBanGiao, idTaiSanCon
        );
    }

    /**
     * Lấy danh sách unique IdDonViSoHuu đang sở hữu một tài sản (IdCCDCVT)
     */
    public List<String> getNhomDonViSoHuu(String idTaiSan) {
        return dao.getNhomDonViSoHuu(idTaiSan);
    }

    public List<ChiTietDonViSoHuu> readCsv(MultipartFile file) throws IOException {
        List<ChiTietDonViSoHuu> list = new ArrayList<>();

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
                ChiTietDonViSoHuu ts = ChiTietDonViSoHuu.mapToChiTietDonViSoHuu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public PageResponse<ChiTietDonViSoHuuEnrichedDTO> getPagedEnriched(int page, int size, String search, String idDonViSoHuu, String date) {
        int offset = page * size;
        int total = dao.countAll(search, idDonViSoHuu, date);
        List<ChiTietDonViSoHuuEnrichedDTO> items = dao.findAllPagedEnriched(offset, size, search, idDonViSoHuu, date);
        return new PageResponse<>(items, total, page, size);
    }

    public List<ChiTietDonViSoHuu> readExcel(MultipartFile file) throws IOException {
        List<ChiTietDonViSoHuu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            ChiTietDonViSoHuu ts = ChiTietDonViSoHuu.mapToChiTietDonViSoHuu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
