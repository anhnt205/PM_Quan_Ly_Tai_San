package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class HuongDan {
    private String id;
    private String tenHuongDan;
    private String taiLieu; // S3 Key
    private String nguoiTao;
    private String ngayTao;
}
