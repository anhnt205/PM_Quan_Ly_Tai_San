package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ThuocTinhNhanVien {
    private String id;
    private String idNhanVien;
    private String noiDung;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;


    
}
