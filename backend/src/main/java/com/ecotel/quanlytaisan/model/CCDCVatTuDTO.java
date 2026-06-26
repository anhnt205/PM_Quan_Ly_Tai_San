package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class CCDCVatTuDTO {
    private String id;
    private String ten;
    private String idDonVi;
    private String tenDonVi;
    private String idNhomCCDC;
    private String tenNhomCCDC;
    private String ngayNhap;
    private String donViTinh;
    private Integer soLuong;
    private Double giaTri;
    private String soKyHieu;
    private String kyHieu;
    private String congSuat;
    private String nuocSanXuat;
    private Integer namSanXuat;
    private String ghiChu;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private List<ChiTietTaiSan> chiTietTaiSanList;
    private List<TaiSanCon> taiSanConList;
    private List<ChiTietDonViSoHuu> chiTietDonViSoHuuList;
    private String idLoaiCCDCCon;
    private String hienTrang;
    private String donViTinh2;
    private Integer soLuong2;
}
