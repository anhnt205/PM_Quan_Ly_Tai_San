package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LoaiCCDCCon;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LoaiCCDCConService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaiccdccon")
public class LoaiCCDCConController {
    @Autowired
    private LoaiCCDCConService loaiCCDCConService;

    // Phân trang toàn bộ
    @GetMapping("/paged")
    public PageResponse<LoaiCCDCCon> getAllPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {

        return loaiCCDCConService.getAllPagedResponse(page, size, sortBy, sortDir, search);
    }

    // Phân trang theo loại cha (phổ biến nhất)
    @GetMapping("/byloaiccdc/{idLoaiCCDC}/paged")
    public PageResponse<LoaiCCDCCon> getByIdLoaiCCDCPaged(
            @PathVariable("idLoaiCCDC") String idLoaiCCDC,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search) {

        return loaiCCDCConService.getPagedResponseByIdLoaiCCDC(idLoaiCCDC, page, size, sortBy, sortDir, search);
    }

    @GetMapping
    public List<LoaiCCDCCon> getAll() {
        return loaiCCDCConService.getAll();
    }

    @GetMapping("/{id}")
    public LoaiCCDCCon getById(@PathVariable("id") String id) {
        return loaiCCDCConService.getById(id);
    }

    @GetMapping("/byloaiccdc/{idLoaiCCDC}")
    public List<LoaiCCDCCon> getByIdLoaiCCDC(@PathVariable("idLoaiCCDC") String idLoaiCCDC) {
        return loaiCCDCConService.getByIdLoaiCCDC(idLoaiCCDC);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody LoaiCCDCCon lccdc) {
        try {
            int result = loaiCCDCConService.create(lccdc);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo loại CCDC con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo loại CCDC con thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<LoaiCCDCCon> list) {
        try {
            int total = loaiCCDCConService.batchCreate(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách loại CCDC con thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách loại CCDC con thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<LoaiCCDCCon> list) {
        try {
            int total = loaiCCDCConService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách loại CCDC con thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách loại CCDC con thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody LoaiCCDCCon lccdc) {
        try {
            lccdc.setId(id);
            int result = loaiCCDCConService.update(lccdc);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật loại CCDC con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại CCDC con để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = loaiCCDCConService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa loại CCDC con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại CCDC con để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = loaiCCDCConService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách loại CCDC con thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách loại CCDC con thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }




    @DeleteMapping("/delete-all")
    @Operation(summary = "Xoá toàn bộ loại CCDC Con")
    public ResponseEntity<?> deleteAll() {
        loaiCCDCConService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ loại CCDC Con");
    }





}
