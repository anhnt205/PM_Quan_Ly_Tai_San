package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietDieuDongPhucLucTaiSan {
    private String id;
    private String idDieuDongPhuLucTaiSan;
    private String idPhuLucTaiSan;
    private Double soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public ChiTietDieuDongPhucLucTaiSan() {}

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIdDieuDongPhuLucTaiSan() { return idDieuDongPhuLucTaiSan; }
    public void setIdDieuDongPhuLucTaiSan(String idDieuDongPhuLucTaiSan) { this.idDieuDongPhuLucTaiSan = idDieuDongPhuLucTaiSan; }
    public String getIdPhuLucTaiSan() { return idPhuLucTaiSan; }
    public void setIdPhuLucTaiSan(String idPhuLucTaiSan) { this.idPhuLucTaiSan = idPhuLucTaiSan; }
    public double getSoLuong() { return soLuong; }
    public void setSoLuong(double soLuong) { this.soLuong = soLuong; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNgayTao() { return ngayTao; }
    public void setNgayTao(String ngayTao) { this.ngayTao = ngayTao; }
    public String getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(String ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
    public String getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(String nguoiTao) { this.nguoiTao = nguoiTao; }
    public String getNguoiCapNhat() { return nguoiCapNhat; }
    public void setNguoiCapNhat(String nguoiCapNhat) { this.nguoiCapNhat = nguoiCapNhat; }
    public Boolean getIsActive() { return isActive; }

}
