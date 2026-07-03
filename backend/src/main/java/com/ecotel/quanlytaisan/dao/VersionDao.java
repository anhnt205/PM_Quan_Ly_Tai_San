package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class VersionDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Version> findAll() {
        String sql = "SELECT * FROM Version ORDER BY NgayCapNhat DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Version.class));
    }

    public List<Version> findAllActive() {
        String sql = "SELECT * FROM Version WHERE IsActive = TRUE ORDER BY NgayCapNhat DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Version.class));
    }

    public Version findById(String id) {
        String sql = "SELECT * FROM Version WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Version.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public Version findByVersionCode(String versionCode) {
        String sql = "SELECT * FROM Version WHERE VersionCode = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Version.class), versionCode);
        } catch (Exception e) {
            return null;
        }
    }

    public Version getLatestVersion() {
        String sql = "SELECT * FROM Version WHERE IsActive = TRUE ORDER BY NgayCapNhat DESC LIMIT 1";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Version.class));
        } catch (Exception e) {
            return null;
        }
    }

    public int insert(Version version) {
        // Kiểm tra id không null và không empty
        if (version.getId() == null || version.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM Version WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, version.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(version);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = """
                    INSERT INTO Version (
                        Id, VersionName, VersionCode, Description, ReleaseDate, 
                        IsActive, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;
            
            String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            return jdbcTemplate.update(sql, 
                version.getId(), 
                version.getVersionName(), 
                version.getVersionCode(), 
                version.getDescription(),
                version.getReleaseDate(),
                version.getIsActive() != null ? version.getIsActive() : true,
                version.getNgayTao() != null ? version.getNgayTao() : currentTime,
                version.getNgayCapNhat() != null ? version.getNgayCapNhat() : currentTime,
                version.getNguoiTao(),
                version.getNguoiCapNhat()
            );
        }
    }

    public int update(Version version) {
        String sql = """
                UPDATE Version
                SET VersionName = ?, VersionCode = ?, Description = ?, ReleaseDate = ?,
                    IsActive = ?, NgayCapNhat = ?, NguoiCapNhat = ?
                WHERE Id = ?
                """;

        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return jdbcTemplate.update(sql, 
            version.getVersionName(), 
            version.getVersionCode(), 
            version.getDescription(),
            version.getReleaseDate(),
            version.getIsActive(),
            version.getNgayCapNhat() != null ? version.getNgayCapNhat() : currentTime,
            version.getNguoiCapNhat(),
            version.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM Version WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deactivate(String id) {
        String sql = "UPDATE Version SET IsActive = FALSE, NgayCapNhat = ? WHERE Id = ?";
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return jdbcTemplate.update(sql, currentTime, id);
    }

    public int activate(String id) {
        String sql = "UPDATE Version SET IsActive = TRUE, NgayCapNhat = ? WHERE Id = ?";
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return jdbcTemplate.update(sql, currentTime, id);
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM Version";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public long countActive() {
        String sql = "SELECT COUNT(*) FROM Version WHERE IsActive = TRUE";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
}
