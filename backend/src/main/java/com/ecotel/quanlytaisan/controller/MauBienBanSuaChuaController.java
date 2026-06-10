package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.MauBienBanSuaChua;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.MauBienBanSuaChuaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mau-bien-ban-sua-chua")
@RequiredArgsConstructor
public class MauBienBanSuaChuaController {

    private final MauBienBanSuaChuaService service;

    @PostMapping
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> create(@RequestBody MauBienBanSuaChua entity) {
        try {
            MauBienBanSuaChua created = service.create(entity);
            return ResponseEntity.ok(ApiResponse.success("Thêm thành công", created, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Thêm thất bại: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<MauBienBanSuaChua>>> createBatch(@RequestBody List<MauBienBanSuaChua> entities) {
        try {
            List<MauBienBanSuaChua> createdList = service.createBatch(entities);
            return ResponseEntity.ok(ApiResponse.success("Thêm nhiều thành công", createdList, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Thêm nhiều thất bại: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> update(@PathVariable String id, @RequestBody MauBienBanSuaChua entity) {
        try {
            MauBienBanSuaChua updated = service.update(id, entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Cập nhật thất bại: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<List<MauBienBanSuaChua>>> updateBatch(@RequestBody List<MauBienBanSuaChua> entities) {
        try {
            List<MauBienBanSuaChua> updatedList = service.updateBatch(entities);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật nhiều thành công", updatedList, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Cập nhật nhiều thất bại: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Xóa thất bại: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@RequestBody List<String> ids) {
        try {
            service.deleteBatch(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa nhiều thành công", null, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Xóa nhiều thất bại: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/all")
    public ResponseEntity<ApiResponse<Void>> deleteAll() {
        try {
            service.deleteAll();
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả thành công", null, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Xóa tất cả thất bại: " + e.getMessage(), null));
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponse<MauBienBanSuaChua>>> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String ten) {
        try {
            PageResponse<MauBienBanSuaChua> response = service.getPaged(page, size, ten);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Lấy danh sách thất bại: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/mac-dinh")
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> setMacDinh(@PathVariable String id) {
        try {
            MauBienBanSuaChua updated = service.setMacDinh(id);
            return ResponseEntity.ok(ApiResponse.success("Đặt mặc định thành công", updated, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Đặt mặc định thất bại: " + e.getMessage(), null));
        }
    }
}
