package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietTaiSanDao;
import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DatabaseMigrationService {

    @Autowired
    @Qualifier("sqlServerJdbcTemplate")
    private JdbcTemplate sqlServerJdbcTemplate;

    @Autowired
    private CCDCVatTuDao ccdcVatTuDao;

    @Autowired
    private ChiTietTaiSanDao chiTietTaiSanDao;

    // TẠO CLASS TẠM (WRAPPER) ĐỂ KHÔNG PHẢI SỬA MODEL CCDCVatTu
    private static class MigrationGroup {
        CCDCVatTu parent;
        List<ChiTietTaiSan> children = new ArrayList<>();

        public MigrationGroup(CCDCVatTu parent) {
            this.parent = parent;
        }
    }

    public void processMigration(String bakFilePath) {
        try {
            String dbTarget = "ESOFTINV_2026";

            boolean isRestored = restoreDatabase(bakFilePath, dbTarget);
            if (!isRestored) {
                // Nếu Restore xịt thì ném lỗi dừng luôn, không chạy xuống dưới nữa
                throw new RuntimeException("Lỗi: Quá trình Restore thất bại. Không thể đồng bộ!");
            }

            System.out.println("--- Bắt đầu quy trình gom nhóm Cha-Con & Upsert ---");

            String queryDataSql = String.format(
                "SELECT ct.MA_VTHH, dm.MA_VTHH1, dm.TEN_VTHH, dm.MA_DVT, h.MA_KHO_NHAP, " +
                "h.NGAY_VAO_SO, h.DIEN_GIAI, dm.MA_NHOM_VTHH, dm.LOAI_VTHH, " +
                "ct.SO_LUONG, ct.TONG_TIEN, ct.LOT_SERIAL, dm.PROPERTY1, dm.PROPERTY2 " +
                "FROM [%s].dbo.VTHH_CT ct " +
                "JOIN [%s].dbo.VTHH h ON ct.PR_KEY = h.PR_KEY " + 
                "JOIN [%s].dbo.DM_VTHH dm ON ct.MA_VTHH = dm.MA_VTHH",
                dbTarget, dbTarget, dbTarget
            );

            List<Map<String, Object>> rows = sqlServerJdbcTemplate.queryForList(queryDataSql);
            
            // DÙNG WRAPPER Ở ĐÂY
            Map<String, MigrationGroup> groupMap = new LinkedHashMap<>(); 
            DateTimeFormatter isoFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

            for (Map<String, Object> row : rows) {
                String maHeThong = String.valueOf(row.get("MA_VTHH"));
                String maDep = (row.get("MA_VTHH1") != null && !row.get("MA_VTHH1").toString().trim().isEmpty()) 
                               ? row.get("MA_VTHH1").toString().trim() 
                               : maHeThong;

                // Lấy group ra hoặc tạo mới nếu chưa có
                MigrationGroup group = groupMap.get(maDep);
                
                if (group == null) {
                    CCDCVatTu parent = new CCDCVatTu();
                    parent.setId(maDep); 
                    parent.setSoKyHieu(maDep);
                    parent.setTen(String.valueOf(row.get("TEN_VTHH")));
                    parent.setDonViTinh(String.valueOf(row.get("MA_DVT")));
                    parent.setIdNhomCCDC(String.valueOf(row.get("MA_NHOM_VTHH")));
                    parent.setIdDonVi(String.valueOf(row.get("MA_KHO_NHAP")));
                    parent.setGhiChu(String.valueOf(row.get("DIEN_GIAI")));
                    parent.setIdLoaiCCDCCon(String.valueOf(row.get("LOAI_VTHH")));
                    parent.setIdCongTy("ct001");
                    parent.setIsActive(true);
                    parent.setNgayTao(LocalDateTime.now().format(isoFormatter));
                    parent.setNgayCapNhat(LocalDateTime.now().format(isoFormatter));
                    parent.setSoLuong(0);
                    parent.setGiaTri(0.0);
                    parent.setHienTrang(0);
                    
                    group = new MigrationGroup(parent);
                    groupMap.put(maDep, group);
                }

                // Tạo đối tượng Con
                ChiTietTaiSan child = new ChiTietTaiSan();
                int stt = group.children.size() + 1;
                child.setId(maDep + "_" + stt); 
                
                child.setIdTaiSan(maDep);
                child.setSoKyHieu(String.valueOf(row.get("LOT_SERIAL")));
                child.setNuocSanXuat(String.valueOf(row.get("PROPERTY1")));
                child.setCongSuat(String.valueOf(row.get("PROPERTY2")));
                
                int slCon = row.get("SO_LUONG") != null ? ((Number) row.get("SO_LUONG")).intValue() : 0;
                double gtCon = row.get("TONG_TIEN") != null ? ((Number) row.get("TONG_TIEN")).doubleValue() : 0.0;
                
                child.setSoLuong(slCon);
                if (row.get("NGAY_VAO_SO") != null) {
                    child.setNgayVaoSo(row.get("NGAY_VAO_SO").toString());
                    child.setNgaySuDung(row.get("NGAY_VAO_SO").toString());
                }

                // Nhét con vào balo và cộng dồn số lượng cho cha
                group.children.add(child);
                group.parent.setSoLuong(group.parent.getSoLuong() + slCon);
                group.parent.setGiaTri(group.parent.getGiaTri() + gtCon);
            }

            // 3. Đổ dữ liệu vào MySQL
            System.out.println("Đang lưu dữ liệu vào MySQL...");
            int parentCount = 0;
            for (MigrationGroup g : groupMap.values()) {
                try {
                    // Lưu Cha
                    ccdcVatTuDao.insert(g.parent); 
                    
                    // Dọn dẹp con cũ (đảm bảo không bị rác khi update)
                    chiTietTaiSanDao.delete(g.parent.getId()); 
                    
                    // Lưu danh sách Con
                    for (ChiTietTaiSan child : g.children) {
                        chiTietTaiSanDao.insert(child); 
                    }
                    parentCount++;
                } catch (Exception ex) {
                    System.err.println("Lỗi lưu vật tư " + g.parent.getId() + ": " + ex.getMessage());
                }
            }

            System.out.println("--- THÀNH CÔNG: Đã đồng bộ " + parentCount + " loại vật tư Cha ---");

        } catch (Exception e) {
            System.err.println("Lỗi hệ thống trong quá trình migration: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean restoreDatabase(String bakFilePath, String targetDbName) {
        System.out.println("--- BƯỚC 1: Đọc Logical Names từ file .bak ---");
        String logicalDataName = "";
        String logicalLogName = "";

        try {
            // Lệnh lấy danh sách file bên trong .bak
            String fileListCmd = String.format("RESTORE FILELISTONLY FROM DISK = N'%s'", bakFilePath);
            ProcessBuilder pbFileList = new ProcessBuilder(
                "sqlcmd", "-S", "DESKTOP-CHU10SD\\MSSQLSERVER01", "-E", "-W", "-Q", fileListCmd
            );
            pbFileList.redirectErrorStream(true);
            Process procFileList = pbFileList.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(procFileList.getInputStream(), "UTF-8"));
            String line;
            
            // Đọc kết quả bảng từ sqlcmd để trích xuất LogicalName
            // Bỏ qua 2 dòng header của sqlcmd (LogicalName, PhysicalName...)
            boolean isDataStarted = false; 
            while ((line = reader.readLine()) != null) {
                if (line.contains("LogicalName")) {
                    isDataStarted = true;
                    reader.readLine(); // Bỏ qua dòng kẻ gạch "------------"
                    continue;
                }
                
                if (isDataStarted && !line.trim().isEmpty() && !line.contains("rows affected")) {
                    // Cắt chuỗi theo khoảng trắng. Cột đầu tiên là LogicalName, cột thứ hai là Type (D=Data, L=Log)
                    String[] columns = line.trim().split("\\s+");
                    if (columns.length >= 2) {
                        String name = columns[0];
                        String type = columns[1];
                        
                        if (type.equals("D")) {
                            logicalDataName = name;
                        } else if (type.equals("L")) {
                            logicalLogName = name;
                        }
                    }
                }
            }
            procFileList.waitFor();

            if (logicalDataName.isEmpty() || logicalLogName.isEmpty()) {
                System.err.println("Lỗi: Không thể trích xuất Logical Name từ file .bak!");
                return false;
            }
            
            System.out.println("-> Tìm thấy Data Name: " + logicalDataName);
            System.out.println("-> Tìm thấy Log Name: " + logicalLogName);

            System.out.println("--- BƯỚC 2: Bắt đầu Restore với MOVE ---");
            String dataFolder = "C:\\SQLData\\";
            java.io.File dir = new java.io.File(dataFolder);
            if (!dir.exists()) dir.mkdirs();

            // Lắp LogicalName vừa tìm được vào lệnh Restore
            String sqlCommand = String.format(
                "RESTORE DATABASE [%s] FROM DISK = N'%s' WITH REPLACE, RECOVERY, " +
                "MOVE N'%s' TO N'%s%s.mdf', " +
                "MOVE N'%s' TO N'%s%s_log.ldf';",
                targetDbName, bakFilePath, 
                logicalDataName, dataFolder, targetDbName,
                logicalLogName, dataFolder, targetDbName
            );

            ProcessBuilder pbRestore = new ProcessBuilder(
                "sqlcmd", "-S", "DESKTOP-CHU10SD\\MSSQLSERVER01", "-E", "-Q", sqlCommand
            );
            pbRestore.redirectErrorStream(true);
            Process procRestore = pbRestore.start();

            BufferedReader resReader = new BufferedReader(new InputStreamReader(procRestore.getInputStream(), "UTF-8"));
            while ((line = resReader.readLine()) != null) {
                System.out.println("SQLCMD: " + line);
            }

            int exitCode = procRestore.waitFor();
            if (exitCode == 0) {
                System.out.println("--- RESTORE THÀNH CÔNG! ---");
                Thread.sleep(3000); 
                return true;
            } else {
                System.err.println("--- LỖI RESTORE ---");
                return false;
            }

        } catch (Exception e) {
            System.err.println("Lỗi hệ thống khi Restore: " + e.getMessage());
            return false;
        }
    }
}