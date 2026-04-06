package com.ecotel.quanlytaisan.scheduler;

import com.ecotel.quanlytaisan.dao.DbConfigDao;
import com.ecotel.quanlytaisan.model.DbConfig;
import com.ecotel.quanlytaisan.service.DatabaseMigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.ZoneId;

@Component
@EnableScheduling
public class DatabaseSyncScheduler {

    @Autowired
    private DbConfigDao dbConfigDao;

    @Autowired
    private DatabaseMigrationService databaseMigrationService;

    // Chạy ngầm định kỳ mỗi phút để kiểm tra cấu hình đồng bộ
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh")
    public void executeDatabaseSync() {
        DbConfig defaultDb = dbConfigDao.findDefault();
        if (defaultDb == null) return;

        LocalTime now = LocalTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        String syncTime = defaultDb.getSyncTime();
        Integer intervalHours = defaultDb.getSyncIntervalHours();

        boolean shouldSync = false;

        // 1. Ưu tiên kiểm tra theo thời điểm cụ thể (syncTime)
        if (syncTime != null && !syncTime.isEmpty()) {
            // syncTime có định dạng HH:mm:ss hoặc HH:mm
            String currentTimeStr = now.format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));
            if (syncTime.startsWith(currentTimeStr)) {
                shouldSync = true;
                System.out.println("Scheduled Sync [Time Match]: " + currentTimeStr);
            }
        } 
        // 2. Nếu không có syncTime, fallback về intervalHours (chỉ chạy vào phút thứ 0)
        else if (intervalHours != null && intervalHours > 0 && now.getMinute() == 0) {
            if (now.getHour() % intervalHours == 0) {
                shouldSync = true;
                System.out.println("Scheduled Sync [Interval Match]: hour=" + now.getHour() + ", interval=" + intervalHours);
            }
        }

        if (shouldSync) {
            try {
                databaseMigrationService.processMigration(defaultDb.getId());
                System.out.println("Sync Background Job executed successfully at " + now);
            } catch (Exception e) {
                System.err.println("Sync Background Job failed: " + e.getMessage());
            }
        }
    }
}
