package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class BienPhapPhuongTienChiTiet {
    private String id;
    private String idBienPhap;
    private String idVatTu;
    private String idChiTietVatTu;
    private Integer soLuongCap;
    private Integer soLuongThuHoi;
    private String ghiChu;

    // Join fields từ CCDCVatTu
    private String tenVatTu;
    private String donViTinh;
}
