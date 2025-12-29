package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class UpdateChiTietDonViSoHuu {
    private String idCCDCVT;
    private String idDonViGui;
    private String idDonViNhan;
    private Integer soLuongBanGiao;
    private String thoiGianBanGiao;
    private String idTsCon;
}
