package com.ecotel.quanlytaisan.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KeHoachSuaChuaVatTuTieuHao {
    private String id;
    private String idKeHoachSuaChua;
    @NotNull
    private String idCCDC;
    @NotNull
    private String idChiTietCCDC;

    private String idNhomCCDC;
    private String tenNhomCCDC;
    private String tenVatTu;
    private String soKyHieu;
    private String namSanXuat;
    private String nuocSanXuat;
    private String donViTinh;
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Các trường hiển thị thêm (từ join)
    private String maCCDC;
    private String tenCCDC;
}