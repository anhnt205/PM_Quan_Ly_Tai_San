package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.UserPermission;
import com.ecotel.quanlytaisan.service.UserPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/userpermission")
public class UserPermissionController {
    @Autowired
    private UserPermissionService userPermissionService;

    @GetMapping("/user/{userId}")
    public List<UserPermission> getUserPermissions(@PathVariable String userId) {
        return userPermissionService.getUserPermissions(userId);
    }

    @GetMapping("/user/{userId}/permission/{permissionCode}")
    public List<UserPermission> getUserPermissionsByCode(@PathVariable String userId, @PathVariable String permissionCode) {
        return userPermissionService.getUserPermissionsByCode(userId, permissionCode);
    }

    @GetMapping("/user/{userId}/check/{permissionCode}/{action}")
    public ResponseEntity<ApiResponse<Object>> checkPermission(@PathVariable String userId, 
                                                             @PathVariable String permissionCode, 
                                                             @PathVariable String action) {
        try {
            boolean hasPermission = userPermissionService.hasPermission(userId, permissionCode, action);
            Map<String, Object> result = new HashMap<>();
            result.put("hasPermission", hasPermission);
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            result.put("action", action);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/cancreate/{permissionCode}")
    public ResponseEntity<ApiResponse<Object>> canCreate(@PathVariable String userId, @PathVariable String permissionCode) {
        try {
            boolean canCreate = userPermissionService.canCreate(userId, permissionCode);
            Map<String, Object> result = new HashMap<>();
            result.put("canCreate", canCreate);
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền tạo thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/canread/{permissionCode}")
    public ResponseEntity<ApiResponse<Object>> canRead(@PathVariable String userId, @PathVariable String permissionCode) {
        try {
            boolean canRead = userPermissionService.canRead(userId, permissionCode);
            Map<String, Object> result = new HashMap<>();
            result.put("canRead", canRead);
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền đọc thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/canupdate/{permissionCode}")
    public ResponseEntity<ApiResponse<Object>> canUpdate(@PathVariable String userId, @PathVariable String permissionCode) {
        try {
            boolean canUpdate = userPermissionService.canUpdate(userId, permissionCode);
            Map<String, Object> result = new HashMap<>();
            result.put("canUpdate", canUpdate);
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền cập nhật thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/candelete/{permissionCode}")
    public ResponseEntity<ApiResponse<Object>> canDelete(@PathVariable String userId, @PathVariable String permissionCode) {
        try {
            boolean canDelete = userPermissionService.canDelete(userId, permissionCode);
            Map<String, Object> result = new HashMap<>();
            result.put("canDelete", canDelete);
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền xóa thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Set quyền cụ thể cho user
    @PostMapping("/set-permission")
    public ResponseEntity<ApiResponse<Object>> setUserPermission(@RequestBody UserPermission userPermission) {
        try {
            int result = userPermissionService.setUserPermission(userPermission);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Set quyền cho người dùng thành công", userPermission, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Set quyền cho người dùng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Cập nhật quyền cụ thể cho user
    @PutMapping("/update-permission")
    public ResponseEntity<ApiResponse<Object>> updateUserPermission(@RequestBody UserPermission userPermission) {
        try {
            int result = userPermissionService.updateUserPermission(userPermission);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật quyền cho người dùng thành công", userPermission, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy quyền để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Xóa quyền cụ thể của user
    @DeleteMapping("/remove-permission")
    public ResponseEntity<ApiResponse<Object>> removeUserPermission(@RequestParam String userId, @RequestParam String permissionCode) {
        try {
            int result = userPermissionService.removeUserPermission(userId, permissionCode);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa quyền của người dùng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy quyền để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Set nhiều quyền cho user cùng lúc (Batch)
    @PostMapping("/set-permission-batch")
    public ResponseEntity<ApiResponse<Object>> setUserPermissionsBatch(@RequestBody List<UserPermission> userPermissions) {
        try {
            int result = userPermissionService.setUserPermissionsBatch(userPermissions);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Set batch quyền cho người dùng thành công", userPermissions, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Set batch quyền cho người dùng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Cập nhật nhiều quyền cho user cùng lúc (Batch)
    @PutMapping("/update-permission-batch")
    public ResponseEntity<ApiResponse<Object>> updateUserPermissionsBatch(@RequestBody List<UserPermission> userPermissions) {
        try {
            int result = userPermissionService.updateUserPermissionsBatch(userPermissions);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật batch quyền cho người dùng thành công", userPermissions, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật batch quyền cho người dùng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
