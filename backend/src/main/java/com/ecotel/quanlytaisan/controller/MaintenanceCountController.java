package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceCountController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/share-counts")
    public ResponseEntity<ApiResponse<Object>> getShareCounts(@RequestParam("userid") String userid) {
        try {
            boolean isAdmin = "admin".equalsIgnoreCase(userid);
            String baseCondition = "(Share IS NULL OR Share = 0) AND (TrangThai IS NULL OR TrangThai NOT IN (2, 3))";
            String condition = isAdmin ? baseCondition : baseCondition + " AND NguoiTao = ?";
            Object[] args = isAdmin ? new Object[]{} : new Object[]{userid};

            Map<String, Long> counts = new HashMap<>();

            counts.put("totalPlan", countTable("kehoachsuachua", condition, args));
            counts.put("totalIncident", countTable("suco_thietbi", condition, args));
            counts.put("totalRepair", countTable("suachua", condition, args));
            counts.put("totalIncidentInspection", countTable("kiemtra_suco", condition, args));
            counts.put("totalMaterialAssessment", countTable("danhgia_vattu", condition, args));
            counts.put("totalInspectionMachine", countTable("giamdinh", condition, args));
            counts.put("totalInspectionVehicle", 0L);
            counts.put("totalMachineInspection", countTable("nghiemthu_maymoc", condition, args));
            counts.put("totalVehicleAcceptance", countTable("nghiemthu_phuongtien", condition, args));
            counts.put("totalMeasureMachine", countTable("bienphap_maymoc", condition, args));
            counts.put("totalMeasureVehicle", countTable("bienphap_phuongtien", condition, args));

            // Handover and Transfer
            long totalAssetTransfer = countTable("dieudongtaisan", condition, args);
            long totalToolTransfer = countTable("dieudongccdcvattu", condition, args);
            long totalAssetHandover = countTable("bangiaotaisan", condition, args);
            long totalToolHandover = countTable("bangiaoccdcvattu", condition, args);

            counts.put("totalAssetTransfer", totalAssetTransfer);
            counts.put("totalToolTransfer", totalToolTransfer);
            counts.put("totalAssetHandover", totalAssetHandover);
            counts.put("totalToolHandover", totalToolHandover);

            long totalShareRecord = counts.values().stream().mapToLong(Long::longValue).sum();
            // Subtract the handover and transfer counts to get the maintenance total
            long maintenanceTotal = totalShareRecord - totalAssetTransfer - totalToolTransfer - totalAssetHandover - totalToolHandover;
            
            counts.put("total", maintenanceTotal);

            return ResponseEntity.ok(ApiResponse.success("Lấy số lượng bản ghi có quyền share thành công", counts, 1));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    private long countTable(String tableName, String condition, Object[] args) {
        try {
            String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE " + condition;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, args);
            return count != null ? count.longValue() : 0L;
        } catch (Exception e) {
            System.err.println("Error counting table " + tableName + ": " + e.getMessage());
            return 0L;
        }
    }
}
