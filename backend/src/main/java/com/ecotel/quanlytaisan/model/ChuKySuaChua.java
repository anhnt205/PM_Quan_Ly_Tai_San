package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChuKySuaChua {
    private String id;
    private String idTaiSan;
    private String idLoaiSuaChua;
    private Integer chuKy;
    private String donViChuKy;
    
    // Front-end sync flags
    private Boolean isInserted;
    private Boolean isDeleted;
}
