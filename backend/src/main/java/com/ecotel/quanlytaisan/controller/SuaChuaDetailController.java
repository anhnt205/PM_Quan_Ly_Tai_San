package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.SuaChuaDetailResponse;
import com.ecotel.quanlytaisan.service.SuaChuaDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suachua/detail")
public class SuaChuaDetailController {

    @Autowired
    private SuaChuaDetailService suaChuaDetailService;

    /**
     * Lấy chi tiết đầy đủ của một phiếu sửa chữa (bao gồm master, detail, kết quả, chữ ký)
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuaChuaDetailResponse> getDetailById(@PathVariable String id) {
        SuaChuaDetailResponse response = suaChuaDetailService.getDetailById(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả chi tiết theo công ty
     */
    @GetMapping("/congty/{idCongTy}")
    public ResponseEntity<List<SuaChuaDetailResponse>> getDetailByCongTy(@PathVariable String idCongTy) {
        List<SuaChuaDetailResponse> list = suaChuaDetailService.getDetailByCongTy(idCongTy);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy tất cả chi tiết theo userId (các phiếu user có quyền xem)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SuaChuaDetailResponse>> getDetailByUserId(@PathVariable String userId) {
        List<SuaChuaDetailResponse> list = suaChuaDetailService.getDetailByUserId(userId);
        return ResponseEntity.ok(list);
    }
}