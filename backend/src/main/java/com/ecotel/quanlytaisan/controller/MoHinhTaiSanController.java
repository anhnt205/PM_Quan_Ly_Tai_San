package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.MoHinhTaiSan;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.MoHinhTaiSanEnrichedDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.MoHinhTaiSanService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/mohinhtaisan")
public class MoHinhTaiSanController {
    @Autowired
    private MoHinhTaiSanService moHinhTaiSanService;

    @GetMapping
    public List<MoHinhTaiSanEnrichedDTO> getAll(@RequestParam("idcongty") String idcongty) {
        return moHinhTaiSanService.getAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<MoHinhTaiSanEnrichedDTO> getPaged(
            @RequestParam(value = "idCongTy", required = false) String idCongTy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {
        return moHinhTaiSanService.getAllPaged(idCongTy, page, size, sortBy, sortDir, search);
    }

    @GetMapping("/{id}")
    public MoHinhTaiSanEnrichedDTO getById(@PathVariable("id") String id) {
        return moHinhTaiSanService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody MoHinhTaiSan mhts) {
        try {
            int result = moHinhTaiSanService.create(mhts);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo mô hình tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo mô hình tài sản thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<MoHinhTaiSan> list) {
        try {
            int total = moHinhTaiSanService.batchCreate(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách mô hình tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách mô hình tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<MoHinhTaiSan> list) {
        try {
            int total = moHinhTaiSanService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách mô hình tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách mô hình tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody MoHinhTaiSan mhts) {
        try {
            mhts.setId(id);
            int result = moHinhTaiSanService.update(mhts);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật mô hình tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy mô hình tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = moHinhTaiSanService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa mô hình tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy mô hình tài sản để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = moHinhTaiSanService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách mô hình tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách mô hình tài sản thất bại", total));
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
            List<MoHinhTaiSan> listMoHinhTaiSan;
            if (filename.endsWith(".csv")) {
                listMoHinhTaiSan = moHinhTaiSanService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listMoHinhTaiSan = moHinhTaiSanService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            // Tạo 2 danh sách kết quả
            List<MoHinhTaiSan> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (MoHinhTaiSan mhts : listMoHinhTaiSan) {
                if (mhts.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", mhts);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = moHinhTaiSanService.create(mhts);
                    if (inserted > 0) {
                        successList.add(mhts);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", mhts);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", mhts);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listMoHinhTaiSan.size());
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
    @Operation(summary = "Xoá toàn bộ mô hình tài sản")
    public ResponseEntity<?> deleteAll() {
        moHinhTaiSanService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ mô hình tài sản");
    }


}
