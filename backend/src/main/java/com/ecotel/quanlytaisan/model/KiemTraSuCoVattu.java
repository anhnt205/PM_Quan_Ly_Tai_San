package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class KiemTraSuCoVattu {
    private String id;
    private String idChiTietKiemTraSuCo; // FK -> kiemtra_suco_chitiet.Id
    private String idVatTu;
    private String idChiTietVatTu;    // FK -> CCDCVatTu.Id
    private Integer soLuong;
    private String tinhTrang;
    private Integer soLuongSuaChua;
    private Integer soLuongThayMoi;
    private String ghiChu;

    // View fields populated from CCDCVatTu join
    private String tenVatTu;
    private String donViTinh;
}
