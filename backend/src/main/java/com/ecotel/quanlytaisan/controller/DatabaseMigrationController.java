package com.ecotel.quanlytaisan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ecotel.quanlytaisan.service.DatabaseMigrationService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/migration")
@CrossOrigin("*") // Cho phép Frontend gọi API
public class DatabaseMigrationController {

    // Lấy đường dẫn thư mục C:/SQLBackups từ file cấu hình
    @Value("${backup.upload.dir:C:/SQLBackups}")
    private String uploadDir;

    @Autowired
    private DatabaseMigrationService migrationService;

    @PostMapping("/upload-bak")
    public ResponseEntity<?> uploadBackupFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: File tải lên bị trống!");
        }

        try {
            // 1. Kiểm tra và tạo thư mục C:/SQLBackups nếu chưa có
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 2. Tạo tên file duy nhất để tránh bị trùng lặp
            String originalFileName = file.getOriginalFilename();
            String newFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            
            // 3. Tạo đường dẫn tuyệt đối để lưu file
            Path filePath = Paths.get(uploadDir, newFileName);
            
            // 4. Lưu file vật lý xuống ổ cứng
            file.transferTo(filePath.toFile());

            // (Phần 3: Code gọi lệnh RESTORE SQL Server sẽ được viết thêm vào đây sau)
            migrationService.processMigration(filePath.toString());

            return ResponseEntity.ok("Upload thành công! Đường dẫn file: " + filePath.toString());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lưu file: " + e.getMessage());
        }
    }
}