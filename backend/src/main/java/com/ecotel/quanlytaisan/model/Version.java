package com.ecotel.quanlytaisan.model;

import java.time.LocalDateTime;

public class Version {
    private String id;
    private String versionName;
    private String versionCode;
    private String description;
    private LocalDateTime releaseDate;
    private Boolean isActive;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    public Version() {
    }

    public Version(String id, String versionName, String versionCode, String description, 
                   LocalDateTime releaseDate, Boolean isActive, String ngayTao, String ngayCapNhat, 
                   String nguoiTao, String nguoiCapNhat) {
        this.id = id;
        this.versionName = versionName;
        this.versionCode = versionCode;
        this.description = description;
        this.releaseDate = releaseDate;
        this.isActive = isActive;
        this.ngayTao = ngayTao;
        this.ngayCapNhat = ngayCapNhat;
        this.nguoiTao = nguoiTao;
        this.nguoiCapNhat = nguoiCapNhat;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public String getVersionCode() {
        return versionCode;
    }

    public void setVersionCode(String versionCode) {
        this.versionCode = versionCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDateTime releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(String ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getNgayCapNhat() {
        return ngayCapNhat;
    }

    public void setNgayCapNhat(String ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getNguoiTao() {
        return nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getNguoiCapNhat() {
        return nguoiCapNhat;
    }

    public void setNguoiCapNhat(String nguoiCapNhat) {
        this.nguoiCapNhat = nguoiCapNhat;
    }

    @Override
    public String toString() {
        return "Version{" +
                "id='" + id + '\'' +
                ", versionName='" + versionName + '\'' +
                ", versionCode='" + versionCode + '\'' +
                ", description='" + description + '\'' +
                ", releaseDate=" + releaseDate +
                ", isActive=" + isActive +
                ", ngayTao='" + ngayTao + '\'' +
                ", ngayCapNhat='" + ngayCapNhat + '\'' +
                ", nguoiTao='" + nguoiTao + '\'' +
                ", nguoiCapNhat='" + nguoiCapNhat + '\'' +
                '}';
    }
}
