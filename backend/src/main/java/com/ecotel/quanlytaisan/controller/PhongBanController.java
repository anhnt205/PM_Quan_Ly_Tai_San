package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.PhongBan;
import com.ecotel.quanlytaisan.model.PhongBanDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.PhongBanService;

import io.swagger.v3.oas.annotations.Operation;

import com.ecotel.quanlytaisan.service.NotificationService;
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
@RequestMapping("/api/phongban")
public class PhongBanController {
    @Autowired
    private PhongBanService phongBanService;
    
    @Autowired
    private NotificationService notificationService;
    @GetMapping
    public List<PhongBanDTO> getAll(@RequestParam("idcongty") String idcongty) {
        return phongBanService.getAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<PhongBanDTO> getAllPaged(
            @RequestParam("idcongty") String idcongty,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {
        return phongBanService.getAllPaged(idcongty, page, size, sortBy, sortDir, search);
    }

    @GetMapping("/{id}")
    public PhongBanDTO getById(@PathVariable("id") String id) {
        return phongBanService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody PhongBan pb) {
        try {
            int result = phongBanService.create(pb);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyPhongBanCreated(pb.getIdCongTy(), pb.getId(), "System");
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo phòng ban thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo phòng ban thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody PhongBan pb) {
        try {
            pb.setId(id);
            int result = phongBanService.update(pb);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyPhongBanUpdated(pb.getIdCongTy(), pb.getId(), "System");
                return ResponseEntity.ok(ApiResponse.success("Cập nhật phòng ban thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phòng ban để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<PhongBan> list) {
        try {
            int total = phongBanService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách phòng ban thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách phòng ban thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<PhongBan> list) {
        try {
            int total = phongBanService.batchCreate(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách phòng ban thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách phòng ban thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            // Lấy thông tin phòng ban trước khi xóa để có thông tin công ty
            PhongBanDTO phongBan = phongBanService.getById(id);
            int result = phongBanService.delete(id);
            if (result > 0) {
                // Gửi thông báo socket
                if (phongBan != null) {
                    notificationService.notifyPhongBanDeleted(phongBan.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa phòng ban thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phòng ban để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = phongBanService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách phòng ban thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách phòng ban thất bại", total));
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
            // Đọc danh sách phòng ban
            List<PhongBan> listPhongBan;
            if (filename.endsWith(".csv")) {
                listPhongBan = phongBanService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listPhongBan = phongBanService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }

            // Tạo 2 danh sách kết quả
            List<PhongBan> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (PhongBan pb : listPhongBan) {
                if (pb.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", pb);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = phongBanService.create(pb);
                    if (inserted > 0) {
                        successList.add(pb);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", pb);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", pb);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listPhongBan.size());
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
    @Operation(summary = "Xoá toàn bộ phòng ban")
    public ResponseEntity<?> deleteAll() {
        phongBanService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ phòng ban");
    }




}
