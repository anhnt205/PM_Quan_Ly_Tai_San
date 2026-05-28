package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LyLichNhomTaiSanRequest;
import com.ecotel.quanlytaisan.model.LyLichNhomTaiSanResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.LyLichNhomTaiSanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ly-lich-nhom-tai-san")
@RequiredArgsConstructor
public class LyLichNhomTaiSanController {
    private final LyLichNhomTaiSanService lyLichNhomTaiSanService;

    @GetMapping
    public PageResponse<LyLichNhomTaiSanResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return lyLichNhomTaiSanService.getAll(page, size);
    }

    @PutMapping("/update-list")
    public ResponseEntity<ApiResponse<Void>> updateList(@RequestBody List<LyLichNhomTaiSanRequest> requests) {
        lyLichNhomTaiSanService.updateList(requests);
        return ResponseEntity.ok(ApiResponse.success("Update list ly lich nhom tai san thành công", null, null));
    }
}
