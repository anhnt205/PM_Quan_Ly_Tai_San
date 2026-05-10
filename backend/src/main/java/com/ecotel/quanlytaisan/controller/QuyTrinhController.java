package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.QuyTrinhSuaChuaDTO;
import com.ecotel.quanlytaisan.service.QuyTrinhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quy-trinh")
public class QuyTrinhController {

    @Autowired
    private QuyTrinhService quyTrinhService;

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getPaged(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String idTaiSan,
            @RequestParam(required = false) Integer nam) {
        try {
            PageResponse<QuyTrinhSuaChuaDTO> result = quyTrinhService.getPagedQuyTrinh(page, pageSize, idTaiSan, nam);
            return ResponseEntity.ok(ApiResponse.success("Lấy dữ liệu quy trình thành công", result, (int) result.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
