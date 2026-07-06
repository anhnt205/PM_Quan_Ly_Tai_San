package com.ecotel.quanlytaisan.seed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String adminId = "admin";
        String tkId = "TK001";
        
        try {
            // 1. Seed NhanVien cho admin
            String checkNvSql = "SELECT COUNT(*) FROM NhanVien WHERE Id = ?";
            Integer nvCount = jdbcTemplate.queryForObject(checkNvSql, Integer.class, adminId);
            if (nvCount != null && nvCount == 0) {
                String insertNvSql = "INSERT INTO NhanVien (Id, HoTen, DiDong, EmailCongViec, IdCongTy, TrangThai) VALUES (?, ?, ?, ?, ?, 1)";
                jdbcTemplate.update(insertNvSql, adminId, "Administrator", "0123456789", "admin@company.com", "ct001");
                System.out.println("  [SEEDER] Đã tạo NhanVien admin");
            }
            
            // 2. Seed TaiKhoan cho admin
            String checkTkSql = "SELECT COUNT(*) FROM TaiKhoan WHERE Id = ?";
            Integer tkCount = jdbcTemplate.queryForObject(checkTkSql, Integer.class, tkId);
            if (tkCount != null && tkCount == 0) {
                String insertTkSql = "INSERT INTO TaiKhoan (Id, TenDangNhap, MatKhau, Username, HoTen, Email, SoDienThoai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IdCongTy, Rule, IsActive) " +
                                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)";
                jdbcTemplate.update(insertTkSql, tkId, adminId, "admin", "admin", "Administrator", "admin@company.com", "0123456789", now, now, "system", "system", "ct001");
                System.out.println("  [SEEDER] Đã tạo TaiKhoan admin (TK001)");
            }
            
            // 3. Seed UserPermission cho admin
            String getPermsSql = "SELECT Id FROM Permission";
            List<String> permissionIds = jdbcTemplate.queryForList(getPermsSql, String.class);
            
            for (String pId : permissionIds) {
                String checkUpSql = "SELECT COUNT(*) FROM UserPermission WHERE UserId = ? AND PermissionId = ?";
                Integer upCount = jdbcTemplate.queryForObject(checkUpSql, Integer.class, tkId, pId);
                if (upCount != null && upCount > 0) {
                    // Cập nhật lại toàn quyền
                    String updateUpSql = "UPDATE UserPermission SET CanCreate=1, CanRead=1, CanUpdate=1, CanDelete=1, UpdatedDate=? WHERE UserId=? AND PermissionId=?";
                    jdbcTemplate.update(updateUpSql, now, tkId, pId);
                } else {
                    // Thêm mới
                    String newId = java.util.UUID.randomUUID().toString();
                    String insertUpSql = "INSERT INTO UserPermission (Id, UserId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete, CreatedDate, IsActive) VALUES (?, ?, ?, 1, 1, 1, 1, ?, 1)";
                    jdbcTemplate.update(insertUpSql, newId, tkId, pId, now);
                }
            }
            System.out.println("  [SEEDER] Đã đồng bộ đầy đủ quyền cho admin (TK001)");
            
        } catch (Exception e) {
            System.err.println("  [SEEDER LỖI] Lỗi khi seed dữ liệu Admin: " + e.getMessage());
        }
    }
}
