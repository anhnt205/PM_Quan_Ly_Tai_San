package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChuaDTO;
import com.ecotel.quanlytaisan.service.KeHoachCongViecSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoach-congviec")
public class KeHoachCongViecSuaChuaController {

    @Autowired
    private KeHoachCongViecSuaChuaService keHoachCongViecSuaChuaService;

    /**
     * Lấy danh sách công việc theo kế hoạch
     */
    @GetMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<List<KeHoachCongViecSuaChuaDTO>> findByIdKeHoach(@PathVariable String idKeHoach) {
        List<KeHoachCongViecSuaChuaDTO> list = keHoachCongViecSuaChuaService.findByIdKeHoach(idKeHoach);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy công việc theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<KeHoachCongViecSuaChuaDTO> findById(@PathVariable String id) {
        KeHoachCongViecSuaChuaDTO dto = keHoachCongViecSuaChuaService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Thêm mới công việc
     */
    @PostMapping
    public ResponseEntity<Integer> insert(@RequestBody KeHoachCongViecSuaChua entity) {
        int result = keHoachCongViecSuaChuaService.insert(entity);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Cập nhật công việc
     */
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable String id, @RequestBody KeHoachCongViecSuaChua entity) {
        entity.setId(id);
        int result = keHoachCongViecSuaChuaService.update(entity);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Xóa công việc
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        int result = keHoachCongViecSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa tất cả công việc theo kế hoạch
     */
    @DeleteMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<Void> deleteByIdKeHoach(@PathVariable String idKeHoach) {
        keHoachCongViecSuaChuaService.deleteByIdKeHoach(idKeHoach);
        return ResponseEntity.noContent().build();
    }
}