package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class GiamDinhChiTiet {
    private String id;
    private String idGiamDinh;
    private String tinhTrang;
    private Boolean suaChua;
    private Boolean thayMoi;
    private String ghiChu;
    private String idTaiSan;
    private String idSuaChuaChiTiet;

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    //view
    private String tenTaiSan;
    private String donViTinh;
    private String soLuong;
}
