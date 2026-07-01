package com.ecotel.quanlytaisan.security;

import com.ecotel.quanlytaisan.permissions.PermissionDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Filter chạy sau BearerTokenAuthenticationFilter (Spring đã verify JWT xong).
 *
 * Hai luồng được hỗ trợ:
 *
 * 1. Token Portal (RSA/JWKS):
 *    - JWT có claim "permissions" dạng Map<moduleCode, {c,r,u,d,a}>
 *    - Parse ra AppUserDetails với quyền chi tiết
 *    - PermissionFilter sẽ kiểm tra @RequirePermission
 *
 * 2. Token Local (HS512 — sinh bởi TaiKhoanService):
 *    - JWT chỉ có: sub (username), scope ("ADMIN"|"USER"), iss, exp, iat
 *    - Không có claim "permissions"
 *    - → Grant FULL ACCESS (phương án A): tạo AppUserDetails với permissions = null
 *    - PermissionFilter sẽ bỏ qua kiểm tra nếu permissions == null
 */
@Slf4j
@Component
public class AppTokenFilter extends OncePerRequestFilter {

    /** Claim đánh dấu token đến từ portal */
    private static final String PERMISSIONS_CLAIM = "permissions";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Spring đã verify và set Jwt object vào SecurityContext
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {

            Map<String, Object> rawPerms = jwt.getClaim(PERMISSIONS_CLAIM);

            AppUserDetails principal;

            if (rawPerms != null) {
                // ── PORTAL TOKEN ──────────────────────────────────────────────
                // Có claim permissions → parse chi tiết
                log.debug("Portal token detected for subject: {}", jwt.getSubject());
                Map<String, PermissionDto> permissions = parsePermissions(rawPerms);

                principal = AppUserDetails.builder()
                        .userId(extractString(jwt, "userId", jwt.getSubject()))
                        .username(extractString(jwt, "username", jwt.getSubject()))
                        .fullName(extractString(jwt, "fullName", jwt.getSubject()))
                        .companyId(extractLong(jwt, "companyId"))
                        .app(extractString(jwt, "app", null))
                        .permissions(permissions)
                        .tokenType(TokenType.PORTAL)
                        .build();

            } else {
                // ── LOCAL TOKEN ───────────────────────────────────────────────
                // Không có claim permissions → full-access (phương án A)
                log.debug("Local token detected for subject: {}", jwt.getSubject());

                principal = AppUserDetails.builder()
                        .userId(jwt.getSubject())   // sub = username (tenDangNhap)
                        .username(jwt.getSubject())
                        .fullName(jwt.getSubject())
                        .companyId(null)
                        .app(null)
                        .permissions(null)          // null = full-access, kiểm tra ở PermissionFilter
                        .tokenType(TokenType.LOCAL)
                        .build();
            }

            UsernamePasswordAuthenticationToken newAuth =
                    new UsernamePasswordAuthenticationToken(
                            principal, null, principal.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }

        chain.doFilter(request, response);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Map<String, PermissionDto> parsePermissions(Map<String, Object> rawPerms) {
        Map<String, PermissionDto> permissions = new HashMap<>();
        rawPerms.forEach((resource, val) -> {
            @SuppressWarnings("unchecked")
            Map<String, Object> permMap = (Map<String, Object>) val;
            PermissionDto dto = PermissionDto.builder()
                    .c(Boolean.TRUE.equals(permMap.get("c")))
                    .r(Boolean.TRUE.equals(permMap.get("r")))
                    .u(Boolean.TRUE.equals(permMap.get("u")))
                    .d(Boolean.TRUE.equals(permMap.get("d")))
                    .a(Boolean.TRUE.equals(permMap.get("a")))
                    .build();
            permissions.put(resource, dto);
        });
        return permissions;
    }

    private String extractString(Jwt jwt, String claimName, String defaultValue) {
        Object val = jwt.getClaim(claimName);
        if (val instanceof String s) return s;
        if (val instanceof Number n) return n.toString();
        return defaultValue;
    }

    private Long extractLong(Jwt jwt, String claimName) {
        Object val = jwt.getClaim(claimName);
        if (val instanceof Long l) return l;
        if (val instanceof Integer i) return i.longValue();
        if (val instanceof Number n) return n.longValue();
        if (val instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }
}
