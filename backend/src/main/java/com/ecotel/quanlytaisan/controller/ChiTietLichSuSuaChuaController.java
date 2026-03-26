package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.ChiTietLichSuSuaChua;
import com.ecotel.quanlytaisan.service.ChiTietLichSuSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chitiet-lichsu")
public class ChiTietLichSuSuaChuaController {

    @Autowired
    private ChiTietLichSuSuaChuaService chiTietService;

    @GetMapping("/lichsu/{idLichSu}")
    public ResponseEntity<List<ChiTietLichSuSuaChuaDTO>> findByLichSu(@PathVariable("idLichSu") String idLichSu) {
        return ResponseEntity.ok(chiTietService.findByIdLichSu(idLichSu));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChiTietLichSuSuaChua> findById(@PathVariable("id") String id) {
        ChiTietLichSuSuaChua entity = chiTietService.findById(id);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(entity);
    }

    @PostMapping
    public ResponseEntity<ChiTietLichSuSuaChua> insert(@RequestBody ChiTietLichSuSuaChua entity) {
        ChiTietLichSuSuaChua created = chiTietService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChiTietLichSuSuaChua> update(@PathVariable("id") String id, @RequestBody ChiTietLichSuSuaChua entity) {
        entity.setId(id);
        ChiTietLichSuSuaChua updated = chiTietService.update(entity);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        int result = chiTietService.delete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-lichsu/{idLichSu}")
    public ResponseEntity<Integer> deleteByLichSu(@PathVariable("idLichSu") String idLichSu) {
        int result = chiTietService.deleteByIdLichSu(idLichSu);
        return ResponseEntity.ok(result);
    }

    // Bulk operations
    @PostMapping("/bulk-create")
    public ResponseEntity<Void> bulkCreate(@RequestBody List<ChiTietLichSuSuaChua> list) {
        chiTietService.bulkInsert(list);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/bulk")
    public ResponseEntity<Void> bulkUpdate(@RequestBody List<ChiTietLichSuSuaChua> list) {
        chiTietService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDelete(@RequestBody List<String> ids) {
        chiTietService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }
}