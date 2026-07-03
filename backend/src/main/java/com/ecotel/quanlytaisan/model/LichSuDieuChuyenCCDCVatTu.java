package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class LichSuDieuChuyenCCDCVatTu {
    private String id;
    private String idBanGiaoCCDCVatTu; 
    private String idCCDCVatTu; 
    private String idChiTietCCDCVatTu;        
    private String idDonViGiao;    
    private String idDonViNhan;   
    private Integer soLuong;     
    private String thoiGianBanGiao;
    
    // Các trường bổ sung để hiển thị tên nếu cần (DTO)
    private String tenCCDCVatTu;
    private String tenDonViGiao;
    private String tenDonViNhan;
}
