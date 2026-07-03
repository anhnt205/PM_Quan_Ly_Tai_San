package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DbConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
public class DbConfigDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DbConfig> findAll() {
        String sql = "SELECT * FROM DbConfig";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DbConfig.class));
    }

    public DbConfig findById(String id) {
        String sql = "SELECT * FROM DbConfig WHERE Id = ?";
        List<DbConfig> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DbConfig.class), id);
        return result.isEmpty() ? null : result.get(0);
    }

    public DbConfig findDefault() {
        String sql = "SELECT * FROM DbConfig WHERE IsDefault = 1";
        List<DbConfig> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DbConfig.class));
        return result.isEmpty() ? null : result.get(0);
    }

    public void clearDefault() {
        String sql = "UPDATE DbConfig SET IsDefault = 0";
        jdbcTemplate.update(sql);
    }

    public int insert(DbConfig config) {
        if (config.getId() == null || config.getId().isEmpty()) {
            config.setId(UUID.randomUUID().toString());
        }
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        config.setNgayTao(now);
        config.setNgayCapNhat(now);

        String sql = """
                INSERT INTO DbConfig (Id, Dbms, Ip, Port, DbName, Username, Password, NgayTao, NgayCapNhat, IsDefault, SyncIntervalHours, SyncTime)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        return jdbcTemplate.update(sql, config.getId(), config.getDbms(), config.getIp(),
                config.getPort(), config.getDbName(), config.getUsername(), config.getPassword(), 
                config.getNgayTao(), config.getNgayCapNhat(), config.getIsDefault(), config.getSyncIntervalHours(), config.getSyncTime());
    }

    public int update(DbConfig config) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        config.setNgayCapNhat(now);

        String sql = """
                UPDATE DbConfig SET
                    Dbms = ?,
                    Ip = ?,
                    Port = ?,
                    DbName = ?,
                    Username = ?,
                    Password = ?,
                    NgayCapNhat = ?,
                    IsDefault = ?,
                    SyncIntervalHours = ?,
                    SyncTime = ?
                WHERE Id = ?
                """;
        return jdbcTemplate.update(sql, config.getDbms(), config.getIp(), config.getPort(),
                config.getDbName(), config.getUsername(), config.getPassword(), config.getNgayCapNhat(), 
                config.getIsDefault(), config.getSyncIntervalHours(), config.getSyncTime(), config.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM DbConfig WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
