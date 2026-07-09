package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.PhieuGiaoViec;
import com.ecotel.quanlytaisan.model.PhieuGiaoViecDTO;
import com.ecotel.quanlytaisan.service.PhieuGiaoViecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/phieugiaoviec")
public class PhieuGiaoViecController {

    @Autowired
    private PhieuGiaoViecService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<PhieuGiaoViecDTO> list = service.findAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getAllPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "userid", required = false) String userid,
            @RequestParam(value = "isSign", required = false) Boolean isSign,
            @RequestParam(value = "dateFrom", required = false) String dateFrom,
            @RequestParam(value = "dateTo", required = false) String dateTo
    ) {
        try {
            PageResponse<PhieuGiaoViecDTO> response = service.findAllPaged(
                    page, size, sortBy, sortDir, search,
                    trangThai, userid, isSign, dateFrom, dateTo);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, (int) response.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/suachua/{idSuaChua}")
    public ResponseEntity<ApiResponse<Object>> getByIdSuaChua(@PathVariable("idSuaChua") String idSuaChua) {
        try {
            List<PhieuGiaoViecDTO> list = service.findByIdSuaChua(idSuaChua);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            PhieuGiaoViecDTO dto = service.findByIdDTO(id);
            if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu giao việc", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@Valid @RequestBody PhieuGiaoViecDTO entity) {
        try {
            PhieuGiaoViec result = service.insert(entity);
            if (result != null) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo phiếu giao việc thành công", result, 1));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo phiếu giao việc thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @Valid @RequestBody PhieuGiaoViecDTO entity) {
        try {
            entity.setId(id);
            PhieuGiaoViec result = service.update(entity);
            if (result != null) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật phiếu giao việc thành công", result, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu giao việc để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<PhieuGiaoViecDTO> entities) {
        try {
            service.batchUpdate(entities);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách phiếu giao việc thành công", null, entities.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = service.delete(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Xóa phiếu giao việc thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu giao việc để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            service.bulkDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách phiếu giao việc thành công", null, ids.size()));
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
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật trạng thái thành công", result, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu giao việc", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huyPhieu(@RequestParam("id") String id) {
        try {
            int result = service.huyPhieu(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Hủy phiếu giao việc thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu giao việc", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
