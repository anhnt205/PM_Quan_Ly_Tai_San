package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.service.DashboardService;
import com.ecotel.quanlytaisan.service.NhomCCDCService;
import com.ecotel.quanlytaisan.service.NhomTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService service;

    // ===== API chính - Lấy tất cả thống kê =====
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getDashboardStatistics() {
        try {
            Map<String, Object> data = service.getAllStatistics();
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê dashboard thành công", data, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ===== API mới cho thống kê trạng thái =====

    @GetMapping("/tai-san-theo-hien-trang-phan-tram")
    public ResponseEntity<ApiResponse<Object>> getTaiSanTheoHienTrangPhanTram() {
        try {
            List<Map<String, Object>> data = service.getTaiSanTheoHienTrangPhanTram();
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê tài sản theo hiện trạng với phần trăm thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/ccdc-theo-hien-trang-phan-tram")
    public ResponseEntity<ApiResponse<Object>> getCCDCTheoHienTrangPhanTram() {
        try {
            List<Map<String, Object>> data = service.getCCDCTheoHienTrangPhanTram();
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê CCDC theo hiện trạng với phần trăm thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/tai-san-sap-het-han-khau-hao")
    public ResponseEntity<ApiResponse<Object>> getTaiSanSapHetHanKhauHao() {
        try {
            List<Map<String, Object>> data = service.getTaiSanSapHetHanKhauHao();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản sắp hết hạn khấu hao thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/tai-san-theo-nhom-loai-con-phan-tram")
    public ResponseEntity<ApiResponse<Object>> getTaiSanTheoNhomLoaiConPhanTram(
        @RequestParam(value = "nhomId", required = false) String nhomId,
        @RequestParam("idcongty") String idcongty) {
        try {
             List<Map<String, Object>> data = service.getTaiSanTheoNhomLoaiConPhanTram(idcongty, nhomId);
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê tài sản theo nhóm và loại con với phần trăm thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/ccdc-theo-nhom-loai-con-phan-tram")
    public ResponseEntity<ApiResponse<Object>> getCCDCTheoNhomLoaiConPhanTram(
        @RequestParam(value = "nhomId", required = false) String nhomId,
        @RequestParam("idcongty") String idcongty) {
        try {
            Map<String, List<Map<String, Object>>> data = service.getCCDCTheoNhomLoaiConPhanTram(idcongty, nhomId);
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê CCDC theo nhóm và loại con với phần trăm thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ===== API mới cho thống kê nhóm với phần trăm chi tiết =====

    @GetMapping("/tai-san-theo-nhom-phan-tram-chi-tiet")
    public ResponseEntity<ApiResponse<Object>> getTaiSanTheoNhomPhanTramChiTiet() {
        try {
            List<Map<String, Object>> data = service.getTaiSanTheoNhomPhanTramChiTiet();
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê tài sản theo nhóm với phần trăm chi tiết thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/ccdc-theo-nhom-phan-tram-chi-tiet")
    public ResponseEntity<ApiResponse<Object>> getCCDCTheoNhomPhanTramChiTiet() {
        try {
            List<Map<String, Object>> data = service.getCCDCTheoNhomPhanTramChiTiet();
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê CCDC theo nhóm với phần trăm chi tiết thành công", data, data.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
