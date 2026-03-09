package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuaChua;
import com.ecotel.quanlytaisan.model.SuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.SuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/suachua")
public class SuaChuaController {

    @Autowired
    private SuaChuaService suaChuaService;

    /**
     * Lấy danh sách phiếu sửa chữa có phân trang, lọc, sắp xếp
     *
     * @param idCongTy    ID công ty (bắt buộc)
     * @param page        Trang số (mặc định 0)
     * @param size        Số lượng mỗi trang (mặc định 20)
     * @param sortBy      Trường sắp xếp (mặc định ngaytao)
     * @param sortDir     Hướng sắp xếp (asc/desc)
     * @param search      Từ khóa tìm kiếm
     * @param userId      ID người dùng để lọc theo quyền (tùy chọn)
     * @param loai        Loại phiếu (tùy chọn)
     * @param idDonViGiao ID đơn vị giao (tùy chọn)
     * @param idDonViNhan ID đơn vị nhận (tùy chọn)
     */
    @GetMapping
    public ResponseEntity<PageResponse<SuaChuaDTO>> findAll(
            @RequestParam String idCongTy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Integer loai,
            @RequestParam(required = false) String idDonViGiao,
            @RequestParam(required = false) String idDonViNhan,
            @RequestParam(required = false) String idKeHoach,
            @RequestParam(required = false) Integer trangThai  // <-- thêm
    ) throws SQLException {
        PageResponse<SuaChuaDTO> response = suaChuaService.findAllPaged(
                idCongTy, page, size, sortBy, sortDir, search,
                userId, loai, idDonViGiao, idDonViNhan, idKeHoach,
                trangThai  // <-- thêm
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách phiếu sửa chữa theo userId (các phiếu user có quyền xem)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SuaChuaDTO>> getByUserId(@PathVariable String userId) throws SQLException {
        List<SuaChuaDTO> list = suaChuaService.getByUserId(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy danh sách phiếu sửa chữa theo loại
     */
    @GetMapping("/loai/{loai}")
    public ResponseEntity<List<SuaChuaDTO>> getByLoai(@PathVariable int loai) throws SQLException {
        List<SuaChuaDTO> list = suaChuaService.getByLoai(loai);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy thông tin phiếu sửa chữa theo ID (trả về DTO)
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuaChuaDTO> findById(@PathVariable String id) throws SQLException {
        SuaChuaDTO dto = suaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Tạo mới phiếu sửa chữa
     */
    @PostMapping
    public ResponseEntity<SuaChua> insert(@RequestBody SuaChua entity) throws SQLException {
        SuaChua created = suaChuaService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Cập nhật phiếu sửa chữa
     */
    @PutMapping("/{id}")
    public ResponseEntity<SuaChua> update(@PathVariable String id, @RequestBody SuaChua entity) throws SQLException {
        entity.setId(id);
        SuaChua updated = suaChuaService.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa phiếu sửa chữa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) throws SQLException {
        int result = suaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ==================== CÁC ENDPOINT XỬ LÝ KÝ DUYỆT ====================
    /**
     * Gộp toàn bộ ký duyệt vào 1 API
     * Tự động xác định bước dựa trên userId:
     *   - Người ký nháy (IdNguoiKyNhay)
     *   - Duyệt cấp phòng (IdTrinhDuyetCapPhong)
     *   - Duyệt giám đốc (IdTrinhDuyetGiamDoc)
     *   - Người ký phụ (bảng NguoiKy)
     * Trả về trạng thái mới: 0=nháp, 1=chờ duyệt, 2=hủy, 3=hoàn thành
     */
    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(
            @RequestParam String id,
            @RequestParam String userId
    ) {
        try {
            SuaChua existing = suaChuaService.findById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy phiếu sửa chữa", null));
            }

            int result = suaChuaService.updateTrangThai(id, userId);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    /**
     * Hủy phiếu sửa chữa
     */
    @PostMapping("/{id}/huy")
    public ResponseEntity<Integer> huyTrangThai(@PathVariable String id) {
        int result = suaChuaService.huyTrangThai(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Kiểm tra quyền ký của user trên phiếu
     * Trả về: 0 - có thể ký, 1 - chưa đến lượt, 2 - không trong luồng, 3 - đã ký
     */
    @GetMapping("/{id}/permission")
    public ResponseEntity<Integer> getPermissionSigning(
            @PathVariable String id,
            @RequestParam String userId
    ) throws SQLException {
        SuaChuaDTO dto = suaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        int permission = suaChuaService.getPermissionSigning(dto, userId);
        return ResponseEntity.ok(permission);
    }

    // ==================== IMPORT ====================

    /**
     * Import từ file CSV
     */
    @PostMapping("/import/csv")
    public ResponseEntity<List<SuaChua>> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        List<SuaChua> list = suaChuaService.readCsv(file);
        return ResponseEntity.ok(list);
    }

    /**
     * Import từ file Excel
     */
    @PostMapping("/import/excel")
    public ResponseEntity<List<SuaChua>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<SuaChua> list = suaChuaService.readExcel(file);
        return ResponseEntity.ok(list);
    }
}