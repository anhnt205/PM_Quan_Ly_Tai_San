package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NhanVienDao;
import com.ecotel.quanlytaisan.model.NhanVien;
import com.ecotel.quanlytaisan.model.NhanVienDTO;
// duplicate import removed
import com.ecotel.quanlytaisan.model.PageResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NhanVienService {
    @Autowired
    private NhanVienDao nhanVienDao;

    @Autowired
    private S3Service s3Service;

    public List<NhanVienDTO> getAll(String idCongTy) {
        return nhanVienDao.findAll(idCongTy);
    }

    public PageResponse<NhanVienDTO> getAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = nhanVienDao.countByCongTy(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<NhanVienDTO> items = nhanVienDao.findAllPaged(idCongTy, offset, size, sortBy, sortDir, search);
        return new PageResponse<>(items, total, page, size);
    }

    public List<NhanVienDTO> findByPhongBan(String idPhongBan) {
        return nhanVienDao.findByPhongBan(idPhongBan);
    }

    public NhanVienDTO getById(String id) {
        return nhanVienDao.findById(id);
    }

    public int create(NhanVien nv) {
        return nhanVienDao.insert(nv);
    }

    public int update(NhanVien nv) {
        return nhanVienDao.update(nv);
    }

    public int delete(String id) {
        return nhanVienDao.delete(id);
    }


    public List<NhanVien> readCsv(MultipartFile file) throws IOException {
        List<NhanVien> list = new ArrayList<>();

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
                NhanVien ts = NhanVien.mapToNhanVien(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<NhanVien> readExcel(MultipartFile file) throws IOException {
        List<NhanVien> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            NhanVien ts = NhanVien.mapToNhanVien(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }

   public int insertNhanVienFromExcel(MultipartFile file) throws Exception {
    int count = 0;
    try (InputStream is = file.getInputStream();
         XSSFWorkbook workbook = new XSSFWorkbook(is)) {
        
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<NhanVien> listNhanVien = new ArrayList<>();

        // 1. Đọc dữ liệu text trực tiếp vào Object NhanVien
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            
            NhanVien nv = NhanVien.mapToNhanVien(row); // Dùng hàm đã sửa ở Bước 1
            nv.setIdCongTy("CT001");
            listNhanVien.add(nv);
        }
           
        // 2. Xử lý ảnh nhúng (nếu có) và tải lên S3
        if (sheet.getDrawingPatriarch() != null) {
            for (XSSFShape shape : sheet.getDrawingPatriarch().getShapes()) {
                if (shape instanceof XSSFPicture) {
                    XSSFPicture pic = (XSSFPicture) shape;
                    XSSFClientAnchor anchor = (XSSFClientAnchor) pic.getAnchor();
                    int rowIndex = anchor.getRow1();
                    int colIndex = anchor.getCol1();

                    if (rowIndex <= 0 || rowIndex > listNhanVien.size()) continue;
                    NhanVien nv = listNhanVien.get(rowIndex - 1);

                    byte[] data = pic.getPictureData().getData();
                    String s3Key = s3Service.uploadFile(data, "png");

                    if (colIndex == 5) nv.setChuKyNhay(s3Key);   // Cột F
                    if (colIndex == 7) nv.setChuKyThuong(s3Key); // Cột H
                }
            }
        }

        // 3. Lưu vào Database
        for (NhanVien nv : listNhanVien) {
            nhanVienDao.insert(nv);
            count++;
        }
    }
    return count;
}

    public List<Map<String, Object>> processExcelFile(MultipartFile file) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();

        // Tạo thư mục lưu ảnh nếu chưa có
        Path uploadDir = Paths.get("uploads");
        Files.createDirectories(uploadDir);

        try (InputStream is = file.getInputStream();
             XSSFWorkbook workbook = new XSSFWorkbook(is)) {

            XSSFSheet sheet = workbook.getSheetAt(0);

            // ---- Đọc dữ liệu text ----
            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // bỏ hàng tiêu đề
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Map<String, Object> emp = new HashMap<>();
                emp.put("id", getCellValueAsString(row.getCell(0)));
                emp.put("hoTen", getCellValueAsString(row.getCell(1)));
                emp.put("diDong", getCellValueAsString(row.getCell(2)));
                emp.put("email", getCellValueAsString(row.getCell(3)));
                emp.put("kyNhay", getCellValueAsString(row.getCell(4)));
                emp.put("chuKyNhay", getCellValueAsString(row.getCell(5)));
                emp.put("kyThuong", getCellValueAsString(row.getCell(6)));
                emp.put("chuKyThuong", getCellValueAsString(row.getCell(7)));  
                emp.put("kySo", getCellValueAsString(row.getCell(8)));
                emp.put("uuid", getCellValueAsString(row.getCell(9)));
                emp.put("maPin", getCellValueAsString(row.getCell(10)));
                emp.put("savePin", getCellValueAsString(row.getCell(11)));
                emp.put("maphongban", getCellValueAsString(row.getCell(12)));
                emp.put("machucvu", getCellValueAsString(row.getCell(13)));
                emp.put("ngaytao", getCellValueAsString(row.getCell(14)));
                emp.put("ngaycapnhat", getCellValueAsString(row.getCell(15)));

                result.add(emp);
            }

           // ---- Đọc ảnh nhúng ----
            if (sheet.getDrawingPatriarch() != null) {
                for (XSSFShape shape : sheet.getDrawingPatriarch().getShapes()) {
                    if (shape instanceof XSSFPicture) {
                        XSSFPicture pic = (XSSFPicture) shape;
                        XSSFClientAnchor anchor = (XSSFClientAnchor) pic.getAnchor();

                        int rowIndex = anchor.getRow1(); // hàng
                        int colIndex = anchor.getCol1(); // cột

                        // bỏ header
                        if (rowIndex <= 0 || rowIndex > result.size()) continue;

                        byte[] data = pic.getPictureData().getData();
                        String ext = pic.getPictureData().suggestFileExtension();

                        Map<String, Object> emp = result.get(rowIndex - 1);
                        // Cột F (index 5) → chuKyNhay (Ảnh nhúng được neo vào cột F)
                        if (colIndex == 5) { 
                            String existing = (String) emp.get("chuKyNhay");
                            if (existing == null || existing.trim().isEmpty()) {
                                String s3Key = s3Service.uploadFile(data, ext);
                                emp.put("chuKyNhay", s3Key);
                            }
                        }
                        // Cột H (index 7) → chuKyThuong (Ảnh nhúng được neo vào cột H)
                        else if (colIndex == 7) { 
                            String existing = (String) emp.get("chuKyThuong");
                            if (existing == null || existing.trim().isEmpty()) {
                                String s3Key = s3Service.uploadFile(data, ext);
                                emp.put("chuKyThuong", s3Key);
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    // ---- Helper: lấy giá trị ô an toàn ----
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    double num = cell.getNumericCellValue();
                    if (num == (long) num) {
                        return String.valueOf((long) num);
                    } else {
                        return String.valueOf(num);
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (IllegalStateException e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }


    public void deleteAll() {
        nhanVienDao.deleteAll();
    }

}
