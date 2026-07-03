package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.service.S3Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/put")
    public ResponseEntity<?> getPresignedPutUrl(@RequestParam("fileName") String fileName, @RequestParam("type") String type) {
        try {
            String url = s3Service.generatePresignedPutUrl(fileName, type);
            return ResponseEntity.ok(Map.of("status", "success", "data", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getPresignedGetUrl(@RequestParam("key") String key) {
        try {
            String url = s3Service.generatePresignedGetUrl(key);
            return ResponseEntity.ok(Map.of("status", "success", "data", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error generating URL"));
        }
    }

     @GetMapping("/update")
    public ResponseEntity<?> getPresignedUpdateUrl(@RequestParam("key") String key) {
        try {
            String url = s3Service.generatePresignedUpdateUrl(key);
            return ResponseEntity.ok(Map.of("status", "success", "data", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadFileDirect(@RequestParam("key") String key) {
        try {
            byte[] data = s3Service.downloadFile(key);
            String fileName = key.substring(key.lastIndexOf("/") + 1);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error downloading file: " + e.getMessage()));
        }
    }

    @GetMapping("/preview")
    public ResponseEntity<?> previewFile(@RequestParam("key") String key) {
        try {
            byte[] data = s3Service.downloadFile(key);
            String fileName = key.substring(key.lastIndexOf("/") + 1);
            String contentType = s3Service.getContentType(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error previewing file: " + e.getMessage()));
        }
    }
}