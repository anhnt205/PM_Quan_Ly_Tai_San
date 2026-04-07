package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.DinhMucSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.DinhMucSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dinhmucsuachua")
public class DinhMucSuaChuaController {

    @Autowired
    private DinhMucSuaChuaService service;

    @GetMapping("/paged")
    public ResponseEntity<PageResponse<DinhMucSuaChuaDTO>> getPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "search", required = false) String search
    ) {
        PageResponse<DinhMucSuaChuaDTO> response = service.getPaged(page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DinhMucSuaChuaDTO> getById(@PathVariable("id") String id) {
        DinhMucSuaChuaDTO dto = service.getById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DinhMucSuaChuaDTO>> create(
            @RequestBody DinhMucSuaChuaDTO dto,
            @RequestParam("username") String username
    ) {
        try {
            DinhMucSuaChuaDTO saved = service.save(dto, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo định mức thành công", saved, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi khi tạo định mức: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DinhMucSuaChuaDTO>> update(
            @PathVariable("id") String id,
            @RequestBody DinhMucSuaChuaDTO dto,
            @RequestParam("username") String username
    ) {
        try {
            dto.setId(id);
            DinhMucSuaChuaDTO saved = service.save(dto, username);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật định mức thành công", saved, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi khi cập nhật định mức: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("Xóa định mức thành công", null, 1));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi khi xóa định mức: " + e.getMessage(), null));
        }
    }
}
