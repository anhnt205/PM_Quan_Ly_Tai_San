package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class SuaChuaChiTiet {
    private String id;
    private String idSuaChua;
    private String idTaiSan;
    private String idKeHoachChiTiet;
    
    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
}
