package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.BulkKeHoachSuaChuaRequest;
import com.ecotel.quanlytaisan.model.KeHoachSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.KeHoachSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/kehoach-suachua")
public class KeHoachSuaChuaController {

    @Autowired
    private KeHoachSuaChuaService keHoachSuaChuaService;

    /**
     * Lấy danh sách kế hoạch sửa chữa có phân trang, lọc, sắp xếp
     */
    @GetMapping
    public ResponseEntity<PageResponse<KeHoachSuaChuaDTO>> findAll(
            @RequestParam String idCongTy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String loaiKeHoach,
            @RequestParam(required = false) String loaiDoiTuong,
            @RequestParam(required = false) String idDonViThucHien,
            @RequestParam(required = false) String trangThai
    ) throws SQLException {
        PageResponse<KeHoachSuaChuaDTO> response = keHoachSuaChuaService.findAllPaged(
                idCongTy, page, size, sortBy, sortDir, search,
                loaiKeHoach, loaiDoiTuong, idDonViThucHien, trangThai
        );
        return ResponseEntity.ok(response);
    }

    // Bulk Create
    @PostMapping("/bulk-create")
    public ResponseEntity<?> bulkCreate(@RequestBody List<KeHoachSuaChua> list) throws SQLException {
        keHoachSuaChuaService.bulkCreate(list);
        return ResponseEntity.ok().build();
    }

    // Bulk Update
    @PutMapping("/bulk-update")
    public ResponseEntity<?> bulkUpdate(@RequestBody List<KeHoachSuaChua> list) throws SQLException {
        keHoachSuaChuaService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    // Bulk Delete
    @DeleteMapping("/bulk-delete")
    public ResponseEntity<?> bulkDelete(@RequestBody List<String> ids) throws SQLException {
        keHoachSuaChuaService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }

    /**
     * Lấy thông tin kế hoạch theo ID (trả về DTO)
     */
    @GetMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaDTO> findById(@PathVariable String id) throws SQLException {
        KeHoachSuaChuaDTO dto = keHoachSuaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Tạo mới kế hoạch sửa chữa
     */
    @PostMapping
    public ResponseEntity<KeHoachSuaChua> insert(@RequestBody KeHoachSuaChua entity) throws SQLException {
        KeHoachSuaChua created = keHoachSuaChuaService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Cập nhật kế hoạch sửa chữa
     */
    @PutMapping("/{id}")
    public ResponseEntity<KeHoachSuaChua> update(@PathVariable String id, @RequestBody KeHoachSuaChua entity) throws SQLException {
        entity.setId(id);
        KeHoachSuaChua updated = keHoachSuaChuaService.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa kế hoạch sửa chữa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) throws SQLException {
        int result = keHoachSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ==================== IMPORT ====================

    /**
     * Import từ file CSV
     */
    @PostMapping("/import/csv")
    public ResponseEntity<List<KeHoachSuaChua>> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        List<KeHoachSuaChua> list = keHoachSuaChuaService.readCsv(file);
        return ResponseEntity.ok(list);
    }

    /**
     * Import từ file Excel
     */
    @PostMapping("/import/excel")
    public ResponseEntity<List<KeHoachSuaChua>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<KeHoachSuaChua> list = keHoachSuaChuaService.readExcel(file);
        return ResponseEntity.ok(list);
    }
}