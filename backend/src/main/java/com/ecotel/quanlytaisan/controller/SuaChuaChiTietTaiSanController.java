package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuaChuaChiTietTaiSan;
import com.ecotel.quanlytaisan.service.SuaChuaChiTietTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suachua-chitiettaisan")
public class SuaChuaChiTietTaiSanController {

    @Autowired
    private SuaChuaChiTietTaiSanService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<SuaChuaChiTietTaiSan> list = service.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chi tiết tài sản thành công", list, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            SuaChuaChiTietTaiSan item = service.getById(id);
            if (item != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết tài sản với ID: " + id, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-kehoach/{idKeHoach}")
    public ResponseEntity<ApiResponse<Object>> getByIdKeHoach(@PathVariable String idKeHoach) {
        try {
            List<SuaChuaChiTietTaiSan> list = service.getByIdKeHoach(idKeHoach);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách theo kế hoạch thành công", list, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody SuaChuaChiTietTaiSan entity) {
        try {
            SuaChuaChiTietTaiSan created = service.create(entity);
            if (created != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm chi tiết tài sản thành công", created, null));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm chi tiết tài sản thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody SuaChuaChiTietTaiSan entity) {
        try {
            entity.setId(id);
            SuaChuaChiTietTaiSan updated = service.update(entity);
            if (updated != null) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết tài sản thành công", updated, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết tài sản để cập nhật", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết tài sản thành công", null, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết tài sản để xóa", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(@RequestBody List<SuaChuaChiTietTaiSan> list) {
        try {
            int count = service.batchInsert(list);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm hàng loạt chi tiết tài sản thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(@RequestBody List<SuaChuaChiTietTaiSan> list) {
        try {
            int count = service.batchUpdate(list);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật hàng loạt chi tiết tài sản thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchDelete(@RequestBody List<String> ids) {
        try {
            int count = service.batchDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa hàng loạt chi tiết tài sản thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}