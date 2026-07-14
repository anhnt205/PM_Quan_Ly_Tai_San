package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.BienPhapPhuongTienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/bienphap-phuongtien")
public class BienPhapPhuongTienController {

    @Autowired
    private BienPhapPhuongTienService service;

    // ─── GET danh sách phân trang ─────────────────────────────────────────────

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getPaged(
            @RequestParam("idCongTy") String idCongTy,
            @RequestParam(value = "page",      defaultValue = "0")    int     page,
            @RequestParam(value = "size",      defaultValue = "20")   int     size,
            @RequestParam(value = "sortBy",    required = false)      String  sortBy,
            @RequestParam(value = "sortDir",   defaultValue = "desc") String  sortDir,
            @RequestParam(value = "search",    required = false)      String  search,
            @RequestParam(value = "trangThai", required = false)      Integer trangThai,
            @RequestParam(value = "userid",    required = false)      String  userid,
            @RequestParam(value = "isSign",    required = false)      Boolean isSign,
            @RequestParam(value = "dateFrom",  required = false)      String  dateFrom,
            @RequestParam(value = "dateTo",    required = false)      String  dateTo,
            @RequestParam(value = "idTaiSan",  required = false)      String  idTaiSan
    ) {
        try {
            PageResponse<BienPhapPhuongTienDTO> resp = service.findAllPaged(
                    idCongTy, page, size, sortBy, sortDir, search, trangThai, userid, isSign, dateFrom, dateTo, idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", resp, (int) resp.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET danh sách ───────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(value = "idcongty", required = false) String idCongTy) {
        try {
            List<BienPhapPhuongTienDTO> list = service.findAll(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET theo ID ──────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            BienPhapPhuongTienDTO dto = service.findByIdDTO(id);
            if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy biện pháp sửa chữa", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET theo IdTaiSan ────────────────────────────────────────────────────

    @GetMapping("/taisan/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> getByIdTaiSan(@PathVariable String idTaiSan) {
        try {
            List<BienPhapPhuongTienDTO> list = service.findByIdTaiSan(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET theo IdGiamDinhPhuongTien ───────────────────────────────────────────────

    @GetMapping("/giamdinh-phuongtien/{idGiamDinhPhuongTien}")
    public ResponseEntity<ApiResponse<Object>> getByIdGiamDinhPhuongTien(@PathVariable String idGiamDinhPhuongTien) {
        try {
            List<BienPhapPhuongTienDTO> list = service.findByIdGiamDinhPhuongTien(idGiamDinhPhuongTien);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── POST tạo mới ─────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@Valid @RequestBody BienPhapPhuongTien entity) {
        try {
            BienPhapPhuongTien created = service.insert(entity);
            return ResponseEntity.ok(ApiResponse.success("Tạo biện pháp thành công", created, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── PUT cập nhật ─────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id,
                                                      @Valid @RequestBody BienPhapPhuongTien entity) {
        try {
            entity.setId(id);
            BienPhapPhuongTien updated = service.update(entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── POST cập nhật trạng thái ký ─────────────────────────────────────────

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(@RequestParam String id,
                                                               @RequestParam String userId) {
        try {
            int result = service.updateTrangThai(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── POST hủy ────────────────────────────────────────────────────────────

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huy(@RequestParam String id) {
        try {
            int r = service.huy(id);
            return ResponseEntity.ok(ApiResponse.success("Hủy biện pháp thành công", null, r));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int r = service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, r));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            ids.forEach(service::delete);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<@Valid BienPhapPhuongTien> list) {
        try {
            service.bulkUpdate(list);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PatchMapping("/{id}/ghi-chu")
    public ResponseEntity<ApiResponse<Object>> updateGhiChu(
            @PathVariable("id") String id,
            @RequestBody java.util.Map<String, String> body) {
        try {
            String ghiChu = body.get("ghiChuBienBan");
            int result = service.updateGhiChu(id, ghiChu);
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("Cập nhật ghi chú thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy bản ghi", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
