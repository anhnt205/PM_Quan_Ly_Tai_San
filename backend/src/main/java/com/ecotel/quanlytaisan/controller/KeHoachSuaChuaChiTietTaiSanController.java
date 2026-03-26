package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachSuaChuaChiTietTaiSan;
import com.ecotel.quanlytaisan.service.KeHoachSuaChuaChiTietTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoachsuachua-chitiet-taisan")
public class KeHoachSuaChuaChiTietTaiSanController {

    @Autowired
    private KeHoachSuaChuaChiTietTaiSanService chiTietTaiSanService;

    @GetMapping
    public ResponseEntity<List<KeHoachSuaChuaChiTietTaiSan>> getAll() {
        return ResponseEntity.ok(chiTietTaiSanService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaChiTietTaiSan> getById(@PathVariable("id") String id) {
        KeHoachSuaChuaChiTietTaiSan entity = chiTietTaiSanService.getById(id);
        return entity != null ? ResponseEntity.ok(entity) : ResponseEntity.notFound().build();
    }

    @GetMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<List<KeHoachSuaChuaChiTietTaiSan>> getByIdKeHoach(@PathVariable("idKeHoach") String idKeHoach) {
        return ResponseEntity.ok(chiTietTaiSanService.getByIdKeHoach(idKeHoach));
    }

    @PostMapping
    public ResponseEntity<KeHoachSuaChuaChiTietTaiSan> create(@RequestBody KeHoachSuaChuaChiTietTaiSan entity) {
        KeHoachSuaChuaChiTietTaiSan created = chiTietTaiSanService.create(entity);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaChiTietTaiSan> update(@PathVariable("id") String id,
                                                              @RequestBody KeHoachSuaChuaChiTietTaiSan entity) {
        entity.setId(id);
        KeHoachSuaChuaChiTietTaiSan updated = chiTietTaiSanService.update(entity);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        return chiTietTaiSanService.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/batch-insert")
    public ResponseEntity<Integer> batchInsert(@RequestBody List<KeHoachSuaChuaChiTietTaiSan> list) {
        return ResponseEntity.ok(chiTietTaiSanService.batchInsert(list));
    }

    @PutMapping("/batch-update")
    public ResponseEntity<Integer> batchUpdate(@RequestBody List<KeHoachSuaChuaChiTietTaiSan> list) {
        return ResponseEntity.ok(chiTietTaiSanService.batchUpdate(list));
    }

    @DeleteMapping("/batch-delete")
    public ResponseEntity<Integer> batchDelete(@RequestBody List<String> ids) {
        return ResponseEntity.ok(chiTietTaiSanService.batchDelete(ids));
    }
}