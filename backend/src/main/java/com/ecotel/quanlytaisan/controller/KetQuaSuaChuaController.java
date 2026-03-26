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

    @GetMapping
    public ResponseEntity<PageResponse<KetQuaSuaChuaDTO>> findAll(
            @RequestParam(value = "idCongTy", required = false) String idCongTy,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "tuNgay", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate tuNgay,
            @RequestParam(value = "denNgay", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate denNgay,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "idDonViGiao", required = false) String idDonViGiao,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        LocalDateTime fromDateTime = (tuNgay != null) ? tuNgay.atStartOfDay() : null;
        LocalDateTime toDateTime = (denNgay != null) ? denNgay.atTime(LocalTime.MAX) : null;

        PageResponse<KetQuaSuaChuaDTO> response = ketQuaSuaChuaService.findWithFilters(
                idCongTy, trangThai, fromDateTime, toDateTime, search, userId,
                idDonViGiao, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<KetQuaSuaChuaDTO>> getByUserId(@PathVariable("userId") String userId) {
        List<KetQuaSuaChuaDTO> list = ketQuaSuaChuaService.getByUserId(userId);
        return ResponseEntity.ok(list);
    }

    // ==================== API LẤY CHI TIẾT ====================

    @GetMapping("/suachua/{idSuaChua}")
    public ResponseEntity<List<KetQuaSuaChuaDTO>> findByIdSuaChua(@PathVariable("idSuaChua") String idSuaChua) {
        List<KetQuaSuaChuaDTO> list = ketQuaSuaChuaService.findListByIdSuaChua(idSuaChua);
        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaDTO> findById(@PathVariable("id") String id) {
        KetQuaSuaChuaDTO dto = ketQuaSuaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/entity/{id}")
    public ResponseEntity<KetQuaSuaChua> findByIdEntity(@PathVariable("id") String id) {
        KetQuaSuaChua entity = ketQuaSuaChuaService.findById(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entity);
    }

    // ==================== API CRUD ====================

    @PostMapping
    public ResponseEntity<KetQuaSuaChua> insert(@RequestBody KetQuaSuaChua entity) {
        KetQuaSuaChua created = ketQuaSuaChuaService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KetQuaSuaChua> update(@PathVariable("id") String id,
                                                @RequestBody KetQuaSuaChua entity) {
        entity.setId(id);
        KetQuaSuaChua updated = ketQuaSuaChuaService.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        int result = ketQuaSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ==================== API XỬ LÝ KÝ DUYỆT ====================

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(
            @RequestParam("id") String id,
            @RequestParam("userId") String userId) {

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

    @PostMapping("/{id}/huy")
    public ResponseEntity<Integer> huyTrangThai(@PathVariable("id") String id) {
        int result = ketQuaSuaChuaService.huyTrangThai(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/permission")
    public ResponseEntity<Integer> getPermissionSigning(
            @PathVariable("id") String id,
            @RequestParam("userId") String userId) {

        KetQuaSuaChuaDTO dto = ketQuaSuaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        int permission = ketQuaSuaChuaService.getPermissionSigning(dto, userId);
        return ResponseEntity.ok(permission);
    }

    // ==================== BULK OPERATIONS ====================

    @PostMapping("/bulk-create")
    public ResponseEntity<?> bulkCreate(@RequestBody List<KetQuaSuaChua> list) {
        ketQuaSuaChuaService.bulkInsert(list);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/bulk")
    public ResponseEntity<?> bulkUpdate(@RequestBody List<KetQuaSuaChua> list) {
        ketQuaSuaChuaService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<?> bulkDelete(@RequestBody List<String> ids) {
        ketQuaSuaChuaService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }

    // ==================== IMPORT ====================

    @PostMapping("/import/csv")
    public ResponseEntity<List<KetQuaSuaChua>> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = ketQuaSuaChuaService.readCsv(file);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/import/excel")
    public ResponseEntity<List<KetQuaSuaChua>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<KetQuaSuaChua> list = ketQuaSuaChuaService.readExcel(file);
        return ResponseEntity.ok(list);
    }
}