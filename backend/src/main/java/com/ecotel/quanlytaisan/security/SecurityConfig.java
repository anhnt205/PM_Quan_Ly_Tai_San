package com.ecotel.quanlytaisan.security;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

/**
 * Security configuration duy nhất cho toàn hệ thống.
 * Hỗ trợ 2 loại token:
 *  - Token local (HS512): do hệ thống tài sản tự sinh, dùng JWT_SECRET_KEY
 *  - Token portal (JWKS/RSA): do portal service sinh, verify qua JWKS endpoint
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    /** Các endpoint không cần xác thực */
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/taikhoan/login",
            "/api/taikhoan/login/**",
            // OTC exchange: portal lưu mã vào Redis, client dùng mã này đổi lấy appToken
            // Endpoint này không có Bearer token → phải public
            "/api/taikhoan/exchange-code",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/ws/**",
            "/ws/info",
    };

    @Value("${JWT_SECRET_KEY}")
    private String localSignerKey;

    @Value("${portal.jwks-uri}")
    private String portalJwksUri;

    private final AppTokenFilter appTokenFilter;
    private final PermissionFilter permissionFilter;

    // ─── JwtDecoder beans ────────────────────────────────────────────────────

    /**
     * Decoder cho token local (HMAC-HS512, sinh bởi TaiKhoanService).
     */
    @Bean("localJwtDecoder")
    public JwtDecoder localJwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(localSignerKey.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    /**
     * Decoder cho token portal (RSA, verify qua JWKS endpoint).
     */
    @Bean("portalJwtDecoder")
    public JwtDecoder portalJwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(portalJwksUri).build();
    }

    /**
     * Decoder ủy quyền: thử local trước, fallback sang portal.
     * Đây là bean PRIMARY được Spring Security sử dụng.
     */
    @Bean
    @Primary
    public JwtDecoder jwtDecoder() {
        return new DelegatingJwtDecoder(localJwtDecoder(), portalJwtDecoder());
    }

    // ─── Security Filter Chain ────────────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS — sử dụng CorsConfigurationSource bean từ config/SecurityConfig.java
                .cors(Customizer.withDefaults())

                // Tắt CSRF (REST API stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless session
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // OAuth2 Resource Server dùng DelegatingJwtDecoder (primary bean)
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())))

                // Phân quyền endpoint
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()   // preflight CORS
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )

                // Filter pipeline: BearerTokenFilter → AppTokenFilter → PermissionFilter
                .addFilterAfter(appTokenFilter, BearerTokenAuthenticationFilter.class)
                .addFilterAfter(permissionFilter, AppTokenFilter.class);

        return http.build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("API Quản Lý Tài Sản").version("1.0"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .name("bearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
