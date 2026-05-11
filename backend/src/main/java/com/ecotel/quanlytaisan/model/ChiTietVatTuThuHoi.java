package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietVatTuThuHoi {
    private String id;
    private String idDanhGiaVatTu;
    private String idChiTietVatTu;
    private String idVatTu;
    private Integer soLuong;
    private String tinhTrang;
    private String bienPhapXuLy;
    private String ghiChu;
    
    // View fields (not in table, joined for UI)
    private String tenVatTu;
    private String donViTinh;
}
