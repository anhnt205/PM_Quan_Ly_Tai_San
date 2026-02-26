package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.DanhMucResponse;
import com.ecotel.quanlytaisan.service.DanhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/danhmuc")
public class DanhMucController {

    @Autowired
    private DanhMucService danhMucService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<DanhMucResponse>> getAllDanhMuc(@RequestParam String idCongTy) {
        try {
            DanhMucResponse danhMucResponse = danhMucService.getAllDanhMuc(idCongTy);
            
            // Đếm tổng số bản ghi
            int totalRecords = 0;
            if (danhMucResponse.getNhomTaiSan() != null) totalRecords += danhMucResponse.getNhomTaiSan().size();
            if (danhMucResponse.getNhomCCDC() != null) totalRecords += danhMucResponse.getNhomCCDC().size();
            if (danhMucResponse.getLoaiTaiSan() != null) totalRecords += danhMucResponse.getLoaiTaiSan().size();
            if (danhMucResponse.getLoaiTaiSanCon() != null) totalRecords += danhMucResponse.getLoaiTaiSanCon().size();
            if (danhMucResponse.getLoaiCCDCCon() != null) totalRecords += danhMucResponse.getLoaiCCDCCon().size();
            if (danhMucResponse.getNhanVien() != null) totalRecords += danhMucResponse.getNhanVien().size();
            if (danhMucResponse.getMoHinhTaiSan() != null) totalRecords += danhMucResponse.getMoHinhTaiSan().size();
            if (danhMucResponse.getDonVi() != null) totalRecords += danhMucResponse.getDonVi().size();
            if (danhMucResponse.getDonViTinh() != null) totalRecords += danhMucResponse.getDonViTinh().size();

            return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách danh mục thành công", danhMucResponse, totalRecords)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Object>> getDanhMucSummary(@RequestParam String idCongTy) {
        try {
            DanhMucResponse danhMucResponse = danhMucService.getAllDanhMuc(idCongTy);
            
            // Tạo summary object
            java.util.Map<String, Object> summary = new java.util.HashMap<>();
            summary.put("nhomTaiSanCount", danhMucResponse.getNhomTaiSan() != null ? danhMucResponse.getNhomTaiSan().size() : 0);
            summary.put("nhomCCDCCount", danhMucResponse.getNhomCCDC() != null ? danhMucResponse.getNhomCCDC().size() : 0);
            summary.put("loaiTaiSanCount", danhMucResponse.getLoaiTaiSan() != null ? danhMucResponse.getLoaiTaiSan().size() : 0);
            summary.put("loaiTaiSanConCount", danhMucResponse.getLoaiTaiSanCon() != null ? danhMucResponse.getLoaiTaiSanCon().size() : 0);
            summary.put("loaiCCDCConCount", danhMucResponse.getLoaiCCDCCon() != null ? danhMucResponse.getLoaiCCDCCon().size() : 0);
            summary.put("nhanVienCount", danhMucResponse.getNhanVien() != null ? danhMucResponse.getNhanVien().size() : 0);
            summary.put("moHinhTaiSanCount", danhMucResponse.getMoHinhTaiSan() != null ? danhMucResponse.getMoHinhTaiSan().size() : 0);
            summary.put("donViCount", danhMucResponse.getDonVi() != null ? danhMucResponse.getDonVi().size() : 0);
            summary.put("donViTinhCount", danhMucResponse.getDonViTinh() != null ? danhMucResponse.getDonViTinh().size() : 0);

            int totalCount = (Integer) summary.get("nhomTaiSanCount") + 
                           (Integer) summary.get("nhomCCDCCount") + 
                           (Integer) summary.get("loaiTaiSanCount") + 
                           (Integer) summary.get("loaiTaiSanConCount") + 
                           (Integer) summary.get("loaiCCDCConCount") + 
                           (Integer) summary.get("nhanVienCount") + 
                           (Integer) summary.get("moHinhTaiSanCount") + 
                           (Integer) summary.get("donViCount") + 
                           (Integer) summary.get("donViTinhCount");

            summary.put("totalCount", totalCount);

            return ResponseEntity.ok(
                ApiResponse.success("Lấy thống kê danh mục thành công", summary, totalCount)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
