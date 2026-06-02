package com.ecotel.quanlytaisan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecotel.quanlytaisan.service.DatabaseMigrationService;

@RestController
@RequestMapping("/api/migration")
public class DatabaseMigrationController {

    @Autowired
    private DatabaseMigrationService migrationService;

    @PostMapping("/sync/{dbConfigId}")
    public ResponseEntity<?> syncDatabase(@PathVariable String dbConfigId) {
        try {
            migrationService.processMigration(dbConfigId);
            return ResponseEntity.ok("Đồng bộ dữ liệu CSDL thành công! Hệ thống đã cập nhật danh mục vật tư.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đồng bộ: " + e.getMessage());
        }
    }
}