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

    @PostMapping("/sync-vat-tu/{dbConfigId}")
    public ResponseEntity<?> syncDatabaseVatTu(@PathVariable String dbConfigId) {
        try {
            migrationService.processVatTuMigration(dbConfigId);
            return ResponseEntity.ok("Đồng bộ dữ liệu CSDL thành công! Hệ thống đã cập nhật danh mục vật tư.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đồng bộ: " + e.getMessage());
        }
    }

    @PostMapping("/sync-tai-san/{dbConfigId}")
    public ResponseEntity<?> syncDatabaseTaiSan(@PathVariable String dbConfigId) {
        try {
            migrationService.processTaiSanMigration(dbConfigId);
            return ResponseEntity.ok("Đồng bộ dữ liệu TÀI SẢN thành công! Hệ thống đã cập nhật các danh mục tài sản.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đồng bộ tài sản: " + e.getMessage());
        }
    }
}