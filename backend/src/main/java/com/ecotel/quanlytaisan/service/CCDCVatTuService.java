package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietDonViSoHuuDao;
import com.ecotel.quanlytaisan.dao.ChiTietTaiSanDao;
import com.ecotel.quanlytaisan.dao.TaiSanDao;
import com.ecotel.quanlytaisan.model.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class CCDCVatTuService {
    @Autowired
    private CCDCVatTuDao ccdcVatTuDao;
    @Autowired
    private ChiTietTaiSanDao chiTietTaiSanDao;
    @Autowired
    private TaiSanDao taiSanDao;
    @Autowired
    private ChiTietDonViSoHuuDao chiTietDonViSoHuuDao;

    public List<CCDCVatTuDTO> getAll(String idCongTy) {
        List<CCDCVatTuDTO> taiSanDTOList = ccdcVatTuDao.findAll(idCongTy);
        // for (CCDCVatTuDTO taiSanDTO : taiSanDTOList) {
        //     List<ChiTietTaiSan> chiTietTaiSanList = chiTietTaiSanDao.findAll(taiSanDTO.getId());
        //     taiSanDTO.setChiTietTaiSanList(chiTietTaiSanList);
        //     List<TaiSanCon> taiSanConList = taiSanDao.getTaiSanConByTaiSan(taiSanDTO.getId());
        //     taiSanDTO.setTaiSanConList(taiSanConList);
        //     List<ChiTietDonViSoHuu>chiTietDonViSoHuuList = chiTietDonViSoHuuDao.findByIdCCDCVT(taiSanDTO.getId());
        //     taiSanDTO.setChiTietDonViSoHuuList(chiTietDonViSoHuuList);
        // }
        return taiSanDTOList;
    }

    public PageResponse<CCDCVatTuDTO> getAllPaged(
        String idCongTy, int page, int size,
        String sortBy, String sortDir,
        String search, String idDonViSoHuu,String idNhomCCDC) {

        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        boolean hasDonVi = idDonViSoHuu != null && !idDonViSoHuu.trim().isEmpty();

        long total = ccdcVatTuDao.countAllPaged(idCongTy, search, idDonViSoHuu,idNhomCCDC);
        if (total == 0) return new PageResponse<>(List.of(), 0, page, size);

        int offset = page * size;
        List<CCDCVatTuDTO> items = ccdcVatTuDao.findAllPaged(
                idCongTy, offset, size, sortBy, sortDir, search, idDonViSoHuu,idNhomCCDC);

        for (CCDCVatTuDTO item : items) {
            item.setChiTietTaiSanList(chiTietTaiSanDao.findAll(item.getId()));
            item.setTaiSanConList(taiSanDao.getTaiSanConByTaiSan(item.getId()));

            // Nếu lọc theo đơn vị: chỉ trả ChiTietDonViSoHuu của đơn vị đó
            List<ChiTietDonViSoHuu> chiTietList = hasDonVi
                    ? chiTietDonViSoHuuDao.findByIdCCDCVTAndIdDonViSoHuu(item.getId(), idDonViSoHuu)
                    : chiTietDonViSoHuuDao.findByIdCCDCVT(item.getId());
            item.setChiTietDonViSoHuuList(chiTietList);
        }

        return new PageResponse<>(items, total, page, size);
    }

    public PageResponse<CCDCVatTuDTO> getAllPagedByDonVi(String idCongTy, String idDonVi, int page, int size, String sortBy, String sortDir) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        // Tối ưu tương tự: Gọi DAO trực tiếp
        List<CCDCVatTuDTO> all = ccdcVatTuDao.findAll(idCongTy);
        List<CCDCVatTuDTO> filtered = new ArrayList<>();
        for (CCDCVatTuDTO item : all) {
            if (item.getIdDonVi() != null && item.getIdDonVi().equals(idDonVi)) {
                filtered.add(item);
            }
        }

        // Apply sorting
        filtered.sort(getComparator(sortBy, sortDir));

        long total = filtered.size();
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }

        int fromIndex = Math.min(page * size, filtered.size());
        int toIndex = Math.min(fromIndex + size, filtered.size());
        List<CCDCVatTuDTO> items = new ArrayList<>(filtered.subList(fromIndex, toIndex));

        // Load chi tiết cho trang hiện tại
        for (CCDCVatTuDTO item : items) {
            List<ChiTietTaiSan> chiTietTaiSanList = chiTietTaiSanDao.findAll(item.getId());
            item.setChiTietTaiSanList(chiTietTaiSanList);
            List<TaiSanCon> taiSanConList = taiSanDao.getTaiSanConByTaiSan(item.getId());
            item.setTaiSanConList(taiSanConList);
            List<ChiTietDonViSoHuu> chiTietDonViSoHuuList = chiTietDonViSoHuuDao.findByIdCCDCVT(item.getId());
            item.setChiTietDonViSoHuuList(chiTietDonViSoHuuList);
        }

        return new PageResponse<>(items, total, page, size);
    }

    private PageResponse<CCDCVatTuDTO> getPagedByBanGiaoStatus(String idCongTy, String idDonViSoHuu, int page, int size, String sortBy, String sortDir, boolean daBanGiao) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        long total = ccdcVatTuDao.countByDonViSoHuu(idCongTy, idDonViSoHuu, daBanGiao);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }

        int offset = page * size;
        List<CCDCVatTuDTO> items = ccdcVatTuDao.findAllPagedByDonViSoHuu(idCongTy, idDonViSoHuu, offset, size, sortBy, sortDir, daBanGiao);
        for (CCDCVatTuDTO item : items) {
            List<ChiTietTaiSan> chiTietTaiSanList = chiTietTaiSanDao.findAll(item.getId());
            item.setChiTietTaiSanList(chiTietTaiSanList);
            List<TaiSanCon> taiSanConList = taiSanDao.getTaiSanConByTaiSan(item.getId());
            item.setTaiSanConList(taiSanConList);
            List<ChiTietDonViSoHuu> chiTietDonViSoHuuList = chiTietDonViSoHuuDao.findByIdCCDCVT(item.getId());
            item.setChiTietDonViSoHuuList(chiTietDonViSoHuuList);
        }
        return new PageResponse<>(items, total, page, size);
    }

    public PageResponse<CCDCVatTuDTO> getPagedDaBanGiaoByDonViSoHuu(String idCongTy, String idDonViSoHuu, int page, int size, String sortBy, String sortDir) {
        return getPagedByBanGiaoStatus(idCongTy, idDonViSoHuu, page, size, sortBy, sortDir, true);
    }

    public PageResponse<CCDCVatTuDTO> getPagedChuaBanGiaoByDonViSoHuu(String idCongTy, String idDonViSoHuu, int page, int size, String sortBy, String sortDir) {
        return getPagedByBanGiaoStatus(idCongTy, idDonViSoHuu, page, size, sortBy, sortDir, false);
    }

    private Comparator<CCDCVatTuDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");
        
        Comparator<CCDCVatTuDTO> comparator = null;
        
        switch (normalizedSortBy) {
            case "ten":
                comparator = Comparator.comparing(
                    item -> item.getTen() != null ? item.getTen() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "tendonvi":
                comparator = Comparator.comparing(
                    item -> item.getTenDonVi() != null ? item.getTenDonVi() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "tennhomccdc":
                comparator = Comparator.comparing(
                    item -> item.getTenNhomCCDC() != null ? item.getTenNhomCCDC() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaynhap":
                comparator = Comparator.comparing(
                    item -> item.getNgayNhap() != null ? item.getNgayNhap() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "soluong":
                comparator = Comparator.comparing(
                    item -> item.getSoLuong() != null ? item.getSoLuong() : 0,
                    Comparator.nullsLast(Integer::compareTo)
                );
                break;
            case "giatri":
                comparator = Comparator.comparing(
                    item -> item.getGiaTri() != null ? item.getGiaTri() : 0.0,
                    Comparator.nullsLast(Double::compareTo)
                );
                break;
            case "ngaytao":
                comparator = Comparator.comparing(
                    item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaycapnhat":
            default:
                comparator = Comparator.comparing(
                    item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
        }
        
        if (comparator == null) {
            // Default to ngayCapNhat
            comparator = Comparator.comparing(
                item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
            );
        }
        
        return ascending ? comparator : comparator.reversed();
    }

    public CCDCVatTuDTO getById(String id) {
        return ccdcVatTuDao.findById(id);
    }

    public int create(CCDCVatTu ccdc) {
        return ccdcVatTuDao.insert(ccdc);
    }

    public int update(CCDCVatTu ccdc) {
        return ccdcVatTuDao.update(ccdc);
    }

    public int delete(String id) {
        taiSanDao.deleteTaiSanConByTaiSan(id);
        return ccdcVatTuDao.delete(id);
    }

    public int deleteAll() {
        ccdcVatTuDao.deleteAllChiTietTaiSan();
        ccdcVatTuDao.deleteAllChiTietDonViSoHuu();
        return ccdcVatTuDao.deleteAll();
    }

    public List<CCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<CCDCVatTu> list = new ArrayList<>();

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
                CCDCVatTu ts = CCDCVatTu.mapToCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<CCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<CCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            CCDCVatTu ts = CCDCVatTu.mapToCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }

    public void exportToExcel(String idCongTy, OutputStream outputStream) throws IOException {
        // Lấy danh sách CCDC/Vật tư trực tiếp từ DAO (không load các list con để tối ưu performance)
        List<CCDCVatTuDTO> list = ccdcVatTuDao.findAll(idCongTy);

        // Tạo workbook và sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("CCDCVatTu");

        // Tạo font cho header
        Font headerFont = workbook.createFont();
        headerFont.setFontName("Times New Roman");
        headerFont.setFontHeightInPoints((short) 13);
        headerFont.setBold(true);

        // Tạo style cho header
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        // Tạo font cho data
        Font dataFont = workbook.createFont();
        dataFont.setFontName("Times New Roman");
        dataFont.setFontHeightInPoints((short) 13);

        // Tạo style cho data
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setFont(dataFont);
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);

        // Tạo style cho số
        CellStyle numberStyle = workbook.createCellStyle();
        numberStyle.setFont(dataFont);
        numberStyle.setBorderBottom(BorderStyle.THIN);
        numberStyle.setBorderTop(BorderStyle.THIN);
        numberStyle.setBorderLeft(BorderStyle.THIN);
        numberStyle.setBorderRight(BorderStyle.THIN);
        numberStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("#,##0"));

        // Tạo header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "Mã công cụ dụng cụ",
            "Mã đơn vị",
            "Tên công cụ dụng cụ",
            "Ngày nhập",
            "Mã đơn vị tính",
            "Mã nhóm CCDC",
            "Mã loại CCDC con",
            "Giá trị",
            "Ký hiệu",
            "Ghi chú",
            "Số ký hiệu",
            "Số lượng",
            "Công suất",
            "Nước sản xuất",
            "Năm sản xuất"
        };

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Ghi dữ liệu
        int rowNum = 1;
        for (CCDCVatTuDTO item : list) {
            Row row = sheet.createRow(rowNum++);
            
            // Mã công cụ dụng cụ
            Cell cell0 = row.createCell(0);
            cell0.setCellValue(item.getId() != null ? item.getId() : "");
            cell0.setCellStyle(dataStyle);
            
            // Mã đơn vị
            Cell cell1 = row.createCell(1);
            cell1.setCellValue(item.getIdDonVi() != null ? item.getIdDonVi() : "");
            cell1.setCellStyle(dataStyle);
            
            // Tên công cụ dụng cụ
            Cell cell2 = row.createCell(2);
            cell2.setCellValue(item.getTen() != null ? item.getTen() : "");
            cell2.setCellStyle(dataStyle);
            
            // Ngày nhập
            Cell cell3 = row.createCell(3);
            cell3.setCellValue(item.getNgayNhap() != null ? item.getNgayNhap() : "");
            cell3.setCellStyle(dataStyle);
            
            // Mã đơn vị tính
            Cell cell4 = row.createCell(4);
            cell4.setCellValue(item.getDonViTinh() != null ? item.getDonViTinh() : "");
            cell4.setCellStyle(dataStyle);
            
            // Mã nhóm CCDC
            Cell cell5 = row.createCell(5);
            cell5.setCellValue(item.getIdNhomCCDC() != null ? item.getIdNhomCCDC() : "");
            cell5.setCellStyle(dataStyle);
            
            // Mã loại CCDC con
            Cell cell6 = row.createCell(6);
            cell6.setCellValue(item.getIdLoaiCCDCCon() != null ? item.getIdLoaiCCDCCon() : "");
            cell6.setCellStyle(dataStyle);
            
            // Giá trị
            Cell cell7 = row.createCell(7);
            if (item.getGiaTri() != null) {
                cell7.setCellValue(item.getGiaTri());
                cell7.setCellStyle(numberStyle);
            } else {
                cell7.setCellValue("");
                cell7.setCellStyle(dataStyle);
            }
            
            // Ký hiệu
            Cell cell8 = row.createCell(8);
            cell8.setCellValue(item.getKyHieu() != null ? item.getKyHieu() : "");
            cell8.setCellStyle(dataStyle);
            
            // Ghi chú
            Cell cell9 = row.createCell(9);
            cell9.setCellValue(item.getGhiChu() != null ? item.getGhiChu() : "");
            cell9.setCellStyle(dataStyle);
            
            // Số ký hiệu
            Cell cell10 = row.createCell(10);
            cell10.setCellValue(item.getSoKyHieu() != null ? item.getSoKyHieu() : "");
            cell10.setCellStyle(dataStyle);
            
            // Số lượng
            Cell cell11 = row.createCell(11);
            if (item.getSoLuong() != null) {
                cell11.setCellValue(item.getSoLuong());
                cell11.setCellStyle(numberStyle);
            } else {
                cell11.setCellValue("");
                cell11.setCellStyle(dataStyle);
            }
            
            // Công suất
            Cell cell12 = row.createCell(12);
            cell12.setCellValue(item.getCongSuat() != null ? item.getCongSuat() : "");
            cell12.setCellStyle(dataStyle);
            
            // Nước sản xuất
            Cell cell13 = row.createCell(13);
            cell13.setCellValue(item.getNuocSanXuat() != null ? item.getNuocSanXuat() : "");
            cell13.setCellStyle(dataStyle);
            
            // Năm sản xuất
            Cell cell14 = row.createCell(14);
            if (item.getNamSanXuat() != null) {
                cell14.setCellValue(item.getNamSanXuat());
                cell14.setCellStyle(numberStyle);
            } else {
                cell14.setCellValue("");
                cell14.setCellStyle(dataStyle);
            }
        }

        // Set column widths (tối ưu hơn auto-size)
        int[] columnWidths = {
            25,  // Mã công cụ dụng cụ
            15,  // Mã đơn vị
            35,  // Tên công cụ dụng cụ
            18,  // Ngày nhập
            15,  // Mã đơn vị tính
            18,  // Mã nhóm CCDC
            20,  // Mã loại CCDC con
            18,  // Giá trị
            15,  // Ký hiệu
            30,  // Ghi chú
            15,  // Số ký hiệu
            12,  // Số lượng
            15,  // Công suất
            18,  // Nước sản xuất
            15   // Năm sản xuất
        };
        
        for (int i = 0; i < headers.length && i < columnWidths.length; i++) {
            sheet.setColumnWidth(i, columnWidths[i] * 256); // Excel width unit = 1/256 of a character
        }

        // Ghi workbook ra output stream
        workbook.write(outputStream);
        workbook.close();
    }

    /**
     * Search CCDC/VatTu theo cac truong: id, ten, tenDonVi, tenNhomCCDC, kyHieu, soKyHieu, congSuat, nuocSanXuat
     */
    private boolean matchesCCDCSearch(CCDCVatTuDTO item, String query) {
        if (item == null || query == null || query.isEmpty()) {
            return false;
        }
        String q = query.toLowerCase();
        return containsIgnoreCase(item.getId(), q)
            || containsIgnoreCase(item.getTen(), q)
            || containsIgnoreCase(item.getTenDonVi(), q)
            || containsIgnoreCase(item.getTenNhomCCDC(), q)
            || containsIgnoreCase(item.getKyHieu(), q)
            || containsIgnoreCase(item.getSoKyHieu(), q)
            || containsIgnoreCase(item.getCongSuat(), q)
            || containsIgnoreCase(item.getNuocSanXuat(), q)
            || containsIgnoreCase(item.getDonViTinh(), q)
            || containsIgnoreCase(item.getGhiChu(), q);
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
