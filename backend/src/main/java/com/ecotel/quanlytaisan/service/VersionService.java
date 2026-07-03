package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.VersionDao;
import com.ecotel.quanlytaisan.model.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class VersionService {
    @Autowired
    private VersionDao versionDao;

    public List<Version> getAll() {
        return versionDao.findAll();
    }

    public List<Version> getAllActive() {
        return versionDao.findAllActive();
    }

    public Version getById(String id) {
        return versionDao.findById(id);
    }

    public Version getByVersionCode(String versionCode) {
        return versionDao.findByVersionCode(versionCode);
    }

    public Version getLatestVersion() {
        return versionDao.getLatestVersion();
    }

    public int create(Version version) {
        // Set default values
        if (version.getIsActive() == null) {
            version.setIsActive(true);
        }
        
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        if (version.getNgayTao() == null) {
            version.setNgayTao(currentTime);
        }
        if (version.getNgayCapNhat() == null) {
            version.setNgayCapNhat(currentTime);
        }
        if (version.getNguoiTao() == null) {
            version.setNguoiTao("system");
        }
        if (version.getNguoiCapNhat() == null) {
            version.setNguoiCapNhat("system");
        }

        return versionDao.insert(version);
    }

    public int update(Version version) {
        // Set update time
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        version.setNgayCapNhat(currentTime);
        
        if (version.getNguoiCapNhat() == null) {
            version.setNguoiCapNhat("system");
        }

        return versionDao.update(version);
    }

    public int delete(String id) {
        return versionDao.delete(id);
    }

    public int deactivate(String id) {
        return versionDao.deactivate(id);
    }

    public int activate(String id) {
        return versionDao.activate(id);
    }

    public long getTotalCount() {
        return versionDao.count();
    }

    public long getActiveCount() {
        return versionDao.countActive();
    }

    // Utility method to generate version ID from version code
    public String generateVersionId(String versionCode) {
        if (versionCode == null || versionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Version code không được null hoặc rỗng");
        }
        return "v" + versionCode.replace(".", "_");
    }

    // Method to validate version code format (semantic versioning)
    public boolean isValidVersionCode(String versionCode) {
        if (versionCode == null || versionCode.trim().isEmpty()) {
            return false;
        }
        // Basic semantic versioning pattern: major.minor.patch
        String pattern = "^\\d+\\.\\d+\\.\\d+$";
        return versionCode.matches(pattern);
    }
}
