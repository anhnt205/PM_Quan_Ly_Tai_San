package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChuKySuaChua;
import com.ecotel.quanlytaisan.service.ChuKySuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chukysuachua")
public class ChuKySuaChuaController {

    @Autowired
    private ChuKySuaChuaService chuKySuaChuaService;

    @GetMapping("/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> getByIdTaiSan(@PathVariable("idTaiSan") String idTaiSan) {
        try {
            List<ChuKySuaChua> result = chuKySuaChuaService.getByIdTaiSan(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chu kỳ sửa chữa thành công", result, result.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Object>> sync(@RequestBody List<ChuKySuaChua> list) {
        try {
            int result = chuKySuaChuaService.syncChuKySuaChua(list);
            return ResponseEntity.ok(ApiResponse.success("Đồng bộ chu kỳ sửa chữa thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
