package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class GioHoatDongDTO {
    private String id;
    private String idTaiSan;
    private String nam;
    private String thang;
    private String ngay;
    private Float gioHoatDong;
    private String ketQuaHoatDong;
    private Float gioNgungMay_HongMay;
    private Float gioNgungMay_ChoDoi;
    private Float gioNgungMay_MatDien;
    private Float gioNgungMay_ThieuNguyenLieu;
    private Float gioNgungMay_LyDoKhac;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
}