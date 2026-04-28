package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuaChua;
import com.ecotel.quanlytaisan.model.SuaChuaDTO;
import com.ecotel.quanlytaisan.service.SuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suachua")
public class SuaChuaController {

    @Autowired
    private SuaChuaService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(@RequestParam("idCongTy") String idCongTy) {
        try {
            List<SuaChuaDTO> list = service.findAll(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            SuaChuaDTO dto = service.findByIdDTO(id);
            if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody SuaChua entity) {
        try {
            SuaChua result = service.insert(entity);
            if (result != null) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo phiếu sửa chữa thành công", result, 1));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo phiếu sửa chữa thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody SuaChua entity) {
        try {
            entity.setId(id);
            SuaChua result = service.update(entity);
            if (result != null) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật phiếu sửa chữa thành công", result, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = service.delete(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Xóa phiếu sửa chữa thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            service.bulkDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách phiếu sửa chữa thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(
            @RequestParam("id") String id,
            @RequestParam("trangThai") Integer trangThai) {
        try {
            int result = service.updateTrangThai(id, trangThai);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật trạng thái thành công", result, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huySuaChua(@RequestParam("id") String id) {
        try {
            int result = service.huySuaChua(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Hủy phiếu sửa chữa thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
