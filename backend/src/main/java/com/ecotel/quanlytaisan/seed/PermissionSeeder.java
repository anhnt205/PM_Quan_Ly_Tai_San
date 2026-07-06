package com.ecotel.quanlytaisan.seed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class PermissionSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        seedPermission("PERM001", "Quản lý Tài sản", "TAISAN", "Quản lý tài sản");
        seedPermission("PERM002", "Quản lý CCDC Vật tư", "CCDCVT", "Quản lý công cụ dụng cụ vật tư");
        seedPermission("PERM003", "Quản lý Bàn giao tài sản", "BANGIAO_TAISAN", "Quản lý bàn giao tài sản");
        seedPermission("PERM004", "Quản lý Bàn giao CCDC", "BANGIAO_CCDC", "Quản lý bàn giao CCDC");
        seedPermission("PERM005", "Quản lý Điều động tài sản", "DIEUDONG_TAISAN", "Quản lý điều động tài sản");
        seedPermission("PERM006", "Quản lý Điều động CCDC", "DIEUDONG_CCDC", "Quản lý điều động CCDC");
        seedPermission("PERM007", "Quản lý Nhân viên", "NHANVIEN", "Quản lý nhân viên");
        seedPermission("PERM008", "Quản lý Phòng ban", "PHONGBAN", "Quản lý phòng ban");
        seedPermission("PERM009", "Quản lý Công ty", "CONGTY", "Quản lý công ty");
        seedPermission("PERM010", "Quản lý Dự án", "DUAN", "Quản lý dự án");
        seedPermission("PERM011", "Quản lý Loại tài sản", "LOAITAISAN", "Quản lý loại tài sản");
        seedPermission("PERM012", "Quản lý Loại CCDC", "LOAICCDC", "Quản lý loại CCDC");
        seedPermission("PERM013", "Quản lý Khấu hao", "KHAUHAO", "Quản lý khấu hao");
        seedPermission("PERM014", "Quản lý Báo cáo", "BAOCAO", "Quản lý báo cáo");
        seedPermission("PERM015", "Quản lý Cấu hình", "CONFIG", "Quản lý cấu hình hệ thống");
        seedPermission("PERM016", "Quản lý Tài khoản", "TAIKHOAN", "Quản lý tài khoản người dùng");
        seedPermission("PERM017", "Quản lý Phân quyền", "PERMISSION", "Quản lý phân quyền hệ thống");
        seedPermission("PERM018", "Quản lý Nhóm tài sản", "NHOMTAISAN", "Quản lý nhóm tài sản");
        seedPermission("PERM019", "Quản lý Mô hình tài sản", "MOHINHTAISAN", "Quản lý mô hình tài sản");
        seedPermission("PERM020", "Quản lý Nguồn vốn", "NGUONVON", "Quản lý nguồn vốn");
    }

    private void seedPermission(String id, String name, String code, String description) {
        try {
            // Kiểm tra xem permission code đã tồn tại chưa
            String checkSql = "SELECT COUNT(*) FROM Permission WHERE PermissionCode = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, code);
            
            if (count != null && count > 0) {
                // Đã tồn tại -> Update tên và mô tả
                String updateSql = "UPDATE Permission SET PermissionName = ?, Description = ? WHERE PermissionCode = ?";
                jdbcTemplate.update(updateSql, name, description, code);
            } else {
                // Chưa tồn tại -> Insert mới
                String insertSql = "INSERT INTO Permission (Id, PermissionName, PermissionCode, Description, IsActive) VALUES (?, ?, ?, ?, 1)";
                jdbcTemplate.update(insertSql, id, name, code, description);
                System.out.println("  [SEEDER] Đã thêm quyền mới: " + name + " (" + code + ")");
            }
        } catch (Exception e) {
            System.err.println("  [SEEDER LỖI] Không thể seed quyền " + code + ": " + e.getMessage());
        }
    }
}
