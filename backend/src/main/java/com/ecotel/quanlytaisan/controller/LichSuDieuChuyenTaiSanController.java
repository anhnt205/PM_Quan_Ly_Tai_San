package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSan;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSanDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LichSuDieuChuyenTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lichsudieuchuyentaisan")
public class LichSuDieuChuyenTaiSanController {

    @Autowired
    private LichSuDieuChuyenTaiSanService lichSuDieuChuyenTaiSanService;

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LichSuDieuChuyenTaiSanDTO> list) {
        try {
            int result = lichSuDieuChuyenTaiSanService.createBatch(list);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo lịch sử điều chuyển thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo lịch sử điều chuyển thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<PageResponse<LichSuDieuChuyenTaiSan>> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String idTaiSan,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        PageResponse<LichSuDieuChuyenTaiSan> response = lichSuDieuChuyenTaiSanService.getAllPaged(page, size, idTaiSan, fromDate, toDate);
        return ResponseEntity.ok(response);
    }
}
