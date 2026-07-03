package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.DbConfig;
import com.ecotel.quanlytaisan.service.DbConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dbconfig")
public class DbConfigController {

    @Autowired
    private DbConfigService dbConfigService;

    @PostMapping("/test-connection")
    public ResponseEntity<ApiResponse<Object>> testConnection(@RequestBody DbConfig config) {
        try {
            boolean isConnected = dbConfigService.testConnection(config);
            if (isConnected) {
                return ResponseEntity.ok(ApiResponse.success("Kết nối cơ sở dữ liệu thành công!", null, 1));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra lại thông số.", 0));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi kiểm tra kết nối: " + e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<DbConfig> list = dbConfigService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cấu hình thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            DbConfig config = dbConfigService.getById(id);
            if (config != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy cấu hình thành công", config, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy cấu hình", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody DbConfig config) {
        try {
            // Nếu gửi yêu cầu mà không có idCongTy, ta có thể throw hoặc mặc định, ở đây phụ thuộc payload của frontend.
            int result = dbConfigService.create(config);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo cấu hình DB thành công", config, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo cấu hình DB thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody DbConfig config) {
        try {
            config.setId(id);
            int result = dbConfigService.update(config);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật cấu hình DB thành công", config, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy cấu hình DB để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = dbConfigService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa cấu hình DB thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy cấu hình DB để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<Object>> setDefaultDb(@PathVariable("id") String id, 
            @RequestParam(value = "syncIntervalHours", required = false) Integer syncIntervalHours,
            @RequestParam(value = "syncTime", required = false) String syncTime) {
        try {
            int result = dbConfigService.setDefault(id, syncIntervalHours, syncTime);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Bật cờ mặc định cho DB thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy cấu hình DB", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
