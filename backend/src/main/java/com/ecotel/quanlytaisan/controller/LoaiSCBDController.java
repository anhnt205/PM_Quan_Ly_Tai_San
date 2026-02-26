package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LoaiSCBD;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LoaiSCBDService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaiscbd")
@CrossOrigin(origins = "*")
public class LoaiSCBDController {

    @Autowired
    private LoaiSCBDService loaiSCBDService;

//   /api/loaiSCBD/paged?page=0&size=20&search=&sortBy=Ten&sortDir=asc
    @GetMapping("/paged")
    public PageResponse<LoaiSCBD> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {

        return loaiSCBDService.getAllPagedResponse(page, size, sortBy, sortDir, search);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<LoaiSCBD> loaiSCBDs = loaiSCBDService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách loại sửa chữa bảo dưỡng thành công", loaiSCBDs, loaiSCBDs.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            LoaiSCBD loaiSCBD = loaiSCBDService.getById(id);
            if (loaiSCBD != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy loại sửa chữa bảo dưỡng thành công", loaiSCBD, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại sửa chữa bảo dưỡng", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody LoaiSCBD loaiSCBD) {
        try {
            int result = loaiSCBDService.create(loaiSCBD);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo loại sửa chữa bảo dưỡng thành công", loaiSCBD, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo loại sửa chữa bảo dưỡng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody LoaiSCBD loaiSCBD) {
        try {
            loaiSCBD.setId(id);
            int result = loaiSCBDService.update(loaiSCBD);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật loại sửa chữa bảo dưỡng thành công", loaiSCBD, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại sửa chữa bảo dưỡng để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = loaiSCBDService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa loại sửa chữa bảo dưỡng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại sửa chữa bảo dưỡng để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LoaiSCBD> loaiSCBDs) {
        try {
            int result = loaiSCBDService.createBatch(loaiSCBDs);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo batch loại sửa chữa bảo dưỡng thành công", loaiSCBDs, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo batch loại sửa chữa bảo dưỡng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<LoaiSCBD> loaiSCBDs) {
        try {
            int result = loaiSCBDService.updateBatch(loaiSCBDs);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật batch loại sửa chữa bảo dưỡng thành công", loaiSCBDs, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại sửa chữa bảo dưỡng để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int result = loaiSCBDService.deleteBatch(ids);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa batch loại sửa chữa bảo dưỡng thành công", ids, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại sửa chữa bảo dưỡng để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/delete-all")
    @Operation(summary = "Xoá toàn bộ loại SCBD")
    public ResponseEntity<?> deleteAll() {
        loaiSCBDService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ loại SCBD");
    }


}
