package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.KetQuaSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/ketqua-suachua")
public class KetQuaSuaChuaController {

    @Autowired
    private KetQuaSuaChuaService ketQuaSuaChuaService;

    // ==================== API LẤY DANH SÁCH ====================

    /**
     * Lấy danh sách kết quả sửa chữa với phân trang và lọc
     */
    @GetMapping
    public ResponseEntity<PageResponse<KetQuaSuaChuaDTO>> findAll(
            @RequestParam(required = false) String idCongTy,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate tuNgay,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate denNgay,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String idDonViGiao,  // <-- THÊM
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LocalDateTime fromDateTime = (tuNgay != null) ? tuNgay.atStartOfDay() : null;
        LocalDateTime toDateTime = (denNgay != null) ? denNgay.atTime(LocalTime.MAX) : null;

        PageResponse<KetQuaSuaChuaDTO> response = ketQuaSuaChuaService.findWithFilters(
                idCongTy, trangThai, fromDateTime, toDateTime, search, userId,
                idDonViGiao,  // <-- THÊM
                page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách kết quả theo userId (các phiếu user có quyền xem/ký)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<KetQuaSuaChuaDTO>> getByUserId(@PathVariable String userId) {
        List<KetQuaSuaChuaDTO> list = ketQuaSuaChuaService.getByUserId(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy danh sách kết quả theo loại
     */
    @GetMapping("/loai/{loai}")
    public ResponseEntity<List<KetQuaSuaChuaDTO>> getByLoai(@PathVariable int loai) {
        List<KetQuaSuaChuaDTO> list = ketQuaSuaChuaService.getByLoai(loai);
        return ResponseEntity.ok(list);
    }

    // ==================== API LẤY CHI TIẾT ====================

    /**
     * Lấy kết quả theo phiếu sửa chữa (kèm chi tiết)
     */
    @GetMapping("/suachua/{idSuaChua}")
    public ResponseEntity<KetQuaSuaChuaDTO> findByIdSuaChua(@PathVariable String idSuaChua) {
        KetQuaSuaChuaDTO dto = ketQuaSuaChuaService.findByIdSuaChua(idSuaChua);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Lấy kết quả theo ID (trả về DTO)
     */
    @GetMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaDTO> findById(@PathVariable String id) {
        KetQuaSuaChuaDTO dto = ketQuaSuaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Lấy kết quả theo ID (trả về entity)
     */
    @GetMapping("/entity/{id}")
    public ResponseEntity<KetQuaSuaChua> findByIdEntity(@PathVariable String id) {
        KetQuaSuaChua entity = ketQuaSuaChuaService.findById(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entity);
    }

    // ==================== API CRUD ====================

    /**
     * Thêm mới kết quả
     */
    @PostMapping
    public ResponseEntity<KetQuaSuaChua> insert(@RequestBody KetQuaSuaChua entity) {
        KetQuaSuaChua created = ketQuaSuaChuaService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Cập nhật kết quả
     */
    @PutMapping("/{id}")
    public ResponseEntity<KetQuaSuaChua> update(@PathVariable String id,
                                                @RequestBody KetQuaSuaChua entity) {
        entity.setId(id);
        KetQuaSuaChua updated = ketQuaSuaChuaService.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa kết quả
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        int result = ketQuaSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ==================== API XỬ LÝ KÝ DUYỆT ====================

    /**
     * Cập nhật trạng thái ký duyệt
     * Tự động xác định bước dựa trên userId:
     *   - Người ký nháy (IdNguoiKyNhay)
     *   - Duyệt cấp phòng (IdTrinhDuyetCapPhong)
     *   - Duyệt giám đốc (IdTrinhDuyetGiamDoc)
     *   - Người ký phụ (bảng NguoiKy)
     * Trả về trạng thái mới: 0=nháp, 1=duyệt, 2=hủy, 3=hoàn thành
     */
    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(
            @RequestParam String id,
            @RequestParam String userId) {

        try {
            KetQuaSuaChua existing = ketQuaSuaChuaService.findById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy phiếu kết quả sửa chữa", null));
            }

            int result = ketQuaSuaChuaService.updateTrangThai(id, userId);
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
     * Hủy phiếu kết quả sửa chữa
     */
    @PostMapping("/{id}/huy")
    public ResponseEntity<Integer> huyTrangThai(@PathVariable String id) {
        int result = ketQuaSuaChuaService.huyTrangThai(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Kiểm tra quyền ký của user trên phiếu
     * Trả về: 0 - có thể ký, 1 - chưa đến lượt, 2 - không trong luồng, 3 - đã ký
     */
    @GetMapping("/{id}/permission")
    public ResponseEntity<Integer> getPermissionSigning(
            @PathVariable String id,
            @RequestParam String userId) {

        KetQuaSuaChuaDTO dto = ketQuaSuaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        int permission = ketQuaSuaChuaService.getPermissionSigning(dto, userId);
        return ResponseEntity.ok(permission);
    }

//    /**
//     * Duyệt cấp phòng
//     */
//    @PostMapping("/{id}/duyet-cap-phong")
//    public ResponseEntity<Integer> duyetCapPhong(
//            @PathVariable String id,
//            @RequestParam String userId,
//            @RequestParam boolean xacNhan) {
//
//        int result = ketQuaSuaChuaService.updateDuyetCapPhong(id, userId, xacNhan);
//        return ResponseEntity.ok(result);
//    }
//
//    /**
//     * Duyệt giám đốc
//     */
//    @PostMapping("/{id}/duyet-giam-doc")
//    public ResponseEntity<Integer> duyetGiamDoc(
//            @PathVariable String id,
//            @RequestParam String userId,
//            @RequestParam boolean xacNhan) {
//
//        int result = ketQuaSuaChuaService.updateDuyetGiamDoc(id, userId, xacNhan);
//        return ResponseEntity.ok(result);
//    }
//
//    /**
//     * Ký nháy
//     */
//    @PostMapping("/{id}/ky-nhay")
//    public ResponseEntity<Integer> kyNhay(
//            @PathVariable String id,
//            @RequestParam String userId) {
//
//        int result = ketQuaSuaChuaService.updateKyNhay(id, userId);
//        return ResponseEntity.ok(result);
//    }

    // ==================== BULK OPERATIONS ====================

    /**
     * Tạo hàng loạt
     */
    @PostMapping("/bulk-create")
    public ResponseEntity<?> bulkCreate(@RequestBody List<KetQuaSuaChua> list) {
        ketQuaSuaChuaService.bulkInsert(list);
        return ResponseEntity.ok().build();
    }

    /**
     * Cập nhật hàng loạt
     */
    @PutMapping("/bulk")
    public ResponseEntity<?> bulkUpdate(@RequestBody List<KetQuaSuaChua> list) {
        ketQuaSuaChuaService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa hàng loạt
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<?> bulkDelete(@RequestBody List<String> ids) {
        ketQuaSuaChuaService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }

    // ==================== IMPORT ====================

    /**
     * Import từ file CSV
     */
    @PostMapping("/import/csv")
    public ResponseEntity<List<KetQuaSuaChua>> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = ketQuaSuaChuaService.readCsv(file);
        return ResponseEntity.ok(list);
    }

    /**
     * Import từ file Excel
     */
    @PostMapping("/import/excel")
    public ResponseEntity<List<KetQuaSuaChua>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = ketQuaSuaChuaService.readExcel(file);
        return ResponseEntity.ok(list);
    }
}