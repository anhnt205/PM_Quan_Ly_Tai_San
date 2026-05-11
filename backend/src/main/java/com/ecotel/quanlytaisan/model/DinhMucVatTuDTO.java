package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class DinhMucVatTuDTO {
    private String id;
    private String idDinhMuc;
    private String idCCDCVT;
    private String idChiTietVatTu;
    private String tenCCDCVT;
    private String donViTinh;
    private String tenNhom;
    private Integer soLuong;
    private String kyHieu;
    private String ghiChu;
    
    // Status flag for sync (optional, but helpful for identifies new vs existing)
    private Boolean isNew;
    private Boolean isDeleted;
    private Boolean isUpdated;
}
