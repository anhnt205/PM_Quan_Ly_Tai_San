package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class BanGiaoPhuLuc {
    private String id;
    private String idCongTy;
    private String banGiaoPhuLuc;
    private String quyetDinhDieuDongSo;
    private String lenhDieuDong;
    private String idDonViGiao;
    private String idDonViNhan;
    private String ngayBanGiao;
    private String idLanhDao;
    private String idDaiDiendonviBanHanhQD;
    private Boolean daXacNhan;
    private String idDaiDienBenGiao;
    private Boolean daiDienBenGiaoXacNhan;
    private String idDaiDienBenNhan;
    private Boolean daiDienBenNhanXacNhan;
    private String idDonViDaiDien;
    private Boolean donViDaiDienXacNhan;
    private Integer trangThai;
    private String note;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;



}
