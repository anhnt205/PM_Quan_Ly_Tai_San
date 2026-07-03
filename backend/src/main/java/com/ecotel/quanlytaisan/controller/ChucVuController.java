package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChucVu;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.ChucVuService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/chucvu")
public class ChucVuController {

    @Autowired
    private ChucVuService chucVuService;

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChucVu cv) {
        try {
            int result = chucVuService.insert(cv);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Thêm chức vụ thành công", cv, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody ChucVu cv) {
        try {
            cv.setId(id);
            int result = chucVuService.update(cv);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chức vụ thành công", cv, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chức vụ để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChucVu> list) {
        try {
            int total = chucVuService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chức vụ thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách chức vụ thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChucVu> list) {
        try {
            int total = chucVuService.batchCreate(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách chức vụ thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chức vụ thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = chucVuService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chức vụ thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chức vụ để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = chucVuService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chức vụ thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chức vụ thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/congty/{idCongTy}")
    public ResponseEntity<ApiResponse<Object>> findAll(@PathVariable("idCongTy") String idCongTy) {
        try {
            List<ChucVu> list = chucVuService.findAll(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Danh sách chức vụ", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/congty/{idCongTy}/paged")
    public PageResponse<ChucVu> findAllPaged(
            @PathVariable("idCongTy") String idCongTy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {
        return chucVuService.findAllPaged(idCongTy, page, size, sortBy, sortDir, search);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> findById(@PathVariable("id") String id) {
        try {
            ChucVu cv = chucVuService.findById(id);
            if (cv != null) {
                return ResponseEntity.ok(ApiResponse.success("Tìm thấy chức vụ", cv, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chức vụ", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Object>> findByTen(@RequestParam("ten") String ten) {
        try {
            List<ChucVu> list = chucVuService.findByTen(ten);
            return ResponseEntity.ok(ApiResponse.success("Kết quả tìm kiếm", list, list.size()));
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
            List<ChucVu> listChucVu;
            if (filename.endsWith(".csv")) {
                listChucVu = chucVuService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChucVu = chucVuService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            List<ChucVu> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (ChucVu cv : listChucVu) {
                if (cv.getId() == null) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", cv);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = chucVuService.insert(cv);
                    if (inserted > 0) {
                        successList.add(cv);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", cv);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", cv);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("total", listChucVu.size());
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




    @DeleteMapping("/delete-all")
    @Operation(summary = "Xoá toàn bộ chức vụ")
    public ResponseEntity<?> deleteAll() {
        chucVuService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ chức vụ");
    }





}