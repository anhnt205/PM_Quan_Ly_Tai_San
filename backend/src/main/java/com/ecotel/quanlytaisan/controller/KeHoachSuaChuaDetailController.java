package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.KeHoachSuaChuaDetailResponse;
import com.ecotel.quanlytaisan.service.KeHoachSuaChuaDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoach-suachua/detail")
public class KeHoachSuaChuaDetailController {

    @Autowired
    private KeHoachSuaChuaDetailService keHoachSuaChuaDetailService;

    /**
     * Lấy chi tiết đầy đủ của một kế hoạch (kèm công việc và danh sách tài sản/CCDC)
     */
    @GetMapping("/{id}")
    public ResponseEntity<KeHoachSuaChuaDetailResponse> getDetailById(@PathVariable String id) {
        KeHoachSuaChuaDetailResponse response = keHoachSuaChuaDetailService.getDetailById(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả chi tiết theo công ty
     */
    @GetMapping("/congty/{idCongTy}")
    public ResponseEntity<List<KeHoachSuaChuaDetailResponse>> getDetailByCongTy(@PathVariable String idCongTy) {
        List<KeHoachSuaChuaDetailResponse> list = keHoachSuaChuaDetailService.getDetailByCongTy(idCongTy);
        return ResponseEntity.ok(list);
    }
}