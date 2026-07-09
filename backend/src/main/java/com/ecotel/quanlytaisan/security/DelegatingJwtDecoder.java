package com.ecotel.quanlytaisan.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

/**
 * JwtDecoder ủy quyền: thử local decoder (HS512) trước,
 * nếu thất bại thì fallback sang portal decoder (JWKS/RSA).
 *
 * Cơ chế nhận dạng:
 *  - Token local: được ký bằng HMAC-HS512 với JWT_SECRET_KEY
 *  - Token portal: được ký bằng RSA private key, verify qua JWKS endpoint
 */
@Slf4j
public class DelegatingJwtDecoder implements JwtDecoder {

    private final JwtDecoder localDecoder;
    private final JwtDecoder portalDecoder;

    public DelegatingJwtDecoder(JwtDecoder localDecoder, JwtDecoder portalDecoder) {
        this.localDecoder = localDecoder;
        this.portalDecoder = portalDecoder;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        // Thử local decoder (HS512) trước
        try {
            Jwt jwt = localDecoder.decode(token);
            log.debug("Token decoded successfully by local decoder (HS512)");
            return jwt;
        } catch (JwtException localEx) {
            log.debug("Local decoder failed ({}), trying portal decoder...", localEx.getMessage());
        }

        // Fallback: thử portal decoder (JWKS/RSA)
        try {
            Jwt jwt = portalDecoder.decode(token);
            log.debug("Token decoded successfully by portal decoder (JWKS)");
            return jwt;
        } catch (JwtException portalEx) {
            log.warn("Both decoders failed. Portal error: {}", portalEx.getMessage());
            throw new JwtException("Token không hợp lệ: không thể xác thực bởi local decoder lẫn portal decoder");
        }
    }
}
