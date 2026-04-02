package com.ecotel.quanlytaisan.model;

public class BanHanhRequest {
    private String id;
    private String soQuyetDinh;
    private String ngayQuyetDinh;
    // Getter và Setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSoQuyetDinh() { return soQuyetDinh; }
    public void setSoQuyetDinh(String soQuyetDinh) { this.soQuyetDinh = soQuyetDinh; }

    public String getNgayQuyetDinh() { return ngayQuyetDinh; }
    public void setNgayQuyetDinh(String ngayQuyetDinh) { this.ngayQuyetDinh = ngayQuyetDinh; }
}