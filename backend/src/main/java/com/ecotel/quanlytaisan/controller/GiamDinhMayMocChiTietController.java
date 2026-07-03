package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocVatTu;
import com.ecotel.quanlytaisan.service.GiamDinhMayMocChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/giamdinh-maymoc-chitiet")
public class GiamDinhMayMocChiTietController {

    @Autowired
    private GiamDinhMayMocChiTietService service;

    @GetMapping("/giamdinh/{idGiamDinhMayMoc}")
    public ResponseEntity<ApiResponse<Object>> getByGiamDinh(@PathVariable("idGiamDinhMayMoc") String idGiamDinhMayMoc) {
        try {
            List<GiamDinhMayMocChiTiet> list = service.findByIdGiamDinh(idGiamDinhMayMoc);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(@RequestBody List<GiamDinhMayMocChiTiet> list) {
        try {
            int[] r = service.batchInsert(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(@RequestBody List<GiamDinhMayMocChiTiet> list) {
        try {
            int[] r = service.batchUpdate(list);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchDelete(@RequestBody List<String> ids) {
        try {
            service.batchDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- ENDPOINTS CHO VẬT TƯ CHI TIẾT (giamdinh_maymoc_vattu) ---

    @GetMapping("/vattu/{idChiTietGiamDinhMayMoc}")
    public ResponseEntity<ApiResponse<Object>> getVatTuByChiTietGiamDinh(@PathVariable("idChiTietGiamDinhMayMoc") String idChiTietGiamDinhMayMoc) {
        try {
            List<GiamDinhMayMocVatTu> list = service.findVatTuByIdChiTietGiamDinh(idChiTietGiamDinhMayMoc);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vật tư thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/vattu/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsertVatTu(@RequestBody List<GiamDinhMayMocVatTu> list) {
        try {
            int[] r = service.batchInsertVatTu(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách vật tư thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/vattu/{id}")
    public ResponseEntity<ApiResponse<Object>> updateVatTu(@PathVariable("id") String id, @RequestBody GiamDinhMayMocVatTu entity) {
        try {
            entity.setId(id);
            int r = service.updateVatTu(entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật vật tư thành công", null, r));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/vattu/batch")
    public ResponseEntity<ApiResponse<Object>> batchDeleteVatTu(@RequestBody List<String> ids) {
        try {
            service.batchDeleteVatTu(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách vật tư thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
