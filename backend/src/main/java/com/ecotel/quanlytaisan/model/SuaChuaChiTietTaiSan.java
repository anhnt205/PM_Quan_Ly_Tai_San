package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class SuaChuaChiTietTaiSan {
    private String id;
    private String idSuaChua;
    private String idKeHoachSuaChua;
    private String idTaiSan;
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean daSuaChua;
    private Boolean isActive;

    private String tenTaiSan;
    private String tenKeHoach;

}
