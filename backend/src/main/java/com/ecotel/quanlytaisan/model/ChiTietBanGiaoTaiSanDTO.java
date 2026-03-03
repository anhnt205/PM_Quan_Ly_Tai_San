package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietBanGiaoTaiSanDTO {
    private String id;
    private String idBanGiaoTaiSan;
    private String banGiaoTaiSan;
    private String quyetDinhDieuDongSo;
    private String idTaiSan;
    private String tenTaiSan;
    private String donViTinh;
    private String kyHieu;
    private String soKyHieu;
    private String nuocSanXuat;
    private String hienTrang;
    private String moTa;
    private Integer soLuong;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String ghiChu;
}
