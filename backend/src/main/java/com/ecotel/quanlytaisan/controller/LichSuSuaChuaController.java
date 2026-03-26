package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.LichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.LichSuSuaChua;
import com.ecotel.quanlytaisan.service.LichSuSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lichsu-suachua")
public class LichSuSuaChuaController {

    @Autowired
    private LichSuSuaChuaService lichSuService;

    @GetMapping
    public ResponseEntity<List<LichSuSuaChuaDTO>> findAll() {
        return ResponseEntity.ok(lichSuService.findAll());
    }

    @GetMapping("/taisan/{idTaiSan}")
    public ResponseEntity<List<LichSuSuaChuaDTO>> findByTaiSan(@PathVariable("idTaiSan") String idTaiSan) {
        return ResponseEntity.ok(lichSuService.findByTaiSan(idTaiSan));
    }

    @GetMapping("/ketqua/{idKetQuaSuaChua}")
    public ResponseEntity<List<LichSuSuaChuaDTO>> findByKetQuaSuaChua(@PathVariable("idKetQuaSuaChua") String idKetQuaSuaChua) {
        return ResponseEntity.ok(lichSuService.findByKetQuaSuaChua(idKetQuaSuaChua));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichSuSuaChuaDTO> findById(@PathVariable("id") String id) {
        LichSuSuaChuaDTO dto = lichSuService.findByIdDTO(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<LichSuSuaChua> insert(@RequestBody LichSuSuaChua entity) {
        LichSuSuaChua created = lichSuService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichSuSuaChua> update(@PathVariable("id") String id, @RequestBody LichSuSuaChua entity) {
        entity.setId(id);
        LichSuSuaChua updated = lichSuService.update(entity);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        int result = lichSuService.delete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-ketqua/{idKetQuaSuaChua}")
    public ResponseEntity<Integer> deleteByIdKetQuaSuaChua(@PathVariable("idKetQuaSuaChua") String idKetQuaSuaChua) {
        int result = lichSuService.deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
        return ResponseEntity.ok(result);
    }

    // Bulk operations
    @PostMapping("/bulk-create")
    public ResponseEntity<Void> bulkCreate(@RequestBody List<LichSuSuaChua> list) {
        lichSuService.bulkInsert(list);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/bulk")
    public ResponseEntity<Void> bulkUpdate(@RequestBody List<LichSuSuaChua> list) {
        lichSuService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDelete(@RequestBody List<String> ids) {
        lichSuService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }
}