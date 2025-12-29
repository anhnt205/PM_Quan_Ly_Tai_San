package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.Version;
import com.ecotel.quanlytaisan.service.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/version")
public class VersionController {
    @Autowired
    private VersionService versionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Version>>> getAll() {
        try {
            List<Version> versions = versionService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách version thành công", versions, versions.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Version>>> getAllActive() {
        try {
            List<Version> versions = versionService.getAllActive();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách version đang hoạt động thành công", versions, versions.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<Version>> getLatestVersion() {
        try {
            Version version = versionService.getLatestVersion();
            if (version != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy version mới nhất thành công", version, 1));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version nào", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Version>> getById(@PathVariable String id) {
        try {
            Version version = versionService.getById(id);
            if (version != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin version thành công", version, 1));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version với ID: " + id, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/code/{versionCode}")
    public ResponseEntity<ApiResponse<Version>> getByVersionCode(@PathVariable String versionCode) {
        try {
            Version version = versionService.getByVersionCode(versionCode);
            if (version != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin version thành công", version, 1));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version với code: " + versionCode, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody Version version) {
        try {
            // Validate version code format
            if (!versionService.isValidVersionCode(version.getVersionCode())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Version code không hợp lệ. Định dạng phải là: major.minor.patch (ví dụ: 1.0.0)", null));
            }

            // Generate ID if not provided
            if (version.getId() == null || version.getId().trim().isEmpty()) {
                version.setId(versionService.generateVersionId(version.getVersionCode()));
            }

            int result = versionService.create(version);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo version thành công", version, result));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Tạo version thất bại", result));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody Version version) {
        try {
            // Validate version code format if provided
            if (version.getVersionCode() != null && !versionService.isValidVersionCode(version.getVersionCode())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Version code không hợp lệ. Định dạng phải là: major.minor.patch (ví dụ: 1.0.0)", null));
            }

            version.setId(id);
            int result = versionService.update(version);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật version thành công", version, result));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version để cập nhật", result));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = versionService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa version thành công", null, result));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version để xóa", result));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Object>> deactivate(@PathVariable String id) {
        try {
            int result = versionService.deactivate(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa version thành công", null, result));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version để vô hiệu hóa", result));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Object>> activate(@PathVariable String id) {
        try {
            int result = versionService.activate(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Kích hoạt version thành công", null, result));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy version để kích hoạt", result));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getStats() {
        try {
            long totalCount = versionService.getTotalCount();
            long activeCount = versionService.getActiveCount();
            
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalVersions", totalCount);
            stats.put("activeVersions", activeCount);
            stats.put("inactiveVersions", totalCount - activeCount);
            
            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê version thành công", stats, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
