package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class DbConfig {
    private String id;
    private String dbms;
    private String ip;
    private String port;
    private String dbName;
    private String username;
    private String password;
    private String ngayTao;
    private String ngayCapNhat;
    private Boolean isDefault;
    private Integer syncIntervalHours;
}
