package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuaChuaChiTiet;
import com.ecotel.quanlytaisan.service.SuaChuaChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suachua-chitiet")
public class SuaChuaChiTietController {

    @Autowired
    private SuaChuaChiTietService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<SuaChuaChiTiet> list = service.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            SuaChuaChiTiet item = service.getById(id);
            if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-suachua/{idSuaChua}")
    public ResponseEntity<ApiResponse<Object>> getByIdSuaChua(@PathVariable("idSuaChua") String idSuaChua) {
        try {
            List<SuaChuaChiTiet> list = service.getByIdSuaChua(idSuaChua);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chi tiết thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody SuaChuaChiTiet entity) {
        try {
            SuaChuaChiTiet result = service.create(entity);
            if (result != null) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm chi tiết thành công", result, 1));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm chi tiết thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(@RequestBody List<SuaChuaChiTiet> list) {
        try {
            int total = service.batchInsert(list);
            if (total > 0) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm danh sách chi tiết thành công", null, total));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chi tiết thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody SuaChuaChiTiet entity) {
        try {
            entity.setId(id);
            SuaChuaChiTiet result = service.update(entity);
            if (result != null) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật chi tiết thành công", result, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            boolean ok = service.delete(id);
            if (ok) return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết thành công", null, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết để xóa", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(@RequestBody List<SuaChuaChiTiet> list) {
        try {
            int total = service.batchUpdate(list);
            if (total > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật danh sách chi tiết thành công", null, total));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách chi tiết thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchDelete(@RequestBody List<String> ids) {
        try {
            service.batchDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
