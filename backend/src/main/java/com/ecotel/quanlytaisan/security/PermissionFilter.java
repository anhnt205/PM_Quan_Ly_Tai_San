package com.ecotel.quanlytaisan.security;

import com.ecotel.quanlytaisan.annotation.PublicApi;
import com.ecotel.quanlytaisan.annotation.RequirePermission;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.io.IOException;

/**
 * Filter kiểm tra annotation @RequirePermission trên controller/method.
 *
 * Luồng xử lý:
 *  1. @PublicApi → bỏ qua (cho phép)
 *  2. Token LOCAL → bypass hoàn toàn (full-access)
 *  3. Token PORTAL → kiểm tra @RequirePermission và permissions của user
 */
@Component
@RequiredArgsConstructor
public class PermissionFilter extends OncePerRequestFilter {

    private final RequestMappingHandlerMapping handlerMapping;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        try {
            HandlerExecutionChain handlerChain = handlerMapping.getHandler(request);
            if (handlerChain == null || !(handlerChain.getHandler() instanceof HandlerMethod method)) {
                chain.doFilter(request, response);
                return;
            }

            // 1. Kiểm tra @PublicApi (method trước, class sau)
            if (method.hasMethodAnnotation(PublicApi.class) ||
                    method.getBeanType().isAnnotationPresent(PublicApi.class)) {
                chain.doFilter(request, response);
                return;
            }

            // 2. Kiểm tra user đã xác thực chưa
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (!(auth != null && auth.getPrincipal() instanceof AppUserDetails user)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Chưa xác thực");
                return;
            }

            // 3. Token LOCAL → full-access, bỏ qua kiểm tra annotation
            if (user.isLocalToken()) {
                chain.doFilter(request, response);
                return;
            }

            // 4. Token PORTAL → kiểm tra @RequirePermission
            RequirePermission methodAnnotation = method.getMethodAnnotation(RequirePermission.class);
            RequirePermission classAnnotation  = method.getBeanType().getAnnotation(RequirePermission.class);

            String resource = null;
            String action   = null;

            if (methodAnnotation != null && !methodAnnotation.resource().isEmpty()) {
                // Endpoint có annotation trên method: dùng resource + action từ method
                resource = methodAnnotation.resource();
                action   = !methodAnnotation.action().isEmpty()
                        ? methodAnnotation.action()
                        : resolveActionFromMethod(request.getMethod());
            } else if (classAnnotation != null && !classAnnotation.resource().isEmpty()) {
                // Endpoint CRUD thông thường: lấy resource từ class, action từ HTTP method
                resource = classAnnotation.resource();
                action   = resolveActionFromMethod(request.getMethod());
            }

            // 5. Không có annotation nào → endpoint chưa được phân quyền → bỏ qua
            if (resource == null || action == null) {
                chain.doFilter(request, response);
                return;
            }

            // 6. Kiểm tra quyền
            if (!user.hasPermission(resource, action)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Không có quyền: " + resource + ":" + action);
                return;
            }

            chain.doFilter(request, response);

        } catch (Exception e) {
            // handlerMapping.getHandler() có thể throw nếu không match route
            chain.doFilter(request, response);
        }
    }

    private String resolveActionFromMethod(String httpMethod) {
        return switch (httpMethod) {
            case "GET"           -> "r";
            case "POST"          -> "c";
            case "PUT", "PATCH"  -> "u";
            case "DELETE"        -> "d";
            default              -> null;
        };
    }
}
