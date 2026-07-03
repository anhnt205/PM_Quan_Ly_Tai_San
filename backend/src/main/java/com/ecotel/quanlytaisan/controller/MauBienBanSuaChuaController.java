package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.MauBienBanSuaChua;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.MauBienBanSuaChuaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/mau-bien-ban-sua-chua")
@RequiredArgsConstructor
public class MauBienBanSuaChuaController {

    private final MauBienBanSuaChuaService service;

    @PostMapping
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> create(@Valid @RequestBody MauBienBanSuaChua entity) {
        MauBienBanSuaChua created = service.create(entity);
        return ResponseEntity.ok(ApiResponse.success("Thêm thành công", created, null));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<MauBienBanSuaChua>>> createBatch(@RequestBody List<@Valid MauBienBanSuaChua> entities) {
        List<MauBienBanSuaChua> createdList = service.createBatch(entities);
        return ResponseEntity.ok(ApiResponse.success("Thêm nhiều thành công", createdList, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> update(@PathVariable String id, @Valid @RequestBody MauBienBanSuaChua entity) {
        MauBienBanSuaChua updated = service.update(id, entity);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated, null));
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<List<MauBienBanSuaChua>>> updateBatch(@RequestBody List<@Valid MauBienBanSuaChua> entities) {
        List<MauBienBanSuaChua> updatedList = service.updateBatch(entities);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhiều thành công", updatedList, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, null));
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@RequestBody List<String> ids) {
        service.deleteBatch(ids);
        return ResponseEntity.ok(ApiResponse.success("Xóa nhiều thành công", null, null));
    }

    @DeleteMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAll() {
        service.deleteAll();
        return ResponseEntity.ok(ApiResponse.success("Xóa tất cả thành công", null, null));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponse<MauBienBanSuaChua>>> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) String loaiBienBan,
            @RequestParam(required = false) Boolean macDinh) {
        PageResponse<MauBienBanSuaChua> response = service.getPaged(page, size, ten, loaiBienBan, macDinh);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, null));
    }

    @PutMapping("/{id}/mac-dinh")
    public ResponseEntity<ApiResponse<MauBienBanSuaChua>> setMacDinh(@PathVariable String id) {
        MauBienBanSuaChua updated = service.setMacDinh(id);
        return ResponseEntity.ok(ApiResponse.success("Đặt mặc định thành công", updated, null));
    }
}
