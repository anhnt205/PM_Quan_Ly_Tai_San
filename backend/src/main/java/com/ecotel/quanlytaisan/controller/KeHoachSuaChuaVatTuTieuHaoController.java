package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachSuaChuaVatTuTieuHao;
import com.ecotel.quanlytaisan.service.KeHoachSuaChuaVatTuTieuHaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoachsuachua-vattu-tieuhao")
public class KeHoachSuaChuaVatTuTieuHaoController {

    @Autowired
    private KeHoachSuaChuaVatTuTieuHaoService vatTuTieuHaoService;

    @GetMapping
    public ResponseEntity<List<KeHoachSuaChuaVatTuTieuHao>> getAll() {
        return ResponseEntity.ok(vatTuTieuHaoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaVatTuTieuHao> getById(@PathVariable("id") String id) {
        KeHoachSuaChuaVatTuTieuHao entity = vatTuTieuHaoService.getById(id);
        return entity != null ? ResponseEntity.ok(entity) : ResponseEntity.notFound().build();
    }

    @GetMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<List<KeHoachSuaChuaVatTuTieuHao>> getByIdKeHoach(@PathVariable("idKeHoach") String idKeHoach) {
        return ResponseEntity.ok(vatTuTieuHaoService.getByIdKeHoach(idKeHoach));
    }

    @PostMapping
    public ResponseEntity<KeHoachSuaChuaVatTuTieuHao> create(@RequestBody KeHoachSuaChuaVatTuTieuHao entity) {
        KeHoachSuaChuaVatTuTieuHao created = vatTuTieuHaoService.create(entity);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaVatTuTieuHao> update(@PathVariable("id") String id,
                                                             @RequestBody KeHoachSuaChuaVatTuTieuHao entity) {
        entity.setId(id);
        KeHoachSuaChuaVatTuTieuHao updated = vatTuTieuHaoService.update(entity);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        return vatTuTieuHaoService.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/batch-insert")
    public ResponseEntity<Integer> batchInsert(@RequestBody List<KeHoachSuaChuaVatTuTieuHao> list) {
        return ResponseEntity.ok(vatTuTieuHaoService.batchInsert(list));
    }

    @PutMapping("/batch-update")
    public ResponseEntity<Integer> batchUpdate(@RequestBody List<KeHoachSuaChuaVatTuTieuHao> list) {
        return ResponseEntity.ok(vatTuTieuHaoService.batchUpdate(list));
    }

    @DeleteMapping("/batch-delete")
    public ResponseEntity<Integer> batchDelete(@RequestBody List<String> ids) {
        return ResponseEntity.ok(vatTuTieuHaoService.batchDelete(ids));
    }
}