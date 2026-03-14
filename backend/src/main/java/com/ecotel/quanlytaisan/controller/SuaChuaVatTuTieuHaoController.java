package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.SuaChuaVatTuTieuHao;
import com.ecotel.quanlytaisan.service.SuaChuaVatTuTieuHaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suachua-vattutieuhao")
public class SuaChuaVatTuTieuHaoController {

    @Autowired
    private SuaChuaVatTuTieuHaoService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll() {
        try {
            List<SuaChuaVatTuTieuHao> list = service.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vật tư tiêu hao thành công", list, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            SuaChuaVatTuTieuHao item = service.getById(id);
            if (item != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy vật tư tiêu hao với ID: " + id, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/by-suachua/{idSuaChua}")
    public ResponseEntity<ApiResponse<Object>> getByIdSuaChua(@PathVariable String idSuaChua) {
        try {
            List<SuaChuaVatTuTieuHao> list = service.getByIdSuaChua(idSuaChua);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách theo phiếu sủa chữa thành công", list, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody SuaChuaVatTuTieuHao entity) {
        try {
            SuaChuaVatTuTieuHao created = service.create(entity);
            if (created != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm vật tư tiêu hao thành công", created, null));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm vật tư tiêu hao thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody SuaChuaVatTuTieuHao entity) {
        try {
            entity.setId(id);
            SuaChuaVatTuTieuHao updated = service.update(entity);
            if (updated != null) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật vật tư tiêu hao thành công", updated, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy vật tư tiêu hao để cập nhật", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("Xóa vật tư tiêu hao thành công", null, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy vật tư tiêu hao để xóa", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchInsert(@RequestBody List<SuaChuaVatTuTieuHao> list) {
        try {
            int count = service.batchInsert(list);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm hàng loạt vật tư tiêu hao thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchUpdate(@RequestBody List<SuaChuaVatTuTieuHao> list) {
        try {
            int count = service.batchUpdate(list);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật hàng loạt vật tư tiêu hao thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> batchDelete(@RequestBody List<String> ids) {
        try {
            int count = service.batchDelete(ids);
            return ResponseEntity.ok(ApiResponse.success("Xóa hàng loạt vật tư tiêu hao thành công", null, count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}