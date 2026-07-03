package com.ecotel.quanlytaisan.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.function.BiConsumer;

import com.ecotel.quanlytaisan.service.DocumentConversionService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/upload")
public class UploadFileController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Autowired
    private DocumentConversionService documentConversionService;


    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();

        try {
            // Tạo thư mục nếu chưa có
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu file vào thư mục uploads/
            String fileName = file.getOriginalFilename();
            System.out.println("file name: " + fileName);
            String filePath = UPLOAD_DIR + fileName;

            file.transferTo(new File(filePath));

            // Trả về JSON response
            response.put("fileName", fileName);
            response.put("filePath", filePath);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Error uploading file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<?> downloadFile(@PathVariable("fileName") String fileName) {
        try {
            File file = new File(UPLOAD_DIR + fileName);
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            byte[] fileBytes = java.nio.file.Files.readAllBytes(file.toPath());

            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"").body(fileBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/preview/{fileName}")
    public ResponseEntity<?> previewFile(@PathVariable("fileName") String fileName) {
        try {
            File file = new File(UPLOAD_DIR + fileName);
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            byte[] fileBytes = java.nio.file.Files.readAllBytes(file.toPath());

            // Tự động đoán content type
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"").contentType(MediaType.parseMediaType(contentType)).body(fileBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file: " + e.getMessage());
        }
    }


    @PostMapping("/export")
    public void exportJson(@RequestBody List<Map<String, Object>> jsonList, @RequestParam(value = "sheetName", defaultValue = "Sheet1") String sheetName, HttpServletResponse response) {
        Workbook workbook = new XSSFWorkbook();
        try {
            // Sheet
            Sheet sheet = workbook.createSheet(sheetName);

            // Header
            Set<String> headerSet = new LinkedHashSet<>();
            for (Map<String, Object> map : jsonList) {
                headerSet.addAll(map.keySet());
            }
            List<String> headers = new ArrayList<>(headerSet);
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
            }

            // Data
            int rowIdx = 1;
            for (Map<String, Object> map : jsonList) {
                Row row = sheet.createRow(rowIdx++);
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = row.createCell(i);
                    Object value = map.get(headers.get(i));
                    if (value != null) {
                        if (value instanceof Number) {
                            cell.setCellValue(((Number) value).doubleValue());
                        } else if (value instanceof Boolean) {
                            cell.setCellValue((Boolean) value);
                        } else {
                            cell.setCellValue(value.toString());
                        }
                    } else {
                        cell.setCellValue("");
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            // Set response headers
            String filename = UUID.randomUUID().toString() + ".xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

            // Ghi trực tiếp workbook ra OutputStream
            workbook.write(response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                workbook.close();
            } catch (Exception ignored) {
            }
        }
    }

    /**
     * Convert DOCX file to PDF
     *
     * @param file DOCX file to convert
     * @return PDF file as byte array
     */
    @PostMapping("/convert/docx-to-pdf")
    public ResponseEntity<?> convertDocxToPdf(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra file có tồn tại không
            if (file.isEmpty()) {
                response.put("error", "File không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra định dạng file
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".docx") && !originalFilename.toLowerCase().endsWith(".doc"))) {
                response.put("error", "Chỉ hỗ trợ file DOCX hoặc DOC");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra kích thước file (giới hạn 50MB)
            if (file.getSize() > 50 * 1024 * 1024) {
                response.put("error", "File quá lớn. Kích thước tối đa là 50MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Tạo file tạm
            File tempFile = File.createTempFile("temp_docx_", ".docx");
            file.transferTo(tempFile);

            try {
                // Convert DOCX sang PDF
                byte[] pdfBytes = documentConversionService.convertDocxToPdfBytes(tempFile);

                // Tạo tên file PDF
                String pdfFileName = originalFilename.replaceAll("\\.(docx?)$", ".pdf");

                // Trả về PDF file
                return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfFileName + "\"").contentType(MediaType.APPLICATION_PDF).body(pdfBytes);

            } finally {
                // Xóa file tạm
                if (tempFile.exists()) {
                    tempFile.delete();
                }
            }

        } catch (Exception e) {
            response.put("error", "Lỗi khi convert file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Convert DOCX file to PDF and save to uploads directory
     *
     * @param file DOCX file to convert
     * @return Information about the converted PDF file
     */
    @PostMapping("/convert/docx-to-pdf-save")
    public ResponseEntity<Map<String, Object>> convertDocxToPdfAndSave(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra file có tồn tại không
            if (file.isEmpty()) {
                response.put("error", "File không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra định dạng file
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".docx") && !originalFilename.toLowerCase().endsWith(".doc"))) {
                response.put("error", "Chỉ hỗ trợ file DOCX hoặc DOC");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra kích thước file (giới hạn 50MB)
            if (file.getSize() > 50 * 1024 * 1024) {
                response.put("error", "File quá lớn. Kích thước tối đa là 50MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Tạo thư mục uploads nếu chưa có
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Tạo file tạm
            File tempFile = File.createTempFile("temp_docx_", ".docx");
            file.transferTo(tempFile);

            try {
                // Tạo tên file PDF
                String pdfFileName = originalFilename.replaceAll("\\.(docx?)$", ".pdf");
                String pdfFilePath = UPLOAD_DIR + pdfFileName;

                // Convert và lưu PDF
                documentConversionService.convertDocxToPdf(tempFile, pdfFilePath);

                // Trả về thông tin file
                response.put("success", true);
                response.put("originalFileName", originalFilename);
                response.put("pdfFileName", pdfFileName);
                response.put("pdfFilePath", pdfFilePath);
                response.put("message", "Convert thành công");

                return ResponseEntity.ok(response);

            } finally {
                // Xóa file tạm
                if (tempFile.exists()) {
                    tempFile.delete();
                }
            }

        } catch (Exception e) {
            response.put("error", "Lỗi khi convert file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Convert existing DOCX file in uploads directory to PDF
     *
     * @param fileName Name of the DOCX file in uploads directory
     * @return PDF file as byte array
     */
    @GetMapping("/convert/docx-to-pdf/{fileName}")
    public ResponseEntity<?> convertExistingDocxToPdf(@PathVariable("fileName") String fileName) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra file có tồn tại không
            File docxFile = new File(UPLOAD_DIR + fileName);
            if (!docxFile.exists()) {
                response.put("error", "File không tồn tại");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Kiểm tra định dạng file
            if (!documentConversionService.isDocxFile(docxFile)) {
                response.put("error", "File không phải là DOCX hoặc DOC");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra kích thước file
            double fileSizeMB = documentConversionService.getFileSizeInMB(docxFile);
            if (fileSizeMB > 50) {
                response.put("error", "File quá lớn. Kích thước tối đa là 50MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Convert DOCX sang PDF
            byte[] pdfBytes = documentConversionService.convertDocxToPdfBytes(docxFile);

            // Tạo tên file PDF
            String pdfFileName = fileName.replaceAll("\\.(docx?)$", ".pdf");

            // Trả về PDF file
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfFileName + "\"").contentType(MediaType.APPLICATION_PDF).body(pdfBytes);

        } catch (Exception e) {
            response.put("error", "Lỗi khi convert file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping(
            value = "/table",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    public ResponseEntity<byte[]> fillTemplate(@RequestBody List<Map<String, Object>> data) throws IOException {
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Dữ liệu JSON trống hoặc không hợp lệ".getBytes());
        }

        // 📂 Đọc file Excel template (đặt trong resources/templates/template.xlsx)
        String templatePath = "src/main/resources/templates/template.xlsx";
        FileInputStream fis = new FileInputStream(templatePath);
        Workbook workbook = new XSSFWorkbook(fis);
        Sheet sheet = workbook.getSheetAt(0);

        // Font Times New Roman size 13
        Font font = workbook.createFont();
        font.setFontName("Times New Roman");
        font.setFontHeightInPoints((short) 13);

        // Font tiêu đề: in đậm
        Font headerFont = workbook.createFont();
        headerFont.setFontName("Times New Roman");
        headerFont.setFontHeightInPoints((short) 13);
        headerFont.setBold(true);

        // Style cho header
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);

        // Style cho nội dung
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFont(font);

        // 🔍 Tìm dòng cuối có dữ liệu để ghi tiếp
        int lastRowNum = sheet.getLastRowNum();
        int startRow = lastRowNum;
        boolean hasContent = false;

        for (int i = 0; i <= lastRowNum; i++) {
            Row row = sheet.getRow(i);
            if (row != null) {
                for (Cell cell : row) {
                    if (cell != null && cell.getCellType() != CellType.BLANK) {
                        hasContent = true;
                        break;
                    }
                }
            }
        }

        // Nếu có dữ liệu trong template, thêm tiếp ở dòng trống tiếp theo
        if (hasContent) {
            startRow = lastRowNum + 1;
        } else {
            startRow = 0;
        }

        // 🔑 Lấy key làm tên cột
        Map<String, Object> firstRow = data.get(0);
        List<String> keys = new ArrayList<>(firstRow.keySet());
        System.out.println("Keys: " + keys);


        Row headerRow = sheet.createRow(startRow);
        for (int i = 0; i < keys.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(keys.get(i));
            cell.setCellStyle(headerStyle);
        }
        startRow++;
        // ---- Ghi dữ liệu JSON vào dòng tiếp theo ----
        for (int i = 0; i < data.size(); i++) {
            Row row = sheet.createRow(startRow + i);
            Map<String, Object> item = data.get(i);
            for (int j = 0; j < keys.size(); j++) {
                Object value = item.get(keys.get(j));
                Cell cell = row.createCell(j);
                cell.setCellStyle(cellStyle);
                cell.setCellValue(value != null ? value.toString() : "");
            }
        }

        // Tự động căn chỉnh độ rộng cột
        for (int i = 0; i < keys.size(); i++) {
            sheet.autoSizeColumn(i);
        }

        // ✅ Xuất ra file Excel mới
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        fis.close();

        byte[] excelBytes = out.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=filled_template.xlsx");

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }


    // 🔍 Tìm hàng có chứa text cụ thể
    private int findRowIndex(Sheet sheet, String keyword) {
        for (Row row : sheet) {
            for (Cell cell : row) {
                if (cell.getCellType() == CellType.STRING && cell.getStringCellValue().contains(keyword)) {
                    return row.getRowNum();
                }
            }
        }
        return -1;
    }
}