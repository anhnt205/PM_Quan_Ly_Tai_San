package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.NhomTaiSan;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.NhomTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhomtaisan")
public class NhomTaiSanController {
    @Autowired
    private NhomTaiSanService nhomTaiSanService;

    @GetMapping
    public List<NhomTaiSan> getAll(@RequestParam String idcongty) {
        return nhomTaiSanService.getAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<NhomTaiSan> getAllPaged(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        return nhomTaiSanService.getAllPaged(idcongty, page, size, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public NhomTaiSan getById(@PathVariable String id) {
        return nhomTaiSanService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody NhomTaiSan nts) {
        try {
            int result = nhomTaiSanService.create(nts);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo nhóm tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo nhóm tài sản thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<NhomTaiSan> list) {
        try {
            int total = 0;
            for (NhomTaiSan item : list) {
                total += nhomTaiSanService.create(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách nhóm tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách nhóm tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody NhomTaiSan nts) {
        try {
            nts.setId(id);
            int result = nhomTaiSanService.update(nts);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật nhóm tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nhóm tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = nhomTaiSanService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa nhóm tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nhóm tài sản để xóa", result));
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
                total += nhomTaiSanService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách nhóm tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách nhóm tài sản thất bại", total));
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
            // Đọc danh sách nhóm tài sản
            List<NhomTaiSan> listNhomTaiSan;
            if (filename.endsWith(".csv")) {
                listNhomTaiSan = nhomTaiSanService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listNhomTaiSan = nhomTaiSanService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }

            // Tạo 2 danh sách kết quả
            List<NhomTaiSan> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (NhomTaiSan nts : listNhomTaiSan) {
                if (nts.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nts);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = nhomTaiSanService.create(nts);
                    if (inserted > 0) {
                        successList.add(nts);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", nts);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nts);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listNhomTaiSan.size());
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
