package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.mapper.LyLichTemplateMapper;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.LyLichTemplateResponse;
import com.ecotel.quanlytaisan.repository.LyLichTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ly-lich-template")
@RequiredArgsConstructor
public class LyLichTemplateController {
    private final LyLichTemplateRepository lyLichTemplateRepository;
    private final LyLichTemplateMapper lyLichTemplateMapper;
    // GET ALL
    @GetMapping
    public ResponseEntity<ApiResponse<List<LyLichTemplateResponse>>> getAll() {
        List<LyLichTemplateResponse> responses = lyLichTemplateRepository.findAll()
                .stream()
                .map(lyLichTemplateMapper::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Get list ly lich template thành công", responses, null));
    }
}
