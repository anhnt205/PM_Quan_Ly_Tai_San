package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietDonViSoHuuDao;
import com.ecotel.quanlytaisan.dao.ChiTietTaiSanDao;
import com.ecotel.quanlytaisan.dao.DbConfigDao;
import com.ecotel.quanlytaisan.dao.NhomCCDCDAO;
import com.ecotel.quanlytaisan.dao.PhongBanDao;
import com.ecotel.quanlytaisan.model.PhongBan;
import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import com.ecotel.quanlytaisan.model.DbConfig;
import com.ecotel.quanlytaisan.model.NhomCCDC;
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

    @Autowired
    private NhomCCDCDAO nhomCCDCDAO;

    @Autowired
    private PhongBanDao phongBanDao;

    // ─── Wrapper gom nhóm dữ liệu cha–con trong quá trình migration ──────────
    /** Thông tin 1 phiếu nhập kho (1 bản ghi VTHHPX + VTHHPX_CT) */
    private static class PhieuNhap {
        String maPbanNhap;
        int    soLuong;
        String soChungTu;   // SO_CTU từ VTHHPX
        String ngayVaoSo;   // NGAY_VAO_SO từ VTHHPX → ngayTao của ChiTietDonViSoHuu

        PhieuNhap(String maPbanNhap, int soLuong, String soChungTu, String ngayVaoSo) {
            this.maPbanNhap = maPbanNhap;
            this.soLuong    = soLuong;
            this.soChungTu  = soChungTu;
            this.ngayVaoSo  = ngayVaoSo;
        }
    }

    private static class MigrationGroup {
        CCDCVatTu vatTu;
        // Danh sách từng phiếu nhập kho — không gộp — 1 phiếu = 1 ChiTietDonViSoHuu
        List<PhieuNhap> phieuNhapList = new ArrayList<>();

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

        // 3. Đồng bộ danh mục NhomCCDC từ DM_NHOM_VTHH
        loadAndSyncNhomVthh(remote, dbStr);

        // 3b. Đồng bộ danh mục PhongBan từ DM_DTHH (chỉ những đơn vị có trong MA_PBAN_NHAP)
        loadAndSyncPhongBan(remote, dbStr);

        // 4. Lấy danh sách vật tư (DM_VTHH + VTHH_CT)
        Map<String, MigrationGroup> groupMap = loadVatTuList(remote, dbStr);
        System.out.println("  Tổng số mã vật tư từ DM_VTHH: " + groupMap.size());

        // 5. Với mỗi vật tư, lấy phiếu xuất + chi tiết → nhóm theo MA_PBAN_NHAP
        loadPhieuXuatGroups(remote, dbStr, groupMap);

        // 6. Ghi vào MySQL
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
        // Đổi MA_NHOM_VTHH1 → MA_NHOM_VTHH để đúng cột và gán idNhomCCDC chính xác
        String sql = String.format(
            "SELECT dmvt.MA_VTHH, dmvt.TEN_VTHH, dmvt.MA_DVT, dmvt.MA_NHOM_VTHH, dmvt.PROPERTY1, " +
            "       (SELECT TOP 1 vc.GIA_GOC " +
            "        FROM [%s].dbo.VTHH_CT vc " +
            "        WHERE vc.MA_VTHH = dmvt.MA_VTHH AND vc.GIA_GOC IS NOT NULL AND vc.GIA_GOC > 0 " +
            "        ORDER BY vc.GIA_GOC DESC) AS GIA_GOC " +
            "FROM [%s].dbo.DM_VTHH dmvt " +
            "WHERE EXISTS (" +
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
            vatTu.setIdNhomCCDC(nvl(row.get("MA_NHOM_VTHH")));   // dùng MA_NHOM_VTHH thay MA_NHOM_VTHH1
            vatTu.setNuocSanXuat(nvl(row.get("PROPERTY1")));      // PROPERTY1 = nuớc sản xuất
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

    // ─── Bước mới: Đồng bộ danh mục nhóm từ DM_NHOM_VTHH ────────────────────
    /**
     * Query bảng DM_NHOM_VTHH trên remote để lấy (MA_NHOM_VTHH, TEN_NHOM_VTHH)
     * rồi upsert vào bảng NhomCCDC local (id = MA_NHOM_VTHH, ten = TEN_NHOM_VTHH).
     */
    private void loadAndSyncNhomVthh(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ danh mục NhomCCDC từ DM_NHOM_VTHH...");
        String sql = String.format(
            "SELECT MA_NHOM_VTHH, TEN_NHOM_VTHH FROM [%s].dbo.DM_NHOM_VTHH",
            dbStr
        );

        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_NHOM_VTHH: " + e.getMessage());
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        int count = 0;

        for (Map<String, Object> row : rows) {
            String maNhom = nvl(row.get("MA_NHOM_VTHH"));
            String tenNhom = nvl(row.get("TEN_NHOM_VTHH"));
            if (maNhom.isEmpty()) continue;

            NhomCCDC nhom = new NhomCCDC();
            nhom.setId(maNhom);
            nhom.setTen(tenNhom);
            nhom.setHieuLuc(true);
            nhom.setIdCongTy("ct001");
            nhom.setNgayTao(now);
            nhom.setNgayCapNhat(now);
            nhom.setNguoiTao("system");
            nhom.setNguoiCapNhat("system");

            try {
                nhomCCDCDAO.insert(nhom);  // insert() đã có logic check tồn tại → upsert
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert NhomCCDC id=" + maNhom + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " nhóm vật tư vào NhomCCDC.");
    }

    // ─── Bước 3b: Đồng bộ danh mục PhongBan từ DM_DTTH ───────────────────────
    /**
     * Query bảng DM_DTTH trên remote để lấy (MA_DTTH, TEN_DTTH),
     * chỉ lấy những MA_DTTH thực sự xuất hiện trong cột MA_PBAN_NHAP của bảng VTHHPX
     * (phiếu nhập kho TRAN_ID = 'NKHOPX'), rồi upsert vào bảng PhongBan local.
     */
    private void loadAndSyncPhongBan(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ danh mục PhongBan từ DM_DTTH (lọc theo MA_PBAN_NHAP)...");
        String sql = String.format(
            "SELECT d.MA_DTTH, d.TEN_DTTH " +
            "FROM [%s].dbo.DM_DTTH d " +
            "WHERE d.MA_DTTH IN (" +
            "    SELECT DISTINCT px.MA_PBAN_NHAP " +
            "    FROM [%s].dbo.VTHHPX px " +
            "    WHERE px.TRAN_ID = 'NKHOPX' " +
            "      AND px.MA_PBAN_NHAP IS NOT NULL " +
            "      AND px.MA_PBAN_NHAP <> ''" +
            ")",
            dbStr, dbStr
        );

        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_DTHH: " + e.getMessage());
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        int count = 0;

        for (Map<String, Object> row : rows) {
            String maDthh  = nvl(row.get("MA_DTTH"));
            String tenDthh = nvl(row.get("TEN_DTTH"));
            if (maDthh.isEmpty()) continue;

            PhongBan pb = new PhongBan();
            pb.setId(maDthh);
            pb.setTenPhongBan(tenDthh);
            pb.setIdCongTy("ct001");
            pb.setIsActive(true);
            pb.setNgayTao(now);
            pb.setNgayCapNhat(now);
            pb.setNguoiTao("system");
            pb.setNguoiCapNhat("system");

            try {
                phongBanDao.insert(pb);  // insert() đã có logic check tồn tại → upsert
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert PhongBan id=" + maDthh + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " phòng ban vào PhongBan.");
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
        String placeholders = String.join(",",
                Collections.nCopies(maVthhBatch.size(), "?"));

        // GROUP BY MA_VTHH + MA_PBAN_NHAP + SO_CTU để gom tất cả dòng cùng chứng từ
        // Dùng MIN(NGAY_VAO_SO) vì nhiều VTHHPX có cùng SO_CTU nhưng NGAY_VAO_SO có thể lệch milliseconds
        String sql = String.format(
            "SELECT px.MA_VTHH, px_h.MA_PBAN_NHAP, SUM(px.SO_LUONG) AS SO_LUONG, " +
            "       px_h.SO_CTU, MIN(px_h.NGAY_VAO_SO) AS NGAY_VAO_SO " +
            "FROM [%s].dbo.VTHHPX_CT px " +
            "JOIN [%s].dbo.VTHHPX px_h ON px_h.PR_KEY = px.FR_KEY " +
            "WHERE px_h.TRAN_ID = 'NKHOPX' " +
            "  AND px.MA_VTHH IN (%s) " +
            "GROUP BY px.MA_VTHH, px_h.MA_PBAN_NHAP, px_h.SO_CTU",
            dbStr, dbStr, placeholders
        );

        List<Map<String, Object>> rows = remote.queryForList(sql, maVthhBatch.toArray());

        for (Map<String, Object> row : rows) {
            String maVthh    = String.valueOf(row.get("MA_VTHH")).trim();
            String maPbanNhap = nvl(row.get("MA_PBAN_NHAP"));
            int sl = row.get("SO_LUONG") != null
                    ? ((Number) row.get("SO_LUONG")).intValue() : 0;
            String soChungTu = nvl(row.get("SO_CTU"));
            String ngayVaoSo = row.get("NGAY_VAO_SO") != null
                    ? row.get("NGAY_VAO_SO").toString() : null;

            MigrationGroup group = groupMap.get(maVthh);
            if (group == null) continue;

            // Thêm từng phiếu vào list (không gộp)
            group.phieuNhapList.add(new PhieuNhap(maPbanNhap, sl, soChungTu, ngayVaoSo));

            // Cộng dồn vào tổng SoLuong CCDCVatTu
            group.vatTu.setSoLuong(group.vatTu.getSoLuong() + sl);
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
                chiTiet.setNuocSanXuat(g.vatTu.getNuocSanXuat()); // PROPERTY1 từ DM_VTHH
                chiTietTaiSanDao.insert(chiTiet);

                // 4c. ChiTietDonViSoHuu: chỉ xóa record cũ (NULL SoChungTu), giữ record bàn giao
                jdbcTemplate.update(
                    "DELETE FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ? AND (SoChungTu IS NULL OR SoChungTu = '')",
                    maVthh
                );

                if (!g.phieuNhapList.isEmpty()) {
                    // Fetch 1 lần các SoChungTu đã tồn tại để tránh N × SELECT COUNT
                    Set<String> existingSct = new HashSet<>(
                        jdbcTemplate.queryForList(
                            "SELECT SoChungTu FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ? AND SoChungTu IS NOT NULL",
                            String.class, maVthh
                        )
                    );

                    List<Object[]> toInsert = new ArrayList<>();
                    List<Object[]> toUpdate = new ArrayList<>();

                    for (PhieuNhap phieu : g.phieuNhapList) {
                        String ngay = phieu.ngayVaoSo != null ? phieu.ngayVaoSo : now;
                        if (phieu.soChungTu != null && existingSct.contains(phieu.soChungTu)) {
                            // Cập nhật lại SoLuong của phiếu đã tồn tại
                            toUpdate.add(new Object[]{
                                phieu.soLuong, phieu.maPbanNhap, ngay, chiTietId,
                                phieu.soChungTu, maVthh
                            });
                        } else {
                            // Phiếu mới → insert
                            toInsert.add(new Object[]{
                                UUID.randomUUID().toString(),
                                maVthh, phieu.maPbanNhap, phieu.soLuong,
                                null, ngay, "system", chiTietId, phieu.soChungTu
                            });
                        }
                    }

                    if (!toInsert.isEmpty()) {
                        jdbcTemplate.batchUpdate(
                            "INSERT INTO ChiTietDonViSoHuu " +
                            "(Id, IdCCDCVT, IdDonViSoHuu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon, SoChungTu) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            toInsert
                        );
                    }
                    if (!toUpdate.isEmpty()) {
                        jdbcTemplate.batchUpdate(
                            "UPDATE ChiTietDonViSoHuu SET SoLuong = ?, IdDonViSoHuu = ?, NgayTao = ?, IdTsCon = ? " +
                            "WHERE SoChungTu = ? AND IdCCDCVT = ?",
                            toUpdate
                        );
                    }
                }

                // 4d. Tổng số lượng = tính luôn từ phieuNhapList (không SELECT lại DB)
                int totalSoLuong = g.phieuNhapList.stream()
                        .mapToInt(p -> p.soLuong)
                        .sum();
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