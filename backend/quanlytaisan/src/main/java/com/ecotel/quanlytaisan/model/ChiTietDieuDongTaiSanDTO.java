package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietDieuDongTaiSanDTO {
    private String id;
    private String idDieuDongTaiSan;
    private String soQuyetDinh;
    private String tenPhieu;
    private String idTaiSan;
    private String tenTaiSan;
    private String donViTinh;
    private String hienTrang;
    private String moTa;
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private Boolean daBanGiao;

}
