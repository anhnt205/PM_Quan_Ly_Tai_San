package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class GiamDinhMayMocVatTu {
    private String id;
    private String idChiTietGiamDinhMayMoc; // FK -> giamdinh_maymoc_chitiet.Id
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
