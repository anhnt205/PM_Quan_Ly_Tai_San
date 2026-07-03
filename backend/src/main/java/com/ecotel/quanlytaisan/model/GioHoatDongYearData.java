package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class GioHoatDongYearData {
    private String nam;
    private List<GioHoatDong> data;
    private Float tongGioHoatDong;
    private Float tongGioNgungMay_HongMay;
    private Float tongGioNgungMay_ChoDoi;
    private Float tongGioNgungMay_MatDien;
    private Float tongGioNgungMay_ThieuNguyenLieu;
    private Float tongGioNgungMay_LyDoKhac;
    private Integer soThangCoDuLieu;
}