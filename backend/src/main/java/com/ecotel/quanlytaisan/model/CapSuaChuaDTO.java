package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class CapSuaChuaDTO {
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
}
