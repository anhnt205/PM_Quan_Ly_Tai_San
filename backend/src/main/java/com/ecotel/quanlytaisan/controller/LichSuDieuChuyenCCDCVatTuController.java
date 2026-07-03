package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTu;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LichSuDieuChuyenCCDCVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lichsudieuchuyenccdcvattu")
public class LichSuDieuChuyenCCDCVatTuController {

    @Autowired
    private LichSuDieuChuyenCCDCVatTuService lichSuDieuChuyenCCDCVatTuService;

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LichSuDieuChuyenCCDCVatTuDTO> list) {
        try {
            int result = lichSuDieuChuyenCCDCVatTuService.createBatch(list);
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
    public ResponseEntity<PageResponse<LichSuDieuChuyenCCDCVatTu>> getAllPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "idCCDCVatTu", required = false) String idCCDCVatTu,
            @RequestParam(value = "fromDate", required = false) String fromDate,
            @RequestParam(value = "toDate", required = false) String toDate
    ) {
        PageResponse<LichSuDieuChuyenCCDCVatTu> response = lichSuDieuChuyenCCDCVatTuService.getAllPaged(page, size, idCCDCVatTu, fromDate, toDate);
        return ResponseEntity.ok(response);
    }
}
