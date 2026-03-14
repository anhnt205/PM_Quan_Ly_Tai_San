package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class SuaChuaVatTuTieuHao {
    private String id;
    private String idSuaChua;
    private String idKeHoachSuaChua;
    private String idCCDC;
    private String idChiTietCCDC;         
    private String tenVatTu;         
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Các trường hiển thị (join)
    private String tenCCDC;
    private String tenKeHoach;
}
