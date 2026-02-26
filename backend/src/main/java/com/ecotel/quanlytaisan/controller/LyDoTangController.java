package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LyDoTang;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LyDoTangService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lydotang")
@CrossOrigin(origins = "*")
public class LyDoTangController {

    @Autowired
    private LyDoTangService lyDoTangService;

//   /api/lydotang/paged?page=0&size=20&search=&sortBy=Ten&sortDir=asc
    @GetMapping("/paged")
    public PageResponse<LyDoTang> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {

        return lyDoTangService.getAllPagedResponse(page, size, sortBy, sortDir, search);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<LyDoTang> lyDoTangs = lyDoTangService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lý do tăng thành công", lyDoTangs, lyDoTangs.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            LyDoTang lyDoTang = lyDoTangService.getById(id);
            if (lyDoTang != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy lý do tăng thành công", lyDoTang, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy lý do tăng", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody LyDoTang lyDoTang) {
        try {
            int result = lyDoTangService.create(lyDoTang);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo lý do tăng thành công", lyDoTang, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo lý do tăng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody LyDoTang lyDoTang) {
        try {
            lyDoTang.setId(id);
            int result = lyDoTangService.update(lyDoTang);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật lý do tăng thành công", lyDoTang, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy lý do tăng để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = lyDoTangService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa lý do tăng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy lý do tăng để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LyDoTang> lyDoTangs) {
        try {
            int result = lyDoTangService.createBatch(lyDoTangs);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo batch lý do tăng thành công", lyDoTangs, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo batch lý do tăng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<LyDoTang> lyDoTangs) {
        try {
            int result = lyDoTangService.updateBatch(lyDoTangs);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật batch lý do tăng thành công", lyDoTangs, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy lý do tăng để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int result = lyDoTangService.deleteBatch(ids);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa batch lý do tăng thành công", ids, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy lý do tăng để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }



    @DeleteMapping("/delete-all")
    @Operation(summary = "Xoá toàn bộ lý do tăng")
    public ResponseEntity<?> deleteAll() {
        lyDoTangService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ lý do tăng");
    }



}
