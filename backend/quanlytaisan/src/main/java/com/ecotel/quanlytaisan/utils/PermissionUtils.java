package com.ecotel.quanlytaisan.utils;

import com.ecotel.quanlytaisan.service.UserPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class PermissionUtils {

    @Autowired
    private UserPermissionService userPermissionService;

    public boolean hasPermission(HttpServletRequest request, String permissionCode, String action) {
        String userId = getUserIdFromRequest(request);
        if (userId == null) {
            return false;
        }
        return userPermissionService.hasPermission(userId, permissionCode, action);
    }

    public boolean canCreate(HttpServletRequest request, String permissionCode) {
        return hasPermission(request, permissionCode, "CanCreate");
    }

    public boolean canRead(HttpServletRequest request, String permissionCode) {
        return hasPermission(request, permissionCode, "CanRead");
    }

    public boolean canUpdate(HttpServletRequest request, String permissionCode) {
        return hasPermission(request, permissionCode, "CanUpdate");
    }

    public boolean canDelete(HttpServletRequest request, String permissionCode) {
        return hasPermission(request, permissionCode, "CanDelete");
    }

    private String getUserIdFromRequest(HttpServletRequest request) {
        // Lấy userId từ header
        String userId = request.getHeader("X-User-Id");
        if (userId != null) {
            return userId;
        }
        
        // Lấy userId từ session
        Object sessionUserId = request.getSession().getAttribute("userId");
        if (sessionUserId != null) {
            return sessionUserId.toString();
        }
        
        // Lấy userId từ parameter (cho testing)
        userId = request.getParameter("userId");
        if (userId != null) {
            return userId;
        }
        
        return null;
    }
}
