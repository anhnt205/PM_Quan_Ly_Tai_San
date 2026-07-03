package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class LoaiKeHoachSCBD {
    private String id;
    private String tenLoai;
    private String moTa;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
}
