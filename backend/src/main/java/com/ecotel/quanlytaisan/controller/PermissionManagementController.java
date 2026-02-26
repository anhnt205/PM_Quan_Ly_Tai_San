package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.UserPermission;
import com.ecotel.quanlytaisan.service.UserPermissionService;
import com.ecotel.quanlytaisan.service.UserRoleService;
import com.ecotel.quanlytaisan.service.RolePermissionService;
import com.ecotel.quanlytaisan.model.RolePermission;
import com.ecotel.quanlytaisan.model.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/permission-management")
public class PermissionManagementController {

    @Autowired
    private UserPermissionService userPermissionService;

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private RolePermissionService rolePermissionService;

    // Gán vai trò cho người dùng
    @PostMapping("/assign-role")
    public ResponseEntity<ApiResponse<Object>> assignRoleToUser(@RequestParam String userId, @RequestParam String roleId) {
        try {
            // Kiểm tra xem user đã có role này chưa
            UserRole existingUserRole = userRoleService.getByUserAndRole(userId, roleId);
            if (existingUserRole != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Người dùng đã có vai trò này", 0));
            }

            UserRole userRole = new UserRole();
            userRole.setId(UUID.randomUUID().toString());
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRole.setIsActive(true);
            userRole.setCreatedDate(LocalDateTime.now());

            int result = userRoleService.create(userRole);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Gán vai trò cho người dùng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Gán vai trò cho người dùng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Gỡ vai trò khỏi người dùng
    @DeleteMapping("/remove-role")
    public ResponseEntity<ApiResponse<Object>> removeRoleFromUser(@RequestParam String userId, @RequestParam String roleId) {
        try {
            UserRole userRole = userRoleService.getByUserAndRole(userId, roleId);
            if (userRole == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy vai trò của người dùng", 0));
            }

            int result = userRoleService.delete(userRole.getId());
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Gỡ vai trò khỏi người dùng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Gỡ vai trò khỏi người dùng thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Cấp quyền cho vai trò
    @PostMapping("/assign-permission-to-role")
    public ResponseEntity<ApiResponse<Object>> assignPermissionToRole(@RequestParam String roleId, 
                                                                     @RequestParam String permissionId,
                                                                     @RequestParam(defaultValue = "false") boolean canCreate,
                                                                     @RequestParam(defaultValue = "false") boolean canRead,
                                                                     @RequestParam(defaultValue = "false") boolean canUpdate,
                                                                     @RequestParam(defaultValue = "false") boolean canDelete) {
        try {
            // Kiểm tra xem role đã có permission này chưa
            RolePermission existingRolePermission = rolePermissionService.getByRoleAndPermission(roleId, permissionId);
            if (existingRolePermission != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Vai trò đã có quyền này", 0));
            }

            RolePermission rolePermission = new RolePermission();
            rolePermission.setId(UUID.randomUUID().toString());
            rolePermission.setRoleId(roleId);
            rolePermission.setPermissionId(permissionId);
            rolePermission.setCanCreate(canCreate);
            rolePermission.setCanRead(canRead);
            rolePermission.setCanUpdate(canUpdate);
            rolePermission.setCanDelete(canDelete);

            int result = rolePermissionService.create(rolePermission);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Cấp quyền cho vai trò thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cấp quyền cho vai trò thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Cập nhật quyền của vai trò
    @PutMapping("/update-role-permission")
    public ResponseEntity<ApiResponse<Object>> updateRolePermission(@RequestParam String roleId, 
                                                                   @RequestParam String permissionId,
                                                                   @RequestParam(defaultValue = "false") boolean canCreate,
                                                                   @RequestParam(defaultValue = "false") boolean canRead,
                                                                   @RequestParam(defaultValue = "false") boolean canUpdate,
                                                                   @RequestParam(defaultValue = "false") boolean canDelete) {
        try {
            RolePermission rolePermission = rolePermissionService.getByRoleAndPermission(roleId, permissionId);
            if (rolePermission == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy quyền của vai trò", 0));
            }

            rolePermission.setCanCreate(canCreate);
            rolePermission.setCanRead(canRead);
            rolePermission.setCanUpdate(canUpdate);
            rolePermission.setCanDelete(canDelete);

            int result = rolePermissionService.update(rolePermission);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật quyền của vai trò thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật quyền của vai trò thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Lấy tất cả quyền của người dùng
    @GetMapping("/user/{userId}/permissions")
    public List<UserPermission> getUserPermissions(@PathVariable String userId) {
        return userPermissionService.getUserPermissions(userId);
    }

    // Lấy tất cả vai trò của người dùng
    @GetMapping("/user/{userId}/roles")
    public List<UserRole> getUserRoles(@PathVariable String userId) {
        return userRoleService.getByUserId(userId);
    }

    // Lấy tất cả quyền của vai trò
    @GetMapping("/role/{roleId}/permissions")
    public List<RolePermission> getRolePermissions(@PathVariable String roleId) {
        return rolePermissionService.getByRoleId(roleId);
    }

    // Kiểm tra quyền tổng thể của người dùng
    @GetMapping("/user/{userId}/check-permission")
    public ResponseEntity<ApiResponse<Object>> checkUserPermission(@PathVariable String userId, 
                                                                  @RequestParam String permissionCode, 
                                                                  @RequestParam String action) {
        try {
            boolean hasPermission = userPermissionService.hasPermission(userId, permissionCode, action);
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("permissionCode", permissionCode);
            result.put("action", action);
            result.put("hasPermission", hasPermission);
            
            return ResponseEntity.ok(ApiResponse.success("Kiểm tra quyền thành công", result, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
