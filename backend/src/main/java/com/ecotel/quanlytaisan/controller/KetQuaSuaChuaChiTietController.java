package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTiet;
import com.ecotel.quanlytaisan.service.KetQuaSuaChuaChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ketqua-suachua/chitiet")
public class KetQuaSuaChuaChiTietController {

    @Autowired
    private KetQuaSuaChuaChiTietService chiTietService;

    @GetMapping("/by-ketqua/{idKetQuaSuaChua}")
    public ResponseEntity<List<KetQuaSuaChuaChiTietDTO>> getByKetQuaSuaChua(@PathVariable String idKetQuaSuaChua) {
        List<KetQuaSuaChuaChiTietDTO> list = chiTietService.findByIdKetQuaSuaChua(idKetQuaSuaChua);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaChiTiet> findById(@PathVariable String id) {
        KetQuaSuaChuaChiTiet entity = chiTietService.findById(id);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(entity);
    }

    @PostMapping
    public ResponseEntity<KetQuaSuaChuaChiTiet> insert(@RequestBody KetQuaSuaChuaChiTiet entity,
                                                       @RequestParam String userId) {
        KetQuaSuaChuaChiTiet created = chiTietService.insert(entity, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaChiTiet> update(@PathVariable String id,
                                                       @RequestBody KetQuaSuaChuaChiTiet entity,
                                                       @RequestParam String userId) {
        entity.setId(id);
        KetQuaSuaChuaChiTiet updated = chiTietService.update(entity, userId);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        int result = chiTietService.delete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/soft/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable String id) {
        int result = chiTietService.softDelete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<KetQuaSuaChuaChiTiet>> insertBulk(@RequestBody List<KetQuaSuaChuaChiTiet> entities,
                                                                 @RequestParam String userId) {
        List<KetQuaSuaChuaChiTiet> created = chiTietService.insertBulk(entities, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<KetQuaSuaChuaChiTiet>> updateBulk(@RequestBody List<KetQuaSuaChuaChiTiet> entities,
                                                                 @RequestParam String userId) {
        List<KetQuaSuaChuaChiTiet> updated = chiTietService.updateBulk(entities, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Integer> deleteBulk(@RequestBody List<String> ids) {
        int count = chiTietService.deleteBulk(ids);
        return ResponseEntity.ok(count);
    }

    /**
     * Thay thế toàn bộ danh sách chi tiết tài sản của một phiếu
     */
    @PutMapping("/replace/{idKetQuaSuaChua}")
    public ResponseEntity<List<KetQuaSuaChuaChiTiet>> replaceByKetQuaSuaChua(
            @PathVariable String idKetQuaSuaChua,
            @RequestBody List<KetQuaSuaChuaChiTiet> newEntities,
            @RequestParam String userId) {
        List<KetQuaSuaChuaChiTiet> result = chiTietService.replaceByKetQuaSuaChua(idKetQuaSuaChua, newEntities, userId);
        return ResponseEntity.ok(result);
    }
}