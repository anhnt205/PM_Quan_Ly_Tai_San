package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.TaiSanFileDTO;
import com.ecotel.quanlytaisan.service.TaiSanFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taisan-file")
public class TaiSanFileController {

    @Autowired
    private TaiSanFileService taiSanFileService;

    // Lấy danh sách file theo id tài sản
    @GetMapping("/by-taisan/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> getByTaiSanId(@PathVariable("idTaiSan") String idTaiSan) {
        try {
            List<TaiSanFileDTO> result = taiSanFileService.getByTaiSanId(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách file thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Lấy chi tiết file theo id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") Integer id) {
        try {
            TaiSanFileDTO result = taiSanFileService.getById(id);
            if (result != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin file thành công", result, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy file với id: " + id, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Thêm mới file
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody TaiSanFileDTO dto) {
        try {
            int result = taiSanFileService.create(dto);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm file thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm file thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Cập nhật file
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") Integer id, @RequestBody TaiSanFileDTO dto) {
        try {
            int result = taiSanFileService.update(id, dto);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật file thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy file để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Xóa file
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") Integer id) {
        try {
            int result = taiSanFileService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa file thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy file để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Xóa tất cả file của một tài sản
    @DeleteMapping("/by-taisan/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> deleteByTaiSanId(@PathVariable("idTaiSan") String idTaiSan) {
        try {
            int result = taiSanFileService.deleteByTaiSanId(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả file của tài sản thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    /**
     * Thêm nhiều file cùng lúc
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<TaiSanFileDTO> dtos) {
        try {
            int successCount = taiSanFileService.createBatch(dtos);
            if (successCount > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách file thành công", null, successCount));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách file thất bại", successCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    /**
     * Xóa nhiều file theo danh sách ID
     */
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<Integer> ids) {
        try {
            int deletedCount = taiSanFileService.deleteBatch(ids);
            if (deletedCount > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách file thành công", null, deletedCount));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách file thất bại", deletedCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}