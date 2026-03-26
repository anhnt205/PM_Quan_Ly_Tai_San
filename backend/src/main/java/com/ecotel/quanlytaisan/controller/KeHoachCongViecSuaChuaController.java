package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChuaDTO;
import com.ecotel.quanlytaisan.model.KeHoachSuaChua;
import com.ecotel.quanlytaisan.service.KeHoachCongViecSuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
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
    public ResponseEntity<List<KeHoachCongViecSuaChuaDTO>> findByIdKeHoach(@PathVariable("idKeHoach") String idKeHoach) {
        List<KeHoachCongViecSuaChuaDTO> list = keHoachCongViecSuaChuaService.findByIdKeHoach(idKeHoach);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy công việc theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<KeHoachCongViecSuaChuaDTO> findById(@PathVariable("id") String id) {
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

    // Bulk Create
    @PostMapping("/bulk-create")
    public ResponseEntity<?> bulkCreate(@RequestBody List<KeHoachCongViecSuaChua> list) throws SQLException {
        keHoachCongViecSuaChuaService.bulkCreate(list);
        return ResponseEntity.ok().build();
    }

    /**
     * Cập nhật công việc
     */
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable("id") String id, @RequestBody KeHoachCongViecSuaChua entity) {
        entity.setId(id);
        int result = keHoachCongViecSuaChuaService.update(entity);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    // Bulk Update
    @PutMapping("/bulk-update")
    public ResponseEntity<?> bulkUpdate(@RequestBody List<KeHoachCongViecSuaChua> list) throws SQLException {
        keHoachCongViecSuaChuaService.bulkUpdate(list);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa công việc
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        int result = keHoachCongViecSuaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // Bulk Delete
    @DeleteMapping("/bulk-delete")
    public ResponseEntity<?> bulkDelete(@RequestBody List<String> ids) throws SQLException {
        keHoachCongViecSuaChuaService.bulkDelete(ids);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa tất cả công việc theo kế hoạch
     */
    @DeleteMapping("/kehoach/{idKeHoach}")
    public ResponseEntity<Void> deleteByIdKeHoach(@PathVariable("idKeHoach") String idKeHoach) {
        keHoachCongViecSuaChuaService.deleteByIdKeHoach(idKeHoach);
        return ResponseEntity.noContent().build();
    }
}