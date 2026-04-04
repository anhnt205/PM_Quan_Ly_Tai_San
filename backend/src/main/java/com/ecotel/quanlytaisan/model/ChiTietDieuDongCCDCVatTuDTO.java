package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietDieuDongCCDCVatTuDTO {
    private String id;
    private String idDieuDongCCDCVatTu;
    private String soChungTu;
    private String tenPhieu;
    private String soQuyetDinh;
    private String idCCDCVatTu;
    private String tenCCDCVatTu;
    private String donViTinh;
    private String congSuat;
    private String nuocSanXuat;
    private String soKyHieu;
    private String kyHieu;
    private String namSanXuat;
    private Integer soLuong;
    private Integer soLuongXuat;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private String idChiTietCCDCVatTu;
    private Boolean isActive;
    private Double soLuongDaBanGiao;
    private Double soLuongConLai;
    private String hienTrang;
    private String moTa;
}
