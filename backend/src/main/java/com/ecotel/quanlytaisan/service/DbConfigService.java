package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DbConfigDao;
import com.ecotel.quanlytaisan.model.DbConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DbConfigService {

    @Autowired
    private DbConfigDao dbConfigDao;

    public List<DbConfig> getAll() {
        return dbConfigDao.findAll();
    }

    public DbConfig getById(String id) {
        return dbConfigDao.findById(id);
    }

    public int create(DbConfig config) {
        return dbConfigDao.insert(config);
    }

    public int update(DbConfig config) {
        return dbConfigDao.update(config);
    }

    public int delete(String id) {
        return dbConfigDao.delete(id);
    }

    public boolean testConnection(DbConfig config) {
        String jdbcUrl = "";
        String dbms = config.getDbms() != null ? config.getDbms().toUpperCase() : "MSSQL";
        String dbStr = (config.getDbName() != null && !config.getDbName().isEmpty()) ? config.getDbName() : "";
        
        switch (dbms) {
            case "MYSQL":
                jdbcUrl = "jdbc:mysql://" + config.getIp() + ":" + config.getPort() + "/" + dbStr;
                break;
            case "POSTGRESQL":
                jdbcUrl = "jdbc:postgresql://" + config.getIp() + ":" + config.getPort() + "/" + dbStr;
                break;
            case "ORACLE":
                jdbcUrl = "jdbc:oracle:thin:@" + config.getIp() + ":" + config.getPort() + (dbStr.isEmpty() ? "" : ":" + dbStr);
                break;
            case "MSSQL":
            default:
                jdbcUrl = "jdbc:sqlserver://" + config.getIp() + ":" + config.getPort() + (dbStr.isEmpty() ? "" : ";databaseName=" + dbStr) + ";encrypt=true;trustServerCertificate=true;";
                break;
        }

        try (java.sql.Connection conn = java.sql.DriverManager.getConnection(jdbcUrl, config.getUsername(), config.getPassword())) {
            return conn.isValid(5);
        } catch (Exception e) {
            System.err.println("Test Connection failed: " + e.getMessage());
            return false;
        }
    }
}
