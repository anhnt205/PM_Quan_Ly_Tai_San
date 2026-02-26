package com.ecotel.quanlytaisan.model;


public class ChiTietBanGiaoPhuLuc {
    private String id;
    private String idBanGiaoPhuLuc;
    private String idPhuLuc;
    private Double soLuong;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public ChiTietBanGiaoPhuLuc() {}

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIdBanGiaoPhuLuc() { return idBanGiaoPhuLuc; }
    public void setIdBanGiaoPhuLuc(String idBanGiaoPhuLuc) { this.idBanGiaoPhuLuc = idBanGiaoPhuLuc; }
    public String getIdPhuLuc() { return idPhuLuc; }
    public void setIdPhuLuc(String idPhuLuc) { this.idPhuLuc = idPhuLuc; }
    public double getSoLuong() { return soLuong; }
    public void setSoLuong(double soLuong) { this.soLuong = soLuong; }
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
