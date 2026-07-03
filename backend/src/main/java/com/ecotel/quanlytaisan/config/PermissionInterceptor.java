package com.ecotel.quanlytaisan.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Component
public class PermissionInterceptor implements HandlerInterceptor {

    // Mapping từ URL pattern đến permission code
    private static final Map<String, String> URL_PERMISSION_MAPPING = new HashMap<>();

    static {
        // Tài sản
        URL_PERMISSION_MAPPING.put("/api/taisan", "TAISAN");
        URL_PERMISSION_MAPPING.put("/api/loaitaisan", "LOAITAISAN");
        URL_PERMISSION_MAPPING.put("/api/loaitaisancon", "LOAITAISAN");

        // CCDC Vật tư
        URL_PERMISSION_MAPPING.put("/api/ccdcvattu", "CCDCVT");
        URL_PERMISSION_MAPPING.put("/api/loaiccdc", "LOAICCDC");
        URL_PERMISSION_MAPPING.put("/api/loaiccdccon", "LOAICCDC");

        // Bàn giao
        URL_PERMISSION_MAPPING.put("/api/bangiaotaisan", "BANGIAO_TAISAN");
        URL_PERMISSION_MAPPING.put("/api/bangiaoccdcvattu", "BANGIAO_CCDC");

        // Điều động
        URL_PERMISSION_MAPPING.put("/api/dieudongtaisan", "DIEUDONG_TAISAN");
        URL_PERMISSION_MAPPING.put("/api/dieudongccdcvattu", "DIEUDONG_CCDC");

        // Quản lý
        URL_PERMISSION_MAPPING.put("/api/nhanvien", "NHANVIEN");
        URL_PERMISSION_MAPPING.put("/api/phongban", "PHONGBAN");
        URL_PERMISSION_MAPPING.put("/api/congty", "CONGTY");
        URL_PERMISSION_MAPPING.put("/api/duan", "DUAN");
        URL_PERMISSION_MAPPING.put("/api/khauhao", "KHAUHAO");
        URL_PERMISSION_MAPPING.put("/api/baocao", "BAOCAO");
        URL_PERMISSION_MAPPING.put("/api/config", "CONFIG");
        URL_PERMISSION_MAPPING.put("/api/taikhoan", "TAIKHOAN");

        // Phân quyền
        URL_PERMISSION_MAPPING.put("/api/permission", "PERMISSION");
        URL_PERMISSION_MAPPING.put("/api/role", "PERMISSION");
        URL_PERMISSION_MAPPING.put("/api/rolepermission", "PERMISSION");
        URL_PERMISSION_MAPPING.put("/api/userrole", "PERMISSION");
        URL_PERMISSION_MAPPING.put("/api/userpermission", "PERMISSION");

        // Upload s3
        URL_PERMISSION_MAPPING.put("/api/s3/put", "S3");
        URL_PERMISSION_MAPPING.put("/api/s3/get", "S3");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        // Lấy userId từ header hoặc session (cần implement authentication)
        String userId = request.getHeader("X-User-Id");
        if (userId == null) {
            userId = (String) request.getSession().getAttribute("userId");
        }

        // Nếu không có userId, cho phép truy cập (cần implement authentication)
        if (userId == null) {
            return true;
        }

        // Tìm permission code từ URL
        String permissionCode = findPermissionCode(requestURI);
        if (permissionCode == null) {
            return true; // Không có quyền được định nghĩa cho URL này
        }

        // Xác định action dựa trên HTTP method
        // String action = getActionFromMethod(method);

        // Kiểm tra quyền
//        boolean hasPermission = userPermissionService.hasPermission(userId, permissionCode, action);
//
//        if (!hasPermission) {
//            response.setStatus(HttpStatus.FORBIDDEN.value());
//            response.setContentType("application/json");
//            response.getWriter().write("{\"success\":false,\"message\":\"Không có quyền thực hiện hành động này\",\"data\":null,\"affectedRows\":0}");
//            return false;
//        }

        return true;
    }


    private String findPermissionCode(String requestURI) {
        for (Map.Entry<String, String> entry : URL_PERMISSION_MAPPING.entrySet()) {
            if (requestURI.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String getActionFromMethod(String method) {
        switch (method.toUpperCase()) {
            case "GET":
                return "CanRead";
            case "POST":
                return "CanCreate";
            case "PUT":
            case "PATCH":
                return "CanUpdate";
            case "DELETE":
                return "CanDelete";
            default:
                return "CanRead";
        }
    }
}
