package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChuaDTO;
import com.ecotel.quanlytaisan.service.KeHoachChiTietSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoach-chitiet")
public class KeHoachChiTietSuaChuaController {

    @Autowired
    private KeHoachChiTietSuaChuaService keHoachChiTietSuaChuaService;

    /**
     * Lấy danh sách chi tiết theo kế hoạch
     */
    @GetMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<List<KeHoachChiTietSuaChuaDTO>> findByIdKeHoach(@PathVariable String idKeHoach) {
        List<KeHoachChiTietSuaChuaDTO> list = keHoachChiTietSuaChuaService.findByIdKeHoach(idKeHoach);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy chi tiết theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<KeHoachChiTietSuaChuaDTO> findById(@PathVariable String id) {
        KeHoachChiTietSuaChuaDTO dto = keHoachChiTietSuaChuaService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Thêm mới chi tiết
     */
    @PostMapping
    public ResponseEntity<Integer> insert(@RequestBody KeHoachChiTietSuaChua entity) {
        int result = keHoachChiTietSuaChuaService.insert(entity);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Cập nhật chi tiết
     */
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable String id, @RequestBody KeHoachChiTietSuaChua entity) {
        entity.setId(id);
        int result = keHoachChiTietSuaChuaService.update(entity);
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
        int result = keHoachChiTietSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa tất cả chi tiết theo kế hoạch
     */
    @DeleteMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<Void> deleteByIdKeHoach(@PathVariable String idKeHoach) {
        keHoachChiTietSuaChuaService.deleteByIdKeHoach(idKeHoach);
        return ResponseEntity.noContent().build();
    }
}