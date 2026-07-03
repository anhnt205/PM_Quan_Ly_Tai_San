package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.LyLichService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ly-lich")
@RequiredArgsConstructor
public class LyLichController {
    private final LyLichService lyLichService;

    @PostMapping
    public ResponseEntity<ApiResponse<LyLichResponse>> create(@RequestBody LyLichRequest request) {
        LyLichResponse response = lyLichService.create(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo ly lich thành công", response, null));
    }

    @PostMapping("/create-batch")
    public ResponseEntity<ApiResponse<List<LyLichResponse>>> createBatch(@RequestBody List<LyLichRequest> requests) {
        List<LyLichResponse> responses = lyLichService.createBatch(requests);
        return ResponseEntity.ok(ApiResponse.success("Tạo list ly lich thành công", responses, null));
    }

    @GetMapping
    public PageResponse<LyLichResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return lyLichService.getAll(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LyLichResponse>> getById(@PathVariable String id) {
        LyLichResponse response = lyLichService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Get ly lich thành công", response, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LyLichResponse>> update(@PathVariable String id, @RequestBody LyLichRequest request) {
        LyLichResponse response = lyLichService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Update ly lich thành công", response, null));
    }

    @PutMapping("/update-batch")
    public ResponseEntity<ApiResponse<List<LyLichResponse>>> updateList(@RequestBody List<LyLichRequest> requests) throws BadRequestException {
        List<LyLichResponse> responses = lyLichService.updateBatch(requests);
        return ResponseEntity.ok(ApiResponse.success("Update list ly lich thành công", responses, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        lyLichService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa ly lich thành công", null, null));
    }

    @DeleteMapping("/delete-batch")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<String> ids) throws BadRequestException {
        lyLichService.deleteBatch(ids);
        return ResponseEntity.ok(ApiResponse.success("Xóa tất cả ly lich thành công", null, null));
    }
}
