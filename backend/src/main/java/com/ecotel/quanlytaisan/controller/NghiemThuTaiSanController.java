package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.NghiemThuTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nghiemthu-taisan")
public class NghiemThuTaiSanController {

    @Autowired
    private NghiemThuTaiSanService service;

    @GetMapping("/bienban/{idBienBan}")
    public ResponseEntity<ApiResponse<Object>> getByBienBan(@PathVariable("idBienBan") String idBienBan) {
        try {
            List<NghiemThuTaiSan> list = service.findByIdBienBan(idBienBan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/vattu/{idBienBanTaiSan}")
    public ResponseEntity<ApiResponse<Object>> getVatTuByBienBanTaiSan(@PathVariable("idBienBanTaiSan") String idBienBanTaiSan) {
        try {
            List<NghiemThuVatTu> list = service.findVatTuByIdBienBanTaiSan(idBienBanTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vật tư thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/taisan/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsertTaiSan(@RequestBody List<NghiemThuTaiSan> list) {
        try {
            int[] r = service.batchInsertTaiSan(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách tài sản thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/vattu/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsertVatTu(@RequestBody List<NghiemThuVatTu> list) {
        try {
            int[] r = service.batchInsertVatTu(list);
            return ResponseEntity.ok(ApiResponse.success("Tạo danh sách vật tư thành công", null, r.length));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/vattu/{id}")
    public ResponseEntity<ApiResponse<Object>> updateVatTu(@PathVariable("id") String id, @RequestBody NghiemThuVatTu entity) {
        try {
            entity.setId(id);
            int r = service.updateVatTu(entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật vật tư thành công", null, r));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/taisan/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteTaiSan(@PathVariable("id") String id) {
        try {
            int r = service.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa tài sản thành công", null, r));
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
