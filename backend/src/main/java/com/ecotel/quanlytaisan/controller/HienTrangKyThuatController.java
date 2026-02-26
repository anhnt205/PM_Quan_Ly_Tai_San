package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.HienTrangKyThuat;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.HienTrangKyThuatService;
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
@RequestMapping("/api/hientrangkythuat")
public class HienTrangKyThuatController {
    @Autowired
    private HienTrangKyThuatService hienTrangKyThuatService;

    @GetMapping
    public List<HienTrangKyThuat> getAll() {
        return hienTrangKyThuatService.getAll();
    }

    @GetMapping("/paged")
    public PageResponse<HienTrangKyThuat> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {
        return hienTrangKyThuatService.getAllPaged(page, size, sortBy, sortDir, search);
    }

    @GetMapping("/all")
    public List<HienTrangKyThuat> getAllIncludeInactive() {
        return hienTrangKyThuatService.getAllIncludeInactive();
    }

    @GetMapping("/{id}")
    public HienTrangKyThuat getById(@PathVariable Integer id) {
        return hienTrangKyThuatService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody HienTrangKyThuat htkt) {
        try {
            int result = hienTrangKyThuatService.create(htkt);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo hiện trạng kỹ thuật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo hiện trạng kỹ thuật thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<HienTrangKyThuat> list) {
        try {
            int total = 0;
            for (HienTrangKyThuat item : list) {
                total += hienTrangKyThuatService.create(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách hiện trạng kỹ thuật thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách hiện trạng kỹ thuật thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable Integer id, @RequestBody HienTrangKyThuat htkt) {
        try {
            htkt.setId(id);
            int result = hienTrangKyThuatService.update(htkt);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật hiện trạng kỹ thuật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy hiện trạng kỹ thuật để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        try {
            int result = hienTrangKyThuatService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa hiện trạng kỹ thuật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy hiện trạng kỹ thuật để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/soft/{id}")
    public ResponseEntity<ApiResponse<Object>> softDelete(@PathVariable Integer id) {
        try {
            int result = hienTrangKyThuatService.softDelete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa hiện trạng kỹ thuật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy hiện trạng kỹ thuật để vô hiệu hóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<Integer> ids) {
        try {
            int total = 0;
            for (Integer id : ids) {
                total += hienTrangKyThuatService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách hiện trạng kỹ thuật thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách hiện trạng kỹ thuật thất bại", total));
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
            List<HienTrangKyThuat> listHienTrangKyThuat;
            if (filename.endsWith(".csv")) {
                listHienTrangKyThuat = hienTrangKyThuatService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listHienTrangKyThuat = hienTrangKyThuatService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            List<HienTrangKyThuat> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (HienTrangKyThuat htkt : listHienTrangKyThuat) {
                if (htkt.getId() == null) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", htkt);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = hienTrangKyThuatService.create(htkt);
                    if (inserted > 0) {
                        successList.add(htkt);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", htkt);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", htkt);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("total", listHienTrangKyThuat.size());
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
    @Operation(summary = "Xoá toàn bộ hiện trạng kỹ thuật")
    public ResponseEntity<?> deleteAll() {
        hienTrangKyThuatService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ hiện trạng kỹ thuật");
    }



}
