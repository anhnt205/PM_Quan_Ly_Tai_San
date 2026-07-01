package com.ecotel.quanlytaisan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 *
 * LƯU Ý: PermissionInterceptor đã bị loại bỏ.
 * Phân quyền hiện được xử lý bởi:
 *  - {@link com.ecotel.quanlytaisan.security.AppTokenFilter} — xác định loại token
 *  - {@link com.ecotel.quanlytaisan.security.PermissionFilter} — kiểm tra @RequirePermission
 *
 * CORS được cấu hình tại CorsConfigurationSource bean trong SecurityConfig.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS được quản lý bởi Spring Security (CorsConfigurationSource bean)
    // Không cần addCorsMappings vì sẽ xung đột với Spring Security CORS filter
}