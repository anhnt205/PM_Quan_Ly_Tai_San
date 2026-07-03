package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietDieuDongPhucLucTaiSanDTO {
    private String id;
    private String idDieuDongPhuLucTaiSan;
    private String tenPhieu;
    private String soQuyetDinh;
    private String idPhuLucTaiSan;
    private String tenPhuLucTS;
    private String maPhuLucTSTB;
    private String donViTinh;
    private String hienTrang;
    private String dacDiem;
    private String moTaThietBiDinhKemTaiSan;

    private Double soLuong;

    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private String isActive;


}
