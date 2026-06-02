package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class CapSuaChua {
    private String id;
    private String kyHieu;
    private String ten;
    private String chuKyThucHien;
    private Integer soLanTrongChuKy;
    private String thoiGianSuaChua;
    private String idLoaiTaiSan;
    private String tenLoaiTaiSan;
    private Integer mocGioDau;
    private Integer mocGioCuoi;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
}
