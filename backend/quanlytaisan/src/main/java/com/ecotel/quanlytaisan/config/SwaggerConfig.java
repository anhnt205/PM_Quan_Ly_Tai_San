package com.ecotel.quanlytaisan.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Quản Lý Tài Sản")
                        .version("1.0.0")
                        .description("Hệ thống quản lý tài sản - Tự động sinh documentation từ các Controller")
                        .contact(new Contact()
                                .name("Ecotel Team")
                                .email("support@ecotel.com")));
    }
}