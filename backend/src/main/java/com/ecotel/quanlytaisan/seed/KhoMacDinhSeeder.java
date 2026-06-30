package com.ecotel.quanlytaisan.seed;

import com.ecotel.quanlytaisan.dao.PhongBanDao;
import com.ecotel.quanlytaisan.model.PhongBan;
import com.ecotel.quanlytaisan.model.PhongBanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class KhoMacDinhSeeder implements CommandLineRunner {

    @Autowired
    private PhongBanDao phongBanDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

        seedKho("Kty", "Kho công ty", true, 1, now);
        seedKho("kth", "Kho thu hồi", true, 2, now);
    }

    private void seedKho(String id, String tenPhongBan, boolean isKho, int loaiKho, String now) {
        try {
            PhongBanDTO existing = phongBanDao.findById(id);
            if (existing != null) {
                // Đã tồn tại -> Chỉ update những trường cần thiết nếu đang bị null/sai
                boolean changed = false;
                if (existing.getIsKho() == null || existing.getIsKho() != isKho) {
                    changed = true;
                }
                if (existing.getLoaiKho() == null || existing.getLoaiKho() != loaiKho) {
                    changed = true;
                }
                
                if (changed) {
                    jdbcTemplate.update(
                        "UPDATE PhongBan SET IsKho = ?, LoaiKho = ?, NgayCapNhat = ?, NguoiCapNhat = ? WHERE Id = ?",
                        isKho, loaiKho, now, "system", id
                    );
                    System.out.println("  [SEEDER] Đã cập nhật " + tenPhongBan + " (" + id + ") với isKho=" + isKho + ", loaiKho=" + loaiKho);
                }
            } else {
                // Chưa tồn tại -> Insert mới
                PhongBan pb = new PhongBan();
                pb.setId(id);
                pb.setTenPhongBan(tenPhongBan);
                pb.setIdCongTy("ct001");
                pb.setIsActive(true);
                pb.setIsKho(isKho);
                pb.setLoaiKho(loaiKho);
                pb.setNgayTao(now);
                pb.setNgayCapNhat(now);
                pb.setNguoiTao("system");
                pb.setNguoiCapNhat("system");

                phongBanDao.insert(pb);
                System.out.println("  [SEEDER] Đã tạo mới " + tenPhongBan + " (" + id + ") với isKho=" + isKho + ", loaiKho=" + loaiKho);
            }
        } catch (Exception e) {
            System.err.println("  [SEEDER LỖI] Không thể seed " + tenPhongBan + " (" + id + "): " + e.getMessage());
        }
    }


}
