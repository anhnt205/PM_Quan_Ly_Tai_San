package com.ecotel.quanlytaisan.permissions;

import com.ecotel.quanlytaisan.security.AppUserDetails;
import com.ecotel.quanlytaisan.security.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.Collections;

/**
 * Utility lấy thông tin người dùng đang xác thực từ SecurityContext.
 *
 * Hỗ trợ 2 loại token:
 *  - LOCAL token: permissions = empty map (full-access đã được xử lý ở PermissionFilter)
 *  - PORTAL token: permissions = map chi tiết từ JWT
 */
@Slf4j
@Component
public class PermissionContext {

    public AuthenticatedUser getCurrentUser(HttpServletRequest request) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof AppUserDetails user)) {
            throw new AccessDeniedException("Chưa xác thực");
        }

        return AuthenticatedUser.builder()
                .userId(parseUserId(user.getUserId()))
                .username(user.getUsername())
                .fullName(user.getFullName())
                .companyId(user.getCompanyId())
                .appCode(user.getApp())
                // Local token: permissions null → dùng empty map (full-access đã pass ở filter)
                .permissions(user.getPermissions() != null ? user.getPermissions() : Collections.emptyMap())
                .build();
    }

    /**
     * Lấy loại token của người dùng hiện tại.
     * @return TokenType.LOCAL hoặc TokenType.PORTAL, null nếu chưa xác thực
     */
    public TokenType getCurrentTokenType() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AppUserDetails user) {
            return user.getTokenType();
        }
        return null;
    }

    /**
     * Kiểm tra user hiện tại có dùng token local không.
     * Dùng trong service layer nếu cần biết để xử lý đặc biệt.
     */
    public boolean isLocalTokenUser() {
        return TokenType.LOCAL.equals(getCurrentTokenType());
    }

    private Long parseUserId(String userId) {
        if (userId == null) return null;
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException e) {
            // Local token: userId = username (string) → trả về null
            return null;
        }
    }
}
