package com.ecotel.quanlytaisan.scheduler;

import com.ecotel.quanlytaisan.dao.DbConfigDao;
import com.ecotel.quanlytaisan.model.DbConfig;
import com.ecotel.quanlytaisan.service.DatabaseMigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@EnableScheduling
public class DatabaseSyncScheduler {

    @Autowired
    private DbConfigDao dbConfigDao;

    @Autowired
    private DatabaseMigrationService databaseMigrationService;

    // Chạy ngầm định kỳ vào giây thứ 0 của mỗi đầu giờ (VD: 07:00, 08:00, ...)
    @Scheduled(cron = "0 0 * * * *")
    public void executeDatabaseSync() {
        System.out.println("Scheduler triggered: Checking for default DB configuration...");
        
        DbConfig defaultDb = dbConfigDao.findDefault();
        if (defaultDb != null) {
            Integer intervalHours = defaultDb.getSyncIntervalHours();
            // Nếu có intervalHours cấu hình hợp lệ
            if (intervalHours != null && intervalHours > 0) {
                int currentHour = LocalTime.now().getHour();
                // Thực thi nếu chia dư bằng 0
                if (currentHour % intervalHours == 0) {
                    System.out.println("Condition matched [currentHour=" + currentHour + ", interval=" + intervalHours + "]. Starting Sync for DbConfig ID: " + defaultDb.getId());
                    
                    try {
                        // Gọi hàm xử lý sync
                        databaseMigrationService.processMigration(defaultDb.getId());
                        System.out.println("Sync Background Job executed successfully!");
                    } catch (Exception e) {
                        System.err.println("Sync Background Job failed: " + e.getMessage());
                        // e.printStackTrace();
                    }
                } else {
                    System.out.println("Condition skipped [currentHour=" + currentHour + ", interval=" + intervalHours + "].");
                }
            } else {
                System.out.println("Invalid interval config: " + intervalHours);
            }
        } else {
            System.out.println("No default DbConfig found. Skipped.");
        }
    }
}
