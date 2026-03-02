package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietSuaChuaDTO;
import com.ecotel.quanlytaisan.service.ChiTietSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chitiet-suachua")
public class ChiTietSuaChuaController {

    @Autowired
    private ChiTietSuaChuaService chiTietSuaChuaService;

    /**
     * Lấy danh sách chi tiết theo phiếu sửa chữa
     */
    @GetMapping("/suachua/{idSuaChua}")
    public ResponseEntity<List<ChiTietSuaChuaDTO>> findByIdSuaChua(@PathVariable String idSuaChua) {
        List<ChiTietSuaChuaDTO> list = chiTietSuaChuaService.findByIdSuaChua(idSuaChua);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy chi tiết theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChiTietSuaChuaDTO> findById(@PathVariable String id) {
        ChiTietSuaChuaDTO dto = chiTietSuaChuaService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Thêm mới chi tiết
     */
    @PostMapping
    public ResponseEntity<Integer> insert(@RequestBody ChiTietSuaChua entity) {
        int result = chiTietSuaChuaService.insert(entity);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Cập nhật chi tiết
     */
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable String id, @RequestBody ChiTietSuaChua entity) {
        entity.setId(id);
        int result = chiTietSuaChuaService.update(entity);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Xóa chi tiết
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        int result = chiTietSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa tất cả chi tiết theo phiếu sửa chữa
     */
    @DeleteMapping("/suachua/{idSuaChua}")
    public ResponseEntity<Void> deleteByIdSuaChua(@PathVariable String idSuaChua) {
        chiTietSuaChuaService.deleteByIdSuaChua(idSuaChua);
        return ResponseEntity.noContent().build();
    }
}