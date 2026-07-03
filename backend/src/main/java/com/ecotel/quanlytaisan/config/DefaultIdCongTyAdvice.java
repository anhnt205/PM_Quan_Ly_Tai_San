package com.ecotel.quanlytaisan.config;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.Collection;

@RestControllerAdvice(basePackages = "com.ecotel.quanlytaisan.controller")
public class DefaultIdCongTyAdvice extends RequestBodyAdviceAdapter {

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        if (body != null) {
            if (body instanceof Collection) {
                for (Object item : (Collection<?>) body) {
                    setIdCongTy(item);
                }
            } else if (body.getClass().isArray()) {
                for (Object item : (Object[]) body) {
                    setIdCongTy(item);
                }
            } else {
                setIdCongTy(body);
            }
        }
        return super.afterBodyRead(body, inputMessage, parameter, targetType, converterType);
    }

    private void setIdCongTy(Object target) {
        if (target == null) return;
        try {
            Method setMethod = target.getClass().getMethod("setIdCongTy", String.class);
            setMethod.invoke(target, "CT001");
        } catch (Exception e) {
            // Method doesn't exist or is not accessible, ignore
        }
    }
}
