package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.NghiemThuPhuongTienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/nghiemthu-phuongtien")
public class NghiemThuPhuongTienController {

    @Autowired
    private NghiemThuPhuongTienService service;

    // ─── GET paged ────────────────────────────────────────────────────────────
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getAllPaged(
            @RequestParam("idCongTy") String idCongTy,
            @RequestParam(value = "page",     defaultValue = "0")  int     page,
            @RequestParam(value = "size",     defaultValue = "20") int     size,
            @RequestParam(value = "sortBy",   required = false)    String  sortBy,
            @RequestParam(value = "sortDir",  defaultValue = "desc") String sortDir,
            @RequestParam(value = "search",   required = false)    String  search,
            @RequestParam(value = "trangThai",required = false)    Integer trangThai,
            @RequestParam(value = "userid",   required = false)    String  userid,
            @RequestParam(value = "isSign",   required = false)    Boolean isSign,
            @RequestParam(value = "dateFrom", required = false)    String  dateFrom,
            @RequestParam(value = "dateTo",   required = false)    String  dateTo,
            @RequestParam(value = "idTaiSan", required = false)    String  idTaiSan
    ) {
        try {
            PageResponse<NghiemThuPhuongTienDTO> response = service.findAllPaged(
                    idCongTy, page, size, sortBy, sortDir, search,
                    trangThai, userid, isSign, dateFrom, dateTo, idTaiSan);
            return ResponseEntity.ok(ApiResponse.success(
                    "Lấy danh sách thành công", response, (int) response.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET all ─────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(value = "idcongty", required = false) String idCongTy) {
        try {
            List<NghiemThuPhuongTienDTO> list = service.findAll(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET by ID ───────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) {
        try {
            NghiemThuPhuongTienDTO dto = service.findByIdDTO(id);
            if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy biên bản nghiệm thu phương tiện", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── GET by BienPhapPhuongTien ────────────────────────────────────────────
    @GetMapping("/bienphap-phuongtien/{idBienPhapPhuongTien}")
    public ResponseEntity<ApiResponse<Object>> getByIdBienPhapPhuongTien(
            @PathVariable("idBienPhapPhuongTien") String idBienPhapPhuongTien) {
        try {
            List<NghiemThuPhuongTienDTO> list = service.findByIdBienPhapPhuongTien(idBienPhapPhuongTien);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/giamdinh-phuongtien/{idGiamDinhPhuongTien}")
    public ResponseEntity<ApiResponse<Object>> getByIdGiamDinhPhuongTien(
            @PathVariable("idGiamDinhPhuongTien") String idGiamDinhPhuongTien) {
        try {
            List<NghiemThuPhuongTienDTO> list = service.findByIdGiamDinhPhuongTien(idGiamDinhPhuongTien);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi xử lý yêu cầu", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống, vui lòng thử lại sau.", null));
        }
    }

    // ─── POST create ─────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@Valid @RequestBody NghiemThuPhuongTien entity) {
        try {
            NghiemThuPhuongTien created = service.insert(entity);
            return ResponseEntity.ok(ApiResponse.success("Tạo biên bản nghiệm thu thành công", created, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── PUT update ──────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable("id") String id,
            @Valid @RequestBody NghiemThuPhuongTien entity) {
        try {
            entity.setId(id);
            NghiemThuPhuongTien updated = service.update(entity);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── POST cập nhật trạng thái (ký) ──────────────────────────────────────
    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(
            @RequestParam("id")     String id,
            @RequestParam("userId") String userId) {
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
    public ResponseEntity<ApiResponse<Object>> huy(@RequestParam("id") String id) {
        try {
            int result = service.huyNghiemThu(id);
            return ResponseEntity.ok(ApiResponse.success("Hủy biên bản thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── PUT batch update ─────────────────────────────────────────────────────
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(
            @RequestBody List<@Valid NghiemThuPhuongTien> list) {
        try {
            service.bulkUpdate(list);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách thành công", null, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── DELETE batch ─────────────────────────────────────────────────────────
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            for (String id : ids) service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ─── DELETE by ID ─────────────────────────────────────────────────────────
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

    // ─── GET permission signing ───────────────────────────────────────────────
    @GetMapping("/permission-signing/{id}")
    public ResponseEntity<ApiResponse<Object>> getPermissionSigning(
            @PathVariable("id") String id,
            @RequestParam("tenDangNhap") String tenDangNhap
    ) {
        try {
            NghiemThuPhuongTienDTO item = service.findByIdDTO(id);
            if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure(
                            "Không tìm thấy biên bản nghiệm thu phương tiện với ID: " + id, null));

            int permission = service.getPermissionSigning(item, tenDangNhap);
            Map<String, Object> response = new HashMap<>();
            response.put("permission", permission);
            response.put("permissionDescription", getPermissionDescription(permission));
            response.put("itemId", id);
            response.put("tenDangNhap", tenDangNhap);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin quyền ký thành công", response, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    private String getPermissionDescription(int permission) {
        switch (permission) {
            case 0: return "Có thể ký";
            case 1: return "Chờ người trước ký";
            case 2: return "Không nằm trong flow ký";
            case 3: return "Đã ký";
            case 4: return "Đã tạo phiếu";
            case 5: return "Có thể tạo phiếu";
            default: return "Trạng thái không xác định";
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
