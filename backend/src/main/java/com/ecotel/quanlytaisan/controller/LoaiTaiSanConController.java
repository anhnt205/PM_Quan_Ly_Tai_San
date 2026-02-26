package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LoaiTaiSanCon;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LoaiTaiSanConService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaitaisancon")
public class LoaiTaiSanConController {
    @Autowired
    private LoaiTaiSanConService loaiTaiSanConService;

    @GetMapping
    public List<LoaiTaiSanCon> getAll() {
        return loaiTaiSanConService.getAll();
    }

    @GetMapping("/paged")
    public PageResponse<LoaiTaiSanCon> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {
        return loaiTaiSanConService.getAllPaged(page, size, sortBy, sortDir, search);
    }

    @GetMapping("/{id}")
    public LoaiTaiSanCon getById(@PathVariable String id) {
        return loaiTaiSanConService.getById(id);
    }

    @GetMapping("/byloaitaisan/{idLoaiTs}")
    public List<LoaiTaiSanCon> getByIdLoaiTs(@PathVariable String idLoaiTs) {
        return loaiTaiSanConService.getByIdLoaiTs(idLoaiTs);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody LoaiTaiSanCon ltsc) {
        try {
            int result = loaiTaiSanConService.create(ltsc);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo loại tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo loại tài sản con thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LoaiTaiSanCon> list) {
        try {
            int total = 0;
            for (LoaiTaiSanCon item : list) {
                total += loaiTaiSanConService.create(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách loại tài sản con thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách loại tài sản con thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody LoaiTaiSanCon ltsc) {
        try {
            ltsc.setId(id);
            int result = loaiTaiSanConService.update(ltsc);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật loại tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại tài sản con để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = loaiTaiSanConService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa loại tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại tài sản con để xóa", result));
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
                total += loaiTaiSanConService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách loại tài sản con thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách loại tài sản con thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
