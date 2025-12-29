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

    public NhanVienService() {
        nhanVienDao = new NhanVienDao();
    }

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
        List<Map<String, Object>> list = processExcelFile(file);
        int count = 0;

        for (Map<String, Object> map : list) {
            try {
                NhanVien nhanVien = new NhanVien();

                nhanVien.setId((String) map.get("id"));
                nhanVien.setHoTen((String) map.get("hoTen"));
                nhanVien.setDiDong((String) map.get("diDong"));
                nhanVien.setEmailCongViec((String) map.get("email"));
                String chuKyNhay = (String) map.get("chuKyNhay");
                String chuKyThuong = (String) map.get("chuKyThuong");
                nhanVien.setChuKyNhay(chuKyNhay);         // ảnh cột E
                nhanVien.setChuKyThuong(chuKyThuong);     // ảnh cột F
                nhanVien.setKyNhay(chuKyNhay != null && !chuKyNhay.trim().isEmpty());
                nhanVien.setKyThuong(chuKyThuong != null && !chuKyThuong.trim().isEmpty());


                String uuid = (String) map.get("uuid");
                nhanVien.setAgreementUUId(uuid);
                nhanVien.setPin((String) map.get("maPin"));
                nhanVien.setKySo(uuid != null && !uuid.trim().isEmpty());
                nhanVien.setBoPhan((String) map.get("maphongban"));
                nhanVien.setChucVu((String) map.get("machucvu"));
                nhanVien.setNgayTao((String) map.get("ngaytao"));
                nhanVien.setNgayCapNhat((String) map.get("ngaycapnhat"));
                nhanVien.setIdCongTy("CT001");

                nhanVienDao.insert(nhanVien);
                count++;
            } catch (Exception e) {
                // Ghi log lỗi, nhưng không dừng toàn bộ quá trình
                System.err.println("Lỗi khi insert nhân viên: " + e.getMessage());
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
                emp.put("chuKyNhay", "");      // cột E
                emp.put("chuKyThuong", "");    // cột F
                emp.put("uuid", getCellValueAsString(row.getCell(6)));
                emp.put("maPin", getCellValueAsString(row.getCell(7)));
                emp.put("maphongban", getCellValueAsString(row.getCell(8)));
                emp.put("machucvu", getCellValueAsString(row.getCell(9)));
                emp.put("ngaytao", getCellValueAsString(row.getCell(10)));
                emp.put("ngaycapnhat", getCellValueAsString(row.getCell(11)));

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

                        // bỏ hàng tiêu đề
                        if (rowIndex <= 0 || rowIndex > result.size()) continue;

                        byte[] data = pic.getPictureData().getData();
                        String ext = pic.getPictureData().suggestFileExtension();
                        String imgName = java.util.UUID.randomUUID().toString() + "." + ext;
                        Path imgPath = uploadDir.resolve(imgName);
                        Files.write(imgPath, data);

                        // Cột E (index 4) → chuKyNhay
                        // Cột F (index 5) → chuKyThuong
                        Map<String, Object> emp = result.get(rowIndex - 1);
                        if (colIndex == 4) {
                            emp.put("chuKyNhay", imgName.toString());
                        } else if (colIndex == 5) {
                            emp.put("chuKyThuong", imgName.toString());
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

}
