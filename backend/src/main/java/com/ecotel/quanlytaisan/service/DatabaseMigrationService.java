package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.dao.CCDCVatTuDao; // Giả định package DAO của bạn
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class DatabaseMigrationService {

    @Autowired
    @Qualifier("sqlServerJdbcTemplate")
    private JdbcTemplate sqlServerJdbcTemplate;

    @Autowired
    private CCDCVatTuDao ccdcVatTuDao; // Để gọi hàm insert vào MySQL

    public void processMigration(String bakFilePath) {
        try {
            String dbTarget = "ESOFTINV_2026";
            System.out.println("--- Bắt đầu quy trình chuyển đổi dữ liệu ---");

            // 1. Câu SQL chuẩn sử dụng PR_KEY để JOIN
            String queryDataSql = String.format(
                "SELECT " +
                "   ct.MA_VTHH, dm.TEN_VTHH, dm.MA_DVT, h.MA_KHO_NHAP, " +
                "   h.NGAY_VAO_SO, h.DIEN_GIAI, dm.MA_NHOM_VTHH, dm.LOAI_VTHH, " +
                "   ct.SO_LUONG, ct.TONG_TIEN, ct.LOT_SERIAL, dm.PROPERTY1, dm.PROPERTY2 " +
                "FROM [%s].dbo.VTHH_CT ct " +
                "JOIN [%s].dbo.VTHH h ON ct.PR_KEY = h.PR_KEY " + // Dùng PR_KEY Tý vừa tìm thấy
                "JOIN [%s].dbo.DM_VTHH dm ON ct.MA_VTHH = dm.MA_VTHH",
                dbTarget, dbTarget, dbTarget
            );

            // 2. Lấy dữ liệu từ SQL Server
            List<Map<String, Object>> rows = sqlServerJdbcTemplate.queryForList(queryDataSql);
            System.out.println("Tìm thấy " + rows.size() + " bản ghi từ SQL Server.");

            int successCount = 0;
            DateTimeFormatter isoFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

            // 3. Vòng lặp chuyển đổi sang MySQL
            for (Map<String, Object> row : rows) {
                try {
                    CCDCVatTu ccdc = new CCDCVatTu();
                    
                    // Gán các giá trị mặc định và ID
                    ccdc.setId(UUID.randomUUID().toString()); // Tạo ID duy nhất cho MySQL
                    ccdc.setIdCongTy("ct001");
                    ccdc.setIsActive(true);
                    ccdc.setNgayTao(LocalDateTime.now().format(isoFormatter));
                    
                    // Ánh xạ dữ liệu từ SQL Server (theo mapping Tý gửi)
                    ccdc.setTen(String.valueOf(row.get("TEN_VTHH")));
                    ccdc.setSoKyHieu(String.valueOf(row.get("MA_VTHH"))); // Mã vật tư
                    ccdc.setDonViTinh(String.valueOf(row.get("MA_DVT")));
                    ccdc.setIdDonVi(String.valueOf(row.get("MA_KHO_NHAP"))); // Đơn vị nhập
                    ccdc.setGhiChu(String.valueOf(row.get("DIEN_GIAI")));
                    ccdc.setIdNhomCCDC(String.valueOf(row.get("MA_NHOM_VTHH")));
                    ccdc.setKyHieu(String.valueOf(row.get("LOT_SERIAL")));
                    ccdc.setNuocSanXuat(String.valueOf(row.get("PROPERTY1")));
                    ccdc.setCongSuat(String.valueOf(row.get("PROPERTY2")));

                    // Ép kiểu số an toàn
                    ccdc.setSoLuong(row.get("SO_LUONG") != null ? ((Number) row.get("SO_LUONG")).intValue() : 0);
                    ccdc.setGiaTri(row.get("TONG_TIEN") != null ? ((Number) row.get("TONG_TIEN")).doubleValue() : 0.0);

                    // Xử lý ngày nhập
                    if (row.get("NGAY_VAO_SO") != null) {
                        ccdc.setNgayNhap(row.get("NGAY_VAO_SO").toString());
                    }

                    // 4. Lưu vào MySQL qua DAO
                    int result = ccdcVatTuDao.insert(ccdc);
                    if (result > 0) successCount++;

                } catch (Exception ex) {
                    System.err.println("Lỗi khi convert dòng " + row.get("MA_VTHH") + ": " + ex.getMessage());
                }
            }

            System.out.println("--- CHUYỂN ĐỔI HOÀN TẤT ---");
            System.out.println("Thành công: " + successCount + "/" + rows.size());

        } catch (Exception e) {
            System.err.println("Lỗi quy trình: " + e.getMessage());
            e.printStackTrace();
        }
    }
}