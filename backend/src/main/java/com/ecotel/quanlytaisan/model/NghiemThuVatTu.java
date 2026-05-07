package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class NghiemThuVatTu {
    private String id;
    private String idBienBanTaiSan; // FK -> nghiemthu_taisan.Id
    private String idChiTietVatTu;  // FK -> CCDCVatTu.Id
    private Integer soLuong;
    private String ghiChu;

    // View fields (join CCDCVatTu)
    private String tenVatTu;
    private String donViTinh;
}
