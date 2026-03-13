package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class KeHoachSuaChuaChiTietTaiSan {
    private String id;
    private String idKeHoachSuaChua;
    private String idTaiSan;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Các trường hiển thị thêm (từ join)
    private String tenTaiSan;
}