package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.DuAn;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.DuAnEnrichedDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.DuAnService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/duan")
public class DuAnController {
    @Autowired
    private DuAnService duAnService;

    @GetMapping
    public List<DuAnEnrichedDTO> getAll(@RequestParam(value = "idCongTy", required = false) String idCongTy) {
        return duAnService.getAll(idCongTy);
    }

    @GetMapping("/paged")
    public PageResponse<DuAnEnrichedDTO> getAllPaged(
            @RequestParam(value = "idCongTy", required = false) String idCongTy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {
        return duAnService.getAllPaged(idCongTy, page, size, sortBy, sortDir, search);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DuAnEnrichedDTO>> getById(@PathVariable("id") String id) {
        try {
            DuAnEnrichedDTO detail = duAnService.getById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin dự án thành công", detail, 1));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody DuAn da) {
        try {
            int result = duAnService.create(da);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo dự án thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo dự án thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<DuAn> list) {
        try {
            int total = duAnService.batchCreate(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách dự án thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách dự án thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<DuAn> list) {
        try {
            int total = duAnService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách dự án thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách dự án thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody DuAn da) {
        try {
            da.setId(id);
            int result = duAnService.update(da);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật dự án thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy dự án để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = duAnService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa dự án thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy dự án để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = duAnService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách dự án thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách dự án thất bại", total));
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
            // Đọc danh sách dự án
            List<DuAn> listDuAn;
            if (filename.endsWith(".csv")) {
                listDuAn = duAnService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listDuAn = duAnService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }

            // Tạo 2 danh sách kết quả
            List<DuAn> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (DuAn da : listDuAn) {
                if (da.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", da);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = duAnService.create(da);
                    if (inserted > 0) {
                        successList.add(da);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", da);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", da);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listDuAn.size());
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
    @Operation(summary = "Xoá toàn bộ dự án")
    public ResponseEntity<?> deleteAll() {
        duAnService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ dự án");
    }





}
