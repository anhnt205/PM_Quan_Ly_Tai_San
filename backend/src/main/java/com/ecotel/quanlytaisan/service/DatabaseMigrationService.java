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
    public void processVatTuMigration(String dbConfigId) {
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

        // Xác định ngày bắt đầu đồng bộ
        LocalDateTime fromDate = getLastSyncDate();
        if (fromDate != null) {
            System.out.println("  Incremental sync từ: " + fromDate);
        } else {
            System.out.println("  Full sync (lần đầu hoặc bảng rỗng).");
        }

        loadAndSyncNhomVthh(remote, dbStr);
        loadAndSyncPhongBan(remote, dbStr);
        loadAndSyncDonViTinh(remote, dbStr);

        // Truyền fromDate vào loadVatTuList
        Map<String, MigrationGroup> groupMap = loadVatTuList(remote, dbStr, fromDate);
        System.out.println("  Tổng số mã vật tư cần đồng bộ: " + groupMap.size());

        loadPhieuXuatGroups(remote, dbStr, groupMap, fromDate);
        persistToMySQL(groupMap);

        System.out.println("=== Đồng bộ hoàn tất: " + groupMap.size() + " mã vật tư ===");
    }

    // ─── Entry point cho Tài Sản ──────────────────────────────────────────────
    public void processTaiSanMigration(String dbConfigId) {
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

        System.out.println("=== Bắt đầu đồng bộ danh mục TÀI SẢN từ database: " + dbStr + " ===");

        // 2. Tạo JdbcTemplate trỏ tới remote MSSQL
        JdbcTemplate remote = buildRemoteJdbcTemplate(config, dbStr);

        // Đồng bộ các danh mục cho tài sản trước
        loadAndSyncDonViTinh(remote, dbStr);
        loadAndSyncHienTrangKyThuat(remote, dbStr);
        loadAndSyncNhomTaiSan(remote, dbStr);
        loadAndSyncLyDoTang(remote, dbStr);
        // loadAndSyncPhongBan(remote, dbStr);

        System.out.println("=== Đồng bộ các danh mục cho tài sản hoàn tất ===");
        loadAndSyncTaiSanMain(remote, dbStr);
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
    private Map<String, MigrationGroup> loadVatTuList(JdbcTemplate remote, String dbStr, LocalDateTime fromDate) {
       // Nếu có fromDate thì chỉ lấy MA_VTHH xuất hiện trong phiếu mới
        String dateFilter = fromDate != null
            ? "AND px_h.NGAY_VAO_SO >= '" + fromDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "' "
            : "";

        String sql = String.format(
            "SELECT dmvt.MA_VTHH, dmvt.TEN_VTHH, dmvt.MA_DVT,dmvt.MA_DVT1, dmvt.MA_NHOM_VTHH, dmvt.LOAI_VTHH, dmvt.PROPERTY1, " +
            "       (SELECT TOP 1 vc.GIA_GOC " +
            "        FROM [%s].dbo.VTHH_CT vc " +
            "        WHERE vc.MA_VTHH = dmvt.MA_VTHH AND vc.GIA_GOC IS NOT NULL AND vc.GIA_GOC > 0 " +
            "        ORDER BY vc.GIA_GOC DESC) AS GIA_GOC " +
            "FROM [%s].dbo.DM_VTHH dmvt",
            dbStr, dbStr
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
            // vatTu.setSoKyHieu(maVthh);
            vatTu.setTen(nvl(row.get("TEN_VTHH")));
            vatTu.setDonViTinh(nvl(row.get("MA_DVT")));
            vatTu.setDonViTinh2(nvl(row.get("MA_DVT1")));
            vatTu.setIdNhomCCDC(nvl(row.get("MA_NHOM_VTHH")));   // dùng MA_NHOM_VTHH thay MA_NHOM_VTHH1
            vatTu.setNuocSanXuat(nvl(row.get("PROPERTY1")));      // PROPERTY1 = nuớc sản xuất
            vatTu.setIdLoaiCCDCCon(nvl(row.get("LOAI_VTHH")));
            vatTu.setIdCongTy("ct001");
            vatTu.setIsActive(true);
            vatTu.setNgayTao(now);
            vatTu.setNgayCapNhat(now);
            vatTu.setSoLuong(0);          // sẽ cộng dồn ở bước 3
            vatTu.setGiaTri(giaGoc);
            vatTu.setHienTrang(null);

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
     * đồng bộ toàn bộ danh mục vào PhongBan local.
     * Nếu đã tồn tại, chỉ update tên phòng ban để giữ nguyên các field setup khác (IsKho, IdQuanLy...).
     */
    private void loadAndSyncPhongBan(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ toàn bộ danh mục PhongBan từ DM_DTTH...");
        String sql = String.format(
            "SELECT MA_DTTH, TEN_DTTH FROM [%s].dbo.DM_DTTH",
            dbStr
        );

        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_DTTH: " + e.getMessage());
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        int count = 0;

        for (Map<String, Object> row : rows) {
            String maDthh  = nvl(row.get("MA_DTTH"));
            String tenDthh = nvl(row.get("TEN_DTTH"));
            if (maDthh.isEmpty()) continue;

            // Bỏ qua một số mã phòng ban theo yêu cầu (bao gồm cả các mã có hậu tố, VD: 2293.1)
            if (java.util.Arrays.asList("00", "2293", "511", "711", "CDUB", "CTMT", "CTNH")
                    .stream().anyMatch(maDthh::startsWith)) {
                continue;
            }

            try {
                int exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM PhongBan WHERE Id = ?", Integer.class, maDthh);
                if (exists > 0) {
                    // Chỉ cập nhật tên phòng ban và timestamp, giữ nguyên các cấu hình khác
                    jdbcTemplate.update("UPDATE PhongBan SET TenPhongBan = ?, NgayCapNhat = ?, NguoiCapNhat = ? WHERE Id = ?", tenDthh, now, "system", maDthh);
                } else {
                    PhongBan pb = new PhongBan();
                    pb.setId(maDthh);
                    pb.setTenPhongBan(tenDthh);
                    pb.setIdCongTy("ct001");
                    pb.setIsActive(true);
                    pb.setNgayTao(now);
                    pb.setNgayCapNhat(now);
                    pb.setNguoiTao("system");
                    pb.setNguoiCapNhat("system");
                    
                    // Insert trực tiếp để tránh ghi đè các trường null
                    jdbcTemplate.update(
                        "INSERT INTO PhongBan (Id, TenPhongBan, IdCongTy, IsActive, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        pb.getId(), pb.getTenPhongBan(), pb.getIdCongTy(), pb.getIsActive(), pb.getNgayTao(), pb.getNgayCapNhat(), pb.getNguoiTao(), pb.getNguoiCapNhat()
                    );
                }
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert PhongBan id=" + maDthh + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " phòng ban vào PhongBan.");
    }

    // ─── Đồng bộ danh mục Đơn vị tính (DM_DVT) ──────────────────────────────
    private void loadAndSyncDonViTinh(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ danh mục DonViTinh từ DM_DVT...");
        String sql = String.format("SELECT MA_DVT, TEN_DVT FROM [%s].dbo.DM_DVT", dbStr);
        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_DVT: " + e.getMessage());
            return;
        }

        int count = 0;
        for (Map<String, Object> row : rows) {
            String ma = nvl(row.get("MA_DVT"));
            String ten = nvl(row.get("TEN_DVT"));
            if (ma.isEmpty()) continue;

            try {
                int exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM DonViTinh WHERE Id = ?", Integer.class, ma);
                if (exists > 0) {
                    jdbcTemplate.update("UPDATE DonViTinh SET TenDonVi = ? WHERE Id = ?", ten, ma);
                } else {
                    jdbcTemplate.update("INSERT INTO DonViTinh (Id, TenDonVi, Note, LaHeThong) VALUES (?, ?, ?, ?)", ma, ten, "", false);
                }
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert DonViTinh id=" + ma + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " đơn vị tính.");
    }

    // ─── Đồng bộ danh mục Hiện trạng kỹ thuật (DM_HIENTRANG / DM_HIEN_TRANG) ──
    private void loadAndSyncHienTrangKyThuat(JdbcTemplate remote, String dbStr) {
        String sql1 = String.format("SELECT MA_HIEN_TRANG, TEN_HIEN_TRANG FROM [%s].dbo.DM_HIENTRANG", dbStr);
        String sql2 = String.format("SELECT MA_HIEN_TRANG, TEN_HIEN_TRANG FROM [%s].dbo.DM_HIEN_TRANG", dbStr);
        
        List<Map<String, Object>> rows = null;
        try {
            rows = remote.queryForList(sql1);
            System.out.println("  Đồng bộ danh mục HienTrangKyThuat từ bảng DM_HIENTRANG...");
        } catch (Exception e) {
            try {
                rows = remote.queryForList(sql2);
                System.out.println("  Đồng bộ danh mục HienTrangKyThuat từ bảng DM_HIEN_TRANG...");
            } catch (Exception ex) {
                System.err.println("  [CẢNH BÁO] Không thể query DM_HIENTRANG hay DM_HIEN_TRANG: " + ex.getMessage());
                return;
            }
        }
        
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        int count = 0;

        for (Map<String, Object> row : rows) {
            String maStr = nvl(row.get("MA_HIEN_TRANG"));
            String ten = nvl(row.get("TEN_HIEN_TRANG"));
            if (maStr.isEmpty()) continue;
            
            try {
                int exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM HienTrangKyThuat WHERE Id = ?", Integer.class, maStr);
                if (exists > 0) {
                    jdbcTemplate.update("UPDATE HienTrangKyThuat SET TenHTKT = ?, NgayCapNhat = ?, NguoiCapNhat = ? WHERE Id = ?", ten, now, "system", maStr);
                } else {
                    jdbcTemplate.update("INSERT INTO HienTrangKyThuat (Id, TenHTKT, MoTa, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                            maStr, ten, "", now, now, "system", "system", true);
                }
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert HienTrangKyThuat id=" + maStr + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " hiện trạng kỹ thuật.");
    }

    // ─── Đồng bộ danh mục Nhóm tài sản (DM_NHOM_TSCD) ───────────────────────
    private void loadAndSyncNhomTaiSan(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ danh mục NhomTaiSan từ DM_NHOM_TSCD...");
        String sql = String.format("SELECT MA_NHOM_TSCD, TEN_NHOM_TSCD FROM [%s].dbo.DM_NHOM_TSCD", dbStr);
        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_NHOM_TSCD: " + e.getMessage());
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        int count = 0;

        for (Map<String, Object> row : rows) {
            String ma = nvl(row.get("MA_NHOM_TSCD"));
            String ten = nvl(row.get("TEN_NHOM_TSCD"));
            if (ma.isEmpty()) continue;

            try {
                int exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM NhomTaiSan WHERE Id = ?", Integer.class, ma);
                if (exists > 0) {
                    jdbcTemplate.update("UPDATE NhomTaiSan SET TenNhom = ?, NgayCapNhat = ?, NguoiCapNhat = ? WHERE Id = ?", ten, now, "system", ma);
                } else {
                    jdbcTemplate.update("INSERT INTO NhomTaiSan (Id, TenNhom, HieuLuc, IdCongTy, IdLyLich, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            ma, ten, true, "ct001", null, now, now, "system", "system", true);
                }
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert NhomTaiSan id=" + ma + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " nhóm tài sản.");
    }

    // ─── Đồng bộ danh mục Lý do tăng (DM_LYDO_TG) ───────────────────────────
    private void loadAndSyncLyDoTang(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ danh mục LyDoTang từ DM_LYDO_TG...");
        String sql = String.format("SELECT MA_LYDO_TG, TEN_LYDO_TG, TANG_GIAM FROM [%s].dbo.DM_LYDO_TG", dbStr);
        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query DM_LYDO_TG: " + e.getMessage());
            return;
        }

        int count = 0;
        for (Map<String, Object> row : rows) {
            String ma = nvl(row.get("MA_LYDO_TG"));
            String ten = nvl(row.get("TEN_LYDO_TG"));
            Integer tangGiam = parseInteger(row.get("TANG_GIAM"), 1);
            if (ma.isEmpty()) continue;

            try {
                int exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM LyDoTang WHERE Id = ?", Integer.class, ma);
                if (exists > 0) {
                    jdbcTemplate.update("UPDATE LyDoTang SET Ten = ?, TangGiam = ? WHERE Id = ?", ten, tangGiam, ma);
                } else {
                    jdbcTemplate.update("INSERT INTO LyDoTang (Id, Ten, TangGiam) VALUES (?, ?, ?)", ma, ten, tangGiam);
                }
                count++;
            } catch (Exception e) {
                System.err.println("  [LỖI] Không thể upsert LyDoTang id=" + ma + ": " + e.getMessage());
            }
        }
        System.out.println("  Đã đồng bộ " + count + " lý do tăng giảm.");
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
                                     Map<String, MigrationGroup> groupMap, LocalDateTime fromDate) {
        if (groupMap.isEmpty()) return;

        // Tạo danh sách MA_VTHH để dùng IN clause (batch toàn bộ 1 lần)
        List<String> allMaVthh = new ArrayList<>(groupMap.keySet());

        // Chia batch 500 để không vượt giới hạn IN clause của SQL Server (max ~2100 params)
        int batchSize = 500;
        for (int i = 0; i < allMaVthh.size(); i += batchSize) {
            List<String> batch = allMaVthh.subList(i, Math.min(i + batchSize, allMaVthh.size()));
            processBatchPhieuXuat(remote, dbStr, batch, groupMap,fromDate);
        }
    }

    private void processBatchPhieuXuat(JdbcTemplate remote, String dbStr,
                                   List<String> maVthhBatch,
                                   Map<String, MigrationGroup> groupMap,
                                   LocalDateTime fromDate) {
        String placeholders = String.join(",",
                Collections.nCopies(maVthhBatch.size(), "?"));

        String dateFilter = fromDate != null
                ? "AND px_h.NGAY_VAO_SO >= '" + fromDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "' "
                : "";

        String sql = String.format(
            "SELECT px.MA_VTHH, px_h.MA_PBAN_NHAP, SUM(px.SO_LUONG) AS SO_LUONG, " +
            "       px_h.SO_CTU, MIN(px_h.NGAY_VAO_SO) AS NGAY_VAO_SO " +
            "FROM [%s].dbo.VTHHPX_CT px " +
            "JOIN [%s].dbo.VTHHPX px_h ON px_h.PR_KEY = px.FR_KEY " +
            "WHERE px_h.TRAN_ID = 'NKHOPX' " +
            "  AND px.MA_VTHH IN (%s) " +
            dateFilter +  // <-- chỉ phiếu từ fromDate trở đi
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
        System.out.println("Đang ghi vào MySQL (Chế độ tối ưu Batch Processing)...");
        int successCount = 0, errorCount = 0;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);

        List<String> allIds = new ArrayList<>(groupMap.keySet());
        int batchSize = 1000;

        // Map<maVthh, Map<soChungTu, soLuongDaBanGiao>>
        Map<String, Map<String, Integer>> existingMap = new HashMap<>();
        Set<String> existingCcdcIds = new HashSet<>();
        Set<String> existingChiTietTaiSanIds = new HashSet<>();

        if (!allIds.isEmpty()) {
            for (int i = 0; i < allIds.size(); i += batchSize) {
                List<String> chunk = allIds.subList(i, Math.min(i + batchSize, allIds.size()));
                String inClause = String.join(",", Collections.nCopies(chunk.size(), "?"));
                
                jdbcTemplate.query(
                    "SELECT IdCCDCVT, SoChungTu, COALESCE(SoLuongDaBanGiao, 0) AS SoLuongDaBanGiao " +
                    "FROM ChiTietDonViSoHuu " +
                    "WHERE IdCCDCVT IN (" + inClause + ") AND SoChungTu IS NOT NULL",
                    chunk.toArray(),
                    rs -> {
                        existingMap
                            .computeIfAbsent(rs.getString("IdCCDCVT"), k -> new HashMap<>())
                            .put(rs.getString("SoChungTu"), rs.getInt("SoLuongDaBanGiao"));
                    }
                );

                jdbcTemplate.query(
                    "SELECT Id FROM CCDCVatTu WHERE Id IN (" + inClause + ")",
                    chunk.toArray(),
                    rs -> {
                        existingCcdcIds.add(rs.getString("Id"));
                    }
                );

                jdbcTemplate.query(
                    "SELECT Id FROM ChiTietTaiSan WHERE IdTaiSan IN (" + inClause + ")",
                    chunk.toArray(),
                    rs -> {
                        existingChiTietTaiSanIds.add(rs.getString("Id"));
                    }
                );
            }
        }

        List<Object[]> ccdcInsertBatch = new ArrayList<>();
        List<Object[]> ccdcUpdateBatch = new ArrayList<>();
        
        List<Object[]> chiTietInsertBatch = new ArrayList<>();
        List<Object[]> chiTietUpdateBatch = new ArrayList<>();

        List<Object[]> donViInsertBatch = new ArrayList<>();
        List<Object[]> donViUpdateBatch = new ArrayList<>();

        for (MigrationGroup g : groupMap.values()) {
            try {
                CCDCVatTu vatTu = g.vatTu;
                String maVthh = vatTu.getId();
                String chiTietId = maVthh + "_1";
                
                // 1. CCDCVatTu
                if (existingCcdcIds.contains(maVthh)) {
                    ccdcUpdateBatch.add(new Object[]{
                        vatTu.getIdDonVi(), vatTu.getTen(), vatTu.getNgayNhap(), vatTu.getDonViTinh(),
                        vatTu.getSoLuong(), vatTu.getGiaTri(), vatTu.getSoKyHieu(), vatTu.getKyHieu(),
                        vatTu.getCongSuat(), vatTu.getNuocSanXuat(), vatTu.getNamSanXuat(), vatTu.getGhiChu(),
                        vatTu.getIdCongTy(), vatTu.getNgayTao(), vatTu.getNgayCapNhat(), vatTu.getNguoiTao(),
                        vatTu.getNguoiCapNhat(), vatTu.getIsActive(), vatTu.getIdNhomCCDC(), vatTu.getIdLoaiCCDCCon(),
                        vatTu.getHienTrang(), vatTu.getDonViTinh2(), vatTu.getSoLuong2(), maVthh
                    });
                } else {
                    ccdcInsertBatch.add(new Object[]{
                        vatTu.getId(), vatTu.getIdDonVi(), vatTu.getTen(), vatTu.getNgayNhap(), vatTu.getDonViTinh(),
                        vatTu.getSoLuong(), vatTu.getGiaTri(), vatTu.getSoKyHieu(), vatTu.getKyHieu(),
                        vatTu.getCongSuat(), vatTu.getNuocSanXuat(), vatTu.getNamSanXuat(), vatTu.getGhiChu(),
                        vatTu.getIdCongTy(), vatTu.getNgayTao(), vatTu.getNgayCapNhat(), vatTu.getNguoiTao(),
                        vatTu.getNguoiCapNhat(), vatTu.getIsActive(), vatTu.getIdNhomCCDC(), vatTu.getIdLoaiCCDCCon(),
                        vatTu.getHienTrang(), vatTu.getDonViTinh2(), vatTu.getSoLuong2()
                    });
                }

                // 2. ChiTietTaiSan
                if (existingChiTietTaiSanIds.contains(chiTietId)) {
                    chiTietUpdateBatch.add(new Object[]{
                        maVthh, null, null, vatTu.getSoKyHieu(), 
                        vatTu.getCongSuat(), vatTu.getNuocSanXuat(), vatTu.getNamSanXuat(), vatTu.getSoLuong(),
                        chiTietId
                    });
                } else {
                    chiTietInsertBatch.add(new Object[]{
                        chiTietId, maVthh, null, null, vatTu.getSoKyHieu(), vatTu.getCongSuat(), 
                        vatTu.getNuocSanXuat(), vatTu.getNamSanXuat(), vatTu.getSoLuong()
                    });
                }

                // 3. Delete old donvisoHuu (no SoChungTu) (đã được gom lại thực thi riêng)

                // 4. ChiTietDonViSoHuu
                Map<String, Integer> existingSctMap = existingMap.getOrDefault(maVthh, Collections.emptyMap());
                
                for (PhieuNhap phieu : g.phieuNhapList) {
                    String ngay = phieu.ngayVaoSo != null ? phieu.ngayVaoSo : now;

                    if (phieu.soChungTu != null && existingSctMap.containsKey(phieu.soChungTu)) {
                        int daBanGiao = existingSctMap.get(phieu.soChungTu);
                        int effectiveSl = Math.max(0, phieu.soLuong - daBanGiao);
                        
                        donViUpdateBatch.add(new Object[]{
                            effectiveSl, phieu.maPbanNhap, ngay, chiTietId,
                            phieu.soChungTu, maVthh
                        });
                    } else {
                        donViInsertBatch.add(new Object[]{
                            UUID.randomUUID().toString(), maVthh, phieu.maPbanNhap, phieu.soLuong,
                            null, ngay, "system", chiTietId, phieu.soChungTu
                        });
                    }
                }

                // Đã gỡ cập nhật tổng bằng batch lẻ, thay bằng 1 câu update duy nhất ở cuối hàm

                successCount++;
            } catch (Exception ex) {
                errorCount++;
                System.err.println("  [LỖI] Xử lý batch chuẩn bị cho vật tư " + g.vatTu.getId() + ": " + ex.getMessage());
            }
        }

        // Execute queries
        System.out.println("  Thực thi batch delete ChiTietDonViSoHuu cũ...");
        if (!allIds.isEmpty()) {
            for (int i = 0; i < allIds.size(); i += batchSize) {
                List<String> chunk = allIds.subList(i, Math.min(i + batchSize, allIds.size()));
                String inClause = String.join(",", Collections.nCopies(chunk.size(), "?"));
                jdbcTemplate.update("DELETE FROM ChiTietDonViSoHuu WHERE (SoChungTu IS NULL OR SoChungTu = '') AND IdCCDCVT IN (" + inClause + ")", chunk.toArray());
            }
        }

        System.out.println("  Thực thi batch insert/update CCDCVatTu...");
        executeBatchWithChunks("INSERT INTO CCDCVatTu (Id, IdDonVi, Ten, NgayNhap, DonVitinh, SoLuong, GiaTri, SoKyHieu, KyHieu, CongSuat, NuocSanXuat, NamSanXuat, GhiChu, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IdNhomCCDC, IdLoaiCCDCCon, HienTrang, DonViTinh2, SoLuong2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ccdcInsertBatch);
        executeBatchWithChunks("UPDATE CCDCVatTu SET IdDonVi=?, Ten=?, NgayNhap=?, DonVitinh=?, SoLuong=?, GiaTri=?, SoKyHieu=?, KyHieu=?, CongSuat=?, NuocSanXuat=?, NamSanXuat=?, GhiChu=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, IdNhomCCDC=?, IdLoaiCCDCCon=?, HienTrang=?, DonViTinh2=?, SoLuong2=? WHERE Id=?", ccdcUpdateBatch);

        System.out.println("  Thực thi batch insert/update ChiTietTaiSan...");
        executeBatchWithChunks("INSERT INTO ChiTietTaiSan (Id, IdTaiSan, NgayVaoSo, NgaySuDung, SoKyHieu, CongSuat, NuocSanXuat, NamSanXuat, SoLuong) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", chiTietInsertBatch);
        executeBatchWithChunks("UPDATE ChiTietTaiSan SET IdTaiSan=?, NgayVaoSo=?, NgaySuDung=?, SoKyHieu=?, CongSuat=?, NuocSanXuat=?, NamSanXuat=?, SoLuong=? WHERE Id=?", chiTietUpdateBatch);

        System.out.println("  Thực thi batch insert/update ChiTietDonViSoHuu...");
        executeBatchWithChunks("INSERT INTO ChiTietDonViSoHuu (Id, IdCCDCVT, IdDonViSoHuu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon, SoChungTu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", donViInsertBatch);
        executeBatchWithChunks("UPDATE ChiTietDonViSoHuu SET SoLuong = ?, IdDonViSoHuu = ?, NgayTao = ?, IdTsCon = ? WHERE SoChungTu = ? AND IdCCDCVT = ?", donViUpdateBatch);

        System.out.println("  Cập nhật tổng số lượng cho CCDCVatTu và ChiTietTaiSan...");
        jdbcTemplate.update("UPDATE CCDCVatTu c " +
                "LEFT JOIN (SELECT IdCCDCVT, COALESCE(SUM(SoLuong), 0) as total FROM ChiTietDonViSoHuu GROUP BY IdCCDCVT) t ON c.Id = t.IdCCDCVT " +
                "SET c.SoLuong = COALESCE(t.total, 0)");
        
        jdbcTemplate.update("UPDATE ChiTietTaiSan c " +
                "LEFT JOIN (SELECT IdCCDCVT, COALESCE(SUM(SoLuong), 0) as total FROM ChiTietDonViSoHuu GROUP BY IdCCDCVT) t ON c.IdTaiSan = t.IdCCDCVT " +
                "SET c.SoLuong = COALESCE(t.total, 0)");

        System.out.println("  Thành công: " + successCount + " | Lỗi: " + errorCount + " mã vật tư.");
    }

    private void executeBatchWithChunks(String sql, List<Object[]> batchArgs) {
        if (batchArgs.isEmpty()) return;
        int chunkSize = 1000;
        for (int i = 0; i < batchArgs.size(); i += chunkSize) {
            List<Object[]> chunk = batchArgs.subList(i, Math.min(i + chunkSize, batchArgs.size()));
            try {
                jdbcTemplate.batchUpdate(sql, chunk);
            } catch (Exception e) {
                System.err.println("  [LỖI] Batch chunk thất bại, đang chuyển sang chạy từng dòng để bảo toàn dữ liệu hợp lệ...");
                for (Object[] args : chunk) {
                    try {
                        jdbcTemplate.update(sql, args);
                    } catch (Exception ex) {
                        System.err.println("    [BỎ QUA] Lỗi dòng: " + ex.getMessage());
                    }
                }
            }
        }
    }

    // ─── Đồng bộ dữ liệu Tài sản chính (TS) ──────────────────────────────────
    private void loadAndSyncTaiSanMain(JdbcTemplate remote, String dbStr) {
        System.out.println("  Đồng bộ dữ liệu Tài sản từ bảng TS và TS_GIATRI...");
        String sql = String.format(
            "SELECT " +
            "ts.SO_THE, ts.MA_TS, ts.TEN_TS, ts.MA_NHOM_TSCD, ts.MA_LYDO_TANG, " +
            "ts.MA_KY_HIEU, ts.SO_KY_HIEU, ts.NUOC_SX, ts.NAM_SX, ts.MA_DVT, " +
            "ts.MA_HIEN_TRANG, ts.NGAY_VAO_SO, ts.NGAY_SD, " +
            "(SELECT TOP 1 NGUYEN_GIA FROM [%s].dbo.TS_GIATRI WHERE FR_KEY = ts.PR_KEY) AS NGUYEN_GIA " +
            "FROM [%s].dbo.TS ts",
            dbStr, dbStr
        );

        List<Map<String, Object>> rows;
        try {
            rows = remote.queryForList(sql);
            System.out.println("  -> Đã truy vấn được " + rows.size() + " dòng từ bảng TS.");
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không thể query dữ liệu TS: " + e.getMessage());
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(fmt);
        
        List<Object[]> insertBatch = new ArrayList<>();
        List<Object[]> updateBatch = new ArrayList<>();
        
        // Lấy danh sách các Id tài sản hiện có để chia ra insert/update
        List<String> existingIds = jdbcTemplate.queryForList("SELECT Id FROM TaiSan", String.class);
        Set<String> existingIdSet = new HashSet<>(existingIds);

        // Tập hợp để theo dõi các MA_TS đã xử lý trong lô dữ liệu hiện tại (loại bỏ trùng lặp)
        Set<String> processedIds = new HashSet<>();
        int emptyIdCount = 0;

        for (Map<String, Object> row : rows) {
            String id = nvl(row.get("SO_THE"));
            if (id.isEmpty()) {
                emptyIdCount++;
                continue;
            }
            
            if (!processedIds.add(id)) {
                System.out.println("  [BỎ QUA] Phát hiện dữ liệu trùng lặp SO_THE: " + id);
                continue;
            }
            
            String soThe = nvl(row.get("SO_THE"));
            String tenTaiSan = nvl(row.get("TEN_TS"));
            String idNhomTaiSan = nvl(row.get("MA_NHOM_TSCD"));
            String lyDoTang = nvl(row.get("MA_LYDO_TANG"));
            String kyHieu = nvl(row.get("MA_KY_HIEU"));
            String soKyHieu = nvl(row.get("SO_KY_HIEU"));
            String nuocSanXuat = nvl(row.get("NUOC_SX"));
            Integer namSanXuat = parseInteger(row.get("NAM_SX"), null);
            String donViTinh = nvl(row.get("MA_DVT"));
            String hienTrang = nvl(row.get("MA_HIEN_TRANG"));
            
            // Format dates (lấy chuỗi, cắt 10 ký tự)
            String rawNgayVaoSo = nvl(row.get("NGAY_VAO_SO"));
            String ngayVaoSo = rawNgayVaoSo.length() >= 10 ? rawNgayVaoSo.substring(0, 10) : rawNgayVaoSo;
            
            String rawNgaySuDung = nvl(row.get("NGAY_SD"));
            String ngaySuDung = rawNgaySuDung.length() >= 10 ? rawNgaySuDung.substring(0, 10) : rawNgaySuDung;
            
            Double nguyenGia = row.get("NGUYEN_GIA") != null ? ((Number) row.get("NGUYEN_GIA")).doubleValue() : null;
            Integer soLuong = 1;
            String idDonViBanDau = "K30";
            
            if (existingIdSet.contains(id)) {
                // Update
                updateBatch.add(new Object[]{
                    soThe, tenTaiSan, idNhomTaiSan, lyDoTang, kyHieu, soKyHieu, 
                    nuocSanXuat, namSanXuat, donViTinh, hienTrang, ngayVaoSo, 
                    ngaySuDung, nguyenGia, now, "system", id
                });
            } else {
                // Insert
                insertBatch.add(new Object[]{
                    id, soThe, tenTaiSan, idNhomTaiSan, lyDoTang, kyHieu, soKyHieu,
                    nuocSanXuat, namSanXuat, donViTinh, hienTrang, ngayVaoSo,
                    ngaySuDung, nguyenGia, soLuong, idDonViBanDau, "ct001",
                    true, now, now, "system", "system"
                });
            }
        }

        System.out.println("  Bắt đầu batch insert/update dữ liệu TaiSan...");
        
        String insertSql = "INSERT INTO TaiSan (Id, SoThe, TenTaiSan, IdNhomTaiSan, LyDoTang, KyHieu, SoKyHieu, NuocSanXuat, NamSanXuat, DonViTinh, HienTrang, NgayVaoSo, NgaySuDung, NguyenGia, SoLuong, IdDonViBanDau, IdCongTy, IsActive, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        executeBatchWithChunks(insertSql, insertBatch);
        
        String updateSql = "UPDATE TaiSan SET SoThe=?, TenTaiSan=?, IdNhomTaiSan=?, LyDoTang=?, KyHieu=?, SoKyHieu=?, NuocSanXuat=?, NamSanXuat=?, DonViTinh=?, HienTrang=?, NgayVaoSo=?, NgaySuDung=?, NguyenGia=?, NgayCapNhat=?, NguoiCapNhat=? WHERE Id=?";
        executeBatchWithChunks(updateSql, updateBatch);
        
        System.out.println("  Đã hoàn tất đồng bộ TaiSan (Insert: " + insertBatch.size() + ", Update: " + updateBatch.size() + ").");
        if (emptyIdCount > 0) {
            System.err.println("  [CẢNH BÁO] Có " + emptyIdCount + " tài sản bị bỏ qua vì trường SO_THE trống (null hoặc chuỗi rỗng)!");
        }
    }

    // ─── Utility ──────────────────────────────────────────────────────────────
    /** Chuyển Object → String, trả về "" nếu null */
    private String nvl(Object val) {
        return val != null ? String.valueOf(val).trim() : "";
    }
    private LocalDateTime getLastSyncDate() {
        String sql = "SELECT MAX(NgayTao) FROM ChiTietDonViSoHuu WHERE NgayTao IS NOT NULL";
        try {
            String maxDate = jdbcTemplate.queryForObject(sql, String.class);
            if (maxDate == null || maxDate.isBlank()) return null;
            // Trim về 19 ký tự để parse an toàn dù format có milliseconds
            String normalized = maxDate.substring(0, 19).replace(" ", "T");
            LocalDateTime latest = LocalDateTime.parse(normalized,
                    DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            // Trừ 1 ngày làm buffer an toàn
            return latest.minusDays(1);
        } catch (Exception e) {
            System.err.println("  [CẢNH BÁO] Không lấy được MaxNgayTao, sẽ full sync: " + e.getMessage());
            return null; // null = full sync toàn bộ lịch sử
        }
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

    private Integer parseInteger(Object obj, Integer defaultValue) {
        if (obj == null) return defaultValue;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try {
            return Integer.parseInt(obj.toString().trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}