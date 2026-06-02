package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuCoThietBiChiTiet;
import com.ecotel.quanlytaisan.service.SuCoThietBiChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller API chi tiết tài sản trong phiếu sự cố thiết bị.
 *
 * Base URL : /api/suco-thietbi-chitiet
 *
 * Mỗi dòng chi tiết gồm:
 *   - idSuCo              : ID phiếu sự cố cha
 *   - idTaiSan            : ID tài sản
 *   - thuocHeThong        : Thuộc hệ thống (nhập tay)
 *   - tinhTrang           : Tình trạng tại thời điểm sự cố (nhập tay)
 *   - idDonViQuanLyKyThuat: ID đơn vị quản lý kỹ thuật
 */
@RestController
@RequestMapping("/api/suco-thietbi-chitiet")
public class SuCoThietBiChiTietController {

    @Autowired
    private SuCoThietBiChiTietService chiTietService;

    // ==================== GET ALL ====================

    /**
     * Lấy tất cả chi tiết (không filter).
     * Dùng cho mục đích debug/admin.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<SuCoThietBiChiTiet> list = chiTietService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET BY ID ====================

    /**
     * Lấy chi tiết theo ID dòng.
     *
     * @param id ID dòng chi tiết
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(
            @PathVariable("id") String id
    ) {
        try {
            SuCoThietBiChiTiet item = chiTietService.getById(id);
            if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET BY ID SỰ CỐ ====================

    /**
     * Lấy danh sách chi tiết theo ID phiếu sự cố cha.
     * Kết quả bao gồm join tenTaiSan, donViTinh, tenDonViQuanLyKyThuat.
     *
     * @param idSuCo ID phiếu sự cố
     */
    @GetMapping("/by-suco/{idSuCo}")
    public ResponseEntity<ApiResponse<Object>> getByIdSuCo(
            @PathVariable("idSuCo") String idSuCo
    ) {
        try {
            List<SuCoThietBiChiTiet> list = chiTietService.getByIdSuCo(idSuCo);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chi tiết thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CREATE ====================

    /**
     * Thêm một dòng chi tiết vào phiếu sự cố.
     * ID sẽ được tự sinh (UUID).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(
            @RequestBody SuCoThietBiChiTiet entity
    ) {
        try {
            SuCoThietBiChiTiet result = chiTietService.create(entity);
            if (result != null) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm chi tiết thành công", result, 1));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm chi tiết thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== BATCH INSERT ====================

    /**
     * Thêm nhiều dòng chi tiết cùng lúc.
     * Mỗi phần tử cần có idSuCo, idTaiSan, thuocHeThong, tinhTrang, idDonViQuanLyKyThuat.
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(
            @RequestBody List<SuCoThietBiChiTiet> list
    ) {
        try {
            int total = chiTietService.batchInsert(list);
            if (total > 0) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm danh sách chi tiết thành công", null, total));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chi tiết thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== UPDATE ====================

    /**
     * Cập nhật một dòng chi tiết.
     *
     * @param id ID dòng chi tiết
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable("id") String id,
            @RequestBody SuCoThietBiChiTiet entity
    ) {
        try {
            entity.setId(id);
            SuCoThietBiChiTiet result = chiTietService.update(entity);
            if (result != null) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật chi tiết thành công", result, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== BATCH UPDATE ====================

    /**
     * Cập nhật nhiều dòng chi tiết cùng lúc.
     * Mỗi phần tử phải có id hợp lệ.
     */
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(
            @RequestBody List<SuCoThietBiChiTiet> list
    ) {
        try {
            int total = chiTietService.batchUpdate(list);
            if (total > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật danh sách chi tiết thành công", null, total));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== DELETE ====================

    /**
     * Xóa một dòng chi tiết.
     *
     * @param id ID dòng chi tiết cần xóa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable("id") String id
    ) {
        try {
            boolean ok = chiTietService.delete(id);
            if (ok) return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết thành công", null, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết để xóa", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== BATCH DELETE ====================

    /**
     * Xóa nhiều dòng chi tiết theo danh sách ID.
     * Request body: ["SCCT_uuid1", "SCCT_uuid2", ...]
     */
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchDelete(
            @RequestBody List<String> ids
    ) {
        try {
            int total = chiTietService.batchDelete(ids);
            if (total > 0) return ResponseEntity.ok(
                    ApiResponse.success("Xóa danh sách chi tiết thành công", null, total));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
