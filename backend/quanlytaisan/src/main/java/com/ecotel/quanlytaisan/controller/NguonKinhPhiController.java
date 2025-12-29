package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.NguonKinhPhi;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.NguonKinhPhiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nguonkinhphi")
public class NguonKinhPhiController {
    @Autowired
    private NguonKinhPhiService nguonKinhPhiService;

    @GetMapping
    public List<NguonKinhPhi> getAll() {
        return nguonKinhPhiService.getAll();
    }

    @GetMapping("/paged")
    public PageResponse<NguonKinhPhi> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        return nguonKinhPhiService.getAllPaged(page, size, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public NguonKinhPhi getById(@PathVariable String id) {
        return nguonKinhPhiService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody NguonKinhPhi nkp) {
        try {
            int result = nguonKinhPhiService.create(nkp);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo nguồn kinh phí thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<NguonKinhPhi> list) {
        try {
            int total = 0;
            for (NguonKinhPhi item : list) {
                total += nguonKinhPhiService.create(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách nguồn kinh phí thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách nguồn kinh phí thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody NguonKinhPhi nkp) {
        try {
            nkp.setId(id);
            int result = nguonKinhPhiService.update(nkp);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nguồn kinh phí để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = nguonKinhPhiService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nguồn kinh phí để xóa", result));
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
                total += nguonKinhPhiService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách nguồn kinh phí thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách nguồn kinh phí thất bại", total));
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
            List<NguonKinhPhi> listNguonKinhPhi;
            if (filename.endsWith(".csv")) {
                listNguonKinhPhi = nguonKinhPhiService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listNguonKinhPhi = nguonKinhPhiService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            // Tạo 2 danh sách kết quả
            List<NguonKinhPhi> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (NguonKinhPhi nkp : listNguonKinhPhi) {
                if (nkp.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nkp);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = nguonKinhPhiService.create(nkp);
                    if (inserted > 0) {
                        successList.add(nkp);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", nkp);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nkp);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listNguonKinhPhi.size());
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
}
