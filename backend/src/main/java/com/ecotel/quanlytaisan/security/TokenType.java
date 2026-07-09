package com.ecotel.quanlytaisan.security;

/**
 * Loại token mà người dùng đã xác thực bằng.
 *
 * LOCAL  — Token do hệ thống tài sản tự sinh (HMAC-HS512).
 *           Không có permissions claim → full-access.
 * PORTAL — Token do portal service sinh (RSA/JWKS).
 *           Có permissions claim → kiểm tra quyền chi tiết.
 */
public enum TokenType {
    LOCAL,
    PORTAL
}
