package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.service.ChiTietKetQuaSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chitiet-ketqua-suachua")
public class ChiTietKetQuaSuaChuaController {

    @Autowired
    private ChiTietKetQuaSuaChuaService chiTietKetQuaSuaChuaService;

    /**
     * Lấy danh sách chi tiết theo kết quả
     */
    @GetMapping("/ketqua/{idKetQua}")
    public ResponseEntity<List<ChiTietKetQuaSuaChuaDTO>> findByIdKetQua(@PathVariable String idKetQua) {
        List<ChiTietKetQuaSuaChuaDTO> list = chiTietKetQuaSuaChuaService.findByIdKetQua(idKetQua);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy chi tiết theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChiTietKetQuaSuaChuaDTO> findById(@PathVariable String id) {
        ChiTietKetQuaSuaChuaDTO dto = chiTietKetQuaSuaChuaService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Thêm mới chi tiết
     */
    @PostMapping
    public ResponseEntity<Integer> insert(@RequestBody ChiTietKetQuaSuaChua entity) {
        int result = chiTietKetQuaSuaChuaService.insert(entity);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Cập nhật chi tiết
     */
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable String id, @RequestBody ChiTietKetQuaSuaChua entity) {
        entity.setId(id);
        int result = chiTietKetQuaSuaChuaService.update(entity);
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
        int result = chiTietKetQuaSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa tất cả chi tiết theo kết quả
     */
    @DeleteMapping("/ketqua/{idKetQua}")
    public ResponseEntity<Void> deleteByIdKetQua(@PathVariable String idKetQua) {
        int result = chiTietKetQuaSuaChuaService.deleteByIdKetQua(idKetQua);
        return ResponseEntity.noContent().build();
    }
}