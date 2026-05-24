package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class GiamDinhVatTu {
    private String id;
    private String idChiTietGiamDinh; // FK -> giamdinh_chitiet.Id
    private String idVatTu;
    private String idChiTietVatTu;    // FK -> CCDCVatTu.Id
    private Integer soLuong;
    private String tinhTrang;
    private Integer soLuongSuaChua;
    private Integer soLuongThayMoi;
    private String ghiChu;

    // Các trường hiển thị thêm bằng cách JOIN với CCDCVatTu
    private String tenVatTu;
    private String donViTinh;
}
