package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.CCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.CCDCVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ccdcvattu")
public class CCDCVatTuController {
    @Autowired
    private CCDCVatTuService ccdcVatTuService;

    @GetMapping
    public List<CCDCVatTuDTO> getAll(@RequestParam("idcongty") String idcongty) {
        return ccdcVatTuService.getAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<CCDCVatTuDTO> getAllPaged(
            @RequestParam("idcongty") String idcongty,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "iddonvisohuu", required = false) String idDonViSoHuu,
            @RequestParam(value = "idnhomccdc", required = false) String idNhomCCDC) { // <<< thêm
        return ccdcVatTuService.getAllPaged(idcongty, page, size, sortBy, sortDir, search, idDonViSoHuu,idNhomCCDC);
    }

    @GetMapping("/paged-id-don-vi-ban-dau")
    public PageResponse<CCDCVatTuDTO> getAllPagedByDonVi(
            @RequestParam("idcongty") String idcongty,
            @RequestParam("iddonvi") String iddonvi,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir) {
        return ccdcVatTuService.getAllPagedByDonVi(idcongty, iddonvi, page, size, sortBy, sortDir);
    }

    @GetMapping("/paged-da-ban-giao-theo-don-vi")
    public PageResponse<CCDCVatTuDTO> getDaBanGiaoByDonViSoHuu(
            @RequestParam("idcongty") String idcongty,
            @RequestParam("iddonvisoHuu") String iddonvisoHuu,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir) {
        return ccdcVatTuService.getPagedDaBanGiaoByDonViSoHuu(idcongty, iddonvisoHuu, page, size, sortBy, sortDir);
    }

    @GetMapping("/paged-chua-ban-giao-theo-don-vi")
    public PageResponse<CCDCVatTuDTO> getChuaBanGiaoByDonViSoHuu(
            @RequestParam("idcongty") String idcongty,
            @RequestParam("iddonvisoHuu") String iddonvisoHuu,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir) {
        return ccdcVatTuService.getPagedChuaBanGiaoByDonViSoHuu(idcongty, iddonvisoHuu, page, size, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public CCDCVatTuDTO getById(@PathVariable("id") String id) {
        return ccdcVatTuService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody CCDCVatTu ccdc) {
        try {
            int result = ccdcVatTuService.create(ccdc);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo CCDC/Vật tư thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody CCDCVatTu ccdc) {
        try {
            ccdc.setId(id);
            int result = ccdcVatTuService.update(ccdc);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy CCDC/Vật tư để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<CCDCVatTu> list) {
        try {
            int total = 0;
            for (CCDCVatTu item : list) {
                total += ccdcVatTuService.create(item); // dùng lại phương thức create có sẵn
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<CCDCVatTu> list) {
        try {
            int total = 0;
            for (CCDCVatTu item : list) {
                total += ccdcVatTuService.update(item); // dùng lại phương thức update có sẵn
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy CCDC/Vật tư để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = ccdcVatTuService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy CCDC/Vật tư để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = 0;
            for (String id : ids) {
                total += ccdcVatTuService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<ApiResponse<Object>> deleteAll() {
        try {
            int result = ccdcVatTuService.deleteAll();
            return ResponseEntity.ok(ApiResponse.success("Xóa toàn bộ CCDC/Vật tư thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("File không được rỗng", null));
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Tên file không hợp lệ", null));
        }

        try {
            // Đọc danh sách CCDC vật tư
            List<CCDCVatTu> listCCDCVatTu;
            if (filename.endsWith(".csv")) {
                listCCDCVatTu = ccdcVatTuService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listCCDCVatTu = ccdcVatTuService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }

            // Tạo 2 danh sách kết quả
            List<CCDCVatTu> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (CCDCVatTu ccdc : listCCDCVatTu) {
                if (ccdc.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", ccdc);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = ccdcVatTuService.create(ccdc);
                    if (inserted > 0) {
                        successList.add(ccdc);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", ccdc);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", ccdc);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listCCDCVatTu.size());
            result.put("successCount", successList.size());
            result.put("failureCount", failureList.size());
            result.put("successItems", successList);
            result.put("failureItems", failureList);

            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload hoàn tất", result, successList.size()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/export/excel")
    public void exportToExcel(
            @RequestParam("idcongty") String idcongty,
            HttpServletResponse response) throws IOException {
        try {
            // Tạo tên file với timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "CCDCVatTu_" + timestamp + ".xlsx";
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");

            // Set response headers
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename);

            // Xuất Excel
            ccdcVatTuService.exportToExcel(idcongty, response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Lỗi khi xuất file Excel: " + e.getMessage());
        }
    }
}
