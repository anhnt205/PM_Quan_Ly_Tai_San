package com.ecotel.quanlytaisan.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    // 1. Cấu hình MySQL làm mặc định (Primary)
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties primaryDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource primaryDataSource() {
        return primaryDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @Primary
    public JdbcTemplate primaryJdbcTemplate(DataSource primaryDataSource) {
        return new JdbcTemplate(primaryDataSource);
    }

    // --- CẤU HÌNH SQL SERVER MỚI NHẤT ---

    @Value("${spring.sqlserver.datasource.url}")
    private String sqlServerUrl;

    @Value("${spring.sqlserver.datasource.username}")
    private String sqlServerUsername;

    @Value("${spring.sqlserver.datasource.password}")
    private String sqlServerPassword;

    @Value("${spring.sqlserver.datasource.driver-class-name}")
    private String sqlServerDriver;

    // 2. Cấu hình SQL Server (Khởi tạo trực tiếp HikariDataSource để tránh lỗi username rỗng)
    @Bean("sqlServerDataSource")
    public DataSource sqlServerDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(sqlServerUrl);
        dataSource.setUsername(sqlServerUsername);
        dataSource.setPassword(sqlServerPassword);
        dataSource.setDriverClassName(sqlServerDriver);
        
        dataSource.setMaximumPoolSize(1); 
        dataSource.setMinimumIdle(1);   
        
        dataSource.setConnectionTimeout(60000);
        return dataSource;
    }

    @Bean("sqlServerJdbcTemplate")
    public JdbcTemplate sqlServerJdbcTemplate(@Qualifier("sqlServerDataSource") DataSource sqlServerDataSource) {
        return new JdbcTemplate(sqlServerDataSource);
    }
}