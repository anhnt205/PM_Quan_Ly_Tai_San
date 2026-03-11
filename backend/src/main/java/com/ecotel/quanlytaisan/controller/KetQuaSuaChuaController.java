package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.service.KetQuaSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ketqua-suachua")
public class KetQuaSuaChuaController {

    @Autowired
    private KetQuaSuaChuaService ketQuaSuaChuaService;

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
     * Lấy kết quả theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<KetQuaSuaChua> findById(@PathVariable String id) {
        KetQuaSuaChua entity = ketQuaSuaChuaService.findById(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entity);
    }

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
}