package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTuDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTu;
import com.ecotel.quanlytaisan.service.KetQuaSuaChuaChiTietVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ketqua-suachua/chitiet-vattu")
public class KetQuaSuaChuaChiTietVatTuController {

    @Autowired
    private KetQuaSuaChuaChiTietVatTuService vatTuService;

    @GetMapping("/by-ketqua/{idKetQuaSuaChua}")
    public ResponseEntity<List<KetQuaSuaChuaChiTietVatTuDTO>> getByKetQuaSuaChua(@PathVariable("idKetQuaSuaChua") String idKetQuaSuaChua) {
        List<KetQuaSuaChuaChiTietVatTuDTO> list = vatTuService.findByIdKetQuaSuaChua(idKetQuaSuaChua);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaChiTietVatTu> findById(@PathVariable("id") String id) {
        KetQuaSuaChuaChiTietVatTu entity = vatTuService.findById(id);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(entity);
    }

    @PostMapping
    public ResponseEntity<KetQuaSuaChuaChiTietVatTu> insert(@RequestBody KetQuaSuaChuaChiTietVatTu entity,
                                                            @RequestParam("userId") String userId) {
        KetQuaSuaChuaChiTietVatTu created = vatTuService.insert(entity, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KetQuaSuaChuaChiTietVatTu> update(@PathVariable("id") String id,
                                                            @RequestBody KetQuaSuaChuaChiTietVatTu entity,
                                                            @RequestParam("userId") String userId) {
        entity.setId(id);
        KetQuaSuaChuaChiTietVatTu updated = vatTuService.update(entity, userId);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        int result = vatTuService.delete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/soft/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable("id") String id) {
        int result = vatTuService.softDelete(id);
        if (result == 0) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<KetQuaSuaChuaChiTietVatTu>> insertBulk(@RequestBody List<KetQuaSuaChuaChiTietVatTu> entities,
                                                                      @RequestParam("userId") String userId) {
        List<KetQuaSuaChuaChiTietVatTu> created = vatTuService.insertBulk(entities, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<KetQuaSuaChuaChiTietVatTu>> updateBulk(@RequestBody List<KetQuaSuaChuaChiTietVatTu> entities,
                                                                      @RequestParam("userId") String userId) {
        List<KetQuaSuaChuaChiTietVatTu> updated = vatTuService.updateBulk(entities, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Integer> deleteBulk(@RequestBody List<String> ids) {
        int count = vatTuService.deleteBulk(ids);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/replace/{idKetQuaSuaChua}")
    public ResponseEntity<List<KetQuaSuaChuaChiTietVatTu>> replaceByKetQuaSuaChua(
            @PathVariable("idKetQuaSuaChua") String idKetQuaSuaChua,
            @RequestBody List<KetQuaSuaChuaChiTietVatTu> newEntities,
            @RequestParam("userId") String userId) {
        List<KetQuaSuaChuaChiTietVatTu> result = vatTuService.replaceByKetQuaSuaChua(idKetQuaSuaChua, newEntities, userId);
        return ResponseEntity.ok(result);
    }
}