package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class DinhMucVatTu {
    private String id;
    private String idDinhMuc;
    private String idCCDCVT;
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
}
