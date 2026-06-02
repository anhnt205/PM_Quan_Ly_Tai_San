package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.CapSuaChua;
import com.ecotel.quanlytaisan.model.CapSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.CapSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cap-sua-chua")
public class CapSuaChuaController {
    @Autowired
    private CapSuaChuaService capSuaChuaService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<CapSuaChuaDTO> result = capSuaChuaService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cấp sửa chữa thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {
        try {
            PageResponse<CapSuaChuaDTO> result = capSuaChuaService.getPaged(page, size, sortBy, sortDir, search);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cấp sửa chữa phân trang thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            CapSuaChuaDTO result = capSuaChuaService.getById(id);
            if (result != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin cấp sửa chữa thành công", result, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy cấp sửa chữa", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody CapSuaChua item) {
        try {
            int result = capSuaChuaService.create(item);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo cấp sửa chữa thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo cấp sửa chữa thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody CapSuaChua item) {
        try {
            int result = capSuaChuaService.update(id, item);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật cấp sửa chữa thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy cấp sửa chữa để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = capSuaChuaService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa cấp sửa chữa thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy cấp sửa chữa để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<ApiResponse<Object>> deleteAll() {
        try {
            int result = capSuaChuaService.deleteAll();
            return ResponseEntity.ok(ApiResponse.success("Xóa toàn bộ cấp sửa chữa thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
