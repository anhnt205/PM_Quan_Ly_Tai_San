package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.GiamDinhChiTiet;
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
}
