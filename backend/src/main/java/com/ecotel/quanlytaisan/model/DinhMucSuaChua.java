package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class DinhMucSuaChua {
    private String id;
    private String idLoaiSuaChua;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
}
