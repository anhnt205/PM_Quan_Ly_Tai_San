package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class GioHoatDongDTO {
    private String id;
    private String idTaiSan;
    private Integer nam;
    private Integer thang;
    private Float gioHoatDong;
    private Float gioSauSCL;
    private Float gioSauBcc;
    private String ngaySCT_Vao;
    private String ngaySCT_Ra;
    private String ngayBcc_Vao;
    private String ngayBcc_Ra;
    private Integer soLanBaoDuongCapI;
    private Integer soLanBaoDuongCapII;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
}