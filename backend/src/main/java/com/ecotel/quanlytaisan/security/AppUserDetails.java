package com.ecotel.quanlytaisan.security;

import com.ecotel.quanlytaisan.enums.PermissionAction;
import com.ecotel.quanlytaisan.permissions.PermissionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Đại diện cho người dùng đã xác thực trong SecurityContext.
 *
 * - Nếu tokenType == PORTAL: permissions != null, kiểm tra quyền chi tiết.
 * - Nếu tokenType == LOCAL:  permissions == null, full-access (không chặn).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUserDetails implements UserDetails {

    private String userId;
    private String username;
    private String fullName;
    private Long   companyId;
    private String app;

    /** key: "tai-san/taisan", value: {c,r,u,d,a} */
    private Map<String, PermissionDto> permissions;

    /** Nguồn gốc token: LOCAL (full-access) hoặc PORTAL (kiểm tra permissions) */
    private TokenType tokenType;

    // ─── Kiểm tra quyền ──────────────────────────────────────────────────────

    /**
     * Kiểm tra quyền trên một resource cụ thể.
     * Token local (LOCAL) luôn trả về true (full-access).
     */
    public boolean hasPermission(String resource, String action) {
        // Local token: bypass hoàn toàn
        if (TokenType.LOCAL.equals(tokenType) || permissions == null) {
            return true;
        }
        PermissionDto perm = permissions.get(resource);
        if (perm == null) return false;
        return switch (action) {
            case "r" -> perm.isR();
            case "c" -> perm.isC();
            case "u" -> perm.isU();
            case "d" -> perm.isD();
            case "a" -> perm.isA();
            default  -> false;
        };
    }

    /** Kiểm tra xem đây có phải local token (full-access) không */
    public boolean isLocalToken() {
        return TokenType.LOCAL.equals(tokenType);
    }

    // ─── Spring Security GrantedAuthority ─────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (TokenType.LOCAL.equals(tokenType) || permissions == null) {
            // Token local: grant một role tổng ROLE_LOCAL_USER
            authorities.add(new SimpleGrantedAuthority("ROLE_LOCAL_USER"));
        } else {
            // Token portal: flatten permissions thành GrantedAuthority
            permissions.forEach((resource, perm) -> {
                for (PermissionAction action : PermissionAction.values()) {
                    if (perm.has(action)) {
                        authorities.add(new SimpleGrantedAuthority(
                                "PERM_" + resource.toUpperCase().replace("/", "_") + "_" + action.name()
                        ));
                        // VD: PERM_TAI_SAN_TAISAN_R
                    }
                }
            });
        }
        return authorities;
    }

    @Override public String getPassword()                 { return null; }
    @Override public boolean isAccountNonExpired()        { return true; }
    @Override public boolean isAccountNonLocked()         { return true; }
    @Override public boolean isCredentialsNonExpired()    { return true; }
    @Override public boolean isEnabled()                  { return true; }
}
