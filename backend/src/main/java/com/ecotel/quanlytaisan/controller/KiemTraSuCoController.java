package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.KiemTraSuCo;
import com.ecotel.quanlytaisan.model.KiemTraSuCoDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.UpdateGhiChuRequest;
import com.ecotel.quanlytaisan.service.KiemTraSuCoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/kiemtra-suco")
public class KiemTraSuCoController {

    @Autowired
    private KiemTraSuCoService service;

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Object>> findAllPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "searchValue", required = false) String searchValue,
            @RequestParam(value = "idCongTy", required = false) String idCongTy,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "userid", required = false) String userid,
            @RequestParam(value = "isSign", required = false) Boolean isSign,
            @RequestParam(value = "dateFrom", required = false) String dateFrom,
            @RequestParam(value = "dateTo", required = false) String dateTo,
            @RequestParam(value = "idTaiSan", required = false) String idTaiSan) {
        try {
            PageResponse<KiemTraSuCoDTO> response = service.findAllPaged(page, pageSize, searchValue, idCongTy, trangThai, userid, isSign, dateFrom, dateTo, idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, (int) response.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(
            @RequestParam("id") String id,
            @RequestParam("userId") String userId) {
        try {
            int result = service.updateTrangThai(id, userId);
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", result, 1));
            return ResponseEntity.ok(ApiResponse.failure("Cập nhật trạng thái thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huy(
            @RequestParam("id") String id) {
        try {
            int result = service.huy(id);
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("Hủy biên bản thành công", result, 1));
            return ResponseEntity.ok(ApiResponse.failure("Hủy biên bản thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> findById(@PathVariable String id) {
        try {
            KiemTraSuCoDTO dto = service.findByIdDTO(id);
            if (dto != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
            }
            return ResponseEntity.ok(ApiResponse.failure("Không tìm thấy dữ liệu", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @GetMapping("/suco/{idSuCo}")
    public ResponseEntity<ApiResponse<Object>> findByIdSuCo(@PathVariable("idSuCo") String idSuCo) {
        try {
            List<KiemTraSuCoDTO> list = service.findByIdSuCo(idSuCo);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure(e.getMessage(), 0));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> insert(@Valid @RequestBody KiemTraSuCo entity) {
        try {
            KiemTraSuCo result = service.insert(entity);
            if (result != null) {
                return ResponseEntity.ok(ApiResponse.success("Thêm mới thành công", result, 1));
            }
            return ResponseEntity.ok(ApiResponse.failure("Thêm mới thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @Valid @RequestBody KiemTraSuCo entity) {
        try {
            entity.setId(id);
            KiemTraSuCo result = service.update(entity);
            if (result != null) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, 1));
            }
            return ResponseEntity.ok(ApiResponse.failure("Cập nhật thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }
    
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<KiemTraSuCo> entities) {
        try {
            service.batchUpdate(entities);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, entities.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = service.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, result));
            }
            return ResponseEntity.ok(ApiResponse.failure("Xóa thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), 0));
        }
    }
    @PatchMapping("/{id}/ghi-chu")
    public ResponseEntity<ApiResponse<Object>> updateGhiChu(
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateGhiChuRequest body) {
        try {
            int result = service.updateGhiChu(id, body.getGhiChuBienBan());
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("Cập nhật ghi chú thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy bản ghi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
