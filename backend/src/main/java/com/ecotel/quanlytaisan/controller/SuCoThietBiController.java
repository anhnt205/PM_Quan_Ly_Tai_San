package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.SuCoThietBiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller API Sự cố thiết bị.
 *
 * Base URL : /api/suco-thietbi
 *
 * TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
 * MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
 */
@RestController
@RequestMapping("/api/suco-thietbi")
public class SuCoThietBiController {

    @Autowired
    private SuCoThietBiService suCoService;

    // ==================== GET ALL (paged) ====================

    /**
     * Lấy danh sách sự cố phân trang.
     *
     * @param idCongTy      Bắt buộc – ID công ty
     * @param page          Số trang (bắt đầu từ 0, mặc định 0)
     * @param size          Kích thước trang (mặc định 20)
     * @param sortBy        Trường sắp xếp: soPhieu | mucDo | trangThai | ngayPhatHien | ngayTao
     * @param sortDir       Chiều sắp xếp: asc | desc (mặc định desc)
     * @param search        Tìm kiếm theo soPhieu, tenHeThongThietBi, moTa
     * @param idDonViBaoCao Filter theo đơn vị báo cáo
     * @param trangThai     Filter theo trạng thái (0/1/2/3)
     * @param mucDo         Filter theo mức độ (1/2/3/4)
     * @param userid        ID người dùng hiện tại (để filter turn-sign)
     */
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getAllPaged(
            @RequestParam("idCongTy") String idCongTy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "idDonViBaoCao", required = false) String idDonViBaoCao,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "mucDo", required = false) Integer mucDo,
            @RequestParam(value = "userid", required = false) String userid,
            @RequestParam(value = "isSign", required = false) Boolean isSign,
            @RequestParam(value = "dateFrom", required = false) String dateFrom,
            @RequestParam(value = "dateTo", required = false) String dateTo
    ) {
        try {
            PageResponse<SuCoThietBiDTO> response = suCoService.findAllPaged(
                    idCongTy, page, size, sortBy, sortDir, search,
                    idDonViBaoCao, trangThai, mucDo, userid, isSign, dateFrom, dateTo);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", response, (int) response.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET ALL (no paging) ====================

    /**
     * Lấy toàn bộ sự cố theo công ty (không phân trang).
     *
     * @param idcongty ID công ty
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam("idcongty") String idCongTy
    ) throws SQLException {
        try {
            List<SuCoThietBiDTO> list = suCoService.findAll(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== GET BY ID ====================

    /**
     * Lấy chi tiết một phiếu sự cố (bao gồm danh sách chi tiết tài sản).
     *
     * @param id ID phiếu sự cố
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(
            @PathVariable("id") String id
    ) throws SQLException {
        try {
            SuCoThietBiDTO dto = suCoService.findByIdDTO(id);
            if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố", null));
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", dto, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-kehoach/{idKeHoach}")
    public ResponseEntity<ApiResponse<Object>> getByIdKeHoach(
            @PathVariable("idKeHoach") String idKeHoach
    ) throws SQLException {
        try {
            List<SuCoThietBiDTO> list = suCoService.findByIdKeHoach(idKeHoach);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sự cố thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CREATE ====================

    /**
     * Tạo mới phiếu sự cố.
     * ID sẽ được tự sinh theo pattern SC-YYYY-NNNN.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(
            @Valid @RequestBody SuCoThietBiDTO entity
    ) throws SQLException {
        try {
            SuCoThietBi result = suCoService.insert(entity);
            if (result != null) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo phiếu sự cố thành công", result, 1));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo phiếu sự cố thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CREATE BATCH ====================

    /**
     * Tạo nhiều phiếu sự cố cùng lúc.
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(
            @RequestBody List<@Valid SuCoThietBiDTO> list
    ) {
        try {
            int total = 0;
            for (SuCoThietBiDTO item : list)
                if (suCoService.insert(item) != null) total++;
            if (total > 0) return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo danh sách phiếu sự cố thành công", null, total));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách phiếu sự cố thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== UPDATE ====================

    /**
     * Cập nhật phiếu sự cố.
     *
     * @param id ID phiếu cần cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable("id") String id,
            @Valid @RequestBody SuCoThietBiDTO entity
    ) throws SQLException {
        try {
            entity.setId(id);
            SuCoThietBi result = suCoService.update(entity);
            if (result != null) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật phiếu sự cố thành công", result, 1));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== UPDATE BATCH ====================

    /**
     * Cập nhật nhiều phiếu sự cố.
     */
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(
            @RequestBody List<@Valid SuCoThietBiDTO> list
    ) {
        try {
            int total = 0;
            for (SuCoThietBiDTO item : list)
                if (suCoService.update(item) != null) total++;
            if (total > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật danh sách phiếu sự cố thành công", null, total));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== DELETE ====================

    /**
     * Xóa phiếu sự cố (đồng thời xóa toàn bộ chi tiết).
     *
     * @param id ID phiếu sự cố
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable("id") String id
    ) throws SQLException {
        try {
            int result = suCoService.delete(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Xóa phiếu sự cố thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== DELETE BATCH ====================

    /**
     * Xóa nhiều phiếu sự cố theo danh sách ID.
     */
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(
            @RequestBody List<String> ids
    ) throws SQLException {
        try {
            suCoService.bulkDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa danh sách phiếu sự cố thành công", null, ids.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== CẬP NHẬT TRẠNG THÁI ====================

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(
            @RequestParam("id") String id,
            @RequestParam("userId") String userId
    ) {
        try {
            int result = suCoService.updateTrangThai(id, userId);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Cập nhật trạng thái thành công", result, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure(e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.failure(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== HỦY ====================

    /**
     * Hủy phiếu sự cố (chuyển trạng thái về 2=Hủy).
     *
     * @param id ID phiếu sự cố
     */
    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huySuCo(
            @RequestParam("id") String id
    ) {
        try {
            int result = suCoService.huySuCo(id);
            if (result > 0) return ResponseEntity.ok(
                    ApiResponse.success("Hủy phiếu sự cố thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ==================== PERMISSION SIGNING ====================

    /**
     * Kiểm tra quyền ký của người dùng trên phiếu sự cố.
     *
     * Kết quả permission:
     *   0 = Có thể ký
     *   1 = Chờ người trước ký
     *   2 = Không nằm trong flow ký
     *   3 = Đã ký
     *   4 = Đã tạo phiếu
     *   5 = Có thể tạo phiếu
     *
     * @param id          ID phiếu sự cố
     * @param tenDangNhap Username / ID người dùng cần kiểm tra
     */
    @GetMapping("/permission-signing/{id}")
    public ResponseEntity<ApiResponse<Object>> getPermissionSigning(
            @PathVariable("id") String id,
            @RequestParam("tenDangNhap") String tenDangNhap
    ) throws SQLException {
        try {
            SuCoThietBiDTO item = suCoService.findByIdDTO(id);
            if (item == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phiếu sự cố với ID: " + id, null));

            int permission = suCoService.getPermissionSigning(item, tenDangNhap);
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
            int result = suCoService.updateGhiChu(id, body.getGhiChuBienBan());
            if (result > 0) return ResponseEntity.ok(ApiResponse.success("Cập nhật ghi chú thành công", null, result));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy bản ghi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
