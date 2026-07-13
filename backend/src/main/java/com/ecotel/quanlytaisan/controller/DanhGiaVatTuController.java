package com.ecotel.quanlytaisan.controller;
import com.ecotel.quanlytaisan.model.UpdateGhiChuRequest;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.DanhGiaVatTu;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.DanhGiaVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/danhgia-vattu")
public class DanhGiaVatTuController {

    @Autowired
    private DanhGiaVatTuService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<DanhGiaVatTu> list = service.findAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "ngayTao") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "userid", required = false) String userid,
            @RequestParam(value = "isSign", required = false) Boolean isSign,
            @RequestParam(value = "dateFrom", required = false) String dateFrom,
            @RequestParam(value = "dateTo", required = false) String dateTo
    ,
            @RequestParam(value = "idTaiSan", required = false) String idTaiSan
    ) {
        try {
            PageResponse<DanhGiaVatTu> response = service.findAllPaged(
                    page, size, sortBy, sortDir, search,
                    trangThai, userid, isSign, dateFrom, dateTo, idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, (int) response.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            DanhGiaVatTu item = service.findById(id);
            if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy dữ liệu", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/nghiemthu/{idNghiemThu}")
    public ResponseEntity<ApiResponse<Object>> getByIdNghiemThu(@PathVariable("idNghiemThu") String idNghiemThu) {
        try {
            List<DanhGiaVatTu> list = service.findByIdNghiemThu(idNghiemThu);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@Valid @RequestBody DanhGiaVatTu entity) {
        try {
            DanhGiaVatTu created = service.insert(entity);
            return ResponseEntity.ok(ApiResponse.success("Tạo thành công", created, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @Valid @RequestBody DanhGiaVatTu entity) {
        try {
            entity.setId(id);
            DanhGiaVatTu updated = service.update(entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<DanhGiaVatTu> entities) {
        try {
            service.batchUpdate(entities);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, entities.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(
            @RequestParam("id") String id,
            @RequestParam("userId") String userId) {
        try {
            int result = service.updateTrangThai(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huy(@RequestParam("id") String id) {
        try {
            int result = service.huy(id);
            return ResponseEntity.ok(ApiResponse.success("Hủy phiếu thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int r = service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, r));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PatchMapping("/{id}/ghi-chu")
    public ResponseEntity<ApiResponse<Object>> updateGhiChu(
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateGhiChuRequest body) {
        try {
            int result = service.updateGhiChu(id, body.getGhiChuBienBan());
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("C?p nh?t ghi ch� th�nh c�ng", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Kh�ng t�m th?y b?n ghi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("L?i h? th?ng: " + e.getMessage(), null));
        }
    }
}
