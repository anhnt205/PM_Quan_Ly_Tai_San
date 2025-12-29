package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.RolePermission;
import com.ecotel.quanlytaisan.service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rolepermission")
public class RolePermissionController {
    @Autowired
    private RolePermissionService rolePermissionService;

    @GetMapping
    public List<RolePermission> getAll() {
        return rolePermissionService.getAll();
    }

    @GetMapping("/role/{roleId}")
    public List<RolePermission> getByRoleId(@PathVariable String roleId) {
        return rolePermissionService.getByRoleId(roleId);
    }

    @GetMapping("/permission/{permissionId}")
    public List<RolePermission> getByPermissionId(@PathVariable String permissionId) {
        return rolePermissionService.getByPermissionId(permissionId);
    }

    @GetMapping("/role/{roleId}/permission/{permissionId}")
    public RolePermission getByRoleAndPermission(@PathVariable String roleId, @PathVariable String permissionId) {
        return rolePermissionService.getByRoleAndPermission(roleId, permissionId);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody RolePermission rolePermission) {
        try {
            int result = rolePermissionService.create(rolePermission);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo phân quyền vai trò thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo phân quyền vai trò thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody RolePermission rolePermission) {
        try {
            rolePermission.setId(id);
            int result = rolePermissionService.update(rolePermission);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật phân quyền vai trò thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phân quyền vai trò để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = rolePermissionService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa phân quyền vai trò thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy phân quyền vai trò để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/role/{roleId}")
    public ResponseEntity<ApiResponse<Object>> deleteByRoleId(@PathVariable String roleId) {
        try {
            int result = rolePermissionService.deleteByRoleId(roleId);
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả phân quyền của vai trò thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/permission/{permissionId}")
    public ResponseEntity<ApiResponse<Object>> deleteByPermissionId(@PathVariable String permissionId) {
        try {
            int result = rolePermissionService.deleteByPermissionId(permissionId);
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả phân quyền của quyền thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<RolePermission> rolePermissions) {
        try {
            int result = rolePermissionService.createBatch(rolePermissions);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo batch phân quyền vai trò thành công", rolePermissions, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo batch phân quyền vai trò thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<RolePermission> rolePermissions) {
        try {
            int result = rolePermissionService.updateBatch(rolePermissions);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật batch phân quyền vai trò thành công", rolePermissions, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật batch phân quyền vai trò thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
