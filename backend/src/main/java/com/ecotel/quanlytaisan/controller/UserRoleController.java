package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.UserRole;
import com.ecotel.quanlytaisan.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userrole")
public class UserRoleController {
    @Autowired
    private UserRoleService userRoleService;

    @GetMapping("/user/{userId}/paged")
    public PageResponse<UserRole> getRolesByUserPaged(
            @PathVariable("userId") String userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search){

        return userRoleService.getPagedResponseByUserId(userId, page, size, sortBy, sortDir, search);
    }
    @GetMapping
    public List<UserRole> getAll() {
        return userRoleService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<UserRole> getByUserId(@PathVariable("userId") String userId) {
        return userRoleService.getByUserId(userId);
    }

    @GetMapping("/role/{roleId}")
    public List<UserRole> getByRoleId(@PathVariable("roleId") String roleId) {
        return userRoleService.getByRoleId(roleId);
    }

    @GetMapping("/user/{userId}/role/{roleId}")
    public UserRole getByUserAndRole(@PathVariable("userId") String userId, @PathVariable("roleId") String roleId) {
        return userRoleService.getByUserAndRole(userId, roleId);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody UserRole userRole) {
        try {
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody UserRole userRole) {
        try {
            userRole.setId(id);
            int result = userRoleService.update(userRole);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật vai trò người dùng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy vai trò người dùng để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = userRoleService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa vai trò người dùng thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy vai trò người dùng để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Object>> deleteByUserId(@PathVariable("userId") String userId) {
        try {
            int result = userRoleService.deleteByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả vai trò của người dùng thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/role/{roleId}")
    public ResponseEntity<ApiResponse<Object>> deleteByRoleId(@PathVariable("roleId") String roleId) {
        try {
            int result = userRoleService.deleteByRoleId(roleId);
            return ResponseEntity.ok(ApiResponse.success("Xóa tất cả người dùng khỏi vai trò thành công", null, result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
