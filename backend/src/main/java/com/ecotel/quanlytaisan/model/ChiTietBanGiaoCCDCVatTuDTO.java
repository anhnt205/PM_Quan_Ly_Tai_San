package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietBanGiaoCCDCVatTuDTO {
    private String id;
    private String idBanGiaoCCDCVatTu;
    private String tenPhieuBanGiao;
    private String idCCDCVatTu;
    private String tenVatTu;
    private String donViTinh;
    private String kyHieu;
    private String soKyHieu;
    private String congSuat;
    private String nuocSanXuat;
    private String namSanXuat;
    private Integer soLuong;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String idChiTietCCDCVatTu;
    private String idChiTietDieuDong;
    private String hienTrang;
    private String moTa;
    private String ghiChu;
    private ChiTietDieuDongCCDCVatTuDTO chiTietDieuDongCCDCVatTuDTO;
}
