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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody LichSuDieuChuyenTaiSanDTO item) {
        try {
            int result = lichSuDieuChuyenTaiSanService.update(id, item);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch sử thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy bản ghi để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = lichSuDieuChuyenTaiSanService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa lịch sử thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy bản ghi để xóa", result));
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

    // ================== BATCH UPDATE & DELETE ==================
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<LichSuDieuChuyenTaiSanDTO> list) {
        try {
            int successCount = lichSuDieuChuyenTaiSanService.updateBatch(list);
            if (successCount > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, successCount));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách thất bại", successCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int deletedCount = lichSuDieuChuyenTaiSanService.deleteBatch(ids);
            if (deletedCount > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách thành công", null, deletedCount));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách thất bại", deletedCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}