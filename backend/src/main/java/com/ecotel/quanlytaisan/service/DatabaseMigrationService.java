package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietDonViSoHuuDao;
import com.ecotel.quanlytaisan.dao.ChiTietTaiSanDao;
import com.ecotel.quanlytaisan.dao.DbConfigDao;
import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import com.ecotel.quanlytaisan.model.DbConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DatabaseMigrationService {

    @Autowired
    private DbConfigDao dbConfigDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CCDCVatTuDao ccdcVatTuDao;

    @Autowired
    private ChiTietTaiSanDao chiTietTaiSanDao;

    @Autowired
    private ChiTietDonViSoHuuDao chiTietDonViSoHuuDao;

    // ─── Wrapper gom nhóm dữ liệu cha–con trong quá trình migration ──────────
    private static class MigrationGroup {
        CCDCVatTu vatTu;
        // Key: "MA_VTHH|MA_PBAN_NHAP" → tổng số lượng của nhóm đó
        Map<String, Integer> pbanNhapSoLuong = new LinkedHashMap<>();

        public MigrationGroup(CCDCVatTu vatTu) {
            this.vatTu = vatTu;
        }
    }

    // ─── Entry point ──────────────────────────────────────────────────────────
    public void processMigration(String dbConfigId) {
        // 1. Đọc cấu hình kết nối
        DbConfig config = dbConfigDao.findById(dbConfigId);
        if (config == null) {
            throw new RuntimeException("Chưa cấu hình Cơ sở dữ liệu để đồng bộ!");
        }
        String dbms = config.getDbms() != null ? config.getDbms().toUpperCase() : "MSSQL";
        if (!"MSSQL".equals(dbms)) {
            throw new RuntimeException("Tính năng đồng bộ hiện chỉ hỗ trợ MS SQL Server.");
        }
        String dbStr = (config.getDbName() != null && !config.getDbName().isEmpty()) ? config.getDbName() : "";
        if (dbStr.isEmpty()) {
            throw new RuntimeException("Chưa cấu hình Tên Database (DbName)!");
        }

        System.out.println("=== Bắt đầu đồng bộ từ database: " + dbStr + " ===");

        // 2. Tạo JdbcTemplate trỏ tới remote MSSQL
        JdbcTemplate remote = buildRemoteJdbcTemplate(config, dbStr);

        // 3. Lấy danh sách vật tư (DM_VTHH + VTHH_CT)
        Map<String, MigrationGroup> groupMap = loadVatTuList(remote, dbStr);
        System.out.println("  Tổng số mã vật tư từ DM_VTHH: " + groupMap.size());

        // 4. Với mỗi vật tư, lấy phiếu xuất + chi tiết → nhóm theo MA_PBAN_NHAP
        loadPhieuXuatGroups(remote, dbStr, groupMap);

        // 5. Ghi vào MySQL
        persistToMySQL(groupMap);

        System.out.println("=== Đồng bộ hoàn tất: " + groupMap.size() + " mã vật tư ===");
    }

    // ─── Bước 1: Kết nối remote ───────────────────────────────────────────────
    private JdbcTemplate buildRemoteJdbcTemplate(DbConfig config, String dbStr) {
        String jdbcUrl = "jdbc:sqlserver://" + config.getIp() + ":" + config.getPort()
                + ";databaseName=" + dbStr
                + ";encrypt=true;trustServerCertificate=true;";
        org.springframework.jdbc.datasource.DriverManagerDataSource ds =
                new org.springframework.jdbc.datasource.DriverManagerDataSource();
        ds.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        ds.setUrl(jdbcUrl);
        ds.setUsername(config.getUsername());
        ds.setPassword(config.getPassword());
        return new JdbcTemplate(ds);
    }

    // ─── Bước 2: Load DM_VTHH + VTHH_CT ─────────────────────────────────────
    /**
     * Với mỗi MA_VTHH có thể có nhiều dòng trong VTHH_CT.
     * Chỉ cần lấy 1 dòng VTHH_CT có GIA_GOC khác null và > 0.
     * Dùng subquery lấy MIN(GIA_GOC) hợp lệ để tránh duplicate MA_VTHH.
     */
    private Map<String, MigrationGroup> loadVatTuList(JdbcTemplate remote, String dbStr) {
        // TOP 1 per MA_VTHH: lấy GIA_GOC đầu tiên có giá trị hợp lệ
        String sql = String.format(
            "SELECT dmvt.MA_VTHH, dmvt.TEN_VTHH, dmvt.MA_DVT, dmvt.MA_NHOM_VTHH1, " +
            "       (SELECT TOP 1 vc.GIA_GOC " +
            "        FROM [%s].dbo.VTHH_CT vc " +
            "        WHERE vc.MA_VTHH = dmvt.MA_VTHH AND vc.GIA_GOC IS NOT NULL AND vc.GIA_GOC > 0 " +
            "        ORDER BY vc.GIA_GOC DESC) AS GIA_GOC " +
            "FROM [%s].dbo.DM_VTHH dmvt " +
            "WHERE dmvt.MA_NHOM_VTHH1 = '49' " +
            "  AND EXISTS (" +
            "      SELECT 1 FROM [%s].dbo.VTHHPX_CT px " +
            "      JOIN [%s].dbo.VTHHPX px_h ON px_h.PR_KEY = px.FR_KEY " +
            "      WHERE px.MA_VTHH = dmvt.MA_VTHH AND px_h.TRAN_ID = 'NKHOPX'" +
            "  )",
            dbStr, dbStr, dbStr, dbStr
        );

        List<Map<String, Object>> rows = remote.queryForList(sql);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);

        Map<String, MigrationGroup> groupMap = new LinkedHashMap<>();

        for (Map<String, Object> row : rows) {
            String maVthh = String.valueOf(row.get("MA_VTHH")).trim();
            if (maVthh.isEmpty() || "null".equalsIgnoreCase(maVthh)) continue;

            // Bỏ qua nếu đã tồn tại (đề phòng query trả về trùng)
            if (groupMap.containsKey(maVthh)) continue;

            double giaGoc = row.get("GIA_GOC") != null
                    ? ((Number) row.get("GIA_GOC")).doubleValue() : 0.0;

            CCDCVatTu vatTu = new CCDCVatTu();
            vatTu.setId(maVthh);
            vatTu.setSoKyHieu(maVthh);
            vatTu.setTen(nvl(row.get("TEN_VTHH")));
            vatTu.setDonViTinh(nvl(row.get("MA_DVT")));
            vatTu.setIdNhomCCDC(nvl(row.get("MA_NHOM_VTHH1")));
            vatTu.setIdCongTy("ct001");
            vatTu.setIsActive(true);
            vatTu.setNgayTao(now);
            vatTu.setNgayCapNhat(now);
            vatTu.setSoLuong(0);          // sẽ cộng dồn ở bước 3
            vatTu.setGiaTri(giaGoc);
            vatTu.setHienTrang(0);

            groupMap.put(maVthh, new MigrationGroup(vatTu));
        }

        return groupMap;
    }

    // ─── Bước 3: Load VTHHPX + VTHHPX_CT, nhóm theo MA_PBAN_NHAP ────────────
    /**
     * Với mỗi MA_VTHH:
     *   - Query tất cả phiếu nhập kho (TRAN_ID = 'NKHOPX') liên quan
     *   - Join VTHHPX_CT qua FR_KEY để lấy SO_LUONG
     *   - Nhóm theo MA_PBAN_NHAP → tổng SO_LUONG
     *   - Cộng tổng toàn bộ vào vatTu.soLuong
     *
     * Query theo từng batch MA_VTHH để tránh N+1 và vẫn dễ đọc.
     */
    private void loadPhieuXuatGroups(JdbcTemplate remote, String dbStr,
                                     Map<String, MigrationGroup> groupMap) {
        if (groupMap.isEmpty()) return;

        // Tạo danh sách MA_VTHH để dùng IN clause (batch toàn bộ 1 lần)
        List<String> allMaVthh = new ArrayList<>(groupMap.keySet());

        // Chia batch 500 để không vượt giới hạn IN clause của SQL Server (max ~2100 params)
        int batchSize = 500;
        for (int i = 0; i < allMaVthh.size(); i += batchSize) {
            List<String> batch = allMaVthh.subList(i, Math.min(i + batchSize, allMaVthh.size()));
            processBatchPhieuXuat(remote, dbStr, batch, groupMap);
        }
    }

    private void processBatchPhieuXuat(JdbcTemplate remote, String dbStr,
                                       List<String> maVthhBatch,
                                       Map<String, MigrationGroup> groupMap) {
        // Tạo placeholders cho IN clause
        String placeholders = String.join(",",
                Collections.nCopies(maVthhBatch.size(), "?"));

        // Join VTHHPX (phiếu) với VTHHPX_CT (chi tiết phiếu)
        // Lọc TRAN_ID = 'NKHOPX' để chỉ lấy phiếu nhập kho
        // Nhóm luôn theo MA_VTHH + MA_PBAN_NHAP để lấy tổng SO_LUONG
        String sql = String.format(
            "SELECT px.MA_VTHH, px_header.MA_PBAN_NHAP, SUM(px.SO_LUONG) AS TONG_SL " +
            "FROM [%s].dbo.VTHHPX_CT px " +
            "JOIN [%s].dbo.VTHHPX px_header ON px_header.PR_KEY = px.FR_KEY " +
            "WHERE px_header.TRAN_ID = 'NKHOPX' " +
            "  AND px.MA_VTHH IN (%s) " +
            "GROUP BY px.MA_VTHH, px_header.MA_PBAN_NHAP",
            dbStr, dbStr, placeholders
        );

        List<Map<String, Object>> rows = remote.queryForList(sql, maVthhBatch.toArray());

        for (Map<String, Object> row : rows) {
            String maVthh    = String.valueOf(row.get("MA_VTHH")).trim();
            String maPbanNhap = String.valueOf(row.get("MA_PBAN_NHAP")).trim();
            int tongSl = row.get("TONG_SL") != null
                    ? ((Number) row.get("TONG_SL")).intValue() : 0;

            MigrationGroup group = groupMap.get(maVthh);
            if (group == null) continue; // không nằm trong danh mục → bỏ qua

            // Nhóm key: dùng dấu | làm separator (MA_PBAN_NHAP không chứa |)
            String groupKey = maVthh + "|" + maPbanNhap;

            // Cộng dồn vào nhóm MA_VTHH + MA_PBAN_NHAP
            group.pbanNhapSoLuong.merge(groupKey, tongSl, Integer::sum);

            // Cộng dồn vào tổng số lượng của CCDCVatTu
            group.vatTu.setSoLuong(group.vatTu.getSoLuong() + tongSl);
        }
    }

    // ─── Bước 4: Ghi toàn bộ vào MySQL ───────────────────────────────────────
    private void persistToMySQL(Map<String, MigrationGroup> groupMap) {
        System.out.println("Đang ghi vào MySQL...");
        int successCount = 0;
        int errorCount   = 0;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);

        for (MigrationGroup g : groupMap.values()) {
            try {
                String maVthh = g.vatTu.getId();

                // 4a. Upsert CCDCVatTu (cha)
                ccdcVatTuDao.insert(g.vatTu);

                // 4b. Tạo ChiTietTaiSan: 1 bản ghi per MA_VTHH
                //     id = MA_VTHH + "_1", soLuong = tổng toàn bộ phòng ban
                String chiTietId = maVthh + "_1";
                ChiTietTaiSan chiTiet = new ChiTietTaiSan();
                chiTiet.setId(chiTietId);
                chiTiet.setSoKyHieu(chiTietId);
                chiTiet.setIdTaiSan(maVthh);
                chiTiet.setSoLuong(g.vatTu.getSoLuong()); // tổng đã cộng ở bước 3
                chiTietTaiSanDao.insert(chiTiet);

                // 4c. Tạo ChiTietDonViSoHuu: 1 bản ghi per nhóm MA_VTHH + MA_PBAN_NHAP
                for (Map.Entry<String, Integer> entry : g.pbanNhapSoLuong.entrySet()) {
                    // Parse lại key "MA_VTHH|MA_PBAN_NHAP"
                    String[] parts     = entry.getKey().split("\\|", 2);
                    String maPbanNhap  = parts.length > 1 ? parts[1] : "";
                    int    rawSl       = entry.getValue();

                    // --- Trừ số lượng đã bàn giao trong năm ---
                    int soLuongDaBanGiao = getSoLuongDaBanGiaoTrongNam(maVthh, maPbanNhap, chiTietId);
                    int soLuongThucTe = Math.max(0, rawSl - soLuongDaBanGiao);

                    ChiTietDonViSoHuu dvsh = new ChiTietDonViSoHuu();
                    dvsh.setIdCCDCVT(maVthh);
                    dvsh.setIdDonViSoHuu(maPbanNhap);
                    dvsh.setIdTsCon(chiTietId);    // trỏ về ChiTietTaiSan vừa tạo ở 4b
                    dvsh.setSoLuong(soLuongThucTe);
                    dvsh.setNgayTao(now);
                    dvsh.setNguoiTao("system");
                    chiTietDonViSoHuuDao.insert(dvsh);
                }

                // 4d. Tính tổng lại số lượng từ ChiTietDonViSoHuu (bao gồm các phòng ban nhận bàn giao)
                int totalSoLuong = getTongSoLuongTuDonViSoHuu(maVthh);
                if (totalSoLuong != g.vatTu.getSoLuong()) {
                     jdbcTemplate.update("UPDATE CCDCVatTu SET SoLuong = ? WHERE Id = ?", totalSoLuong, maVthh);
                     jdbcTemplate.update("UPDATE ChiTietTaiSan SET SoLuong = ? WHERE Id = ?", totalSoLuong, chiTietId);
                }

                successCount++;

            } catch (Exception ex) {
                errorCount++;
                System.err.println("  [LỖI] Vật tư " + g.vatTu.getId()
                        + ": " + ex.getMessage());
            }
        }

        System.out.println("  Thành công: " + successCount
                + " | Lỗi: " + errorCount + " mã vật tư.");
    }

    // ─── Utility ──────────────────────────────────────────────────────────────
    /** Chuyển Object → String, trả về "" nếu null */
    private String nvl(Object val) {
        return val != null ? String.valueOf(val).trim() : "";
    }

    private int getSoLuongDaBanGiaoTrongNam(String maVthh, String idDonViGiao, String idChiTietTaiSan) {
        String currentYearPrefix = java.time.Year.now().getValue() + "-%";
        String sql = "SELECT COALESCE(SUM(ct.SoLuong), 0) " +
                     "FROM ChiTietBanGiaoCCDCVatTu ct " +
                     "JOIN BanGiaoCCDCVatTu bg ON bg.Id = ct.IdBanGiaoCCDCVatTu " +
                     "WHERE bg.TrangThai = 3 " +
                     "  AND bg.IdDonViGiao = ? " +
                     "  AND ct.IdCCDCVatTu = ? " +
                     "  AND ct.IdChiTietCCDCVatTu = ? " +
                     "  AND bg.NgayBanGiao LIKE ?";
        try {
            Integer total = jdbcTemplate.queryForObject(sql, Integer.class, idDonViGiao, maVthh, idChiTietTaiSan, currentYearPrefix);
            return total != null ? total : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private int getTongSoLuongTuDonViSoHuu(String maVthh) {
        String sql = "SELECT COALESCE(SUM(SoLuong), 0) FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ?";
        try {
            Integer total = jdbcTemplate.queryForObject(sql, Integer.class, maVthh);
            return total != null ? total : 0;
        } catch (Exception e) {
            return 0;
        }
    }
}