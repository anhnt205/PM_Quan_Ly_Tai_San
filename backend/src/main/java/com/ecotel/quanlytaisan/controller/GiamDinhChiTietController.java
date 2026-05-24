package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.GiamDinhChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhVatTu;
import com.ecotel.quanlytaisan.service.GiamDinhChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/giamdinh-chitiet")
public class GiamDinhChiTietController {

    @Autowired
    private GiamDinhChiTietService service;

    @GetMapping("/giamdinh/{idGiamDinh}")
    public ResponseEntity<ApiResponse<Object>> getByGiamDinh(@PathVariable("idGiamDinh") String idGiamDinh) {
        try {
            List<GiamDinhChiTiet> list = service.findByIdGiamDinh(idGiamDinh);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(@RequestBody List<GiamDinhChiTiet> list) {
        try {
            int[] r = service.batchInsert(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(@RequestBody List<GiamDinhChiTiet> list) {
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

    // --- ENDPOINTS CHO VẬT TƯ CHI TIẾT (giamdinh_vattu) ---

    @GetMapping("/vattu/{idChiTietGiamDinh}")
    public ResponseEntity<ApiResponse<Object>> getVatTuByChiTietGiamDinh(@PathVariable("idChiTietGiamDinh") String idChiTietGiamDinh) {
        try {
            List<GiamDinhVatTu> list = service.findVatTuByIdChiTietGiamDinh(idChiTietGiamDinh);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vật tư thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/vattu/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsertVatTu(@RequestBody List<GiamDinhVatTu> list) {
        try {
            int[] r = service.batchInsertVatTu(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách vật tư thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/vattu/{id}")
    public ResponseEntity<ApiResponse<Object>> updateVatTu(@PathVariable("id") String id, @RequestBody GiamDinhVatTu entity) {
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
