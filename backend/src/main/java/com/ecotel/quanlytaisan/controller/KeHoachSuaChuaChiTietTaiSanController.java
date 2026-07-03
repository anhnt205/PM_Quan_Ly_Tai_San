package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaChiTietTaiSan;
import com.ecotel.quanlytaisan.service.KeHoachSuaChuaChiTietTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller chi tiết kế hoạch sửa chữa tài sản – theo pattern ChiTietDieuDongTaiSanController.
 * Mỗi dòng chi tiết chứa 12 trường capSuaChuaThang1-12 để chọn cấp sửa chữa theo từng tháng.
 */
@RestController
@RequestMapping("/api/kehoachsuachua-chitiet-taisan")
public class KeHoachSuaChuaChiTietTaiSanController {

    @Autowired
    private KeHoachSuaChuaChiTietTaiSanService chiTietTaiSanService;

    // ==================== GET BY idKeHoach ====================

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam("idkehoachsuachua") String idKeHoachSuaChua) {
        try {
            List<KeHoachSuaChuaChiTietTaiSan> list = chiTietTaiSanService.getByIdKeHoach(idKeHoachSuaChua);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET BY ID ====================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            KeHoachSuaChuaChiTietTaiSan entity = chiTietTaiSanService.getById(id);
            if (entity == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy chi tiết kế hoạch sửa chữa tài sản", null));
            }
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", entity, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET BY idKeHoach (path variable variant) ====================

    @GetMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<ApiResponse<Object>> getByIdKeHoach(@PathVariable("idKeHoach") String idKeHoach) {
        try {
            List<KeHoachSuaChuaChiTietTaiSan> list = chiTietTaiSanService.getByIdKeHoach(idKeHoach);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/kehoach/{idKeHoach}/thang/{thang}")
    public ResponseEntity<ApiResponse<Object>> getByIdKeHoachAndThang(
            @PathVariable("idKeHoach") String idKeHoach,
            @PathVariable("thang") Integer thang) {
        try {
            List<KeHoachSuaChuaChiTietTaiSan> list = chiTietTaiSanService.getByIdKeHoachAndThang(idKeHoach, thang);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CREATE ====================

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody KeHoachSuaChuaChiTietTaiSan entity) {
        try {
            KeHoachSuaChuaChiTietTaiSan created = chiTietTaiSanService.create(entity);
            if (created != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo chi tiết kế hoạch sửa chữa tài sản thành công", created, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo chi tiết kế hoạch sửa chữa tài sản thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CREATE BATCH ====================

    @PostMapping("/batch-insert")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<KeHoachSuaChuaChiTietTaiSan> list) {
        try {
            int total = chiTietTaiSanService.batchInsert(list);
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách chi tiết kế hoạch sửa chữa tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách chi tiết kế hoạch sửa chữa tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== UPDATE ====================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable("id") String id,
            @RequestBody KeHoachSuaChuaChiTietTaiSan entity) {
        try {
            entity.setId(id);
            KeHoachSuaChuaChiTietTaiSan updated = chiTietTaiSanService.update(entity);
            if (updated != null) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết kế hoạch sửa chữa tài sản thành công", updated, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết kế hoạch sửa chữa tài sản để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== UPDATE BATCH ====================

    @PutMapping("/batch-update")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<KeHoachSuaChuaChiTietTaiSan> list) {
        try {
            int total = chiTietTaiSanService.batchUpdate(list);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết kế hoạch sửa chữa tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết kế hoạch sửa chữa tài sản để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== DELETE ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            boolean deleted = chiTietTaiSanService.delete(id);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết kế hoạch sửa chữa tài sản thành công", null, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết kế hoạch sửa chữa tài sản để xóa", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== DELETE BATCH ====================

    @DeleteMapping("/batch-delete")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = chiTietTaiSanService.batchDelete(ids);
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết kế hoạch sửa chữa tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết kế hoạch sửa chữa tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
