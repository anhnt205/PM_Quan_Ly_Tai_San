package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LoaiKeHoachSCBD;
import com.ecotel.quanlytaisan.service.LoaiKeHoachScbdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaikehoachscbd")
public class LoaiKeHoachSCBDController {

    @Autowired
    private LoaiKeHoachScbdService loaiKeHoachService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<LoaiKeHoachSCBD> list = loaiKeHoachService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách loại kế hoạch thành công", list, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            LoaiKeHoachSCBD item = loaiKeHoachService.getById(id);
            if (item != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin loại kế hoạch thành công", item, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại kế hoạch", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody LoaiKeHoachSCBD loaiKeHoach) {
        try {
            // Có thể tự sinh id nếu cần, ở đây giả sử id được gửi từ client hoặc tự sinh trước khi gọi
            int result = loaiKeHoachService.create(loaiKeHoach);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm loại kế hoạch thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm loại kế hoạch thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody LoaiKeHoachSCBD loaiKeHoach) {
        try {
            loaiKeHoach.setId(id);
            int result = loaiKeHoachService.update(loaiKeHoach);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật loại kế hoạch thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại kế hoạch để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = loaiKeHoachService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa loại kế hoạch thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy loại kế hoạch để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
