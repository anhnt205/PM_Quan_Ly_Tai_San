package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class LichSuDieuChuyenCCDCVatTuDTO {
    private String id;
    private String idBanGiaoCCDCVatTu; 
    private String idCCDCVatTu;  
    private String idChiTietCCDCVatTu;     
    private String idDonViGiao;    
    private String idDonViNhan;   
    private Integer soLuong;     
    private String thoiGianBanGiao;
}
